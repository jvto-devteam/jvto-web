import Link from "next/link";
import { 
  Check, 
  QrCode, 
  X, 
  MapPin, 
  ArrowRight, 
  AlertCircle 
} from "lucide-react";

const IjenHealthScreeningSection = () => (
  <section className="py-16 md:py-24 bg-white relative overflow-hidden">
    <div className="container mx-auto px-4">
      {/* Modern Card Container */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="grid md:grid-cols-2">
            
            {/* Content Side */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
                {/* Badge: Warning icon */}
                <div className="inline-flex w-fit items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-100 text-red-600 mb-6">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Mandatory Requirement</span>
                </div>

                <h2 className="font-sans font-black text-3xl md:text-5xl text-gray-900 mb-6 leading-tight uppercase tracking-tight">
                    Real Medical Check <br/>
                    <span className="text-lime-600">Included</span>
                </h2>
                
                <p className="font-sans text-lg text-gray-600 mb-8 leading-relaxed">
                    Kawah Ijen is not a walk in the park. It's a high-altitude volcano with sulfur gas. We include a <span className="font-bold text-gray-900 bg-lime-100 px-1">REAL screening</span> by trained medical staff to ensure your safety.
                </p>

                {/* List Items */}
                <ul className="space-y-4 font-sans text-gray-800 mb-10">
                    <li className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-6 h-6 rounded bg-lime-500 flex items-center justify-center text-white mt-1">
                             <Check className="w-4 h-4" strokeWidth={3} />
                        </div>
                        <span className="font-medium">Included in your package cost.</span>
                    </li>
                    <li className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-6 h-6 rounded bg-lime-500 flex items-center justify-center text-white mt-1">
                            <QrCode className="w-3.5 h-3.5" strokeWidth={3} />
                        </div>
                        <span className="font-medium">Digital QR verification at the gate.</span>
                    </li>
                    <li className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-6 h-6 rounded bg-red-500 flex items-center justify-center text-white mt-1">
                            <X className="w-4 h-4" strokeWidth={3} />
                        </div>
                        <span className="font-medium">Reduces fake letters & avoidable accidents.</span>
                    </li>
                </ul>

                {/* Button Action */}
                <div>
                    <Link target="_blank" href="/travel-guide/ijen-health-screening" className="inline-flex items-center justify-center px-8 py-4 text-sm font-bold text-white transition-all duration-200 bg-black hover:bg-lime-600 rounded-lg uppercase tracking-widest group">
                        See How It Works
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>

            {/* Image Side */}
            <div className="relative min-h-[300px] h-full">
                {/* Sebaiknya gunakan <Image /> dari next/image jika memungkinkan */}
                <img 
                    src="https://javavolcano-touroperator.com/screening/ijen-screening-hotel-01.jpeg" 
                    alt="Nurse performing medical check" 
                    className="absolute inset-0 w-full h-full object-cover"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:bg-gradient-to-l md:from-transparent md:to-transparent"></div>

                {/* Location Label */}
                <div className="absolute bottom-6 left-6 right-6 md:right-auto bg-white/90 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-lg shadow-lg">
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-lime-600" />
                        <p className="font-sans font-bold text-xs uppercase text-gray-900">Location: Your Hotel Lobby</p>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  </section>
);

export default IjenHealthScreeningSection;