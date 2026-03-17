INSERT INTO content_pages (route, lang, schema_version, seo, content, is_active, created_at, updated_at)
VALUES
  (
    '/',
    'en',
    1,
    '{"title":"Tourist Police-Led Private Volcano Tours in East Java | Java Volcano Tour Operator","description":"Private Bromo, Ijen & Tumpak Sewu tours from Surabaya or Bali. Licensed Indonesian operator (Licence 1102230032918), police-led safety culture, all-inclusive packages, Ijen health screening included."}'::jsonb,
    '{"h1":"Tourist Police-Led Private Volcano Tours in East Java"}'::jsonb,
    true,
    now(),
    now()
  ),
  (
    '/contact',
    'en',
    1,
    '{"title":"Contact JVTO Tours | Plan Your East Java Adventure","description":"Get in touch with our expert team to plan your private, all-inclusive tour of Mount Bromo, Ijen, and more. We are here to help you 24/7."}'::jsonb,
    '{"h1":"Contact Us"}'::jsonb,
    true,
    now(),
    now()
  ),
  (
    '/blog',
    'en',
    1,
    '{"title":"Insights | JVTO''s Blog on Safety, Planning & Community","description":"Explore our articles on choosing a legal operator, understanding Ijen health screening, and maximizing your East Java trip. Expert advice from a police-led team."}'::jsonb,
    '{"h1":"Insights & Explainers"}'::jsonb,
    true,
    now(),
    now()
  ),
  (
    '/destinations',
    'en',
    1,
    '{"title":"East Java Destinations | Bromo, Ijen & More","description":"Explore breathtaking destinations in East Java with JVTO. Discover our expert guides for Mount Bromo, Ijen Crater, Tumpak Sewu Waterfall, and more."}'::jsonb,
    '{"h1":"Destinations"}'::jsonb,
    true,
    now(),
    now()
  ),
  (
    '/tours',
    'en',
    1,
    '{"title":"All Private Tours | East Java & Bali Adventures","description":"Explore our complete collection of private tours in East Java and Bali. From Mount Bromo sunrise to Ijen Blue Fire and Tumpak Sewu Waterfall. Flexible starting points from Surabaya or Bali."}'::jsonb,
    '{"h1":"All Destinations Tours"}'::jsonb,
    true,
    now(),
    now()
  ),
  (
    '/tours/from-surabaya',
    'en',
    1,
    '{"title":"Private Tours From Surabaya | Bromo, Ijen & Tumpak Sewu","description":"Explore East Java starting from Surabaya. Best private tours to Mount Bromo sunrise, Ijen Blue Fire, and Madakaripura Waterfall. All-inclusive and hassle-free."}'::jsonb,
    '{"h1":"Surabaya Tours"}'::jsonb,
    true,
    now(),
    now()
  ),
  (
    '/tours/from-bali',
    'en',
    1,
    '{"title":"Private Tours From Bali to Java | Bromo & Ijen Crater","description":"Cross-island adventure from Bali to East Java. Includes ferry crossing, transport, and guided tours to Ijen Blue Fire and Mount Bromo. Drop-off in Bali or Surabaya."}'::jsonb,
    '{"h1":"Bali Tours"}'::jsonb,
    true,
    now(),
    now()
  ),
  (
    '/verify-jvto',
    'en',
    1,
    '{"title":"Verify: Forensic Evidence Locker & Legal Documents","description":"Forensic verification of JVTO''s Tourist Police authority, NIB legality, and operational safety protocols. Download official SHA256-signed documents."}'::jsonb,
    '{"h1":"Trust Through Transparency."}'::jsonb,
    true,
    now(),
    now()
  ),
  (
    '/verify-jvto/legal',
    'en',
    1,
    '{"title":"Verify: Legal Documents","description":"Verify NIB, TDUP, and official business registrations of PT Java Volcano Rendezvous."}'::jsonb,
    '{"h1":"Legal Documents"}'::jsonb,
    true,
    now(),
    now()
  ),
  (
    '/verify-jvto/police-safety',
    'en',
    1,
    '{"title":"Verify: Police Authority & Safety Protocols","description":"Forensic evidence of Tourist Police integration, health screening, and operational safety."}'::jsonb,
    '{"h1":"Police & Safety"}'::jsonb,
    true,
    now(),
    now()
  ),
  (
    '/verify-jvto/press-recognition',
    'en',
    1,
    '{"title":"Verify: Press Recognition","description":"Media coverage and recognition received by JVTO in various publications and platforms."}'::jsonb,
    '{"h1":"Press Recognition"}'::jsonb,
    true,
    now(),
    now()
  ),
  (
    '/verify-jvto/history-artifacts',
    'en',
    1,
    '{"title":"Verify: History Artifacts","description":"Historical records and artifacts related to JVTO''s operations and legacy."}'::jsonb,
    '{"h1":"History Artifacts"}'::jsonb,
    true,
    now(),
    now()
  ),
  (
    '/isic/student-package',
    'en',
    1,
    '{"title":"Explore Java''s Volcanoes with ISIC Benefits | JVTO","description":"Exclusive student deals for ISIC cardholders on safe, all-inclusive volcano tours in East Java with Java Volcano Tour Operator."}'::jsonb,
    '{"h1":"Explore Java''s Volcanoes with ISIC Benefits"}'::jsonb,
    true,
    now(),
    now()
  ),
  (
    '/student-deals/isic',
    'en',
    1,
    '{"title":"ISIC Student Deals — JVTO","description":"Student verification and fair pricing context: Alive Verify API handshake concept, and the practical reason JVTO uses it."}'::jsonb,
    '{"h1":"ISIC Student Deals"}'::jsonb,
    true,
    now(),
    now()
  )
ON CONFLICT (route, lang) DO UPDATE
SET
  schema_version = EXCLUDED.schema_version,
  seo = EXCLUDED.seo,
  content = content_pages.content || EXCLUDED.content,
  is_active = EXCLUDED.is_active,
  updated_at = now();
