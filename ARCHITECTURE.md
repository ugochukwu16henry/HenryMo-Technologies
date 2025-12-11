# API Architecture Overview

## Project Structure

```
HenryMo-Technologies/
├── src/
│   ├── config/
│   │   └── database.ts          # Prisma client configuration
│   ├── middleware/
│   │   ├── auth.ts              # JWT authentication & RBAC
│   │   ├── errorHandler.ts      # Error handling middleware
│   │   └── rateLimiter.ts       # Rate limiting middleware
│   ├── routes/
│   │   ├── auth.ts              # Authentication endpoints
│   │   ├── users.ts             # User & team management
│   │   ├── cms.ts               # CMS (pages & blog)
│   │   ├── portfolio.ts         # Portfolio items
│   │   ├── testimonials.ts      # Client testimonials
│   │   ├── inquiries.ts         # Contact inquiries
│   │   ├── social.ts            # Social media automation
│   │   ├── analytics.ts         # Analytics dashboard
│   │   └── client.ts            # Client portal
│   ├── types/
│   │   └── index.ts             # TypeScript type definitions
│   ├── utils/
│   │   ├── errors.ts            # Error classes & handlers
│   │   ├── jwt.ts               # JWT token utilities
│   │   ├── password.ts          # Password hashing utilities
│   │   └── validation.ts        # Zod validation schemas
│   └── server.ts                # Express app entry point
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── seed.ts                  # Database seeding script
├── package.json
├── tsconfig.json
├── Dockerfile
└── README.md
```

## Authentication Flow

1. **Login**: User provides email/password → Server validates → Returns accessToken + refreshToken
2. **Protected Routes**: Client sends `Authorization: Bearer <accessToken>` header
3. **Token Refresh**: Client sends refreshToken → Server validates → Returns new accessToken + refreshToken
4. **Logout**: Server invalidates refreshToken in database

## Authorization Levels

- **guest**: Public access (portfolio, services, pages)
- **client**: Project tracking, support tickets, own profile
- **admin**: Full CMS, social scheduler, analytics, team management
- **superadmin**: System config, billing, API key management

## Security Features

1. **JWT Authentication**: HS256 signed tokens with configurable expiration
2. **Refresh Tokens**: Stored in database, can be invalidated
3. **Password Hashing**: Bcrypt with 10 salt rounds
4. **Rate Limiting**: 100 req/min per IP (5 req/15min for auth)
5. **CORS**: Restricted to configured origins
6. **Helmet**: Security headers (HSTS, etc.)
7. **Input Validation**: Zod schemas for all inputs
8. **SQL Injection Protection**: Prisma ORM parameterized queries

## Database Models

- **User**: Authentication, profiles, roles
- **TeamInvite**: Team member invitations
- **Page**: CMS pages (Home, About, Services)
- **Blog**: Blog posts/articles
- **PortfolioItem**: Project showcase items
- **Testimonial**: Client testimonials
- **Inquiry**: Contact form submissions
- **SocialAccount**: Connected social media accounts
- **SocialSchedule**: Scheduled social media posts
- **Project**: Client projects
- **ProjectMessage**: Project support messages
- **Analytics**: Analytics data storage

## API Versioning

Current: `/api/*`  
Future: `/api/v1/*`, `/api/v2/*`

## Error Response Format

```json
{
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

Common error codes:
- `AUTH_001`: Invalid token
- `AUTH_002`: Token expired
- `AUTH_003`: Invalid credentials
- `AUTH_004`: Unauthorized
- `AUTH_005`: Forbidden
- `VALIDATION_001`: Validation error
- `NOT_FOUND_001`: Resource not found
- `INTERNAL_001`: Internal server error

## Future Enhancements

1. **SaaS & Billing** (`/api/billing`): Stripe integration, subscription management
2. **AI & Automation** (`/api/ai`): Content generation, hashtag analysis
3. **Digital Academy** (`/api/academy`): Course management, progress tracking
4. **Marketplace** (`/api/marketplace`): Template store, component library
5. **Webhooks**: Third-party integrations
6. **WebSocket**: Real-time updates
7. **OpenAPI/Swagger**: Auto-generated API documentation

## Deployment

### Vercel (Serverless)
- Uses Next.js API routes pattern
- Automatic scaling
- Edge functions support

### Docker
- Multi-stage build
- Production optimized
- Ready for Render, Railway, etc.

### Environment Variables
See `env.example` for all required variables.

## Monitoring & Logging

- Error tracking: Sentry (optional)
- Session replay: LogRocket (optional)
- Custom logging: Console + file logs

## Performance Optimizations

1. Database indexing on frequently queried fields
2. Rate limiting to prevent abuse
3. Connection pooling via Prisma
4. Caching layer ready (Redis integration points)

