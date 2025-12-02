import WeatherClosuresPage from "@/components/website/WeatherClosuresPage";
import StructuredData from "@/components/website/StructuredData";
import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: "Weather, Volcanic Alerts & Closures | JVTO",
  description: "How we handle itinerary changes due to weather, volcanic activity, or other unforeseen closures. Your safety is our priority.",
};

export default function WeatherClosures() {
  const weatherClosuresSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://javavolcano-touroperator.com/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Travel Guide",
            item: "https://javavolcano-touroperator.com/travel-guide/",
          },        
          {
            "@type": "ListItem",
            position: 3,
            name: "Weather & Closures",
            item: "https://javavolcano-touroperator.com/travel-guide/weather-and-closures/",
          },        
        ],
      },
    ],
  };

  return (
    <>
      <StructuredData data={weatherClosuresSchema} />
      <WeatherClosuresPage />;
    </>
  );
}
