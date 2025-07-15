# Auth Service API Documentation

This directory contains the Swagger/OpenAPI documentation for the Lezzet Limanı Auth Service.

## Files

- `swagger.yaml` - Main OpenAPI 2.0 specification in YAML format
- `swagger.json` - OpenAPI specification in JSON format
- `docs.go` - Go package with embedded documentation
- `README.md` - This file

## Manual Documentation

The Swagger documentation is manually maintained to ensure accuracy and completeness.
The files are not auto-generated from code annotations.

## Accessing Documentation

The API documentation can be accessed at:

- Production: `https://lezzetlimani.site/auth/swagger/`
- Local: `http://localhost:3000/auth/swagger/`

## API Endpoints

### Public Endpoints

- `GET /health` - Health check
- `POST /register` - User registration
- `POST /login` - User login
- `POST /verify-email` - Email verification

### Protected Endpoints

- `POST /logout` - User logout (requires JWT token)

## Authentication

Protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Support

For API support, contact: support@lezzetlimani.com
