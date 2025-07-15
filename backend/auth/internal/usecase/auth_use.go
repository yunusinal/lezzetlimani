package usecase

import (
	"auth/internal/contextkeys"
	"auth/internal/domain"
	"auth/internal/dtos"
	"auth/internal/infra/kafka"
	"auth/internal/infra/redis"
	"auth/internal/repository"
	"auth/pkg/errors"
	"auth/pkg/security"
	"auth/pkg/utils"
	"context"
	"log"
	"time"

	"golang.org/x/crypto/bcrypt"
)

type authUsecase struct {
	redisClient  redis.RedisClient
	authRepo     repository.AuthRepository
	jwtService   security.JWTService
	publisher    kafka.EventPublisher
	redisService redis.RedisService
}

func NewAuthUsecase(redisClient redis.RedisClient, authRepo repository.AuthRepository, jwtService security.JWTService, publisher kafka.EventPublisher, redisService redis.RedisService) AuthUsecase {
	return &authUsecase{redisClient: redisClient, authRepo: authRepo, jwtService: jwtService, publisher: publisher, redisService: redisService}
}

func (u *authUsecase) Register(ctx context.Context, req *dtos.RegisterRequest) (*dtos.RegisterResponse, error) {
	// 1. Check if user already exists
	auth, err := u.authRepo.GetByEmail(ctx, req.Email)
	if err != nil {
		return nil, err
	}
	if auth != nil {
		return nil, errors.New("USER_ALREADY_EXISTS", "user already exists")
	}

	// 2. generate IDs
	authID, err := utils.GenerateUUID()
	if err != nil {
		return nil, err
	}
	userID, err := utils.GenerateUUID()
	if err != nil {
		return nil, err
	}

	// 3. hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	// 4. create auth form
	authForm := &domain.Auth{
		ID:       authID,
		UserID:   userID,
		Email:    req.Email,
		Password: string(hashedPassword),
	}

	// 5. save to DB
	if err := u.authRepo.Create(ctx, authForm); err != nil {
		return nil, err
	}

	// 6. generate email token
	emailToken, err := security.GenerateVerificationToken()
	if err != nil {
		return nil, err
	}

	// 7. save token to redis
	if err := u.redisClient.Set(ctx, "verify:"+emailToken, authID, 15*time.Minute); err != nil {
		return nil, err
	}

	// 8. kafka events
	emailEvent := &dtos.EmailEvent{
		Type:      "verification",
		To:        req.Email,
		Subject:   "Verification Email",
		Template:  "verification",
		Variables: map[string]string{"token": emailToken},
	}
	log.Println("emailEvent", emailEvent)
	if err := u.publisher.PublishEmailEvent(ctx, *emailEvent); err != nil {
		return nil, err
	}

	userCreateEvent := &dtos.UserCreateEvent{
		UserID: userID,
	}
	log.Println("userCreateEvent", userCreateEvent)
	if err := u.publisher.PublishUserCreateEvent(ctx, *userCreateEvent); err != nil {
		return nil, err
	}

	// 9. response
	return &dtos.RegisterResponse{
		Message: "User created successfully",
		Token:   emailToken, // For testing purposes
	}, nil
}

