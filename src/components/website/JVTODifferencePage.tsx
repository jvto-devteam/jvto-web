import StructuredData from './StructuredData';
import Breadcrumbs from './Breadcrumbs';
import ProofLedger from './ProofLedger';

const pillars = [
    { 
        icon: "local_police", 
        title: "Pillar 1: Police-Led Safety Culture", 
        content: [
            "Founded and led by an on-duty tourism police officer in East Java (Operator-verified).",
            "Tours are designed with real-world law enforcement insight into route safety and vetted partners.",
            "Transparent cooperation with local authorities for incident response and legal compliance."
        ],
        footer: "We build your tour using the same mindset used to protect travelers on duty."
    },
    { 
        icon: "badge", 
        title: "Pillar 2: Licensed & Traceable", 
        content: [
            "Operated by PT Java Volcano Rendezvous.",
            "Business ID (NIB) & Tourism License (TDUP): 1102230032918.",
            "Physical office: Jl. Khairil Anwar No.102 A, Bondowoso."
        ],
        footer: "If an operator cannot show you a license and an address, think twice. With JVTO, you can verify."
    },
    { 
        icon: "lock", 
        title: "Pillar 3: Private & All-Inclusive", 
        content: [
            "No shared-group buses. Every tour is private for your party.",
            "Key inclusions clearly listed: private vehicle, Bromo jeep, permits, Ijen health screening, gear, water, and T-shirt.",
            "No hidden 'local fees' or surprise add-ons."
        ],
        footer: "You see what’s included before you pay, not when you're cornered on arrival."
    },
    { 
        icon: "health_and_safety", 
        title: "Pillar 4: Ijen Health Screening Leadership", 
        content: [
            "JVTO includes pre-hike screening by a nurse for all Ijen tours, a mandatory local requirement.",
            "We support a digital, QR-verifiable system at health.mountijen.com to prevent fake medical letters and raise safety standards for all visitors."
        ],
        footer: "This is a commitment born from seeing what happens when screening is ignored."
    },
    { 
        icon: "groups", 
        title: "Pillar 5: Local Teams & Real Community Impact", 
        content: [
            "Guides and drivers are recruited from communities around Ijen and Bromo.",
            "We provide continuous training in safety, communication, and responsible tourism.",
            "We prioritize local suppliers who share our standards."
        ],
        footer: "Your money stays closer to the volcanoes you came to see."
    },
    { 
        icon: "school", 
        title: "Pillar 6: Fairness for Students & Sustainability", 
        content: [
            "Official partnership with ISIC to offer fair pricing to international students.",
            "Active member of the Indecon network to align with sustainable tourism principles.",
            "Commitment to ethical practices that protect the environment for future travelers."
        ],
        footer: "Travel should not punish responsible students, and sustainability should be more than a slogan."
    },
    { 
        icon: "reviews", 
        title: "Pillar 7: Independent Reviews You Can Check", 
        content: [
            "We maintain public profiles on Google, TripAdvisor, and Trustpilot.",
            "A long history of positive feedback from guests worldwide.",
            "We encourage you to cross-check our name, address, and license across all platforms."
        ],
        footer: "Use this page as your checklist. Ask every operator for the same level of proof."
    }
];

const PillarCard: React.FC<typeof pillars[0]> = ({ icon, title, content, footer }) => (
    <div className="bg-white dark:bg-background-dark p-6 rounded-2xl border border-ink-neutral-200 dark:border-ink-neutral-700 shadow-card hover:shadow-cardHover transition-shadow flex flex-col">
        <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary/10 text-primary p-3 rounded-lg">
                <span className="material-symbols-outlined">{icon}</span>
            </div>
            <h3 className="text-xl font-bold text-ink-primary dark:text-white">{title}</h3>
        </div>
        <ul className="list-disc list-inside space-y-2 text-ink-neutral-700 dark:text-ink-neutral-200 flex-grow">
            {content.map((item, index) => <li key={index}>{item}</li>)}
        </ul>
        <p className="mt-4 pt-4 border-t border-ink-neutral-200 dark:border-ink-neutral-700 text-sm font-semibold text-ink-neutral-500 dark:text-ink-neutral-400 italic">
            {footer}
        </p>
    </div>
);


const JVTODifferencePage = () => {
  const breadcrumbCrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Why JVTO', path: '/why-jvto' },
    { name: 'The JVTO Difference', path: '/why-jvto/the-jvto-difference' },
  ];
  

  return (
    <>
       <div className="bg-background-light dark:bg-background-dark pt-20">
        <header className="py-12 bg-white dark:bg-ink-primary">
            <div className="container mx-auto px-4">
                <Breadcrumbs crumbs={breadcrumbCrumbs} />
                <div className="mt-4 max-w-4xl">
                    <h1 className="text-4xl md:text-5xl font-bold text-ink-primary dark:text-white">The JVTO Difference — Verified, Private, Responsible</h1>
                    <p className="mt-4 text-lg text-ink-neutral-500 dark:text-ink-neutral-200">
                        This page turns our story into clear standards. These are the rules we operate by, so you know exactly what you’re buying.
                    </p>
                </div>
            </div>
        </header>

        <main className="container mx-auto px-4 py-12 md:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {pillars.map((pillar) => (
                    <PillarCard key={pillar.title} {...pillar} />
                ))}
            </div>
            <div className="max-w-6xl mx-auto">
                <ProofLedger />
            </div>
        </main>
      </div>
    </>
  );
};

export default JVTODifferencePage;