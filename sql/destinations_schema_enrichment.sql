WITH destination_faqs AS (
  SELECT
    d.id,
    d.slug,
    d.short_slug,
    d.name,
    d.province,
    d.country,
    d.best_time_to_visit,
    d.difficulty_level,
    d.duration,
    d.permit_required,
    d.permit_details,
    d.guide_required,
    d.updated_at,
    format(
      'https://javavolcano-touroperator.com/destinations/%s',
      d.slug
    ) AS page_url,
    jsonb_build_object(
      '@type', 'FAQPage',
      '@id', format('https://javavolcano-touroperator.com/destinations/%s#faq', d.slug),
      'mainEntity',
      jsonb_build_array(
        jsonb_build_object(
          '@type', 'Question',
          'name', format('What is the best time to visit %s?', d.name),
          'acceptedAnswer',
          jsonb_build_object(
            '@type', 'Answer',
            'text',
            coalesce(
              nullif(d.best_time_to_visit, ''),
              format('%s can be visited year-round, but dry-season conditions are generally the most comfortable.', d.name)
            )
          )
        ),
        jsonb_build_object(
          '@type', 'Question',
          'name', format('How difficult is %s?', d.name),
          'acceptedAnswer',
          jsonb_build_object(
            '@type', 'Answer',
            'text',
            trim(
              both ' '
              from concat_ws(
                ' ',
                coalesce(
                  format('Difficulty level: %s.', d.difficulty_level),
                  format('Difficulty level for %s varies by route and weather.', d.name)
                ),
                coalesce(format('Typical visit duration: %s.', d.duration), '')
              )
            )
          )
        ),
        jsonb_build_object(
          '@type', 'Question',
          'name', format('Do I need a permit or guide for %s?', d.name),
          'acceptedAnswer',
          jsonb_build_object(
            '@type', 'Answer',
            'text',
            trim(
              both ' '
              from concat_ws(
                ' ',
                CASE
                  WHEN d.permit_required IS TRUE
                    THEN coalesce(nullif(d.permit_details, ''), 'A permit is required for entry.')
                  ELSE 'A special permit is typically not required.'
                END,
                CASE
                  WHEN d.guide_required IS TRUE
                    THEN 'A guide is required or strongly recommended for safety and route support.'
                  ELSE 'A guide may still be recommended depending on conditions and visitor experience.'
                END
              )
            )
          )
        )
      ),
      'isPartOf',
      jsonb_build_object(
        '@id',
        format('https://javavolcano-touroperator.com/destinations/%s#webpage', d.slug)
      )
    ) AS faq_node
  FROM destinations d
  WHERE d.published = TRUE
    AND d.slug IS NOT NULL
    AND d.schema_json IS NOT NULL
),
updated_graph AS (
  SELECT
    d.id,
    jsonb_build_object(
      '@context',
      coalesce(d.schema_json->'@context', to_jsonb('https://schema.org'::text)),
      '@graph',
      (
        SELECT jsonb_agg(
          CASE
            WHEN node->>'@id' = format('%s#%s', f.page_url, f.short_slug) THEN
              CASE
                WHEN node ? 'containedInPlace' THEN node
                ELSE jsonb_set(
                  node,
                  '{containedInPlace}',
                  jsonb_build_object(
                    '@type', 'Place',
                    'name', trim(
                      both ','
                      from concat_ws(', ', coalesce(nullif(f.province, ''), 'East Java'), coalesce(nullif(f.country, ''), 'Indonesia'))
                    ),
                    'address',
                    jsonb_build_object(
                      '@type', 'PostalAddress',
                      'addressRegion', coalesce(nullif(f.province, ''), 'East Java'),
                      'addressCountry', CASE
                        WHEN coalesce(nullif(f.country, ''), 'Indonesia') = 'Indonesia' THEN 'ID'
                        ELSE coalesce(nullif(f.country, ''), 'Indonesia')
                      END
                    )
                  )
                )
              END
            ELSE node
          END
        )
        FROM jsonb_array_elements(d.schema_json->'@graph') AS node
      ) ||
      CASE
        WHEN EXISTS (
          SELECT 1
          FROM jsonb_array_elements(d.schema_json->'@graph') AS node
          WHERE node->>'@type' = 'FAQPage'
        )
          THEN '[]'::jsonb
        ELSE jsonb_build_array(f.faq_node)
      END
    ) AS schema_json
  FROM destinations d
  JOIN destination_faqs f ON f.id = d.id
)
UPDATE destinations d
SET
  schema_json = ug.schema_json,
  updated_at = now()
FROM updated_graph ug
WHERE d.id = ug.id;
