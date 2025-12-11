import { Destination } from '../types';

export const destinationsData: Destination[] = [
    {
        id: 'bromo',
        slug: 'mount-bromo',
        name: 'Mount Bromo',
        description: "Mount Bromo, part of the Tengger Caldera, is an active volcano in East Java. Standing at 2,329 meters, it's a world-renowned icon, famed for its ethereal sunrises, vast 'Sea of Sand', and the raw power of its active crater.",
        images: [
            "https://legacy.javavolcano-touroperator.com/assets/img/destinations/new4.jpg",
            "https://legacy.javavolcano-touroperator.com/assets/img/destinations/new3.jpg",
            "https://legacy.javavolcano-touroperator.com/assets/img/destinations/new2.jpg",
            "https://legacy.javavolcano-touroperator.com/assets/img/destinations/new1.jpg",
            "https://legacy.javavolcano-touroperator.com/assets/img/destinations/fb10.jpg"
        ],
        geo: { latitude: -7.94227, longitude: 112.95301 },
        keyInfo: {
            type: 'Volcanic Caldera',
            phenomenon: 'Sunrise over Tengger & Semeru',
            difficulty: 'Moderate',
            difficultyRating: '3/5',
            elevation: '2,329 m',
            bestSeason: 'Jun–Sep',
            coreEmotion: 'Faith & Majesty'
        },
        risks: {
            gasToxicity: 'Moderate',
            floodRain: 'Low',
            slipperyTerrain: 'Moderate',
            coldExposure: 'High',
            crowdOverTourism: 'High'
        },
        trekkingData: {
            distance: 'Jeep + walk',
            duration: '5–6 hrs (round trip)',
            terrain: 'Sand plain, crater stairs',
            access: 'Sukapura-Cemoro Lawang'
        },
        properties: [
            { propertyID: "weatherBySeason", name: "Weather by Season", value: "Dry Season (May–October)", description: "Dry Season (May–October): Cooler temperatures (5°C–20°C or 41°F–68°F) and clear skies. Wet Season (November–April): Frequent rain, warmer temperatures (10°C–25°C or 50°F–77°F)." },
            { propertyID: "rainfallIntensity", name: "Rainfall Intensity", value: "December–February", description: "Heaviest Rainfall: December–February. Least Rainfall: May–October." },
            { propertyID: "environmentalFactors", name: "Environmental Factors", value: "2,329 m asl, windy", description: "Altitude: ~2,329 m (7,641 ft). Temperature: 5°C–20°C. Wind Speed: 10–20 km/h." },
            { propertyID: "mainAttractions", name: "Main Attractions", value: "Sunrise & Bromo Crater", description: "Sunrise views of Mount Bromo and Semeru, Teletubbies Hill." },
            { propertyID: "gpxTotalDistanceKm", name: "GPX Total Distance (km)", value: 6.9, description: "Total distance of the primary trekking route." },
            { propertyID: "gpxElevationGainM", name: "GPX Elevation Gain (m)", value: 482, description: "Total ascent during the trek." },
            { propertyID: "gpxElevationLossM", name: "GPX Elevation Loss (m)", value: 482, description: "Total descent during the trek." },
            { propertyID: "gpxMinElevationM", name: "GPX Min Elevation (m)", value: 2211 },
            { propertyID: "gpxMaxElevationM", name: "GPX Max Elevation (m)", value: 2633 },
            { propertyID: "gpxBoundingBox", name: "GPX Bounding Box", value: "-7.91898,112.94846 -7.90875,112.96186", description: "lat_min,lon_min lat_max,lon_max" }
        ],
        gpxTrack: [
            [-7.9188, 112.9485], [-7.9187, 112.9485], [-7.9186, 112.9486], [-7.9185, 112.9486], [-7.9184, 112.9487], [-7.9183, 112.9488], [-7.9182, 112.9489], [-7.9181, 112.949], [-7.918, 112.9491], [-7.9179, 112.9492], [-7.9178, 112.9494], [-7.9177, 112.9496], [-7.9176, 112.9498], [-7.9175, 112.95], [-7.9174, 112.9502], [-7.9173, 112.9504], [-7.9172, 112.9507], [-7.9171, 112.951], [-7.917, 112.9513], [-7.9169, 112.9516], [-7.9168, 112.9519], [-7.9167, 112.9522], [-7.9166, 112.9525], [-7.9165, 112.9528], [-7.9163, 112.9531], [-7.9161, 112.9534], [-7.9159, 112.9537], [-7.9157, 112.954], [-7.9155, 112.9543], [-7.9153, 112.9546], [-7.9151, 112.9549], [-7.9149, 112.9552], [-7.9147, 112.9555], [-7.9145, 112.9557], [-7.9143, 112.956], [-7.9141, 112.9562], [-7.9139, 112.9564], [-7.9137, 112.9566], [-7.9135, 112.9568], [-7.9133, 112.957], [-7.9131, 112.9572], [-7.9129, 112.9574], [-7.9127, 112.9576], [-7.9125, 112.9578], [-7.9123, 112.958], [-7.9121, 112.9582], [-7.9119, 112.9584], [-7.9117, 112.9586], [-7.9115, 112.9588], [-7.9113, 112.959], [-7.9111, 112.9592], [-7.9109, 112.9594], [-7.9107, 112.9596], [-7.9105, 112.9598], [-7.9103, 112.96], [-7.9101, 112.9602], [-7.9099, 112.9604], [-7.9097, 112.9606], [-7.9095, 112.9608], [-7.9093, 112.961], [-7.9091, 112.9612], [-7.9089, 112.9614], [-7.9088, 112.9616]
        ],
        gpxElevationProfile: [
            { distance: 0.0, elevation: 2215 }, { distance: 0.5, elevation: 2282 }, { distance: 1.0, elevation: 2350 }, { distance: 1.5, elevation: 2420 }, { distance: 2.0, elevation: 2490 }, { distance: 2.5, elevation: 2550 }, { distance: 3.0, elevation: 2610 }, { distance: 3.5, elevation: 2633 }, { distance: 4.0, elevation: 2580 }, { distance: 4.5, elevation: 2510 }, { distance: 5.0, elevation: 2440 }, { distance: 5.5, elevation: 2370 }, { distance: 6.0, elevation: 2300 }, { distance: 6.5, elevation: 2240 }, { distance: 6.9, elevation: 2211 }
        ]
    },
    {
        id: 'ijen',
        slug: 'ijen-crater',
        name: 'Ijen Crater',
        description: "Mount Ijen is a unique volcano complex famed for its otherworldly 'blue fire' phenomenon and the world's largest acidic crater lake. The challenging midnight trek is a rite of passage for adventurers, rewarded with surreal landscapes at dawn.",
        images: [
            "https://legacy.javavolcano-touroperator.com/assets/img/destinations/new6.jpg",
            "https://legacy.javavolcano-touroperator.com/assets/img/destinations/fb8.jpg",
            "https://legacy.javavolcano-touroperator.com/assets/img/destinations/fb6.jpg",
            "https://legacy.javavolcano-touroperator.com/assets/img/destinations/fb5.jpg",
            "https://legacy.javavolcano-touroperator.com/assets/img/destinations/fb2.jpg"
        ],
        geo: { latitude: -8.05795, longitude: 114.24165 },
        keyInfo: {
            type: 'Active Volcano',
            phenomenon: 'Blue Fire, Acid Lake',
            difficulty: 'Moderate',
            difficultyRating: '3/5',
            elevation: '2,799 m',
            bestSeason: 'May–Oct',
            coreEmotion: 'Awe & Respect'
        },
        risks: {
            gasToxicity: 'High',
            floodRain: 'Low',
            slipperyTerrain: 'Moderate',
            coldExposure: 'High',
            crowdOverTourism: 'Moderate'
        },
        trekkingData: {
            distance: '6 km (round trip)',
            duration: '3–4 hrs',
            terrain: 'Gravel slope, volcanic ash',
            access: 'Paltuding base'
        },
        properties: [
            { propertyID: "weatherBySeason", name: "Weather by Season", value: "Dry Season (May–October)", description: "Ideal for trekking, with cooler temperatures (10°C–20°C or 50°F–68°F) and clear skies. Wet Season (November–April): Warmer (12°C–22°C or 54°F–72°F), higher humidity, and frequent rain." },
            { propertyID: "rainfallIntensity", name: "Rainfall Intensity", value: "December–February", description: "Heaviest Rainfall: December–February. Least Rainfall: May–October. Rain during the wet season can make trails muddy and slippery." },
            { propertyID: "environmentalFactors", name: "Environmental Factors", value: "2,386 m asl, windy", description: "Altitude: Crater rim at ~2,386 m (7,828 ft), Paltuding at ~1,850 m (6,070 ft). Temperature: 2°C–20°C. Wind Speed: 10–20 km/h." },
            { propertyID: "mainAttractions", name: "Main Attractions", value: "Blue Fire & Crater Lake", description: "Turquoise Crater Lake, Blue Fire, Sunrise Views." },
            { propertyID: "gpxTotalDistanceKm", name: "GPX Total Distance (km)", value: 9.7, description: "Total distance of the primary trekking route." },
            { propertyID: "gpxElevationGainM", name: "GPX Elevation Gain (m)", value: 677, description: "Total ascent during the trek." },
            { propertyID: "gpxElevationLossM", name: "GPX Elevation Loss (m)", value: 677, description: "Total descent during the trek." },
            { propertyID: "gpxMinElevationM", name: "GPX Min Elevation (m)", value: 1869 },
            { propertyID: "gpxMaxElevationM", name: "GPX Max Elevation (m)", value: 2379 },
            { propertyID: "gpxBoundingBox", name: "GPX Bounding Box", value: "-8.07398,114.22366 -8.05363,114.24811", description: "lat_min,lon_min lat_max,lon_max" }
        ],
        gpxTrack: [
            [-8.068, 114.224], [-8.0678, 114.2243], [-8.0676, 114.2246], [-8.0674, 114.2249], [-8.0672, 114.2252], [-8.067, 114.2255], [-8.0668, 114.2258], [-8.0666, 114.2261], [-8.0664, 114.2264], [-8.0662, 114.2267], [-8.066, 114.227], [-8.0658, 114.2273], [-8.0656, 114.2276], [-8.0654, 114.2279], [-8.0652, 114.2282], [-8.065, 114.2285], [-8.0648, 114.2288], [-8.0646, 114.2291], [-8.0644, 114.2294], [-8.0642, 114.2297], [-8.064, 114.23], [-8.0638, 114.2303], [-8.0636, 114.2306], [-8.0634, 114.2309], [-8.0632, 114.2312], [-8.063, 114.2315], [-8.0628, 114.2318], [-8.0626, 114.2321], [-8.0624, 114.2324], [-8.0622, 114.2327], [-8.062, 114.233], [-8.0618, 114.2333], [-8.0616, 114.2336], [-8.0614, 114.2339], [-8.0612, 114.2342], [-8.061, 114.2345], [-8.0608, 114.2348], [-8.0606, 114.2351], [-8.0604, 114.2354], [-8.0602, 114.2357], [-8.06, 114.236], [-8.0598, 114.2363], [-8.0596, 114.2366], [-8.0594, 114.2369], [-8.0592, 114.2372], [-8.059, 114.2375], [-8.0588, 114.2378], [-8.0586, 114.2381], [-8.0584, 114.2384], [-8.0582, 114.2387], [-8.058, 114.239], [-8.0578, 114.2393], [-8.0576, 114.2396], [-8.0574, 114.2399], [-8.0572, 114.2402], [-8.057, 114.2405], [-8.0568, 114.2408], [-8.0566, 114.2411], [-8.0564, 114.2414], [-8.0562, 114.2417], [-8.056, 114.242], [-8.0558, 114.2423], [-8.0556, 114.2426], [-8.0554, 114.2429], [-8.0552, 114.2432], [-8.055, 114.2435], [-8.0548, 114.2438], [-8.0546, 114.2441], [-8.0544, 114.2444], [-8.0542, 114.2447], [-8.054, 114.245], [-8.0538, 114.2453]
        ],
        gpxElevationProfile: [
            { distance: 0.0, elevation: 1870 }, { distance: 0.5, elevation: 1950 }, { distance: 1.0, elevation: 2030 }, { distance: 1.5, elevation: 2100 }, { distance: 2.0, elevation: 2170 }, { distance: 2.5, elevation: 2230 }, { distance: 3.0, elevation: 2275 }, { distance: 3.5, elevation: 2320 }, { distance: 4.0, elevation: 2355 }, { distance: 4.5, elevation: 2375 }, { distance: 4.8, elevation: 2379 }, { distance: 5.3, elevation: 2320 }, { distance: 5.8, elevation: 2250 }, { distance: 6.3, elevation: 2180 }, { distance: 6.8, elevation: 2120 }, { distance: 7.3, elevation: 2060 }, { distance: 7.8, elevation: 2000 }, { distance: 8.3, elevation: 1950 }, { distance: 8.8, elevation: 1900 }, { distance: 9.3, elevation: 1880 }, { distance: 9.7, elevation: 1869 }
        ]
    },
    {
        id: 'tumpak-sewu',
        slug: 'tumpak-sewu-waterfall',
        name: 'Tumpak Sewu Waterfall',
        description: 'Often called "Coban Sewu" or "a thousand waterfalls," Tumpak Sewu is a breathtaking 120-meter high tiered waterfall that forms a majestic curtain of water. The trek to its base is a true adventure into a hidden paradise.',
        images: [
            "https://legacy.javavolcano-touroperator.com/assets/img/destinations/new5.jpg",
            "https://legacy.javavolcano-touroperator.com/assets/img/destinations/fb3.jpg",
            "https://legacy.javavolcano-touroperator.com/assets/img/destinations/mt-ijen-papuma-beach-tumpak-sewu-fall-mt.-bromo-malang-tour-surabaya-(6d-5n)-1692676432971/tumpaksewu3.webp",
            "https://legacy.javavolcano-touroperator.com/assets/img/destinations/mt-ijen-papuma-beach-tumpak-sewu-fall-mt.-bromo-malang-tour-surabaya-(6d-5n)-1692676432971/tumpaksewu2.webp",
            "https://legacy.javavolcano-touroperator.com/assets/img/destinations/ijen-coffee-and-cocoa-science-technopark-papuma-tumpak-sewu-bromo-surabaya-(6d-5n)-1692530713108/tumpaksewu4.webp"
        ],
        geo: { latitude: -8.2302713, longitude: 112.9165192 },
        keyInfo: {
            type: 'Waterfall Canyon',
            phenomenon: 'Multi-veil Falls with Semeru backdrop',
            difficulty: 'Hard',
            difficultyRating: '3.5/5',
            elevation: '~500 m',
            bestSeason: 'May–Jul',
            coreEmotion: 'Humility & Wonder'
        },
        risks: {
            gasToxicity: 'None',
            floodRain: 'High',
            slipperyTerrain: 'High',
            coldExposure: 'Low',
            crowdOverTourism: 'Moderate'
        },
        trekkingData: {
            distance: '2.4 km (round trip)',
            duration: '2–3 hrs',
            terrain: 'Canyon, ropes',
            access: 'Sidomulyo village'
        },
        properties: [
            { propertyID: "weatherBySeason", name: "Weather by Season", value: "Dry Season (May–October)", description: "Ideal for visits with clear skies and cooler conditions (22°C–30°C or 72°F–86°F). Wet Season (November–April): Frequent rains, slippery trails, and higher humidity." },
            { propertyID: "rainfallIntensity", name: "Rainfall Intensity", value: "December–February", description: "Heaviest Rainfall: December–February. Least Rainfall: May–October, providing safer and more enjoyable trekking conditions." },
            { propertyID: "requiredGear", name: "Required Gear", value: "Quick-dry clothes & trekking sandals", description: "Clothing: Quick-dry clothes and waterproof layers. Footwear: Non-slip trekking sandals or water shoes. Other: Poncho, waterproof bag, walking poles, snacks, and water." },
            { propertyID: "environmentalFactors", name: "Environmental Factors", value: "400 m asl, humid", description: "Altitude: Base of the waterfall at ~400 m (1,312 ft) above sea level. Temperature: Cool and refreshing (20°C–25°C or 68°F–77°F). Humidity: High (~80%–90%), with constant mist." },
            { propertyID: "mainAttractions", name: "Main Attractions", value: "Horseshoe Waterfall", description: "Horseshoe-Shaped Waterfall: Cascading water creates a mesmerizing view." },
            { propertyID: "gpxTotalDistanceKm", name: "GPX Total Distance (km)", value: 0.7, description: "Total distance of the primary trekking route." },
            { propertyID: "gpxElevationGainM", name: "GPX Elevation Gain (m)", value: 28, description: "Total ascent during the trek." },
            { propertyID: "gpxElevationLossM", name: "GPX Elevation Loss (m)", value: 28, description: "Total descent during the trek." },
            { propertyID: "gpxMinElevationM", name: "GPX Min Elevation (m)", value: 512 },
            { propertyID: "gpxMaxElevationM", name: "GPX Max Elevation (m)", value: 562 },
            { propertyID: "gpxBoundingBox", name: "GPX Bounding Box", value: "-8.23184,112.91781 -8.23028,112.91997", description: "lat_min,lon_min lat_max,lon_max" }
        ],
    },
    {
        id: 'madakaripura',
        slug: 'madakaripura-waterfall',
        name: 'Madakaripura Waterfall',
        description: "Hidden in a deep valley in the foothills of the Bromo-Tengger-Semeru National Park, Madakaripura is a legendary 200-meter high waterfall. The journey to its base is an adventure in itself, involving a trek through rivers and lush greenery to reach the towering, sacred cascades.",
        images: [
            "https://legacy.javavolcano-touroperator.com/assets/img/destinations/mt-ijen-papuma-beach-tumpak-sewu-fall-mt.-bromo-malang-tour-surabaya-(6d-5n)-1692676432971/madakaripura1.webp",
            "https://legacy.javavolcano-touroperator.com/assets/img/destinations/mt-ijen-papuma-beach-tumpak-sewu-fall-mt.-bromo-malang-tour-surabaya-(6d-5n)-1692676432971/madakaripura.webp",
            "https://legacy.javavolcano-touroperator.com/assets/img/destinations/mt.ijen-bromo-madakaripura-malang-surabaya-(-5d-4n-)-1676527974520/madakaripura1.webp",
            "https://legacy.javavolcano-touroperator.com/assets/img/destinations/mt.-ijen---bromo---madakaripura---surabaya-night-market-tour-(4d-3n)-1676516629546/madakaripura (2).webp",
            "https://legacy.javavolcano-touroperator.com/assets/img/destinations/mt.-ijen---bromo---madakaripura---surabaya-night-market-tour-(4d-3n)-1676513053011/madakaripura1.webp"
        ],
        geo: { latitude: -7.8551394, longitude: 113.0076892 },
        keyInfo: {
            type: 'Canyon Waterfall',
            phenomenon: 'Sacred Cave, Vertical Mist Wall',
            difficulty: 'Moderate',
            difficultyRating: '3/5',
            elevation: '~620 m',
            bestSeason: 'May–Oct',
            coreEmotion: 'Reflection & Legacy'
        },
        risks: {
            gasToxicity: 'None',
            floodRain: 'High',
            slipperyTerrain: 'High',
            coldExposure: 'Low',
            crowdOverTourism: 'Moderate'
        },
        trekkingData: {
            distance: '3 km (round trip)',
            duration: '1.5–2 hrs',
            terrain: 'River trek',
            access: 'Lumbang village'
        },
        properties: [
            { propertyID: "weatherBySeason", name: "Weather by Season", value: "Dry Season (May–October)", description: "Best for visits, with safer trails and lower water levels. Wet Season (November–April): Higher water flow, slippery trails, and risk of flash floods." },
            { propertyID: "rainfallIntensity", name: "Rainfall Intensity", value: "December–February", description: "Heaviest Rainfall: December–February. Least Rainfall: May–October." },
            { propertyID: "requiredGear", name: "Required Gear", value: "Quick-dry clothes & water shoes", description: "Clothing: Quick-dry clothes and waterproof items. Footwear: Water shoes or sturdy sandals. Other: Poncho, waterproof bag, snacks, and water." },
            { propertyID: "environmentalFactors", name: "Environmental Factors", value: "620 m asl, humid", description: "Altitude: ~620 m (2,034 ft). Temperature: 20°C–25°C. Humidity: Very high (~90%)." },
            { propertyID: "mainAttractions", name: "Main Attractions", value: "200 m Waterfall", description: "Tall waterfall (200 m), cave-like cliffs." },
            { propertyID: "gpxTotalDistanceKm", name: "GPX Total Distance (km)", value: 3.7, description: "Total distance of the primary trekking route." },
            { propertyID: "gpxElevationGainM", name: "GPX Elevation Gain (m)", value: 445, description: "Total ascent during the trek." },
            { propertyID: "gpxElevationLossM", name: "GPX Elevation Loss (m)", value: 445, description: "Total descent during the trek." },
            { propertyID: "gpxMinElevationM", name: "GPX Min Elevation (m)", value: 561 },
            { propertyID: "gpxMaxElevationM", name: "GPX Max Elevation (m)", value: 836 },
            { propertyID: "gpxBoundingBox", name: "GPX Bounding Box", value: "-7.85401,113.00867 -7.84388,113.01865", description: "lat_min,lon_min lat_max,lon_max" }
        ],
    },
    {
        id: 'papuma-beach',
        slug: 'papuma-beach',
        name: 'Papuma Beach',
        description: "A stunning coastal landscape where dramatic cliffs meet the Indian Ocean. Papuma is renowned for its unique dual-view spots, making it one of the few places in Java where you can witness both a spectacular sunrise and a breathtaking sunset from the same coastline.",
        images: ['https://images.unsplash.com/photo-1590523278144-6c3b65d3284d?q=80&w=800&auto-format=fit=crop'],
        geo: { latitude: -8.4239, longitude: 113.5601 },
        keyInfo: {
            type: 'Coastal Cliff',
            phenomenon: 'Sunrise & Sunset Dual View',
            difficulty: 'Easy',
            difficultyRating: '2/5',
            elevation: '0–50 m',
            bestSeason: 'May–Oct',
            coreEmotion: 'Serenity & Balance'
        },
        risks: {
            gasToxicity: 'None',
            floodRain: 'Low',
            slipperyTerrain: 'Moderate',
            coldExposure: 'None',
            crowdOverTourism: 'Moderate'
        },
        trekkingData: {
            distance: '<1 km',
            duration: '1 hr',
            terrain: 'Sand, rocky beach',
            access: 'Jember city route'
        },
        properties: []
    },
    {
      id: 'surabaya',
      slug: 'surabaya-city',
      name: 'Surabaya City',
      description: "As East Java's bustling capital, Surabaya is a key gateway for volcano adventures. It's a city of contrasts, where modern skyscrapers stand beside historic colonial architecture and vibrant traditional markets.",
      images: ['https://images.unsplash.com/photo-1588704406399-6548540435b6?q=80&w=800&auto-format=fit=crop'],
      geo: { latitude: -7.2575, longitude: 112.7521 },
      keyInfo: { type: 'City', phenomenon: 'Urban Gateway', difficulty: 'Easy', difficultyRating: '1/5', elevation: '5 m', bestSeason: 'All Year', coreEmotion: 'Hub' },
      risks: { gasToxicity: 'None', floodRain: 'Low', slipperyTerrain: 'Low', coldExposure: 'None', crowdOverTourism: 'Moderate' },
      trekkingData: { distance: 'N/A', duration: 'N/A', terrain: 'Urban', access: 'International Airport (SUB)'},
      properties: []
    },
    {
      id: 'malang',
      slug: 'malang-highlands',
      name: 'Malang City',
      description: 'A charming city famous for its colonial architecture, colorful urban art, cool climate, and nearby agro-tourism in Batu.',
      images: [
        'https://images.unsplash.com/photo-1596422846543-162d9f102773?q=80&w=800&auto-format=fit=crop',
        'https://images.unsplash.com/photo-1616679904239-268a2e1d1b9b?q=80&w=800&auto-format=fit=crop',
        'https://images.unsplash.com/photo-1623157512293-1323f1348b48?q=80&w=800&auto-format=fit=crop'
      ],
      geo: { latitude: -7.9797, longitude: 112.6304 },
      keyInfo: { type: 'City', phenomenon: 'Highland Culture', difficulty: 'Easy', difficultyRating: '1/5', elevation: '450-500 m', bestSeason: 'May–Sep', coreEmotion: 'Leisure' },
      risks: { gasToxicity: 'None', floodRain: 'Low', slipperyTerrain: 'Low', coldExposure: 'None', crowdOverTourism: 'Moderate' },
      trekkingData: { distance: 'N/A', duration: 'N/A', terrain: 'Urban', access: 'City exploration'},
      properties: [
        { propertyID: "gpxTotalDistanceKm", name: "GPX Total Distance (km)", value: 10.0 },
        { propertyID: "gpxElevationGainM", name: "GPX Elevation Gain (m)", value: 50 },
        { propertyID: "gpxElevationLossM", name: "GPX Elevation Loss (m)", value: 50 },
        { propertyID: "gpxMinElevationM", name: "GPX Min Elevation (m)", value: 450 },
        { propertyID: "gpxMaxElevationM", name: "GPX Max Elevation (m)", value: 500 },
        { propertyID: "bestTimeToVisit", name: "Best Time to Visit", value: "Year-round, clear skies May-Sep" },
        { propertyID: "difficultyLevel", name: "Difficulty Level", value: "Easy" },
        { propertyID: "gpxBoundingBox", name: "GPX Bounding Box", value: "-7.9825,112.6304 -7.9780,112.6360" }
      ],
      gpxTrack: [
        [-7.9797, 112.6304], [-7.9800, 112.6310], [-7.9810, 112.6315], [-7.9820, 112.6320],
        [-7.9825, 112.6330], [-7.9820, 112.6340], [-7.9810, 112.6350], [-7.9800, 112.6360],
        [-7.9790, 112.6355], [-7.9785, 112.6345], [-7.9780, 112.6335], [-7.9785, 112.6325],
        [-7.9790, 112.6315], [-7.9797, 112.6304]
      ],
      gpxElevationProfile: [
        { distance: 0, elevation: 450 }, { distance: 1, elevation: 455 }, { distance: 2, elevation: 465 },
        { distance: 3, elevation: 475 }, { distance: 4, elevation: 485 }, { distance: 5, elevation: 500 },
        { distance: 6, elevation: 490 }, { distance: 7, elevation: 480 }, { distance: 8, elevation: 470 },
        { distance: 9, elevation: 460 }, { distance: 10, elevation: 450 }
      ]
    },
];
