require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

async function compareDetailedData() {
  try {
    const json = JSON.parse(fs.readFileSync('JVTO_SSOT_v4_0_CLEAN.json', 'utf-8'));
    
    console.log('🔍 DETAILED SYNC ANALYSIS: JSON vs DATABASE\n');
    console.log('=' .repeat(70) + '\n');
    
    // ========== DESTINATIONS ==========
    console.log('🏔️  DESTINATIONS COMPARISON\n');
    
    const jsonDestinations = json.destinations || [];
    const dbDestinations = await prisma.destinations.findMany({ 
      select: { id: true, name: true, slug: true, region: true }
    });
    
    console.log(`JSON: ${jsonDestinations.length} destinations`);
    console.log(`DB: ${dbDestinations.length} destinations\n`);
    
    // Check if JSON destinations are in DB
    const missingDestinations = jsonDestinations.filter(jd => 
      !dbDestinations.some(dd => dd.slug === jd.slug || dd.name === jd.name)
    );
    
    console.log(`Missing in DB: ${missingDestinations.length}`);
    if(missingDestinations.length > 0) {
      console.log('  Missing:', missingDestinations.map(d => d.name).join(', '));
    }
    
    // Check fields
    const jsonDestFields = jsonDestinations[0] ? Object.keys(jsonDestinations[0]) : [];
    const jsonCriticalFields = ['altitude_masl', 'latitude', 'longitude', 'difficulty_level', 'best_time_to_visit', 'temperature_range', 'permit_required', 'guide_required'];
    
    console.log('\nCritical fields in JSON that might be missing in DB:');
    console.log('  ' + jsonCriticalFields.join(', '));
    
    // ========== CREW ==========
    console.log('\n' + '='.repeat(70));
    console.log('\n👥 CREW REGISTRY COMPARISON\n');
    
    const jsonCrew = json.crew_registry || [];
    const dbCrew = await prisma.crew_members.findMany({
      select: { id: true, name: true, code: true, full_name: true }
    });
    
    console.log(`JSON: ${jsonCrew.length} crew members`);
    console.log(`DB: ${dbCrew.length} crew members\n`);
    
    // Check if JSON crew are in DB
    const missingCrew = jsonCrew.filter(jc => 
      !dbCrew.some(dc => dc.code === jc.id || dc.name === jc.name || dc.full_name === jc.name)
    );
    
    console.log(`Missing in DB: ${missingCrew.length}`);
    if(missingCrew.length > 0) {
      console.log('  Missing:', missingCrew.map(c => `${c.name} (${c.role})`).join(', '));
    }
    
    // Check fields
    const jsonCrewFields = jsonCrew[0] ? Object.keys(jsonCrew[0]) : [];
    const jsonCrewCriticalFields = ['archetype', 'knows_about', 'operating_style', 'self_quote', 'evidence_review_quotes'];
    
    console.log('\nRich data fields in JSON that might be missing in DB:');
    console.log('  ' + jsonCrewCriticalFields.join(', '));
    
    // ========== SUMMARY ==========
    console.log('\n' + '='.repeat(70));
    console.log('\n📊 SYNC STATUS SUMMARY\n');
    
    const needsSync = {
      destinations_missing: missingDestinations.length,
      destinations_enrichment_needed: true,
      crew_missing: missingCrew.length,
      crew_enrichment_needed: true
    };
    
    if(needsSync.destinations_missing === 0 && needsSync.crew_missing === 0) {
      console.log('✅ All entities from JSON are in DB');
      console.log('⚠️  BUT: DB might lack RICH METADATA fields from JSON');
      console.log('\nRecommendation: ENRICH existing records with JSON data');
    } else {
      console.log('❌ Some entities missing from DB');
      console.log('   Destinations missing:', needsSync.destinations_missing);
      console.log('   Crew missing:', needsSync.crew_missing);
      console.log('\nRecommendation: SYNC missing + ENRICH with metadata');
    }
    
  } catch(e) {
    console.error('Error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

compareDetailedData();
