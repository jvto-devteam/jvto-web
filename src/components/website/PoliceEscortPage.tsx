import Breadcrumbs from './Breadcrumbs';
import Link from "next/link";

const PoliceEscortPage = () => {
  const breadcrumbCrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Travel Guide', path: '/travel-guide' },
    { name: 'Police Escort for Groups', path: '/travel-guide/police-escort-for-groups' },
  ];

  return (
    <>
      <div className="bg-background-light dark:bg-background-dark pt-20">
        <header className="py-12 bg-white dark:bg-ink-primary">
          <div className="container mx-auto px-4">
            <Breadcrumbs crumbs={breadcrumbCrumbs} />
            <div className="mt-4 max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold text-ink-primary dark:text-white">Police Escort for Tourist Groups in East Java</h1>
              <p className="mt-4 text-lg text-ink-neutral-500 dark:text-ink-neutral-200">
                A clear explanation of how this regulated service works for large groups traveling with JVTO.
              </p>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-3xl mx-auto prose dark:prose-invert prose-headings:text-ink-primary dark:prose-headings:text-white prose-p:text-ink-neutral-700 dark:prose-p:text-ink-neutral-200 prose-li:text-ink-neutral-700 dark:prose-li:text-ink-neutral-200">
            <section>
              <h2>What is an Official Police Escort?</h2>
              <p>For large tourist groups (e.g., 18 or more guests), JVTO can help coordinate an official traffic police escort {`("Patwal")`} for specific segments of the journey. This service is designed to enhance safety and smooth the passage of a convoy of vehicles on busy or narrow roads, such as from the Gending toll exit to our partner hotels in the Bondowoso area.</p>
              
              <h2>How It Works (The Legal Process)</h2>
              <p>This is not a marketing gimmick or an unofficial privilege. It is a regulated service provided by the Indonesian National Police.</p>
              <ul>
                <li><strong>Formal Request:</strong> A formal request is submitted by JVTO to the relevant Traffic Police unit for the intended route.</li>
                <li><strong>Official Order (SPRIN):</strong> If approved, the Police issue a formal written order {`("Surat Perintah" or SPRIN)`} authorizing the escort.</li>
                <li><strong>Availability:</strong> The service is subject to the availability of personnel and vehicles from the police unit and must comply with Indonesian law.</li>
                <li><strong>Transparency:</strong> This is never sold as an automatic or guaranteed inclusion. It is an optional, coordinated service that is only confirmed in writing once we receive official approval.</li>
              </ul>
            </section>

            <section className="mt-8">
              <h2>Frequently Asked Questions</h2>
              <h3>Is an escort always included for large groups?</h3>
              <p>No. It is an optional add-on that must be requested in advance. Its availability is not guaranteed and depends entirely on the approval of the local Traffic Police unit based on their operational capacity and assessment of need.</p>

              <h3>Is there a cost for this service?</h3>
              <p>If the request is approved, there may be an official administrative fee associated with the service to cover fuel and personnel allocation. Any costs are communicated transparently and confirmed in your {`group's`} formal itinerary and invoice.</p>
            </section>
            
            <div className="mt-12 not-prose">
                <Link href="/contact" className="inline-block px-8 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-opacity-90 transition-all">
                    Contact Us for Group Bookings
                </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default PoliceEscortPage;
