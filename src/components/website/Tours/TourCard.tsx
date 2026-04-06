import { Star, Clock, MapPin, ArrowRight } from "lucide-react";
import { Difficulty } from "@/types";
import { ListTourPackage } from "@/types";
import { getPackagePath } from "@/lib/packages/packagePaths";
import { formatPrice } from "@/services/mockData";
import Button from "../UI/Button";
import Image from "next/image";

interface TourCardProps {
  tour: ListTourPackage;
}

const TourCard: React.FC<TourCardProps> = ({ tour }) => {
  const difficultyColors: any = {
    [Difficulty.EASY]: "bg-emerald-500",
    [Difficulty.MODERATE]: "bg-yellow-500",
    [Difficulty.CHALLENGING]: "bg-red-500",
  };

  const fullTourSlug = getPackagePath(tour.slug);

  return (
    <div className="group flex flex-col h-full bg-white shadow-sm hover:shadow-md transition-shadow duration-300 relative rounded-sm overflow-hidden">
      {/* Image Container */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <Image
          src={tour.banner.url}
          alt={tour.banner.alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Badges - Top Left */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 items-start">
          <span className="bg-jvto-dark text-white text-[10px] font-bold uppercase px-2 py-1 tracking-wider rounded-sm shadow-sm backdrop-blur-sm bg-opacity-90">
            Private
          </span>
          <span
            className={`${
              difficultyColors[tour.physicality]
            } text-white text-[10px] font-bold uppercase px-2 py-1 tracking-wider rounded-sm shadow-sm backdrop-blur-sm bg-opacity-90`}
          >
            {tour.physicality.toUpperCase()}
          </span>
        </div>

        {/* Tags - Top Right */}
        <div className="absolute top-4 right-4 flex flex-col gap-1 items-end">
          {tour.tags.slice(0, 2).map((tag, i) => (
            <span
              key={i}
              className="bg-white/90 backdrop-blur-sm text-jvto-dark text-[10px] font-bold uppercase px-2 py-1 tracking-wider rounded-sm shadow-sm"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Rating */}
        <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent flex items-end">
          <div className="flex items-center gap-1 text-white">
            <Star className="fill-jvto-green text-jvto-green w-4 h-4" />
            <span className="font-bold text-sm">4.9</span>
            <span className="text-xs text-gray-300">(112 reviews)</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow pt-4 pb-4 px-4 border-x border-b border-gray-100 rounded-b-sm">
        {/* Start Location */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2 uppercase tracking-wide font-medium">
          <MapPin size={12} className="text-jvto-green" />
          Start:{" "}
          <span className="text-gray-700 font-bold">
            {tour.startDestination}
          </span>
        </div>

        {/* Title */}
        <h3
          className="
    font-bold 
    text-base md:text-lg          
    leading-snug md:leading-tight 
    mb-3 
    group-hover:text-jvto-green 
    transition-colors 
    line-clamp-2 
    min-h-[2.6rem] md:min-h-[3.5rem]"
        >
          {tour.name}
        </h3>

        {/* Highlights */}
        <div className="mb-4 space-y-1.5 flex-grow">
          {tour.highlights.slice(0, 3).map((highlight, index) => (
            <div
              key={index}
              className="flex items-start gap-2 text-xs text-gray-600"
            >
              <span className="w-1.5 h-1.5 mt-1.5 bg-jvto-green rounded-full flex-shrink-0"></span>
              <span className="line-clamp-1 leading-relaxed">{highlight}</span>
            </div>
          ))}
        </div>

        {/* Pricing & Duration */}
        <div className="mt-auto space-y-3 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wide">
                From
              </span>
              <span className="font-black text-lg text-jvto-dark">
                {formatPrice(tour.startFrom)}
              </span>
              <span className="mt-1 text-[11px] leading-relaxed text-gray-500">
                2-pax reference. Larger groups pay less per person.
              </span>
            </div>

            <div className="flex items-center gap-1 text-xs font-bold text-gray-600 bg-gray-50 px-2 py-1.5 rounded-sm border border-gray-200">
              <Clock size={12} className="text-jvto-dark" />
              {tour.duration.day} {tour.duration.day > 1 ? "Days" : "Day"}
            </div>
          </div>

          {/* Button */}
          <Button
            to={fullTourSlug}
            variant="outline"
            size="sm"
            className="w-full group-hover:bg-jvto-dark group-hover:text-white group-hover:border-jvto-dark transition-all"
          >
            View Itinerary <ArrowRight size={14} className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TourCard;
