-- Normalize page-specific schema storage in content_pages
-- Goal:
-- 1) Global org/site identity stays in organization_profile
-- 2) Page-specific schema lives in content_pages.seo
-- 3) Standardize keys to seo.schema_json / seo.schema_type
-- 4) Remove homepage TravelAgency from content_pages to avoid conflicts
--
-- Safe to run multiple times.

BEGIN;

-- 1) Normalize legacy schema keys into seo.schema_json
UPDATE public.content_pages
SET
  seo =
    (seo - 'schema_jsonld' - 'schemas_jsonld') ||
    CASE
      WHEN seo ? 'schema_json' THEN jsonb_build_object('schema_json', seo->'schema_json')
      WHEN seo ? 'schema_jsonld' THEN jsonb_build_object('schema_json', seo->'schema_jsonld')
      WHEN seo ? 'schemas_jsonld' THEN jsonb_build_object('schema_json', seo->'schemas_jsonld')
      ELSE '{}'::jsonb
    END,
  updated_at = now()
WHERE
  lang = 'en'
  AND is_active = true
  AND (
    seo ? 'schema_jsonld'
    OR seo ? 'schemas_jsonld'
  );

-- 2) Homepage must NOT define TravelAgency in content_pages.
-- TravelAgency comes from organization_profile.
UPDATE public.content_pages
SET
  seo = seo - 'schema_type',
  updated_at = now()
WHERE
  route = '/'
  AND lang = 'en'
  AND seo->>'schema_type' = 'TravelAgency';

-- 3) Set page-specific schema types that are safe to store in content_pages
WITH schema_type_updates(route, schema_type) AS (
  VALUES
    ('/blog', 'Blog'),
    ('/contact', 'ContactPage'),
    ('/travel-guide', 'CollectionPage'),
    ('/verify-jvto', 'CollectionPage'),
    ('/verify-jvto/legal', 'CollectionPage'),
    ('/verify-jvto/police-safety', 'CollectionPage'),
    ('/verify-jvto/press-recognition', 'CollectionPage'),
    ('/verify-jvto/history-artifacts', 'CollectionPage'),
    ('/isic/student-package', 'CollectionPage'),
    ('/student-deals/isic', 'AboutPage')
)
UPDATE public.content_pages cp
SET
  seo = jsonb_set(
    COALESCE(cp.seo, '{}'::jsonb),
    '{schema_type}',
    to_jsonb(stu.schema_type),
    true
  ),
  updated_at = now()
FROM schema_type_updates stu
WHERE
  cp.route = stu.route
  AND cp.lang = 'en'
  AND cp.is_active = true;

-- 4) Travel Guide hub: add static item list to DB so it no longer depends on hardcoded route map.
UPDATE public.content_pages
SET
  seo = jsonb_set(
    COALESCE(seo, '{}'::jsonb),
    '{schema_json}',
    '[
      {
        "@type": "ItemList",
        "@id": "https://javavolcano-touroperator.com/travel-guide#guide-sections",
        "name": "JVTO Travel Guide Sections",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "FAQ",
            "url": "https://javavolcano-touroperator.com/travel-guide/faq"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Booking Information",
            "url": "https://javavolcano-touroperator.com/travel-guide/booking-information"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Ijen Health Screening",
            "url": "https://javavolcano-touroperator.com/travel-guide/ijen-health-screening"
          },
          {
            "@type": "ListItem",
            "position": 4,
            "name": "Safety on Tours",
            "url": "https://javavolcano-touroperator.com/travel-guide/safety-on-tours"
          },
          {
            "@type": "ListItem",
            "position": 5,
            "name": "Packing and Fitness",
            "url": "https://javavolcano-touroperator.com/travel-guide/packing-and-fitness"
          },
          {
            "@type": "ListItem",
            "position": 6,
            "name": "Weather and Closures",
            "url": "https://javavolcano-touroperator.com/travel-guide/weather-and-closures"
          },
          {
            "@type": "ListItem",
            "position": 7,
            "name": "Police Escort for Groups",
            "url": "https://javavolcano-touroperator.com/travel-guide/police-escort-for-groups"
          }
        ]
      }
    ]'::jsonb,
    true
  ),
  updated_at = now()
WHERE
  route = '/travel-guide'
  AND lang = 'en'
  AND is_active = true;

-- 5) Policy hub: legacy `schemas_jsonld` has been normalized; enforce the canonical key only.
UPDATE public.content_pages
SET
  seo = jsonb_set(
    COALESCE(seo, '{}'::jsonb),
    '{schema_type}',
    to_jsonb('CollectionPage'::text),
    true
  ),
  updated_at = now()
WHERE
  route = '/policy'
  AND lang = 'en'
  AND is_active = true;

COMMIT;

-- Notes:
-- The following page schemas are still better kept in code unless their source data
-- also moves into content_pages:
-- - /verify-jvto and /verify-jvto/* document ItemList nodes (driven by docs dataset)
-- - /isic/student-package package ItemList (driven by packages API)
-- - homepage custom Service / HealthApplication nodes
