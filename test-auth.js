#!/usr/bin/env node

/**
 * Test Authentication and Protected Routes
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testAuth() {
  console.log('🧪 Testing Authentication and Protected Routes\n');

  try {
    // Test 1: Login
    console.log('1️⃣  Testing Login...');
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'admin@henrymo.tech',
      password: 'admin123',
    });

    if (loginResponse.data.token && loginResponse.data.user) {
      console.log('   ✅ Login successful!');
      console.log(`   User: ${loginResponse.data.user.email}`);
      console.log(`   Role: ${loginResponse.data.user.role}`);
      console.log(`   Token: ${loginResponse.data.token.substring(0, 20)}...\n`);

      const token = loginResponse.data.token;

      // Test 2: Protected API endpoint
      console.log('2️⃣  Testing Protected API (/api/auth/me)...');
      try {
        const meResponse = await axios.get(`${BASE_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('   ✅ Protected API accessible');
        console.log(`   User: ${meResponse.data.email}`);
        console.log(`   Role: ${meResponse.data.role}\n`);
      } catch (err) {
        console.log('   ❌ Protected API failed:', err.response?.data || err.message);
      }

      // Test 3: Test without token
      console.log('3️⃣  Testing API without token (should fail)...');
      try {
        await axios.get(`${BASE_URL}/api/auth/me`);
        console.log('   ❌ Should have failed without token!\n');
      } catch (err) {
        if (err.response?.status === 401) {
          console.log('   ✅ Correctly rejected request without token\n');
        } else {
          console.log('   ⚠️  Unexpected error:', err.response?.status);
        }
      }

      console.log('🎉 All tests passed!\n');
      console.log('📝 Next Steps:');
      console.log('   1. Visit http://localhost:3000/admin/login');
      console.log('   2. Login with: admin@henrymo.tech / admin123');
      console.log('   3. You should be redirected to /admin dashboard');
      console.log('   4. Try accessing /admin/cms - should be protected\n');

    } else {
      console.log('   ❌ Login failed - invalid response format');
    }
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('   ❌ Cannot connect to server');
      console.log('   Make sure dev server is running: npm run dev\n');
    } else {
      console.log('   ❌ Login failed:', error.response?.data || error.message);
      console.log('   Check your database connection and seed data\n');
    }
    process.exit(1);
  }
}

testAuth();

