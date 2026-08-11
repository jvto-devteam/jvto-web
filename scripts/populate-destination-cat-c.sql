-- Category C: Populate new destination columns
-- physical_demand scale: 1=Easy, 2=Moderate, 3=Moderate–Hard, 4=Hard, 5=Strenuous

-- Mount Bromo (id=1)
UPDATE destinations SET
  nickname         = 'The Iconic Volcanic Sunrise',
  trailhead        = 'Sand Sea, Tengger Caldera, Probolinggo',
  display_height_m = 2329,
  physical_demand  = 2
WHERE id = 1;

-- Mount Ijen (id=2)
UPDATE destinations SET
  nickname         = 'The Blue Fire Crater',
  trailhead        = 'Paltuding, Banyuwangi',
  display_height_m = 2386,
  physical_demand  = 4
WHERE id = 2;

-- Madakaripura (id=6)
UPDATE destinations SET
  nickname         = 'Gajah Mada''s Final Sanctuary',
  trailhead        = 'Brantas Gorge, Probolinggo',
  display_height_m = 200,
  physical_demand  = 2
WHERE id = 6;

-- Tumpak Sewu (id=7)
UPDATE destinations SET
  nickname         = 'Java''s Niagara',
  trailhead        = 'Coban Sewu, Lumajang',
  display_height_m = 120,
  physical_demand  = 3
WHERE id = 7;

-- Papuma (id=9)
UPDATE destinations SET
  nickname         = 'Java''s Hidden Turquoise Coast',
  trailhead        = 'Tanjung Papuma, Jember',
  display_height_m = 86,
  physical_demand  = 1
WHERE id = 9;
