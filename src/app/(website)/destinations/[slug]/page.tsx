"use client";

import { useState, useEffect } from "react";
import { 
  MapPin, 
  Wind, 
  Thermometer, 
  TriangleAlert, 
  ArrowRight,
  Flame,
  Clock,
  Footprints,
  Calendar,
  ArrowUpRight,
  Droplets,
  Pickaxe 
} from "lucide-react";

export default function DestinationGuidePage() {
  const [activeSection, setActiveSection] = useState("overview");

  // DATA STRICTLY FROM "KAWAH IJEN - DESTINATION GUIDE"
  const destinationData = {
    // Source: H1 & Quick Facts
    name: "Kawah Ijen Crater",
    subTitle: "Blue Fire & Turquoise Lake", 
    location: "East Java, Indonesia",
    intro: "Kawah Ijen is an active volcano in East Java famous for its turquoise acidic crater lake, sulphur vents and the rare blue fire phenomenon.",
    
    // Source: Quick Facts
    stats: {
      elevation: "2,799", // m above sea level
      unit: "MASL",
      difficulty: "Moderate (3/5)",
      type: "Active Volcano",
      distance: "6 KM", // Round trip
      duration: "3-4 Hours"
    },

    // Source: Best Time to Visit & Weather Patterns
    seasonInfo: {
      bestWindow: "May – October",
      seasonName: "Dry Season",
      details: "Clearer views of the crater lake, stable terrain, and better night sky visibility (Milky Way).",
      wetSeasonWarning: "Nov–Apr: Higher rain, slippery paths, complex gas safety."
    },

    // Source: Tours That Include Kawah Ijen
    relatedTours: [
      { name: "Bromo & Ijen Private 3D2N", route: "From Surabaya" },
      { name: "Bromo, Tumpak Sewu & Ijen 4D3N", route: "From Surabaya" },
      { name: "Ijen & Bromo Private 3D2N", route: "From Bali" }
    ]
  };

  // Scroll Spy Logic
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["overview", "trek", "safety", "culture"];
      const scrollPosition = window.scrollY + 150;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(section);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="bg-white min-h-screen font-sans text-slate-900 pb-20">
      
      {/* 1. HERO SECTION */}
      <div className="relative h-[90vh] w-full bg-slate-900 overflow-hidden flex items-end pb-16 md:pb-24">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600602645249-8c6425fb9f30?q=80&w=2070"
            alt="Kawah Ijen Crater"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex items-center gap-2 mb-4">
             <span className="py-1 px-3 border border-lime-400 rounded-full text-lime-400 text-xs font-bold uppercase tracking-widest bg-black/30 backdrop-blur-sm">
                Volcano Travel Guide
             </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase leading-none mb-6">
            {destinationData.name}
          </h1>
          
          <div className="flex flex-col md:flex-row gap-8 md:items-end justify-between border-t border-white/20 pt-8 mt-4">
            <p className="text-slate-200 text-lg md:text-xl max-w-2xl leading-relaxed font-medium">
              {destinationData.intro}
            </p>
            
            {/* Quick Stats from Data */}
            <div className="flex gap-8 text-white shrink-0">
              <div className="text-right">
                <span className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1">Elevation</span>
                <span className="font-bold text-2xl md:text-3xl">{destinationData.stats.elevation}</span>
                <span className="text-xs text-lime-400 font-bold ml-1">{destinationData.stats.unit}</span>
              </div>
              <div className="w-px bg-white/20 h-12"></div>
              <div className="text-right">
                <span className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1">Type</span>
                <span className="font-bold text-2xl md:text-3xl">{destinationData.stats.type}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. STICKY NAV BAR */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <span className="font-black text-slate-900 uppercase hidden md:block tracking-wide">
              {destinationData.name}
            </span>
            
            <nav className="flex gap-1 md:gap-8 overflow-x-auto no-scrollbar w-full md:w-auto">
              {["overview", "trek", "safety", "culture"].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollTo(item)}
                  className={`text-xs font-bold uppercase tracking-widest py-2 px-2 border-b-2 transition-colors whitespace-nowrap ${
                    activeSection === item
                      ? "border-lime-500 text-lime-600"
                      : "border-transparent text-slate-400 hover:text-slate-900"
                  }`}
                >
                  {item}
                </button>
              ))}
            </nav>

            <button className="hidden md:flex items-center gap-2 bg-slate-900 text-white px-5 py-2 rounded-full text-xs font-bold uppercase hover:bg-lime-500 hover:text-slate-900 transition-all">
              View Routes <ArrowRight size={14}/>
            </button>
          </div>
        </div>
      </div>

      {/* 3. MAIN CONTENT */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT COLUMN: NARRATIVE CONTENT (8 Cols) */}
          <div className="lg:col-span-8 space-y-20">
            
            {/* SECTION: OVERVIEW */}
            <section id="overview" className="scroll-mt-24">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase mb-8 leading-tight">
                The Eastern Anchor of <br/><span className="text-lime-600">The Fire Spine</span>
              </h2>
              <div className="prose prose-lg text-slate-600 leading-loose">
                <p className="first-letter:text-5xl first-letter:font-black first-letter:text-slate-900 first-letter:mr-3 first-letter:float-left">
                  Kawah Ijen sits in the eastern end of Java’s volcanic chain, forming part of the “Fire Spine” that runs from Semeru and Bromo to Ijen. The caldera holds one of the world’s largest acidic crater lakes and active sulphur vents.
                </p>
                <p>
                  Gas combustion can create the <strong>blue fire phenomenon</strong> – a rare, visually striking but high-risk event caused by burning sulphuric gases. Within the East Java route, Ijen represents the Fire element and often serves as the last volcano before travelers exit via Bali.
                </p>
              </div>

              {/* Highlights Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <Flame className="text-blue-500 mb-4" size={32}/>
                    <h3 className="font-bold text-slate-900 text-lg mb-2">Blue Fire</h3>
                    <p className="text-sm text-slate-500">Rare phenomenon caused by burning sulphuric gases. Visible only on certain nights before sunrise.</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <Droplets className="text-teal-500 mb-4" size={32}/>
                    <h3 className="font-bold text-slate-900 text-lg mb-2">Acidic Crater Lake</h3>
                    <p className="text-sm text-slate-500">The world's largest highly acidic crater lake, featuring a stunning turquoise color.</p>
                </div>
              </div>
            </section>

            {/* SECTION: THE TREK */}
            <section id="trek" className="scroll-mt-24 pt-10 border-t border-slate-100">
               <div className="flex items-center gap-3 mb-8">
                  <span className="w-3 h-3 bg-lime-500 rounded-full"></span>
                  <h2 className="text-2xl font-black text-slate-900 uppercase">Route & Trekking Data</h2>
               </div>
               
               <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                  {/* Difficulty Bar */}
                  <div className="mb-8">
                    <div className="flex justify-between text-sm font-bold uppercase mb-2">
                        <span className="text-slate-500">Difficulty Level</span>
                        <span className="text-slate-900">{destinationData.stats.difficulty}</span>
                    </div>
                    <div className="h-4 bg-slate-100 rounded-full overflow-hidden flex">
                        <div className="w-[60%] bg-gradient-to-r from-lime-300 to-lime-500"></div>
                    </div>
                    <p className="text-xs text-slate-500 mt-3 italic">
                       *Continuous uphill trail on gravel and ash. Reasonable baseline fitness is needed.
                    </p>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      <div className="text-center p-5 bg-slate-50 rounded-xl">
                          <Footprints className="mx-auto text-slate-400 mb-2" size={24}/>
                          <div className="font-black text-slate-900 text-xl">{destinationData.stats.distance}</div>
                          <div className="text-[10px] font-bold uppercase text-slate-400">Round Trip</div>
                      </div>
                      <div className="text-center p-5 bg-slate-50 rounded-xl">
                          <Clock className="mx-auto text-slate-400 mb-2" size={24}/>
                          <div className="font-black text-slate-900 text-xl">{destinationData.stats.duration}</div>
                          <div className="text-[10px] font-bold uppercase text-slate-400">Walking Time</div>
                      </div>
                      <div className="text-center p-5 bg-slate-50 rounded-xl">
                          <ArrowUpRight className="mx-auto text-slate-400 mb-2" size={24}/>
                          <div className="font-black text-slate-900 text-xl">Start: Night</div>
                          <div className="text-[10px] font-bold uppercase text-slate-400">00:00 - 01:00</div>
                      </div>
                  </div>
               </div>
            </section>

            {/* SECTION: SAFETY */}
            <section id="safety" className="scroll-mt-24 pt-10 border-t border-slate-100">
                <div className="flex items-center gap-3 mb-8">
                  <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                  <h2 className="text-2xl font-black text-slate-900 uppercase">Safety & Risks</h2>
               </div>

               <div className="bg-red-50 border-l-4 border-red-500 p-8 rounded-r-xl space-y-8">
                  <div className="flex gap-5">
                      <div className="shrink-0 bg-white p-3 rounded-full h-fit shadow-sm">
                          <Wind className="text-red-500" size={24}/>
                      </div>
                      <div>
                          <h3 className="font-bold text-red-900 text-lg">Gas & Toxicity (High Risk)</h3>
                          <p className="text-red-800/80 leading-relaxed mt-2 text-sm">
                              Sulphuric gas plumes can shift rapidly. <strong>Proper protective gear (masks) and guide supervision are essential.</strong> Guests with serious heart, lung, or respiratory conditions should review health screening before joining.
                          </p>
                      </div>
                  </div>
                  <div className="flex gap-5">
                      <div className="shrink-0 bg-white p-3 rounded-full h-fit shadow-sm">
                          <Thermometer className="text-red-500" size={24}/>
                      </div>
                      <div>
                          <h3 className="font-bold text-red-900 text-lg">Cold Exposure</h3>
                          <p className="text-red-800/80 leading-relaxed mt-2 text-sm">
                              Conditions on the rim can feel <strong>close to freezing</strong> before sunrise. Layered clothing, gloves, and head protection are practical requirements.
                          </p>
                      </div>
                  </div>
               </div>
            </section>

            {/* SECTION: CULTURE */}
            <section id="culture" className="scroll-mt-24 pt-10 border-t border-slate-100">
               <h2 className="text-2xl font-black text-slate-900 uppercase mb-8">Culture & Respect</h2>
               
               <div className="flex flex-col md:flex-row gap-8">
                   <div className="flex-1">
                       <h3 className="font-bold text-lg text-slate-900 mb-3 flex items-center gap-2">
                           <Pickaxe size={20} className="text-lime-600"/> The Sulphur Miners
                       </h3>
                       <p className="text-slate-600 leading-relaxed mb-6 text-sm">
                           Known as <em>Wong Ijen</em>, these miners carry 70–90 kg loads of sulphur up steep slopes with basic tools. They represent endurance and a deep relationship with the volcano.
                       </p>
                       
                       <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                           <h4 className="font-bold text-xs uppercase text-slate-500 mb-3 tracking-widest">Behaviour Cues</h4>
                           <ul className="space-y-2 text-sm font-medium text-slate-800">
                               <li className="flex items-center gap-2">
                                   <span className="w-1.5 h-1.5 bg-lime-500 rounded-full"></span>
                                   Do not treat miners as photo props; ask permission first.
                               </li>
                               <li className="flex items-center gap-2">
                                   <span className="w-1.5 h-1.5 bg-lime-500 rounded-full"></span>
                                   No loud music or disruptive behaviour at night.
                               </li>
                               <li className="flex items-center gap-2">
                                   <span className="w-1.5 h-1.5 bg-lime-500 rounded-full"></span>
                                   Avoid touching or disturbing offerings (Sesajen).
                               </li>
                           </ul>
                       </div>
                   </div>
                   
                   {/* Placeholder for Miner Image */}
                   <div className="w-full md:w-1/3 aspect-[3/4] bg-slate-200 rounded-xl overflow-hidden relative">
                        <img 
                            src="https://images.unsplash.com/photo-1596423736733-72213e481180?q=80&w=1974" 
                            alt="Ijen Sulphur Miner" 
                            className="absolute inset-0 w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                        />
                   </div>
               </div>
            </section>

          </div>

          {/* RIGHT COLUMN: STICKY SIDEBAR (ONLY IDEAL VISIT WINDOW) */}
          <div className="lg:col-span-4 relative">
            <div className="sticky top-32 space-y-6">
                
                {/* Widget: Best Time to Visit */}
                <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                    {/* Decorative bg */}
                    <div className="absolute top-0 right-0 p-10 bg-lime-500/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>

                    <div className="relative z-10">
                        <span className="text-xs font-bold text-lime-400 uppercase tracking-widest flex items-center gap-2 mb-4">
                            <Calendar size={14}/> Ideal Visit Window
                        </span>
                        <div className="text-2xl font-black mb-1">{destinationData.seasonInfo.bestWindow}</div>
                        <div className="text-slate-400 text-sm font-medium mb-6">{destinationData.seasonInfo.seasonName}</div>
                        
                        <div className="space-y-4">
                            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                                <p className="text-xs text-slate-300 leading-relaxed">
                                    {destinationData.seasonInfo.details}
                                </p>
                            </div>
                            <div className="flex items-start gap-2 text-xs text-orange-300 bg-orange-500/10 p-2 rounded">
                                <TriangleAlert size={12} className="shrink-0 mt-0.5"/>
                                <span>{destinationData.seasonInfo.wetSeasonWarning}</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
          </div>

        </div>
      </div>

    </div>
  );
}