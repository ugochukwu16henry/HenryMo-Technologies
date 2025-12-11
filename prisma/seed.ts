import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

async function main() {
  console.log('🌱 Seeding database...');

  // Create superadmin user
  const superadminPassword = await hashPassword('admin123');
  const superadmin = await prisma.user.upsert({
    where: { email: 'admin@henrymo.tech' },
    update: {},
    create: {
      email: 'admin@henrymo.tech',
      password: superadminPassword,
      name: 'Henry Kolawole',
      role: 'SUPERADMIN',
    },
  });

  console.log('✅ Created superadmin:', superadmin.email);

  // Create sample pages
  const homePage = await prisma.page.upsert({
    where: { slug: 'home' },
    update: {},
    create: {
      slug: 'home',
      title: 'Home',
      content: '<h1>Welcome to HenryMo Technologies</h1><p>Where Ideas Become Powerful Digital Solutions.</p>',
    },
  });

  const aboutPage = await prisma.page.upsert({
    where: { slug: 'about' },
    update: {},
    create: {
      slug: 'about',
      title: 'About Us',
      content: '<h1>About HenryMo Technologies</h1><p>We are a team of passionate developers...</p>',
    },
  });

  console.log('✅ Created pages:', homePage.slug, aboutPage.slug);

  // Create sample portfolio items
  const portfolio1 = await prisma.portfolioItem.create({
    data: {
      title: 'E-Commerce Platform',
      description: 'A full-featured e-commerce platform built with React and Node.js',
      image: 'https://via.placeholder.com/800x600',
      techStack: ['React', 'Node.js', 'PostgreSQL', 'TypeScript'],
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com/example',
    },
  });

  console.log('✅ Created portfolio items');

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
