-- physical_demand corrections (DB was off-by-1 vs design system)
UPDATE destinations SET physical_demand = 3 WHERE id = 1; -- Bromo: 2→3
UPDATE destinations SET physical_demand = 5 WHERE id = 2; -- Ijen: 4→5
UPDATE destinations SET physical_demand = 3 WHERE id = 6; -- Madakaripura: 2→3
UPDATE destinations SET physical_demand = 4 WHERE id = 7; -- Tumpak Sewu: 3→4

-- Papuma trail_details: tambah Siti Hinggil Hill viewpoint
UPDATE destinations
SET trail_details = trail_details || ' Optional 20–30 min hike to the Siti Hinggil Hill viewpoint (Tanjung Papuma headland, ~86m) for coastal panoramas and sunset views.'
WHERE id = 9;

-- Madakaripura required_gear: raincoat → poncho (sesuai design system)
UPDATE destinations
SET required_gear = (
  SELECT jsonb_agg(CASE WHEN item::text = '"raincoat"' THEN '"poncho"'::jsonb ELSE item END)
  FROM jsonb_array_elements(required_gear) item
)
WHERE id = 6;
