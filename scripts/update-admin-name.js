// scripts/update-admin-name.js
// Quick script to update admin user name in database

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Updating admin user name...');

  try {
    const updatedUser = await prisma.user.update({
      where: { email: 'admin@henrymo.tech' },
      data: {
        name: 'Henry M. Ugochukwu',
      },
    });

    console.log('✅ Admin user updated successfully!');
    console.log('   Email:', updatedUser.email);
    console.log('   Name:', updatedUser.name);
    console.log('   Role:', updatedUser.role);
  } catch (error) {
    console.error('❌ Error updating user:', error);
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error('❌ Script failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

