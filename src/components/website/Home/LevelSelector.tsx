import { MapPin, ArrowRight } from 'lucide-react';

const LevelSelector: React.FC = () => {
  return (
    <section className="py-24 bg-white text-jvto-dark">
      <div className="container mx-auto px-6 text-center mb-16">
        <div className="w-16 h-16 mx-auto mb-6 bg-jvto-green rounded-full flex items-center justify-center">
           <MapPin className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl md:text-4xl font-black uppercase mb-6">Start Your Private Tour From Surabaya or Bali</h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Our adventures are tailored to real East Java driving times. Choose your starting city to see routes designed for logistical efficiency.
        </p>
      </div>

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Surabaya Card */}
          <div className="flex flex-col md:flex-row bg-gray-50 rounded-sm overflow-hidden group hover:shadow-lg transition-shadow duration-300">
            <div className="md:w-1/2 p-10 flex flex-col justify-center">
              <h3 className="font-bold text-sm text-gray-400 uppercase tracking-widest mb-2">Most Popular</h3>
              <h4 className="font-black text-2xl mb-4">Start from Surabaya</h4>
              <p className="text-sm text-gray-600 mb-6">Perfect for arrivals at Juanda Airport (SUB) or train station. Direct access to Bromo.</p>
              <a href="#" className="font-bold flex items-center gap-2 text-jvto-dark group-hover:text-jvto-green transition-colors">
                View Routes <ArrowRight size={16} />
              </a>
            </div>
            <div className="md:w-1/2 h-64 md:h-auto relative">
               <img src="https://picsum.photos/id/1016/600/400" alt="Surabaya" className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
            </div>
          </div>

          {/* Bali Card */}
          <div className="flex flex-col md:flex-row bg-gray-50 rounded-sm overflow-hidden group hover:shadow-lg transition-shadow duration-300">
            <div className="md:w-1/2 p-10 flex flex-col justify-center order-1 md:order-none">
              <h3 className="font-bold text-sm text-gray-400 uppercase tracking-widest mb-2">Cross-Island</h3>
              <h4 className="font-black text-2xl mb-4">Start from Bali</h4>
              <p className="text-sm text-gray-600 mb-6">Includes ferry crossing to Java. Ideal for those continuing their journey west from Bali.</p>
              <a href="#" className="font-bold flex items-center gap-2 text-jvto-dark group-hover:text-jvto-green transition-colors">
                View Routes <ArrowRight size={16} />
              </a>
            </div>
            <div className="md:w-1/2 h-64 md:h-auto relative order-first md:order-none">
               <img src="https://picsum.photos/id/1043/600/400" alt="Bali" className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LevelSelector;