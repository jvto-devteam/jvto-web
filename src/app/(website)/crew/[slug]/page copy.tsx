import React from 'react';
import { 
  Instagram, 
  Facebook, 
  Twitter, 
  Star, 
  Quote, 
  MapPin, 
  ShieldCheck 
} from 'lucide-react';

// Initial Data sesuai request
const crewData = {
  id: 1,
  name: "Ghufron",
  type: "Tour Guide",
  photo: "https://i.ibb.co/4W6Ln5Y/ghufron.jpg",
  coverBanner: "https://i.ibb.co/4W6Ln5Y/ghufron.jpg", // Menggunakan gambar sama sbg placeholder banner
  description: "Ghufron is a professional tour guide with over 5 years of experience in leading tours around Java Volcanoes. He is known for his extensive knowledge of the region, friendly demeanor, and commitment to ensuring that every traveler has a memorable experience. Ghufron is fluent in multiple languages and is passionate about sharing the natural beauty and cultural heritage of Java with visitors from around the world.",
  socialMedia: {
    instagram: "https://www.instagram.com/ghufron_tourguide",
    facebook: "https://www.facebook.com/ghufron.tourguide",
    twitter: "https://twitter.com/ghufron_guide"
  },
  reviews: [
    {
      reviewerName: "Alice Johnson",
      rating: 5,
      photo: "https://i.ibb.co/0Jmshvb/alice.jpg",
      comment: "Ghufron was an amazing guide! He was knowledgeable, friendly, and made our trip unforgettable. Highly recommend!"
    },
    {
      reviewerName: "Michael Smith",
      rating: 4,
      photo: "https://i.ibb.co/2kR3F5H/michael.jpg",
      comment: "Great experience with Ghufron. He took us to some hidden gems and ensured we had a safe and enjoyable trip."
    }
  ]
};

const CrewProfilePage = () => {
  // Helper untuk render bintang
  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        size={16} 
        className={`${i < rating ? "fill-lime-500 text-lime-500" : "fill-gray-200 text-gray-200"}`} 
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-800">
      
      {/* 1. Hero / Cover Banner Section */}
      <div className="relative h-64 md:h-80 lg:h-96 w-full overflow-hidden">
        {/* Overlay Darkening untuk membuat teks/konten kontras */}
        <div className="absolute inset-0 bg-slate-900/40 z-10" />
        <img 
          src={crewData.coverBanner} 
          alt="Cover Banner" 
          className="w-full h-full object-cover grayscale-[20%]"
        />
      </div>

      <div className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-20 -mt-20 lg:-mt-24">
          
          {/* 2. Left Column: Profile Card */}
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden sticky top-8">
              <div className="p-6 text-center">
                {/* Profile Image with Ring */}
                <div className="relative inline-block mb-4">
                  <img 
                    src={crewData.photo} 
                    alt={crewData.name} 
                    className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-md mx-auto"
                  />
                  <div className="absolute bottom-2 right-2 bg-lime-500 text-white p-1.5 rounded-full border-2 border-white" title="Verified Crew">
                    <ShieldCheck size={20} />
                  </div>
                </div>

                <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900 mb-1">
                  {crewData.name}
                </h1>
                <p className="text-lime-600 font-bold uppercase text-sm tracking-wide mb-6">
                  {crewData.type}
                </p>

                {/* Social Media Buttons */}
                <div className="flex justify-center gap-3 mb-6">
                  {crewData.socialMedia.instagram && (
                    <a href={crewData.socialMedia.instagram} target="_blank" rel="noreferrer" className="p-2 bg-gray-100 hover:bg-lime-500 hover:text-white rounded-full transition-colors duration-300">
                      <Instagram size={20} />
                    </a>
                  )}
                  {crewData.socialMedia.facebook && (
                    <a href={crewData.socialMedia.facebook} target="_blank" rel="noreferrer" className="p-2 bg-gray-100 hover:bg-lime-500 hover:text-white rounded-full transition-colors duration-300">
                      <Facebook size={20} />
                    </a>
                  )}
                  {crewData.socialMedia.twitter && (
                    <a href={crewData.socialMedia.twitter} target="_blank" rel="noreferrer" className="p-2 bg-gray-100 hover:bg-lime-500 hover:text-white rounded-full transition-colors duration-300">
                      <Twitter size={20} />
                    </a>
                  )}
                </div>

                <div className="border-t border-gray-100 pt-6 text-left">
                  <div className="flex items-center gap-3 text-slate-500 text-sm mb-2">
                    <MapPin size={16} className="text-lime-600" />
                    <span>Based in East Java, Indonesia</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-500 text-sm">
                    <Star size={16} className="text-lime-600" />
                    <span>5 Years Experience</span>
                  </div>
                </div>
              </div>
              
              {/* CTA Button styled like provided image */}
              <button className="w-full bg-slate-900 text-white font-bold uppercase py-4 hover:bg-lime-500 hover:text-black transition-colors duration-300 flex items-center justify-center gap-2">
                Book This Guide
              </button>
            </div>
          </div>

          {/* 3. Right Column: Details & Reviews */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-8 pt-4 lg:pt-24">
            
            {/* About Section */}
            <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 mb-6 flex items-center gap-2">
                <span className="w-2 h-8 bg-lime-500 block rounded-sm"></span>
                About {crewData.name}
              </h2>
              <p className="text-slate-600 leading-relaxed text-lg">
                {crewData.description}
              </p>
            </section>

            {/* Reviews Section */}
            <section>
              <div className="flex items-center justify-between mb-8 px-2">
                <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-8 bg-lime-500 block rounded-sm"></span>
                  Traveler Reviews
                </h2>
                <div className="text-slate-500 font-medium">
                  {crewData.reviews.length} Verified Reviews
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {crewData.reviews.map((review, index) => (
                  <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
                    {/* Review Header */}
                    <div className="flex items-center gap-4 mb-4">
                      <img 
                        src={review.photo} 
                        alt={review.reviewerName} 
                        className="w-12 h-12 rounded-full object-cover bg-gray-200"
                      />
                      <div>
                        <h4 className="font-bold text-slate-900">{review.reviewerName}</h4>
                        <div className="flex items-center gap-1 mt-0.5">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                    </div>
                    
                    {/* Comment */}
                    <div className="relative flex-grow">
                      <Quote size={24} className="text-lime-100 absolute -top-1 -left-1 transform -scale-x-100" />
                      <p className="text-slate-600 italic pl-6 text-sm relative z-10 leading-relaxed">
                        "{review.comment}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CrewProfilePage;