import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { apiRateLimiter } from './middleware/rateLimiter';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// Routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import cmsRoutes from './routes/cms';
import portfolioRoutes from './routes/portfolio';
import testimonialRoutes from './routes/testimonials';
import inquiryRoutes from './routes/inquiries';
import socialRoutes from './routes/social';
import analyticsRoutes from './routes/analytics';
import clientRoutes from './routes/client';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
}));

// CORS configuration
const allowedOrigins = [
  'https://henrymo.tech',
  'https://admin.henrymo.tech',
  'http://localhost:3000',
  'http://localhost:3001',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use('/api', apiRateLimiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cms', cmsRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/client', clientRoutes);

// API versioning placeholder for future
app.get('/api/v1', (req, res) => {
  res.json({
    version: '1.0',
    message: 'HenryMo Technologies API',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      cms: '/api/cms',
      portfolio: '/api/portfolio',
      social: '/api/social',
      analytics: '/api/analytics',
    },
  });
});

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 HenryMo Technologies API running on port ${PORT}`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/api/v1`);
    console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
  });
}

export default app;
