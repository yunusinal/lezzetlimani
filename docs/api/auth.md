# Kullanıcı Doğrulama ve Yönetimi

## Kullanıcı Giriş

### JWT ile Giriş

Kullanıcının e-posta ve şifresiyle giriş yapmasını sağlar. Başarılı giriş sonrası JWT token’ları döner.

### Endpoint: `POST /auth/login`

### Request

```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

### Responses

#### 200: OK

```json
{
  "access_token": "eyJhbGciOiJIUzI1N...",
  "refresh_token": "def456"
}
```

> access_token: 24 saatlik token \
> refresh_token: 7 günlük token
> refresh_token Redis'te saklanır.

#### 400: Bad Request

```json
{
  "error": "Invalid credentials"
}
```

> Kullanıcı bilgilerini hatalı girdi.
>
> - email, basitleştirilmiş rfc5322 formatına göre doğrulanır.
> - password, en az bir büyük harf, bir küçük harf, bir rakam, bir özel karakter içermeli ve 8-64 karakter uzunluğunda olmalıdır.

#### 401: Unauthorized

```json
{
  "error": "Unauthorized"
}
```

> Kullanıcı yetkisiz giriş yapmaya çalıştı.

#### 404: Not Found

```json
{
  "error": "User not found"
}
```

> Kullanıcı bulunamadı.

#### 429: Too Many Requests

```json
{
  "error": "Too many requests"
}
```

> Aynı IP adresinden yapılan çok fazla başarısız giriş denemesi nedeniyle IP geçici olarak engellenmiştir (Redis'te izlenir).

#### 500: Internal Server Error

```json
{
  "error": "Internal server error"
}
```

> İç sunucu hatası.

## Kullanıcı Kayıt

Yeni bir kullanıcı oluşturur ve e-posta adresine doğrulama kodu gönderir. Hesap, email doğrulanana kadar Redis’te geçici olarak saklanır.

### Endpoint: `POST /auth/register`

### Request

```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

### Responses

#### 200: OK

```json
{
  "message": "verification sent to email"
}
```

> Kullanıcı geçici olarak Redis’e kaydedilir.
> Email’e doğrulama kodu gönderilir (Kafka ile user-service’e event iletilir).
> Kullanıcı POST /auth/verify-email endpointi üzerinden doğrulama yapmalıdır.

#### 400: Bad Request

```json
{
  "error": "Invalid email or password"
}
```

> E-posta ya da parola doğrulama kurallarına uymuyor.

#### 409: Conflict

```json
{
  "error": "User already exists"
}
```

> Bu e-posta adresiyle kayıtlı bir kullanıcı zaten mevcut.

#### 500: Internal Server Error

```json
{
  "error": "Internal server error"
}
```

> İç sunucu hatası.

## Email Doğrulama

Kullanıcının email adresine gönderilen doğrulama kodu ile kayıt işlemini tamamlar. Doğrulama başarılı olursa kullanıcı kalıcı olarak veritabanına kaydedilir ve token’lar döner.

### Endpoint: `POST /auth/verify-email`

### Request

```json
{
  "email": "user@example.com",
  "code": "123456"
}
```

### Responses

#### 200: OK

```json
{
  "access_token": "eyJhbGciOiJIUzI1N...",
  "refresh_token": "def456"
}
```

> E-posta doğrulaması başarılıdır.
> Kullanıcı kalıcı olarak veritabanına yazılır.
> refresh_token, Redis’te saklanır.

#### 400: Bad Request

```json
{
  "error": "Invalid verification code"
}
```

> Gönderilen kod hatalıdır veya kod Redis’te bulunamamıştır.

#### 500: Internal Server Error

```json
{
  "error": "Internal server error"
}
```

> İç sunucu hatası.
