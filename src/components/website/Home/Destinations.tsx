import Link from "next/link";

const Destinations: React.FC = () => {
  const destinations = [
    { 
      name: 'Mount Bromo', 
      desc: 'The Sacred Fire of Tengger',
      img: 'https://javavolcano-touroperator.com/assets/img/destinations/1687322060_BROMO%201.jpg' 
    },
    { 
      name: 'Ijen Crater', 
      desc: 'Blue Fire & Acid Lake',
      img: 'https://javavolcano-touroperator.com/assets/img/destinations/ijen-bromo-tumpak-sewu-malang-sightseeing-tour-1676526893742/1687320433_IJEN31.webp' 
    },
    { 
      name: 'Tumpak Sewu', 
      desc: 'A Thousand Waterfalls',
      img: 'https://javavolcano-touroperator.com/assets/img/destinations/tumpaksewu.webp' 
    },
    { 
      name: 'Papuma Beach', 
      desc: 'Sunrise & Sunset Coast',
      img: 'https://javavolcano-touroperator.com/assets/img/destinations/papuma.webp' 
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-black uppercase mb-4">Volcanoes & Waterfalls</h2>
            <p className="text-gray-600 max-w-xl">
              From the fires of Ijen to the waters of Tumpak Sewu. Discover the elemental landscapes of East Java.
            </p>
          </div>
          <Link href="/destinations" className="hidden md:block font-bold border-b-2 border-jvto-green hover:text-jvto-green transition-colors">See all destinations</Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {destinations.map((dest, idx) => (
            <div key={idx} className="group relative aspect-[3/4] overflow-hidden cursor-pointer rounded-sm">
              <img src={dest.img} alt={dest.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <div className="font-bold text-lg uppercase tracking-wider">{dest.name}</div>
                <div className="text-xs text-jvto-green font-medium mt-1">{dest.desc}</div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="md:hidden mt-8 text-center">
           <Link href="/destinations" className="font-bold border-b-2 border-jvto-green hover:text-jvto-green transition-colors">See all destinations</Link>
        </div>
      </div>
    </section>
  );
};

export default Destinations;
