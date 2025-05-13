# Auth Changelog

## Register - Verify-Email

- [ ] [1] Client (Frontend)  
       - POST /auth/register  
       - Body:

```json
{
  "username": "yemrekeseli",
  "email": "emre@example.com",
  "password": "StrongPass123!"
}
```

- [ ] [2] auth-service  
       - Validate input  
       - Check if email exists  
       - Hash password  
       - Generate userID (UUID) →

```txt
user-uuid-7f71dd79-c2f4-4cf0-82df-6f4b1976a931
```

- Generate secure random token (base64-encoded) →

```txt
abcXYZ123
```

- Save user in DB (verified = false)

```json
{
  "id": "7f71dd79-c2f4-4cf0-82df-6f4b1976a931",
  "email": "emre@example.com",
  "password_hash": "...bcrypt...",
  "verified": false
}
```

- Save token to Redis:

```txt
KEY:   verify:abcXYZ123
VALUE: 7f71dd79-c2f4-4cf0-82df-6f4b1976a931
TTL:   24h
```

- Produce Kafka message to `notification.send_email`:

```json
{
  "type": "VERIFY_EMAIL",
  "to": "emre@example.com",
  "subject": "Lütfen E-posta Adresinizi Doğrulayın",
  "template": "verify_email",
  "variables": {
    "username": "yemrekeseli",
    "verification_link": "https://app.com/verify-email?token=abcXYZ123"
  }
}
```

- [ ] [3] notification-service (Kafka Consumer)  
       - Compose email with link:

```txt
https://app.com/verify-email?token=abcXYZ123
```

- Send email via SMTP  
  (örnek SMTP header'ı/logu)

```txt
To: emre@example.com
Subject: Lütfen E-posta Adresinizi Doğrulayın
Body: [Doğrulama linki içerir]
```

- [ ] [4] User Email Inbox  
       - User clicks link in email →

```txt
/verify-email?token=abcXYZ123
```

- [ ] [5] Client (Frontend)  
       - Parse token from URL  
       - GET `/auth/verify-email?token=abcXYZ123`

- [ ] [6] auth-service (verify endpoint)  
       - Read Redis:

```txt
GET verify:abcXYZ123 → 7f71dd79-c2f4-4cf0-82df-6f4b1976a931
```

- If not found → return:

```json
{
  "error": "Invalid or expired token"
}
```

- Set DB: `verified = true` for userID

```sql
UPDATE users SET verified = true WHERE id = '7f71dd79-c2f4-4cf0-82df-6f4b1976a931'
```

- Delete Redis key:

```txt
DEL verify:abcXYZ123
```

- (Optional) Produce Kafka event: `user.verified`

```json
{
  "event": "USER_VERIFIED",
  "user_id": "7f71dd79-c2f4-4cf0-82df-6f4b1976a931",
  "timestamp": "2025-05-13T15:45:00Z"
}
```

- [ ] [7] Client (Frontend)  
       - Redirect to:

```txt
/login?verified=true
```

- Show message:

```txt
"Email verified! You can now log in."
```
