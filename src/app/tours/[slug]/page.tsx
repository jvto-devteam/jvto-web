import PackageDetail from "./PackageDetail";
export default async function App({ params }) {
  const { slug } = params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/tours/${slug}`,
    {
      cache: "no-store",
    }
  );
  const data = await res.json();
  console.log(data);
  
  // // ==== Hardcoded Data (dummy) ====
  const pkg = {
    id: "bromo-ijen",
    name: "Bromo & Ijen Crater Adventure",
    package_code: "JVTO-BI-001",
    overview: `
    <p>Experience two of East Java’s most iconic volcanoes in one seamless adventure — Mount Bromo and Ijen Crater. Witness the otherworldly blue fire, hike to sunrise viewpoints, and embrace authentic Javanese hospitality along the way.</p>
  `,
    departure: "Surabaya",
    duration: {
      days: 3,
      nights: 2,
    },
    galleries: [
      {
        id: 1,
        image_url:
          "https://javavolcano-touroperator.com/assets/img/tours/bromo.webp",
        alt_text: "Mount Bromo sunrise",
      },
      {
        id: 2,
        image_url:
          "https://javavolcano-touroperator.com/assets/img/tours/ijen.webp",
        alt_text: "Ijen Crater blue fire",
      },
      {
        id: 3,
        image_url:
          "https://javavolcano-touroperator.com/assets/img/tours/jeep.webp",
        alt_text: "Bromo jeep adventure",
      },
    ],
    itinerary: [
      {
        id: 1,
        day: 1,
        title: "Arrival & Transfer to Bromo",
        details:
          "Pick up from Surabaya or Malang. Check-in at hotel near Bromo. #next-stop# Optional visit to local village or waterfall.",
      },
      {
        id: 2,
        day: 2,
        title: "Sunrise & Bromo Crater Tour",
        details:
          "Depart at 3 AM by 4WD Jeep to Penanjakan for sunrise view. Explore the Sea of Sand and Bromo crater. Continue to Bondowoso for Ijen overnight stay.",
      },
      {
        id: 3,
        day: 3,
        title: "Ijen Blue Fire & Departure",
        details:
          "Midnight departure to Ijen basecamp. Hike to the crater rim for the legendary blue fire and sunrise view. Return to Surabaya or Bali.",
      },
    ],
    accommodation: [
      {
        id: 1,
        day: 1,
        hotel: "Café Lava Hostel",
        rating: 3,
        short_description:
          "Comfortable stay near Bromo National Park entrance.",
        banner: [
          "https://javavolcano-touroperator.com/assets/img/hotels/cafe-lava.webp",
        ],
      },
      {
        id: 2,
        day: 2,
        hotel: "Ijen View Hotel & Resort",
        rating: 4,
        short_description:
          "A peaceful retreat in Bondowoso with mountain views.",
        banner: [
          "https://javavolcano-touroperator.com/assets/img/hotels/ijen-view.webp",
        ],
      },
    ],
    included: [
      "Private transport with English-speaking driver",
      "Accommodation for 2 nights",
      "Entrance fees for all destinations",
      "4WD Jeep for Bromo tour",
      "Gas mask and headlamp for Ijen hike",
      "Daily breakfast",
    ],
    exclude: [
      "Personal expenses",
      "Lunch and dinner not specified",
      "Travel insurance",
      "Tips for crew (optional)",
    ],
    package_price: [
      { start: 1, end: 1, price_per_person: 5200000 },
      { start: 2, end: 3, price_per_person: 3900000 },
      { start: 4, end: null, price_per_person: 3500000 },
    ],
  };

  // console.log("SSR data:", data);
  return <PackageDetail pkg={pkg} />;
}
