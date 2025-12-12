#!/usr/bin/env node

/**
 * Database Setup Helper Script
 * Helps generate .env file and provides database setup instructions
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🔧 HenryMo Technologies - Database Setup Helper\n');

// Check if .env already exists
const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  console.log('⚠️  .env file already exists!');
  console.log('   To recreate it, delete the existing .env file first.\n');
  process.exit(0);
}

// Read env.example
const envExamplePath = path.join(process.cwd(), 'env.example');
if (!fs.existsSync(envExamplePath)) {
  console.error('❌ env.example file not found!');
  process.exit(1);
}

const envExample = fs.readFileSync(envExamplePath, 'utf8');

// Generate secure secrets
const jwtSecret = crypto.randomBytes(32).toString('base64');
const jwtRefreshSecret = crypto.randomBytes(32).toString('base64');
const cronSecret = crypto.randomBytes(16).toString('hex');

// Replace placeholders
let envContent = envExample
  .replace(/your-super-secret-jwt-key-change-in-production/g, jwtSecret)
  .replace(/your-super-secret-refresh-key-change-in-production/g, jwtRefreshSecret);

// Add CRON_SECRET if not present
if (!envContent.includes('CRON_SECRET=')) {
  envContent += `\n# Cron Job Secret (for auto-posting)\nCRON_SECRET="${cronSecret}"\n`;
}

// Write .env file
fs.writeFileSync(envPath, envContent);

console.log('✅ Created .env file with secure secrets!');
console.log('\n📝 Next Steps:');
console.log('\n1. Set up your database:');
console.log('   Option A - Cloud Database (Recommended):');
console.log('   • Sign up at https://neon.tech (free tier available)');
console.log('   • Or https://supabase.com (free tier available)');
console.log('   • Create a new project and copy the connection string');
console.log('   • Update DATABASE_URL in .env file');
console.log('\n   Option B - Local PostgreSQL:');
console.log('   • Install PostgreSQL from https://www.postgresql.org/download/windows/');
console.log('   • Create database: CREATE DATABASE henrymo_db;');
console.log('   • Update DATABASE_URL in .env file\n');

console.log('2. Run database migrations:');
console.log('   npm run prisma:generate');
console.log('   npm run prisma:migrate');
console.log('   npm run prisma:seed\n');

console.log('3. Start the dev server:');
console.log('   npm run dev\n');

console.log('4. Test the setup:');
console.log('   • Visit http://localhost:3000/admin/login');
console.log('   • Login with: admin@henrymo.tech / admin123\n');

