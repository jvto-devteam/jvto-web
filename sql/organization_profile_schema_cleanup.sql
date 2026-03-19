-- Clean malformed fragments from organization_profile.schema_json
-- Safe scope:
-- - only touches organization_profile.id = 1
-- - only removes objects inside @graph that do not have "@type"
-- - preserves all valid global nodes

-- Preview the current malformed nodes before updating.
SELECT
  jsonb_pretty(node) AS malformed_node
FROM organization_profile op
CROSS JOIN LATERAL jsonb_array_elements(
  CASE
    WHEN jsonb_typeof(op.schema_json) = 'object'
      AND jsonb_typeof(op.schema_json->'@graph') = 'array'
    THEN op.schema_json->'@graph'
    ELSE '[]'::jsonb
  END
) AS node
WHERE op.id = 1
  AND jsonb_typeof(node) = 'object'
  AND NOT (node ? '@type');

-- Remove malformed nodes without @type from the global graph.
UPDATE organization_profile op
SET schema_json = jsonb_set(
  op.schema_json,
  '{@graph}',
  COALESCE(
    (
      SELECT jsonb_agg(node)
      FROM jsonb_array_elements(op.schema_json->'@graph') AS node
      WHERE jsonb_typeof(node) = 'object'
        AND (node ? '@type')
    ),
    '[]'::jsonb
  )
)
WHERE op.id = 1
  AND jsonb_typeof(op.schema_json) = 'object'
  AND jsonb_typeof(op.schema_json->'@graph') = 'array'
  AND EXISTS (
    SELECT 1
    FROM jsonb_array_elements(op.schema_json->'@graph') AS node
    WHERE jsonb_typeof(node) = 'object'
      AND NOT (node ? '@type')
  );

-- Verify the remaining graph after cleanup.
SELECT
  jsonb_array_length(op.schema_json->'@graph') AS remaining_graph_nodes
FROM organization_profile op
WHERE op.id = 1
  AND jsonb_typeof(op.schema_json) = 'object'
  AND jsonb_typeof(op.schema_json->'@graph') = 'array';
