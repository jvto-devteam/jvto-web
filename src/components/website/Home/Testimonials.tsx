"use client";

import { useState, TouchEvent } from "react";
import {
  Star,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  ArrowRight,
} from "lucide-react";
import { REVIEWS } from "@/services/mockData";
import Image from "next/image";
import Link from "next/link";

const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // State untuk fitur Swipe di Mobile
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Minimum jarak swipe agar dianggap ganti slide
  const minSwipeDistance = 50;

  const initialData = [
    {
      customer_name: "Jeremy Teo",
      profile_photo:
        "https://lh3.googleusercontent.com/a-/ALV-UjWa-RMLudsDhNwpmpsIBwsgbZ34fLvnurqo2Qg8DdMUJFtR8k2s=s120-c-rp-mo-br100",
      date: "2025-10-28",
      star: 5,
      review:
        "We recently completed a tour by Java Volcano Tour Operator (JVTO) to Mt Bromo as well as IJEN and we were very satisfied with the arrangements made by the team. The team was very responsive, the trip was organised smoothly and our driver, Fredi, did a fantastic job, ensuring that we got from place to place safely and on time. We would certainly recommend going for a tour with JVTO!",
    },
    {
      customer_name: "Alydies Yue",
      profile_photo:
        "https://lh3.googleusercontent.com/a/ACg8ocK8V21CQPF5POA68LR0k2Y2DA7-p3isf9yksWYn8O_mAn2iaQ=s120-c-rp-mo-br100",
      date: "2025-10-27",
      star: 5,
      review:
        "We joined the 3D2N Mount Bromo, Madakaripura Waterfall, and Ijen Crater Tour and had an awesome time!\n\nThe tour was really well organized, with hikes spaced out just right so we had enough rest. There was also plenty of time to check out each spot. The food and accommodation were way better than we expected.\n\nBig thanks to our guide Gufron—he's super friendly and fun to hang out with. His briefings (and pretty drawing) before each hike were professional, and he looked after us the whole trip. He also knows all the best spots for photos! Our driver Fredi was always on time. The whole crew made the trip amazing and totally unforgettable.\n\nWe highly recommend this tour!\n10/10!!",
    },
    {
      customer_name: "Andrés",
      profile_photo:
        "https://lh3.googleusercontent.com/a/ACg8ocKNkXY3yMVG-RG2yywgexvG9F2cDyItZZohmHev2Lu4Y118fA=s120-c-rp-mo-ba2-br100",
      date: "2025-10-15",
      star: 5,
      review:
        "Incredible experience! We did 4D3N and they delivered on everything that was promised. We found this tour company very honest compared to others because you know the hotels that you'll go to (which are great btw).\nOur driver, Yandi, was always very kind and attentive. He never rushed us, letting us take our time to rest, while always staying on schedule. He also brought us to have lunch and dinner in very nice restaurants with very reasonable prices. And he even secured us some great spots to see the sunrise in Bromo. Most importantly, mainly thanks to him, we were literally one of the first to reach Tumpak Sewu, Bromo and Ijen, so we could enjoy them without big crowds. Big thanks to Anjas too for being a super nice guide and helping us a lot in Ijen!\nYou should really consider this tour company if you wanna visit these amazing natural treasures in East Java!",
    },
    {
      customer_name: "Samia Amrani",
      profile_photo:
        "https://lh3.googleusercontent.com/a/ACg8ocJ4eOWcIFSgTsYGvX-1TDyCTZjuzn4AVC7Oc5enXGTNU54tczQI=s120-c-rp-mo-br100",
      date: "2025-10-14",
      star: 5,
      review:
        "It was the best experience ever!! Our driver Pras and guide Rendi were the best, great people, super professionals and thoughtful, they took care of every detail and made us feel super safe and good.\nI recommended it 100%",
    },
    {
      customer_name: "Remy H",
      profile_photo:
        "https://lh3.googleusercontent.com/a/ACg8ocLaF32GQ_E3jcrj4JYyoSVZ54QAdvusR_qhqsnflGpRgEdffg=s120-c-rp-mo-br100",
      date: "2025-10-03",
      star: 5,
      review:
        "Me and my girlfriend had an amazing trip over here. We did the 3D2N Ijen + Bromo tour and everything was well arranged. Special thanks to the guide Gufron, who made this trip special ❤️",
    },
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % REVIEWS.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + REVIEWS.length) % REVIEWS.length
    );
  };

  // --- Logic Swipe Mobile ---
  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };
  // --------------------------

  const getVisibleReviews = () => {
    const reviews = [];
    // Kita tetap ambil 3 item untuk kebutuhan Desktop
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % initialData.length;
      reviews.push(initialData[index]);
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
            Real experiences from travelers who trusted us with their East Java
            adventure.
          </p>
        </div>

        <div
          className="relative"
          // Tambahkan event listener swipe di container ini
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 z-10 bg-white hover:bg-gray-50 text-jvto-dark p-3 rounded-full shadow-lg border border-gray-100 transition-all duration-200 group"
            aria-label="Previous reviews"
          >
            <ChevronLeft
              size={24}
              className="group-hover:scale-110 transition-transform"
            />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 z-10 bg-white hover:bg-gray-50 text-jvto-dark p-3 rounded-full shadow-lg border border-gray-100 transition-all duration-200 group"
            aria-label="Next reviews"
          >
            <ChevronRight
              size={24}
              className="group-hover:scale-110 transition-transform"
            />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {visibleReviews.map((review, idx) => (
              <div
                key={`${review.Reviewer_Name}-${idx}`}
                // LOGIKA UTAMA DISINI:
                // Jika index 0: Tampil (flex)
                // Jika index > 0 (item ke-2 & ke-3): Sembunyi di mobile (hidden), tampil di desktop (md:flex)
                className={`
                  bg-gray-50 p-8 rounded-sm border border-gray-100 flex-col relative h-full group hover:shadow-md transition-shadow
                  ${idx === 0 ? "flex" : "hidden md:flex"} 
                `}
              >
                <div className="flex items-center gap-1 mb-4 text-jvto-green">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <h3 className="font-bold text-lg mb-3 line-clamp-2 text-jvto-dark h-14">
                  {`"${review.customer_name}"`}
                </h3>
                <p className="text-gray-600 text-sm italic mb-6 flex-grow line-clamp-4 leading-relaxed">
                  {`"${review.review}"`}
                </p>
                <div className="mt-auto border-t border-gray-200 pt-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="relative w-12 h-12 flex-shrink-0">
                      <Image
                        src={review.profile_photo}
                        alt={review.customer_name}
                        fill
                        className="rounded-full object-cover border-2 border-gray-200"
                        sizes="48px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-jvto-dark mb-1 truncate">
                        {review.customer_name}
                      </p>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>{review.date}</span>
                      </div>
                    </div>
                  </div>
                  <span className="inline-block uppercase tracking-wider font-semibold text-gray-400 bg-white px-2 py-1 rounded-sm border border-gray-100 text-xs">
                    Google Review
                  </span>
                </div>{" "}
              </div>
            ))}
          </div>
        </div>
        <div className="md:mt-16 mt-8 text-center container mx-auto px-6">
          <Link
          target="_blank"
            href="/why-jvto/reviews"
            className="inline-flex items-center gap-2 bg-jvto-dark text-white px-10 py-4 font-bold uppercase tracking-widest rounded-lg shadow-xl hover:bg-gray-800 hover:-translate-y-1 transition-all"
          >
            View All Reviews
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
