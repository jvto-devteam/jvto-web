
import React from 'react';
import SEO from './SEO';
import Breadcrumbs from './Breadcrumbs';

const SafetyOnToursPage = () => {
  const breadcrumbCrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Travel Guide', path: '/travel-guide' },
    { name: 'Safety on Tours', path: '/travel-guide/safety-on-tours' },
  ];

  return (
    <>
      <SEO
        title="Safety on Tours | JVTO's Protocols & Standards"
        description="Our police-led safety culture in practice. Learn about our vehicle standards, guide training, Ijen safety protocols, and emergency procedures."
      />
      <div className="bg-background-light dark:bg-background-dark pt-20">
        <header className="py-12 bg-white dark:bg-ink-primary">
          <div className="container mx-auto px-4">
            <Breadcrumbs crumbs={breadcrumbCrumbs} />
            <div className="mt-4 max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold text-ink-primary dark:text-white">Safety on Our Tours</h1>
              <p className="mt-4 text-lg text-ink-neutral-500 dark:text-ink-neutral-200">
                Our commitment to safety is not just a slogan; {`it's`} the foundation of every tour we operate, informed by our {`founder's`} experience as an active police officer.
              </p>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-3xl mx-auto prose dark:prose-invert prose-headings:text-ink-primary dark:prose-headings:text-white">
            
            <section>
                <h2>Vehicle & Driver Standards</h2>
                <ul>
                    <li><strong>Regular Maintenance:</strong> All our private vehicles undergo regular, documented maintenance checks to ensure they are in excellent working condition.</li>
                    <li><strong>Professional Drivers:</strong> Our drivers are experienced professionals trained in defensive driving on mountainous terrain. They adhere to strict schedules that include mandatory rest periods to prevent fatigue.</li>
                    <li><strong>Seatbelts:</strong> Seatbelts are mandatory for all passengers in our vehicles.</li>
                    <li><strong>Bromo Jeeps:</strong> We only partner with licensed and registered 4WD jeep operators at Bromo who meet our safety and maintenance standards.</li>
                </ul>
            </section>
            
            <section className="mt-8">
                <h2>Guide Training & Protocols</h2>
                 <ul>
                    <li><strong>First Aid & Emergency Response:</strong> Our lead guides are trained in basic first aid and emergency response procedures. They carry first-aid kits and are briefed on the nearest medical facilities for each leg of the journey.</li>
                    <li><strong>Route & Condition Monitoring:</strong> Guides continuously monitor weather and volcanic activity reports. They are empowered to make decisions to alter or cancel an activity if conditions become unsafe.</li>
                    <li><strong>Guest Briefings:</strong> Before every major trek (like Ijen or Tumpak Sewu), your guide will provide a clear safety briefing, outlining the trail conditions, what to expect, and how to use the provided safety gear.</li>
                </ul>
            </section>
            
             <section className="mt-8">
                <h2>Ijen Crater Specific Protocols</h2>
                 <ul>
                    <li><strong>Mandatory Health Screening:</strong> As a non-negotiable rule, every guest must undergo a health check before the Ijen trek. This is included in your tour and helps prevent medical emergencies at high altitude.</li>
                    <li><strong>Professional Gas Masks:</strong> We provide professional-grade gas masks, not cheap disposable ones. Guides ensure they are fitted correctly and instruct on their proper use.</li>
                    <li><strong>Guided Descent:</strong> The optional descent to the blue fire area is always led by the guide, who assesses the conditions and path safety in real-time. Guests are instructed to stay with the guide at all times.</li>
                </ul>
            </section>

            <section className="mt-8">
                <h2>Your Responsibility as a Traveler</h2>
                <p>Your safety is a shared responsibility. We ask that you:</p>
                <ul>
                    <li>Listen carefully to all safety briefings and follow your {`guide's`} instructions.</li>
                    <li>Be honest about your physical fitness and any medical conditions.</li>
                    <li>Do not attempt to take dangerous risks for photos or stray from the marked paths.</li>
                    <li>Inform your guide immediately if you feel unwell or encounter any issues.</li>
                </ul>
            </section>

          </div>
        </main>
      </div>
    </>
  );
};

export default SafetyOnToursPage;
