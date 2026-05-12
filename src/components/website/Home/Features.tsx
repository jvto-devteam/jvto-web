const CREDENTIALS = [
  {
    label: "NIB License",
    value: "1102230032918",
    sub: "Verified on AHU.go.id",
    href: "https://ahu.go.id/sabh/perseroan/qrcode/?kode=NDAyMzAyMDYzNTEwMjE3NF8yXzA4%20RmVicnVhcmkgMjAyM18wOCBGZWJydWFyaSAyMDIz",
    external: true,
  },
  {
    label: "Tourist Police",
    value: "Mr. Agung Sambuko",
    sub: "Active Polpar (Ditpamobvit)",
    href: "/verify-jvto/police-safety",
    external: false,
  },
  {
    label: "Trustpilot",
    value: "4.8 · 47 Reviews",
    sub: "Verified platform rating",
    href: "https://www.trustpilot.com/review/javavolcano-touroperator.com",
    external: true,
  },
  {
    label: "Physical Office",
    value: "Bondowoso, East Java",
    sub: "Walk-in welcome",
    href: "https://www.google.com/maps?cid=1266403973589689021",
    external: true,
  },
];

const Features: React.FC = () => {
  return (
    <section className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-200">
          {CREDENTIALS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              className="group flex flex-col gap-0.5 px-6 py-5 hover:bg-gray-50 transition-colors"
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-600">
                {item.label}
              </span>
              <span className="font-black text-sm text-jvto-dark leading-snug group-hover:text-jvto-green transition-colors">
                {item.value}
              </span>
              <span className="text-[11px] text-gray-500 mt-0.5">
                {item.sub}{item.external && <span className="ml-1 text-gray-400">↗</span>}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
