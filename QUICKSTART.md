# Quick Start Guide

## Prerequisites
- Node.js 18+ installed
- PostgreSQL database running
- npm or yarn package manager

## Setup Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp env.example .env
   ```
   Edit `.env` and set your `DATABASE_URL`:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/henrymo_db?schema=public"
   ```

3. **Set Up Database**
   ```bash
   # Generate Prisma Client
   npm run prisma:generate

   # Create database schema
   npm run prisma:migrate

   # (Optional) Seed initial data
   npm run prisma:seed
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Test the API**
   ```bash
   # Health check
   curl http://localhost:3000/health

   # API info
   curl http://localhost:3000/api/v1
   ```

## Default Admin Credentials

After running the seed script:
- **Email**: admin@henrymo.tech
- **Password**: admin123
- **Role**: superadmin

⚠️ **Important**: Change these credentials in production!

## API Testing

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@henrymo.tech","password":"admin123"}'
```

### Access Protected Route
```bash
curl http://localhost:3000/api/users/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Next Steps

1. Review the API endpoints in `README.md`
2. Set up your production environment variables
3. Configure email service for notifications
4. Set up file storage (Cloudflare R2 or AWS S3)
5. Deploy to your hosting platform

## Troubleshooting

**Database Connection Error**
- Verify PostgreSQL is running
- Check DATABASE_URL in .env
- Ensure database exists

**Port Already in Use**
- Change PORT in .env
- Or kill the process using port 3000

**Prisma Errors**
- Run `npm run prisma:generate` again
- Check Prisma schema syntax
- Verify database migrations

