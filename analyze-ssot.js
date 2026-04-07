const fs = require('fs');
const json = JSON.parse(fs.readFileSync('JVTO_SSOT_v4_0_CLEAN.json', 'utf-8'));

console.log('📋 SSOT JSON STRUCTURE ANALYSIS\n');

// Destinations
if(json.destinations?.length) {
  console.log('🏔️  DESTINATIONS:');
  console.log('   Count:', json.destinations.length);
  if(json.destinations[0]) {
    console.log('   Fields:', Object.keys(json.destinations[0]).join(', '));
    console.log('   Sample:', JSON.stringify({
      id: json.destinations[0].id,
      name: json.destinations[0].name,
      slug: json.destinations[0].slug,
      region: json.destinations[0].region
    }, null, 2));
  }
}

// Crew
if(json.crew_registry?.length) {
  console.log('\n👥 CREW REGISTRY:');
  console.log('   Count:', json.crew_registry.length);
  if(json.crew_registry[0]) {
    console.log('   Fields:', Object.keys(json.crew_registry[0]).join(', '));
    console.log('   Sample:', JSON.stringify({
      id: json.crew_registry[0].id,
      name: json.crew_registry[0].name,
      role: json.crew_registry[0].role,
      expertise: json.crew_registry[0].expertise
    }, null, 2));
  }
}

// Content Pages
if(json.content_pages?.length) {
  console.log('\n📄 CONTENT PAGES:');
  console.log('   Count:', json.content_pages.length);
  if(json.content_pages[0]) {
    console.log('   Fields:', Object.keys(json.content_pages[0]).join(', '));
  }
}

// Pages (mixed)
if(json.pages?.length) {
  console.log('\n📑 PAGES (mixed):');
  console.log('   Count:', json.pages.length);
  const types = {};
  json.pages.forEach(p => types[p.type] = (types[p.type] || 0) + 1);
  console.log('   Types:', types);
}

console.log('\n✅ Analysis complete');
