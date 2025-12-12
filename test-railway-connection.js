#!/usr/bin/env node

/**
 * Test Railway Database Connection
 * Verifies that the DATABASE_URL in .env can connect to Railway
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testConnection() {
  console.log('🚂 Testing Railway Database Connection...\n');

  try {
    // Test 1: Check if DATABASE_URL is set
    const dbUrl = process.env.DATABASE_URL;
    
    if (!dbUrl) {
      console.error('❌ DATABASE_URL not found in .env file!');
      console.log('\nPlease:');
      console.log('1. Go to Railway dashboard');
      console.log('2. Click on your PostgreSQL service');
      console.log('3. Go to Variables tab');
      console.log('4. Copy DATABASE_URL');
      console.log('5. Add it to your .env file');
      process.exit(1);
    }

    // Check if it's a Railway URL
    if (dbUrl.includes('railway.app')) {
      console.log('✅ Railway connection string detected');
    } else if (dbUrl.includes('localhost')) {
      console.log('⚠️  Local database detected (not Railway)');
    } else {
      console.log('✅ Database connection string found');
    }

    // Check if SSL is configured
    if (dbUrl.includes('sslmode=require')) {
      console.log('✅ SSL enabled (secure connection)');
    } else {
      console.log('⚠️  SSL not enabled - adding ?sslmode=require recommended');
    }

    console.log('\n📡 Testing connection...\n');

    // Test 2: Try to connect
    await prisma.$connect();
    console.log('✅ Successfully connected to database!');

    // Test 3: Try a simple query
    const result = await prisma.$queryRaw`SELECT version()`;
    console.log('✅ Database query successful');
    
    if (result && result[0]) {
      console.log(`   PostgreSQL version: ${result[0].version.split(',')[0]}`);
    }

    // Test 4: Check if tables exist
    console.log('\n📊 Checking database schema...');
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;

    if (tables.length > 0) {
      console.log(`✅ Found ${tables.length} table(s):`);
      tables.forEach(table => {
        console.log(`   - ${table.table_name}`);
      });
    } else {
      console.log('⚠️  No tables found - run migrations: npm run prisma:migrate');
    }

    console.log('\n🎉 Railway connection test passed!\n');
    console.log('📝 Next steps:');
    console.log('   1. Run migrations: npm run prisma:migrate');
    console.log('   2. Seed database: npm run prisma:seed');
    console.log('   3. Start server: npm run dev\n');

  } catch (error) {
    console.error('\n❌ Connection failed!\n');
    
    if (error.code === 'P1001') {
      console.error('Cannot reach database server.');
      console.log('\nPossible issues:');
      console.log('1. Check your Railway service is running (not paused)');
      console.log('2. Verify DATABASE_URL is correct in .env');
      console.log('3. Make sure ?sslmode=require is in the connection string');
      console.log('4. Check your internet connection');
    } else if (error.code === 'P1000') {
      console.error('Authentication failed.');
      console.log('\nPossible issues:');
      console.log('1. Password in connection string might be wrong');
      console.log('2. User might not have access to the database');
      console.log('3. Check your Railway credentials');
    } else {
      console.error('Error:', error.message);
      console.log('\nFull error details:');
      console.error(error);
    }
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();

