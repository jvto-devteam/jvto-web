require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

async function deepAnalysis() {
  try {
    // Read JSON SSOT
    const ssot = JSON.parse(fs.readFileSync('./JVTO_SSOT_v4_0_CLEAN.json', 'utf-8'));
    
    console.log('🔍 DETAILED DATA STRUCTURE ANALYSIS\n');
    console.log('='.repeat(80));
    
    // ============ CREW ANALYSIS ============
    console.log('\n📋 CREW REGISTRY ANALYSIS');
    console.log('-'.repeat(80));
    
    // JSON structure
    console.log('\n1️⃣ JSON SSOT - Crew Registry:');
    if (ssot.crew_registry && ssot.crew_registry.length > 0) {
      const sample = ssot.crew_registry[0];
      console.log('  Sample crew entry fields:');
      console.log('   ', Object.keys(sample).join(', '));
      console.log(`  Total crew in SSOT: ${ssot.crew_registry.length}`);
      
      // Show first 3 crew
      ssot.crew_registry.slice(0, 3).forEach((c, i) => {
        console.log(`\n  Crew ${i+1}: ${c.name || c.full_name || '?'}`);
        console.log(`    - Role: ${c.role || c.position || '?'}`);
        console.log(`    - Expertise: ${c.expertise ? c.expertise.join(', ') : 'N/A'}`);
        console.log(`    - Experience: ${c.experience_years || c.experience || '?'} years`);
      });
    }
    
    // DB structure
    console.log('\n\n2️⃣ DATABASE - Crew Members:');
    const dbCrew = await prisma.crew_members.findMany({ take: 3 });
    console.log(`  Total crew in DB: ${await prisma.crew_members.count()}`);
    
    if (dbCrew.length > 0) {
      console.log('  Sample crew entry fields:');
      console.log('   ', Object.keys(dbCrew[0]).join(', '));
      
      dbCrew.forEach((c, i) => {
        console.log(`\n  Crew ${i+1}: ${c.name || '?'}`);
        console.log(`    - Role: ${c.role || '?'}`);
        console.log(`    - Expertise: ${c.expertise || 'N/A'}`);
      });
    }
    
    // ============ DESTINATION ANALYSIS ============
    console.log('\n\n' + '='.repeat(80));
    console.log('🗺️ DESTINATION ANALYSIS');
    console.log('-'.repeat(80));
    
    // JSON structure
    console.log('\n1️⃣ JSON SSOT - Destinations:');
    if (ssot.destinations && ssot.destinations.length > 0) {
      const sample = ssot.destinations[0];
      console.log('  Sample destination entry fields:');
      console.log('   ', Object.keys(sample).join(', '));
      console.log(`  Total destinations in SSOT: ${ssot.destinations.length}`);
      
      ssot.destinations.slice(0, 3).forEach((d, i) => {
        console.log(`\n  Destination ${i+1}: ${d.name || d.title || '?'}`);
        console.log(`    - Slug: ${d.slug || d.url_slug || '?'}`);
        console.log(`    - Description: ${(d.description || d.overview || '?').substring(0, 60)}...`);
        console.log(`    - Elevation: ${d.elevation || d.altitude || '?'}`);
        console.log(`    - Activities: ${d.activities ? (Array.isArray(d.activities) ? d.activities.join(', ') : d.activities) : 'N/A'}`);
      });
    }
    
    // DB structure
    console.log('\n\n2️⃣ DATABASE - Destinations:');
    const dbDest = await prisma.destinations.findMany({ take: 3 });
    console.log(`  Total destinations in DB: ${await prisma.destinations.count()}`);
    
    if (dbDest.length > 0) {
      console.log('  Sample destination entry fields:');
      console.log('   ', Object.keys(dbDest[0]).join(', '));
      
      dbDest.forEach((d, i) => {
        console.log(`\n  Destination ${i+1}: ${d.name || '?'}`);
        console.log(`    - Slug: ${d.slug || '?'}`);
        console.log(`    - Description: ${(d.description || '?').substring(0, 60)}...`);
        console.log(`    - Elevation: ${d.elevation || '?'}`);
      });
    }
    
    // ============ COMPARISON ============
    console.log('\n\n' + '='.repeat(80));
    console.log('⚖️ DATA INTEGRITY CHECK');
    console.log('-'.repeat(80));
    
    // Check specific records
    console.log('\n📍 Checking if SSOT destinations exist in DB:');
    if (ssot.destinations && ssot.destinations.length > 0) {
      for (let dest of ssot.destinations.slice(0, 3)) {
        const dbMatch = await prisma.destinations.findFirst({
          where: { name: { equals: dest.name, mode: 'insensitive' } }
        });
        const status = dbMatch ? '✅ FOUND' : '❌ MISSING';
        console.log(`  ${status} - ${dest.name}`);
        if (dbMatch && dest.description) {
          const match = dbMatch.description?.includes(dest.description.substring(0, 30));
          console.log(`       Data match: ${match ? '✅ YES' : '⚠️ PARTIAL'}`);
        }
      }
    }
    
    console.log('\n👥 Checking if SSOT crew exist in DB:');
    if (ssot.crew_registry && ssot.crew_registry.length > 0) {
      for (let crew of ssot.crew_registry.slice(0, 3)) {
        const crewName = crew.name || crew.full_name;
        const dbMatch = await prisma.crew_members.findFirst({
          where: { name: { equals: crewName, mode: 'insensitive' } }
        });
        const status = dbMatch ? '✅ FOUND' : '❌ MISSING';
        console.log(`  ${status} - ${crewName}`);
      }
    }
    
    console.log('\n' + '='.repeat(80));
    console.log('\n📝 CONCLUSION');
    console.log('-'.repeat(80));
    console.log(`
✓ DB has data but may not have SSOT details
✓ Field names may differ between JSON and DB
✓ Some SSOT structured data may not be in DB
→ Migration/sync recommended to ensure data integrity
    `);
    
  } catch(e) {
    console.error('Error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}
deepAnalysis();