func (u *authUsecase) Login(ctx context.Context, req *dtos.LoginRequest) (*dtos.LoginResponse, error) {
	ip := utils.GetIPFromContext(ctx)
	log.Printf("[Login] IP: %s - Email: %s", ip, req.Email)

	// 1. IP rate limit check
	if limited, _ := u.redisService.IsIPRateLimited(ctx, ip); limited {
		log.Println("[Login] IP rate limited")
		return nil, errors.New("IP_RATE_LIMIT", "Too many failed attempts. Try again later.")
	}

	// 2. get user by email
	auth, err := u.authRepo.GetByEmail(ctx, req.Email)
	if err != nil {
		_ = u.redisService.RegisterFailedAttempt(ctx, ip)
		log.Printf("[Login] DB error: %v", err)
		return nil, errors.Wrap(err, "DB_ERROR", "Failed to query user")
	}
	if auth == nil {
		_ = u.redisService.RegisterFailedAttempt(ctx, ip)
		log.Println("[Login] User not found")
		return nil, errors.New("USER_NOT_FOUND", "User not found")
	}

	log.Printf("[Login] User found: ID=%s, Email=%s, Verified=%v", auth.UserID, auth.Email, auth.Verified)

	// 3. email verified
	if !auth.Verified {
		log.Println("[Login] Email not verified")
		return nil, errors.New("USER_NOT_VERIFIED", "Email not verified")
	}

	// 4. compare password
	if err := bcrypt.CompareHashAndPassword([]byte(auth.Password), []byte(req.Password)); err != nil {
		_ = u.redisService.RegisterFailedAttempt(ctx, ip)
		log.Println("[Login] Password mismatch")
		return nil, errors.New("INVALID_PASSWORD", "Invalid password")
	}
	log.Println("[Login] Password matched")

	// 5. clear failed attempts
	_ = u.redisService.ClearFailedAttempts(ctx, ip)

	// 6. generate tokens
	role := "user"
	log.Printf("[Login] Generating tokens for userID=%s", auth.UserID)

	accessToken, err := u.jwtService.GenerateAccessToken(auth.UserID, role)
	if err != nil {
		log.Printf("[Login] Access token generation failed: %v", err)
		return nil, errors.Wrap(err, "JWT_ERROR", "Failed to generate access token")
	}

	refreshToken, jti, err := u.jwtService.GenerateRefreshToken(auth.UserID, role)
	if err != nil {
		log.Printf("[Login] Refresh token generation failed: %v", err)
		return nil, errors.Wrap(err, "JWT_ERROR", "Failed to generate refresh token")
	}

	// 7. save tokens to redis
	log.Printf("[Login] Saving refresh token and jti to Redis: jti=%s", jti)
	_ = u.redisService.SetRefreshToken(ctx, auth.UserID, refreshToken, 7*24*time.Hour)
	_ = u.redisClient.Set(ctx, "refresh_jti:"+jti, auth.UserID, 7*24*time.Hour)

	// 8. response
	log.Printf("[Login] Login successful for userID=%s", auth.UserID)
	return &dtos.LoginResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		Token:        accessToken, // For testing purposes
	}, nil
}

func (u *authUsecase) VerifyEmail(ctx context.Context, req *dtos.VerifyEmailRequest) (*dtos.VerifyEmailResponse, error) {
	// 1. get authID from redis
	authID, err := u.redisClient.Get(ctx, "verify:"+req.Token)
	if err != nil {
		if errors.IsAppError(err, "REDIS_NIL") {
			return nil, errors.New("INVALID_TOKEN", "Verification token is invalid or expired")
		}
		return nil, errors.Wrap(err, "REDIS_ERROR", "Failed to retrieve token")
	}

	// 2. get auth from db
	auth, err := u.authRepo.GetByAuthID(ctx, authID)
	if err != nil {
		return nil, errors.Wrap(err, "DB_ERROR", "Failed to fetch user")
	}
	if auth == nil {
		return nil, errors.New("USER_NOT_FOUND", "User not found")
	}

	// 3. already verified
	if auth.Verified {
		return nil, errors.New("ALREADY_VERIFIED", "Email already verified")
	}

	// 4. verify user
	auth.Verified = true
	if err := u.authRepo.Update(ctx, auth); err != nil {
		return nil, errors.Wrap(err, "DB_ERROR", "Failed to update verification")
	}

	// 5. save pending user to redisg
	_ = u.redisClient.Set(ctx, "pending_user:"+auth.UserID, "1", 15*time.Minute)

	// 5. delete token from redis
	_ = u.redisClient.Del(ctx, "verify:"+req.Token)

	// 6. generate tokens
	role := "user"

	accessToken, err := u.jwtService.GenerateAccessToken(auth.UserID, role)
	if err != nil {
		return nil, errors.Wrap(err, "JWT_ERROR", "Failed to generate access token")
	}

	refreshToken, jti, err := u.jwtService.GenerateRefreshToken(auth.UserID, role)
	if err != nil {
		return nil, errors.Wrap(err, "JWT_ERROR", "Failed to generate refresh token")
	}

	// 7. save refresh token to redis
	_ = u.redisService.SetRefreshToken(ctx, auth.UserID, refreshToken, 7*24*time.Hour)
	_ = u.redisClient.Set(ctx, "refresh_jti:"+jti, auth.UserID, 7*24*time.Hour)

	// 8. response
	return &dtos.VerifyEmailResponse{
		Message:      "Email verified successfully",
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		Token:        accessToken, // For testing purposes
	}, nil
}

