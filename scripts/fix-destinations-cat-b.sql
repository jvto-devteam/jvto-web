-- Category B: Add missing content to existing columns (no schema change)

-- Ijen safety_notes: miners etiquette + health cert QR rule
UPDATE destinations
SET safety_notes = safety_notes || '["Sulfur miners have right of way on the trail — yield and do not photograph them without asking","Health certificate with QR code is mandatory — no valid cert, no crater entry (BBKSDA SE.1658/KSA.9/2024)"]'::jsonb
WHERE id = 2;

-- Tumpak Sewu safety_notes: helmet provider attribution
UPDATE destinations
SET safety_notes = safety_notes || '["Helmets are provided by local Tumpak Sewu site management, not JVTO equipment"]'::jsonb
WHERE id = 7;

-- Madakaripura safety_notes: helmet provider attribution
UPDATE destinations
SET safety_notes = safety_notes || '["Helmets are provided by local waterfall site management, not JVTO equipment"]'::jsonb
WHERE id = 6;

-- Madakaripura physical_requirements: horse option
UPDATE destinations
SET physical_requirements = physical_requirements || ' Horse available from the parking area for guests who prefer not to walk the full ~1.5km canyon approach.'
WHERE id = 6;

-- Tumpak Sewu required_gear: add poncho + trekking_poles
UPDATE destinations
SET required_gear = required_gear || '["poncho","trekking_poles"]'::jsonb
WHERE id = 7;

-- Bromo required_gear: add sunscreen
UPDATE destinations
SET required_gear = required_gear || '["sunscreen"]'::jsonb
WHERE id = 1;

-- Ijen cultural_context: append Blue Fire explanation
UPDATE destinations
SET cultural_context = cultural_context || ' The blue fire (api biru) phenomenon occurs when sulfuric gases emerge from vents under pressure and ignite on contact with air, burning electric blue. Visible only in darkness — typically midnight to pre-dawn. A natural phenomenon: not guaranteed on every night, affected by gas flow and weather conditions.'
WHERE id = 2;

-- Bromo tips_for_visitors: prepend specific timing
UPDATE destinations
SET tips_for_visitors = 'Jeep pickup 02:30–03:30 from hotel for Penanjakan viewpoint (arrive by 04:30 for sunrise). Sunrise 04:30–06:00. Tour typically finishes by 09:00–09:30. ' || tips_for_visitors
WHERE id = 1;

-- Ijen tips_for_visitors: prepend specific timing
UPDATE destinations
SET tips_for_visitors = 'Hotel departure 00:00, trek start at Paltuding trailhead 02:00, reach blue fire before 04:00, sunrise 05:00–06:00. ' || tips_for_visitors
WHERE id = 2;

-- Tumpak Sewu tips_for_visitors: prepend specific timing
UPDATE destinations
SET tips_for_visitors = 'Recommended start 07:00–08:00, finish 11:00–13:00 before midday heat. ' || tips_for_visitors
WHERE id = 7;

-- Madakaripura tips_for_visitors: prepend specific timing
UPDATE destinations
SET tips_for_visitors = 'Recommended start 08:00–12:00. ' || tips_for_visitors
WHERE id = 6;

-- Tumpak Sewu highlight: add Java's Niagara nickname + waterfall height
UPDATE destinations
SET highlight = 'Java''s Niagara — ~120m multi-tiered waterfall curtain. ' || highlight
WHERE id = 7;

-- Papuma highlight: add cape info + circuit role
UPDATE destinations
SET highlight = highlight || '. Cape headland Tanjung Papuma ~86m. The only coastal stop on a JVTO East Java circuit — between Ijen night hike and Tumpak Sewu canyon descent.'
WHERE id = 9;
