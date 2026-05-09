import Breadcrumbs from './Breadcrumbs';
import Link from "@/components/website/AppLink";

const WeatherClosuresPage = () => {
  const breadcrumbCrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Travel Guide', path: '/travel-guide' },
    { name: 'Weather & Closures', path: '/travel-guide/weather-closures' },
  ];

  return (
    <>
      <div className="bg-background-light dark:bg-background-dark pt-20">
        <header className="py-12 bg-white dark:bg-ink-primary">
          <div className="container mx-auto px-4">
            <Breadcrumbs crumbs={breadcrumbCrumbs} />
            <div className="mt-4 max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold text-ink-primary dark:text-white">Weather, Volcanic Alerts & Closures</h1>
              <p className="mt-4 text-lg text-ink-neutral-500 dark:text-ink-neutral-200">
                Our policy on handling itinerary changes due to unforeseen events.
              </p>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-3xl mx-auto prose dark:prose-invert prose-headings:text-ink-primary dark:prose-headings:text-white">
            <h2>Our Commitment to Safety</h2>
            <p>East {`Java's`} volcanoes are active and its weather can be unpredictable. Your safety is always our first priority. We continuously monitor official reports from government agencies (like the PVMBG for volcanic activity) and local park authorities regarding volcanic alerts, extreme weather warnings, and park closures.</p>
            
            <h2>How We Handle Changes</h2>
            <p>If a planned destination becomes unsafe or inaccessible due to a volcanic alert, extreme weather (such as storms that create landslide risks), or an official closure, we will not proceed with that part of the itinerary. Instead, our experienced guides and operations team will implement the best possible alternative route or activity based on the situation on the ground.</p>
            <ul>
                <li><strong>Clear Communication:</strong> We prioritize clear and immediate communication with you. Your guide will explain the situation, the reason for the change, and the proposed alternative plan.</li>
                <li><strong>Viable Alternatives:</strong> We will offer a comparable alternative experience where possible. This could mean visiting a different waterfall, exploring a local cultural site, or adjusting the timing of an activity.</li>
                <li><strong>Safety Over Schedule:</strong> We will never compromise your safety by ignoring official warnings or attempting a risky route just to stick to the original plan.</li>
            </ul>
            <p>Please see our <Link href="/travel-guide/terms">Terms & Conditions</Link> for full details on how such Force Majeure events are handled regarding any potential refunds and travel credits, which are assessed based on unrecoverable costs.</p>
          </div>
        </main>
      </div>
    </>
  );
};

export default WeatherClosuresPage;