func (u *authUsecase) Logout(ctx context.Context, req *dtos.LogoutRequest) (*dtos.LogoutResponse, error) {
	userIDRaw := ctx.Value(contextkeys.UserIDKey)
	userID, ok := userIDRaw.(string)
	if !ok || userID == "" {
		return nil, errors.New("UNAUTHORIZED", "userID not found in context")
	}

	jtiRaw := ctx.Value(contextkeys.JTIKey)
	jti, ok := jtiRaw.(string)
	if !ok || jti == "" {
		return nil, errors.New("UNAUTHORIZED", "jti not found in context")
	}

	// 1. blacklist access token
	if err := u.redisService.BlacklistToken(ctx, jti, 15*time.Minute); err != nil {
		return nil, errors.Wrap(err, "REDIS_ERROR", "Failed to blacklist access token")
	}

	// 2. delete refresh token
	if err := u.redisService.DeleteRefreshToken(ctx, userID); err != nil {
		return nil, errors.Wrap(err, "REDIS_ERROR", "Failed to delete refresh token")
	}

	// 3. response
	return &dtos.LogoutResponse{
		Message: "Successfully logged out",
	}, nil
}

func (u *authUsecase) ForgotPassword(ctx context.Context, req *dtos.ForgotPasswordRequest) (*dtos.ForgotPasswordResponse, error) {
	// 1. get user by email
	auth, err := u.authRepo.GetByEmail(ctx, req.Email)
	if err != nil {
		return nil, errors.Wrap(err, "DB_ERROR", "Failed to fetch user")
	}
	if auth == nil {
		return nil, errors.New("USER_NOT_FOUND", "User not found")
	}

	// 2. generate password reset token
	resetToken, err := utils.GenerateUUID()
	if err != nil {
		return nil, errors.Wrap(err, "SECURITY_ERROR", "Failed to generate password reset token")
	}

	// 3. save token to redis (key: reset:<token> value: auth.ID)
	if err := u.redisClient.Set(ctx, "reset:"+resetToken, auth.ID, 15*time.Minute); err != nil {
		return nil, errors.Wrap(err, "REDIS_ERROR", "Failed to save reset token")
	}

	// 4. send reset email via kafka
	emailEvent := &dtos.EmailEvent{
		Type:      "password_reset",
		To:        req.Email,
		Subject:   "Password Reset",
		Template:  "password_reset",
		Variables: map[string]string{"token": resetToken},
	}
	if err := u.publisher.PublishEmailEvent(ctx, *emailEvent); err != nil {
		return nil, errors.Wrap(err, "KAFKA_ERROR", "Failed to send reset email")
	}

	return &dtos.ForgotPasswordResponse{
		Message: "Password reset email sent. Please check your inbox.",
	}, nil
}

func (u *authUsecase) ResetPassword(ctx context.Context, req *dtos.ResetPasswordRequest) (*dtos.ResetPasswordResponse, error) {
	// Assume req has Token and NewPassword fields (update DTO if needed)
	token := req.Token
	newPassword := req.NewPassword

	// 1. get authID from redis
	authID, err := u.redisClient.Get(ctx, "reset:"+token)
	if err != nil {
		if errors.IsAppError(err, "REDIS_NIL") {
			return nil, errors.New("INVALID_TOKEN", "Reset token is invalid or expired")
		}
		return nil, errors.Wrap(err, "REDIS_ERROR", "Failed to retrieve reset token")
	}

	// 2. get user from db
	auth, err := u.authRepo.GetByAuthID(ctx, authID)
	if err != nil {
		return nil, errors.Wrap(err, "DB_ERROR", "Failed to fetch user")
	}
	if auth == nil {
		return nil, errors.New("USER_NOT_FOUND", "User not found")
	}

	// 3. hash new password
	hashedPassword, err := utils.HashPassword(newPassword)
	if err != nil {
		return nil, errors.Wrap(err, "HASH_ERROR", "Failed to hash new password")
	}
	auth.Password = hashedPassword

	// 4. update user password in db
	if err := u.authRepo.Update(ctx, auth); err != nil {
		return nil, errors.Wrap(err, "DB_ERROR", "Failed to update password")
	}

	// 5. delete token from redis
	_ = u.redisClient.Del(ctx, "reset:"+token)

	return &dtos.ResetPasswordResponse{
		Message: "Password has been reset successfully.",
	}, nil
}
