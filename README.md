# HenryMo Technologies API

**Where Ideas Become Powerful Digital Solutions.**

A comprehensive RESTful API built with Node.js, Express, TypeScript, and PostgreSQL for HenryMo Technologies.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with refresh tokens and RBAC
- **CMS**: Dynamic pages and blog management
- **Portfolio**: Project showcase management
- **Testimonials**: Client testimonial system
- **Contact & Inquiries**: Contact form with admin management
- **Social Media Automation**: Schedule posts across multiple platforms
- **Analytics Dashboard**: Traffic, leads, and social media analytics
- **Client Portal**: Project tracking and support messaging
- **Security**: Rate limiting, CORS, input validation, and more

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd HenryMo-Technologies
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and fill in your configuration values.

4. Set up the database:
```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate
```

5. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## 📚 API Endpoints

### Authentication (`/api/auth`)
- `POST /login` - User login
- `POST /register` - Client registration
- `POST /refresh` - Refresh access token
- `POST /logout` - Logout user
- `POST /password-reset/request` - Request password reset
- `POST /password-reset/confirm` - Confirm password reset

### Users (`/api/users`)
- `GET /me` - Get current user profile
- `PUT /me` - Update current user profile
- `GET /team` - List team members (admin only)
- `POST /team` - Invite team member (admin only)
- `DELETE /team/:id` - Delete team member (admin only)

### CMS (`/api/cms`)
- `GET /pages` - List all pages
- `GET /pages/:slug` - Get page by slug
- `POST /pages` - Create page (admin only)
- `PUT /pages/:id` - Update page (admin only)
- `DELETE /pages/:id` - Delete page (admin only)
- `GET /blog` - List blog posts
- `POST /blog` - Create blog post (admin only)
- `PUT /blog/:id` - Update blog post (admin only)
- `DELETE /blog/:id` - Delete blog post (admin only)

### Portfolio (`/api/portfolio`)
- `GET /items` - List portfolio items
- `GET /items/:id` - Get portfolio item
- `POST /items` - Create portfolio item (admin only)
- `PUT /items/:id` - Update portfolio item (admin only)
- `DELETE /items/:id` - Delete portfolio item (admin only)

### Testimonials (`/api/testimonials`)
- `GET /` - List testimonials
- `GET /:id` - Get testimonial
- `POST /` - Create testimonial (admin only)
- `PUT /:id` - Update testimonial (admin only)
- `DELETE /:id` - Delete testimonial (admin only)

### Inquiries (`/api/inquiries`)
- `POST /` - Submit inquiry
- `GET /` - List all inquiries (admin only)
- `GET /:id` - Get inquiry (admin only)
- `PUT /:id/status` - Update inquiry status (admin only)

### Social Media (`/api/social`)
- `GET /accounts` - List connected accounts (admin only)
- `POST /connect/:platform` - Connect platform (admin only)
- `POST /schedule` - Schedule post (admin only)
- `GET /schedule` - List scheduled posts (admin only)
- `DELETE /schedule/:id` - Delete scheduled post (admin only)
- `GET /analytics` - Get social media analytics (admin only)

### Analytics (`/api/analytics`)
- `GET /traffic` - Get traffic analytics (admin only)
- `GET /leads` - Get leads analytics (admin only)
- `GET /social/summary` - Get social media summary (admin only)

### Client Portal (`/api/client`)
- `GET /projects` - Get client projects
- `GET /projects/:id` - Get project details
- `POST /projects/:id/messages` - Send project message
- `GET /billing` - Get billing information

## 🔐 Authentication

All protected routes require a Bearer token in the Authorization header:

```
Authorization: Bearer <access_token>
```

## 🗄️ Database Schema

The API uses Prisma ORM with PostgreSQL. See `prisma/schema.prisma` for the complete schema.

## 🧪 Development

```bash
# Run in development mode with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Open Prisma Studio
npm run prisma:studio
```

## 🚢 Deployment

The API is designed to be deployed on:
- **Vercel** (serverless functions)
- **Render** (Docker containers)
- Any Node.js hosting platform

Make sure to set all environment variables in your hosting platform.

## 📝 License

ISC

## 👤 Author

Henry Ugochukwu 
HenryMo Technologies

