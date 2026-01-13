import Image from "next/image";
import Button from "../UI/Button";
import { Star } from "lucide-react";

const Hero: React.FC = () => {
  return (
    <div className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/img/hero/home.webp"
          alt="Ijen Crater"
          fill
          priority
          sizes="100vw"
          quality={80}
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-black/30"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center text-white mt-16">
        <a
          href="https://www.trustpilot.com/review/javavolcano-touroperator.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/10 px-5 py-2.5 rounded-full mb-8 animate-fade-in-up hover:bg-white/20 transition-all duration-300 group"
        >
          {/* Green Stars */}
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-[#00b67a] p-1 rounded-sm shadow-sm">
                <Star
                  className="w-3 h-3 text-white fill-white"
                  strokeWidth={0}
                />
              </div>
            ))}
          </div>
          {/* Text */}
          <div className="flex items-center gap-1.5 text-sm md:text-base leading-none">
            <span className="font-medium text-gray-200">Excellent on</span>
            <span className="font-bold text-white flex items-center gap-0.5">
              Trustpilot
              <Star className="w-3 h-3 text-[#00b67a] fill-[#00b67a] ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
            </span>
          </div>
        </a>

        <h1 className="text-3xl md:text-6xl font-black leading-tight mb-6 uppercase tracking-tight max-w-5xl mx-auto">
          Tourist Police-Led <br /> Private Volcano Tours <br /> in East Java
        </h1>

        <p className="text-md md:text-xl text-gray-200 mb-10 max-w-3xl mx-auto font-light">
          Private Bromo, Ijen & Tumpak Sewu tours from Surabaya or Bali.
          Licensed Indonesian operator (Licence 1102230032918), police-led
          safety culture, all-inclusive packages, Ijen health screening
          included.
        </p>

        <div className="flex gap-4 justify-center md:hidden">
          <Button target="_blank" to="/tours" variant="primary" size="md">
            Private Tours
          </Button>
          <Button
            to="/verify-jvto"
            variant="outline"
            size="md"
            className="border-white text-white hover:bg-white hover:!text-black"
          >
            Verify JVTO
          </Button>
        </div>
        <div className="md:flex gap-4 justify-center hidden">
          <Button target="_blank" to="/tours" variant="primary" size="lg">
            Private Tours
          </Button>
          <Button
          target="_blank"
            to="/verify-jvto"
            variant="outline"
            size="lg"
            className="border-white text-white hover:bg-white hover:!text-black"
          >
            Verify JVTO
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
