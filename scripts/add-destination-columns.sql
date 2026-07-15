ALTER TABLE destinations
  ADD COLUMN IF NOT EXISTS display_height_m INTEGER,
  ADD COLUMN IF NOT EXISTS nickname         VARCHAR(150),
  ADD COLUMN IF NOT EXISTS trailhead        VARCHAR(200),
  ADD COLUMN IF NOT EXISTS physical_demand  INTEGER,
  ADD COLUMN IF NOT EXISTS sections         JSONB;
