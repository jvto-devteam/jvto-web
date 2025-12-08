import Link from "next/link";

const WhyJVTO: React.FC = () => {
  return (
    <section className="py-24 bg-jvto-dark text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-jvto-green/5 skew-x-12 transform translate-x-20"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-block bg-jvto-green text-jvto-dark text-xs font-black uppercase tracking-widest px-3 py-1 mb-6">
              Our Story
            </div>
            <h2 className="text-4xl md:text-6xl font-black uppercase mb-8 leading-none">
              From Local Host to <br/>
              <span className="text-jvto-green">Police-Led Operator.</span>
            </h2>
            <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
              <p>
                JVTO grew from a humble local guesthouse in Bondowoso into a licensed tour operator shaped by the <strong>Tourist Police experience</strong> of our founder, Mr. Sam.
              </p>
              <p>
                We saw the gaps in safety standards first-hand and decided to build something different: private-only routes, realistic driving days, and clear written rules. 
              </p>
              <p>
                Today, we act as a bridge between wild adventure and professional safety standards.
              </p>
            </div>
            <div className="mt-10 flex flex-wrap gap-6">
               <Link href="/why-jvto/our-story" className="font-bold border-b-2 border-jvto-green text-white hover:text-jvto-green transition-colors pb-1 text-lg">
                 Read Full Story
               </Link>
               <Link href="/verify-jvto" className="font-bold border-b-2 border-gray-600 text-gray-400 hover:text-white hover:border-white transition-colors pb-1 text-lg">
                 How to Verify Us
               </Link>
            </div>
          </div>
          
          <div className="relative flex justify-center lg:justify-end">
             {/* Main Image - Founder */}
             <div className="relative z-10 rounded-sm overflow-hidden shadow-2xl border-4 border-white/10 w-full max-w-md aspect-[4/5]">
               <img 
                 src="https://javavolcano-touroperator.com/founder/mr-sam-tourist-police-portrait.png" 
                 alt="Agung 'Mr. Sam' Sambuko - JVTO Founder" 
                 className="w-full h-full object-cover"
               />
               <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-8">
                 <p className="font-bold text-white text-xl uppercase mb-1">Agung {`"Mr. Sam"`} Sambuko</p>
                 <p className="text-xs text-jvto-green font-bold uppercase tracking-widest">Founder & Active Tourist Police</p>
               </div>
             </div>
             
             {/* Decorative Elements */}
             <div className="absolute -top-10 -right-10 w-64 h-64 bg-jvto-green/10 rounded-full blur-3xl -z-10"></div>
             <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyJVTO;
