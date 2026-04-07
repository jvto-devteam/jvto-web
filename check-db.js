require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

async function checkCounts() {
  try {
    const [cp, blogs, faqs, dests, acts, crew] = await Promise.all([
      prisma.content_pages.count(),
      prisma.blogs.count(),
      prisma.faqs.count(),
      prisma.destinations.count(),
      prisma.activities.count(),
      prisma.crew_members.count()
    ]);
    console.log('DATABASE STATUS:');
    console.log('================');
    console.log(`Content Pages: ${cp}`);
    console.log(`Blog Posts: ${blogs}`);
    console.log(`FAQs: ${faqs}`);
    console.log(`Destinations: ${dests}`);
    console.log(`Activities: ${acts}`);
    console.log(`Crew Members: ${crew}`);
  } catch(e) {
    console.error('Error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}
checkCounts();
