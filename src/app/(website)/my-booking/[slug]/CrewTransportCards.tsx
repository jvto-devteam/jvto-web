import Image from "next/image";
import { UserCheck, Car, Users } from "lucide-react";

interface Props {
  crews: {
    guides: any[];
    drivers: any[];
  };
  vehicles: any[];
}

export default function CrewTransportCards({ crews, vehicles }: Props) {
  const allCrews = [...crews.guides, ...crews.drivers];

  return (
    <div className="space-y-8">
      
      {/* 1. CREW SECTION */}
      {allCrews.length > 0 && (
        <div className="bg-white rounded-sm border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-black uppercase tracking-wide text-slate-900 mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-jvto-lime"></span>
                Meet Your Crew
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {allCrews.map((person, idx) => (
                    <div key={idx} className="group border border-slate-100 rounded-sm overflow-hidden hover:shadow-md transition-all">
                        <div className="relative h-40 w-full bg-slate-100">
                            <Image 
                                src={person.photo} 
                                alt={person.name} 
                                fill 
                                className="object-cover transition-transform group-hover:scale-105"
                                sizes="(max-width: 768px) 50vw, 25vw"
                            />
                        </div>
                        <div className="p-3">
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-50 text-blue-600 mb-2">
                                {person.role}
                            </span>
                            <p className="font-bold text-slate-900 text-sm truncate">{person.name}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}

      {/* 2. TRANSPORT SECTION */}
      {vehicles.length > 0 && (
        <div className="bg-white rounded-sm border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-black uppercase tracking-wide text-slate-900 mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-jvto-lime"></span>
                Transportation Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {vehicles.map((car, idx) => (
                    <div key={idx} className="flex flex-col border border-slate-200 rounded-sm overflow-hidden">
                        <div className="relative h-48 w-full bg-slate-50 p-4">
                            <Image 
                                src={car.banner} 
                                alt={car.name} 
                                fill 
                                className="object-contain" // Contain agar mobil terlihat utuh
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </div>
                        <div className="p-5 bg-white border-t border-slate-100">
                            <h4 className="font-bold text-lg text-slate-900">{car.name}</h4>
                            <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
                                <Users size={16} />
                                <span>Capacity: {car.capacity}</span>
                            </div>
                            
                            {/* Interior Images Preview (Tiny Gallery) */}
                            {car.interior && car.interior.length > 0 && (
                                <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                                    {car.interior.map((img: string, i: number) => (
                                        <div key={i} className="relative h-12 w-16 shrink-0 rounded-md overflow-hidden border border-slate-200">
                                            <Image src={img} alt="Interior" fill className="object-cover" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}

    </div>
  );
}