import Link from "@/components/website/AppLink";
import { BookOpen, HelpCircle, ArrowRight } from 'lucide-react';

const TravelGuideTeaser: React.FC = () => {
  return (
    <section className="py-20 bg-gray-900 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-jvto-green/5 skew-x-12 transform translate-x-20"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          
          <div className="lg:w-1/2">
            <div className="flex items-center gap-3 mb-6 text-jvto-green">
              <BookOpen size={28} />
              <span className="font-bold uppercase tracking-widest text-sm">Plan First, Then Decide</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase mb-6 leading-tight">
              Read the Rulebook <br/> Before You Book
            </h2>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              You do not have to book immediately. We keep our rules transparent so you know exactly what to expect. 
              Read our Travel Guide to understand cancellations, health screening, packing lists, and safety protocols before you pay a deposit.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link target="_blank" href="/travel-guide" prefetch={false} className="bg-jvto-green text-jvto-dark px-8 py-3 font-bold uppercase rounded-sm hover:bg-white transition-colors inline-flex items-center gap-2">
                Open Travel Guide <ArrowRight size={16} />
              </Link>
              <Link target="_blank" href="/contact" prefetch={false} className="border-2 border-white text-white px-8 py-3 font-bold uppercase rounded-sm hover:bg-white hover:text-jvto-dark transition-colors">
                Contact Us
              </Link>
            </div>
          </div>

          <div className="lg:w-1/2 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link target="_blank" href="/travel-guide/faq" prefetch={false} className="bg-gray-800 p-6 rounded-sm hover:bg-gray-700 transition-colors border border-gray-700 group">
                <HelpCircle className="text-jvto-green mb-4 w-8 h-8 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-lg mb-2 group-hover:text-jvto-green transition-colors">FAQ</h3>
                <p className="text-sm text-gray-400">Common questions about private tours, logistics, and safety.</p>
              </Link>
              
              <Link target="_blank" href="/travel-guide/booking-information" prefetch={false} className="bg-gray-800 p-6 rounded-sm hover:bg-gray-700 transition-colors border border-gray-700 group">
                <div className="text-jvto-green mb-4 font-black text-2xl group-hover:scale-110 transition-transform origin-left">$</div>
                <h3 className="font-bold text-lg mb-2 group-hover:text-jvto-green transition-colors">Booking & Payments</h3>
                <p className="text-sm text-gray-400">Deposits, Travel Credit, and cancellation policies explained.</p>
              </Link>

              <Link target="_blank" href="/travel-guide/ijen-health-screening" prefetch={false} className="bg-gray-800 p-6 rounded-sm hover:bg-gray-700 transition-colors border border-gray-700 group">
                <div className="text-jvto-green mb-4 font-black text-2xl group-hover:scale-110 transition-transform origin-left">+</div>
                <h3 className="font-bold text-lg mb-2 group-hover:text-jvto-green transition-colors">Ijen Screening</h3>
                <p className="text-sm text-gray-400">Mandatory health checks and digital certificates for the crater hike.</p>
              </Link>

              <Link target="_blank" href="/travel-guide/safety-on-tours" prefetch={false} className="bg-gray-800 p-6 rounded-sm hover:bg-gray-700 transition-colors border border-gray-700 group">
                <div className="text-jvto-green mb-4 font-black text-2xl group-hover:scale-110 transition-transform origin-left">!</div>
                <h3 className="font-bold text-lg mb-2 group-hover:text-jvto-green transition-colors">Safety & Risks</h3>
                <p className="text-sm text-gray-400">Our police-led safety culture and risk management protocols.</p>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default TravelGuideTeaser;
