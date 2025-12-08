'use client'
import { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import { REVIEWS } from '@/services/mockData';

const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % REVIEWS.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + REVIEWS.length) % REVIEWS.length);
  };

  const getVisibleReviews = () => {
    const reviews = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % REVIEWS.length;
      reviews.push(REVIEWS[index]);
    }
    return reviews;
  };

  const visibleReviews = getVisibleReviews();

  return (
    <section className="py-24 bg-white border-t border-gray-100 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4 text-jvto-green">
            <MessageCircle size={24} />
          </div>
          <h2 className="text-3xl md:text-4xl font-black uppercase mb-6 text-jvto-dark">
            What Our Guests Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Real experiences from travelers who trusted us with their East Java adventure.
          </p>
        </div>

        <div className="relative">
          {/* Navigation Buttons */}
          <button 
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 z-10 bg-white hover:bg-gray-50 text-jvto-dark p-3 rounded-full shadow-lg border border-gray-100 transition-all duration-200 group"
            aria-label="Previous reviews"
          >
            <ChevronLeft size={24} className="group-hover:scale-110 transition-transform" />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 z-10 bg-white hover:bg-gray-50 text-jvto-dark p-3 rounded-full shadow-lg border border-gray-100 transition-all duration-200 group"
            aria-label="Next reviews"
          >
            <ChevronRight size={24} className="group-hover:scale-110 transition-transform" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {visibleReviews.map((review, idx) => (
              <div key={`${review.Reviewer_Name}-${idx}`} className="bg-gray-50 p-8 rounded-sm border border-gray-100 flex flex-col relative h-full group hover:shadow-md transition-shadow">
                <div className="flex items-center gap-1 mb-4 text-jvto-green">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>

                <h3 className="font-bold text-lg mb-3 line-clamp-2 text-jvto-dark h-14">
                  {`"${review.Review_Title}"`}
                </h3>

                <p className="text-gray-600 text-sm italic mb-6 flex-grow line-clamp-4 leading-relaxed">
                  {`"${review.Review_Text}"`}
                </p>

                <div className="mt-auto border-t border-gray-200 pt-4">
                  <p className="font-bold text-sm text-jvto-dark mb-1 truncate">
                    {review.Reviewer_Name}
                  </p>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>{review.Review_Date}</span>
                    <span className="uppercase tracking-wider font-semibold text-gray-400 bg-white px-2 py-1 rounded-sm border border-gray-100">
                      {review.Source.split(' ')[0]}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;