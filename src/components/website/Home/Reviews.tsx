"use client";
import React, { useState, useRef, useEffect } from "react";

const TrustpilotWidget = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviewsPerView, setReviewsPerView] = useState(1); // Default 1
  const carouselRef = useRef(null);
  const [cardWidth, setCardWidth] = useState(393);

  const reviews = [
    {
      name: "JzB Bro",
      date: "2026-02-26",
      url: "https://www.trustpilot.com/reviews/69a004758191c478028bb03b",
      stars: 5,
      title: "We have such a wonderful moments",
      text: "Even in the bad weather ,anyway we can enjoy the trip. All The guides are very kindness, friendly and sincerely especially Yandi and Rendi , two thumbs up!!!!!",
      verified: true,
    },
    {
      name: "Chaiwut",
      date: "2026-02-26",
      url: "https://www.trustpilot.com/reviews/69a004aade1903a06e93597f",
      stars: 5,
      title: "Rendi&yandi good guide",
      text: "Rendi&yandi good guide",
      verified: true,
    },
    {
      name: "Pat",
      date: "2026-02-26",
      url: "https://www.trustpilot.com/reviews/69a0059e53a1af75be830479",
      stars: 5,
      title: "It was a very fun trip",
      text: "It was a very fun trip. The driver, Yandi, took great care of us the whole time and brought us everywhere we wanted to go. The guides, Rendi and Yandi, communicated well in English and helped take really great photos. If you’re planning to travel to Surabaya, I highly recommend this place.",
      verified: true,
    },
    {
      name: "Evan",
      date: "2026-01-22",
      url: "https://www.trustpilot.com/reviews/6970d23d258b40bcc409827e",
      stars: 5,
      title: "Ahboy was an amazing guide",
      text: "Ahboy was an amazing guide- knowledgeable, caring and fun. Wr're so glad he showed us ljen.",
      verified: true,
    },
    {
      name: "Patarachai Sereerat",
      date: "2026-01-18",
      url: "https://www.trustpilot.com/reviews/696ccc50a8dcb95a58473ac5",
      stars: 5,
      title: "Amazing trip",
      text: "Had an amazing trip visiting Bromo, Ijen Crater, and Tumpak Sewu Waterfall! Everything was well organized and the price was really good. The staff were super kind and helpful — special thanks to Yandi (our driver who’s been staying with us the whole trip) and Boy (our guide to Ijen crater). They were so friendly and shared lots of useful info. Even though we had to wake up in the middle of the night, it was totally worth it! Highly recommended",
      verified: true,
    },
    {
      name: "Jiang Tianjian",
      date: "2026-01-04",
      url: "https://www.trustpilot.com/reviews/695a253c9aedd5ee816d03ff",
      stars: 5,
      title: "Fantastic trip",
      text: "The tour guides were extremely friendly and accommodating. One of our friends was injured and they helped him as well. Overall, fantastic planning from the team!",
      verified: false,
    },
    {
      name: "John Joyce",
      date: "2025-12-30",
      url: "https://www.trustpilot.com/reviews/69538f76dead3f5394830f65",
      stars: 5,
      title: "What an unbelievable experience",
      text: "What an unbelievable experience I don't think there is a better tour guide anywhere than Anjas the personal touch he provides and the knowledge he as over everywhere we went will put this company head and shoulders above the rest.",
      verified: true,
    },
    {
      name: "Sisca",
      date: "2025-12-27",
      url: "https://www.trustpilot.com/reviews/694f2b7b6b98b5e928cbbabe",
      stars: 5,
      title: "Professional and Knowledgable Guides",
      text: "JVTO takes pride in assuring their customers by giving them prompt prior information. The driver Yandi and guide Boy, who were assigned to us, were great. We had a wonderful time at Ijen today.",
      verified: true,
    },
    {
      name: "Geoffrey",
      date: "2025-12-02",
      url: "https://www.trustpilot.com/reviews/692e9b276ce47e5c83ed1ecd",
      stars: 5,
      title: "Great tour",
      text: "Rendi and Fredi were great tour hosts .all your needs were taken care of throughout the tour . All the days were fully explained in advance what to expect and when to be ready",
      verified: true,
    },
    {
      name: "Jason Li",
      date: "2025-10-18",
      url: "https://www.trustpilot.com/reviews/68f33075f3905283fc849cc8",
      stars: 5,
      title: "Ahboy was a phenomenal Ijen guide",
      text: "Ahboy was a phenomenal Ijen guide from start to end. Not only was he incredibly knowledgeable and went out of his way to make sure everything we needed was sorted out (safety, logistics, equipment)...",
      verified: true,
    },
    {
      name: "ella ryan",
      date: "2025-10-18",
      url: "https://www.trustpilot.com/reviews/68f2e7621dc7ff8281797e3d",
      stars: 5,
      title: "Visiting Mount Ijen",
      text: "Visiting Mount Ijen was such a beautiful experience. We had a great time with our guide Ahboy he was so fun and helpful!",
      verified: true,
    },
    {
      name: "Nina nguyen",
      date: "2025-10-12",
      url: "https://www.trustpilot.com/reviews/68eb9bb3aaf3d528d97fcfb7",
      stars: 5,
      title: "I recently joined a tour to East Java…",
      text: "I recently joined a tour to East Java with JVTO, and it was absolutely incredible! Our guide, Gufron, and driver, Holili, made the entire trip so comfortable and safe. Gufron was so knowledgeable...",
      verified: true,
    },
    {
      name: "Karthika TS",
      date: "2025-10-10",
      url: "https://www.trustpilot.com/reviews/68e88dc1cc246a2f8568d916",
      stars: 4,
      title: "Being a solo traveler it was safe...",
      text: "Being a solo traveler it was safe and stress free experience with JVTO. The staffs were on time and friendly. Loved the hotels and food recommendations got from the guides.",
      verified: false,
    },
    {
      name: "Tobias W.",
      date: "2025-09-17",
      url: "https://www.trustpilot.com/reviews/68ca3538165229b8147b53af",
      stars: 5,
      title: "Perfect trip",
      text: "We can only praise the JVTO team, and above all our guide Rendi and our driver Joyo, in the highest terms. We came across JVTO by chance, and looking back, we are incredibly grateful for the great experience...",
      verified: true,
    },
    {
      name: "Divya_ Stri",
      date: "2025-09-15",
      url: "https://www.trustpilot.com/reviews/68c777ed4e24dcb6b907258c",
      stars: 5,
      title: "Ijen and Bromo tour",
      text: "Our driver Yandi was really reliable and friendly. He briefed us on what to expect for the day and was really helpful throughout our trip. Our guide for Mount Ijen was Gufron...",
      verified: true,
    },
    {
      name: "Megane",
      date: "2025-08-20",
      url: "https://www.trustpilot.com/reviews/68a57463cc9f0897c2fb5149",
      stars: 5,
      title: "On a vécu une superbe expérience",
      text: "On a vécu une superbe expérience avec Oboy qui nous a guidé tout le long du voyage. L'expérience était vraiment top! Je recommande Oboy, qui a vraiment été au petit soin pour nous.",
      verified: true,
    },
    {
      name: "Olivia McGhie",
      date: "2025-08-16",
      url: "https://www.trustpilot.com/reviews/68a00d8837e6f7e230ce5c98",
      stars: 5,
      title: "East Java Tour Bali>Surabaya 4D2N",
      text: "Our driver Goyo and Guide Ehboy were fantastic! We had such an incredible experience on the tour around East Java. Goyo was an expert driver, whilst Ehboy's guidance and knowledge...",
      verified: true,
    },
    {
      name: "Luke Chatwin",
      date: "2025-08-16",
      url: "https://www.trustpilot.com/reviews/68a00d2a3591c7c75b8ca839",
      stars: 5,
      title: "East Java Tour Bali to Surabaya",
      text: "Guide Ehboy and driver Goyo were great! Had an amazing tour and enjoyed each bit of it. Would definitely recommend for anyone considering a trip to the highlights of East Java.",
      verified: true,
    },
    {
      name: "Wing Shan Lui",
      date: "2025-08-03",
      url: "https://www.trustpilot.com/reviews/688f726868ecc5feb10a8fa3",
      stars: 5,
      title: "The 4D3N volcano trip is really worth...",
      text: "We joined the tour from 31/7 to 3/8. We have had a great trip with our driver, Dika, he was being very helpful and caring, sharing things about Indonesia with us, taking us to different local restaurants...",
      verified: true,
    },
    {
      name: "Siobhan",
      date: "2025-07-26",
      url: "https://www.trustpilot.com/reviews/6884abe81a07648212569608",
      stars: 5,
      title: "Ijen and Bromo tour",
      text: "We had such an amazing experience doing Ijen, Mount Bromo and the waterfall. It truly was a once in a lifetime experience. Our driver Johan went above and beyond to help us...",
      verified: true,
    },
    {
      name: "Iain Maclean",
      date: "2025-07-25",
      url: "https://www.trustpilot.com/reviews/6882d3d2cb01c6335e87baeb",
      stars: 5,
      title: "My wife and I did the Java Volcano tour",
      text: "My wife and I did the Java Volcano tour visiting Ijen with Eboy as our guide. We can't speak highly enough of him he is an excellent guide. From start to finish he made sure we were safe...",
      verified: true,
    },
    {
      name: "Alicia",
      date: "2025-07-25",
      url: "https://www.trustpilot.com/reviews/68825a454ef3b15a03fc3a47",
      stars: 5,
      title: "Thank You JVTO for an Amazing Trip",
      text: "We really loved and were very satisfied with this trip. Throughout the journey, we were well taken care of by Yandi and Kiki, who gave us many helpful suggestions for our itinerary.",
      verified: true,
    },
    {
      name: "Dani Ernst",
      date: "2025-07-15",
      url: "https://www.trustpilot.com/reviews/68764f7619c244744882ea09",
      stars: 4,
      title: "We did the Java Tour with our guide",
      text: "We did the Java Tour with our guide Fredy. He was soo friendly and helpful! He made the trip very easy for us. Thank you so much, Fredy! Maybe it would be good to know that the tours are very heavy...",
      verified: true,
    },
    {
      name: "Rai Y",
      date: "2025-06-22",
      url: "https://www.trustpilot.com/reviews/6857c2bef34bcf699479ec09",
      stars: 4,
      title: "3D2N Ijen, Bromo and Madakapuri",
      text: "Overall we are very happy with the service given by the local guide! Freddy our guide and driver was excellent in taking care of us and meeting our needs. He is also fun to talk to.",
      verified: true,
    },
    {
      name: "Nash Ville",
      date: "2025-06-04",
      url: "https://www.trustpilot.com/reviews/6840069123b9159ddb95605d",
      stars: 5,
      title: "we booked 4d3n ijen-tumpak sewu...",
      text: "we booked 4d3n ijen-tumpak sewu- bromo- it was arranged smoothly from the airport till bck to hotel on the last day- the teams are very professional, efficient and friendly.",
      verified: true,
    },
    {
      name: "Eileen Chua",
      date: "2025-05-31",
      url: "https://www.trustpilot.com/reviews/683a9b005ab4d58d23dca253",
      stars: 5,
      title: "The overall experience was great",
      text: "The overall experience was great. Guide Ahboy is efficient and takes the extra miles to ensure the tour goes smoothly and ample time is provided for each attraction. Driver Joy is very experienced.",
      verified: true,
    },
    {
      name: "Gokul Adapa",
      date: "2025-05-25",
      url: "https://www.trustpilot.com/reviews/6833039ee699d6d856f3bdce",
      stars: 5,
      title: "Best Experience with JVTO",
      text: "Thanks JVTO we had a best experience with Mount Bromo,Ijen,Mandakaripura waterfalls. Thanks to Toufic Guide for being friendly and helpful.",
      verified: true,
    },
    {
      name: "Basia DM",
      date: "2025-05-13",
      url: "https://www.trustpilot.com/reviews/68230809884c9a6bb75d54ec",
      stars: 5,
      title: "East Java - Great experiance",
      text: "Great experiance! Thank you JVTO, and thank you Gufron! Best guide! East Java is wonderfull and the experiance - unforgetable!",
      verified: true,
    },
    {
      name: "Noelia Carrasco",
      date: "2025-04-30",
      url: "https://www.trustpilot.com/reviews/681110b6d382710bfb4c327e",
      stars: 5,
      title: "Great experience, higly recommended!",
      text: "We did 4D3N from Bali to Surabaya visiting Mount Ijen, Bromo, Tumpak Sewu and Madakaripura Waterfall and we cannot be so grateful! Everything went perfect, and our driver Yandi help us!",
      verified: true,
    },
    {
      name: "Yandi Junaidi",
      date: "2024-08-11",
      url: "https://www.trustpilot.com/reviews/66b8c5ec17dea7f42c82e310",
      stars: 5,
      title: "Trip 4D3N Ijen-Bromo-Tumpak sewu",
      text: "Hi!! I'm veri happy with java volcano service. about the guide and the driver. they're very professional and had very well service for us thank you for unforgettable experience",
      verified: false,
    },
    {
      name: "Alfi Layalin",
      date: "2024-08-11",
      url: "https://www.trustpilot.com/reviews/66b8c17f61907569fcb5a7fe",
      stars: 5,
      title: "Bromo - Tumpak sewu",
      text: "Spending my 3 days in Indonesia It was so amazing, all they offered to visit the natural places was so stunning. Highly recommend you to book this tour..",
      verified: false,
    },
    {
      name: "Ghufrano Septyan",
      date: "2024-08-11",
      url: "https://www.trustpilot.com/reviews/66b8aff642a78e48bdfcf9b1",
      stars: 5,
      title: "Best 3D 2N Trip",
      text: "Had an amazing 3D 2N trip, thanks to Java Volcano Tour Operator who make our trip well-organized. Everything was taken care of, both the Tour Guide and The Customer Service are fast.",
      verified: false,
    },
    {
      name: "Gean Delipta",
      date: "2024-08-11",
      url: "https://www.trustpilot.com/reviews/66b8af0504096a5eec4a1f71",
      stars: 5,
      title: "Perfect itenerary",
      text: "We booked for 3days 2 nightijen and bromoIt was a great and adventurous trip for both if us. Thanks Guys and team who guided us throughout the trip. They also sent us back to our destinated hotel safely.",
      verified: false,
    },
    {
      name: "Anjas Setyawan",
      date: "2024-08-11",
      url: "https://www.trustpilot.com/reviews/66b8ac377f8008b575d160bb",
      stars: 5,
      title: "Best Travel Agent",
      text: "I hadn't used a tour company for many years, and this time I was pleasantly surprised by the excellent service! Compared to the tours I joined with my family when I was younger, this experience was much better.",
      verified: false,
    },
    {
      name: "Rendi Rivaldi",
      date: "2024-08-11",
      url: "https://www.trustpilot.com/reviews/66b8ab579abb0a6afbb8aecd",
      stars: 5,
      title: "Thanks for java volcano",
      text: "we had great experience during our trip 3D2N especially sunrise at the bromo and thanks for the professional guide can take unforgettable memory for us",
      verified: false,
    },
    {
      name: "Ahmad lutfi Haqi",
      date: "2024-08-11",
      url: "https://www.trustpilot.com/reviews/66b8aa2fee6c99d4ad8b3ed8",
      stars: 5,
      title: "Kudos to Java Volcano.",
      text: "Kudos to Java Volcano. Literally gave us such an unforgettable experience 3D2N for Bromo-Ijen. All experience crews that accompany us literally helps us documentating such a wonderful momeries.",
      verified: false,
    },
    {
      name: "sa'ad ramadhan",
      date: "2024-07-02",
      url: "https://www.trustpilot.com/reviews/6683a76c67279bb28f2e4cf6",
      stars: 5,
      title: "Fantastic Tour",
      text: "My trip to Kawah Ijen with Java Volcano Tour Operator was amazing. From booking to the tour itself, everything was handled with professionalism. Our guide was knowledgeable.",
      verified: false,
    },
    {
      name: "Angga Riski Ariwardana",
      date: "2024-01-18",
      url: "https://www.trustpilot.com/reviews/65a8bc6504960ff06cf62132",
      stars: 5,
      title: "East Java tour (Bromo Volcano)",
      text: "My wife and I had an unforgettable and spectacular honeymoon when we did the East Java tour with this company. The well-experienced driver drove as very safely and carefully.",
      verified: false,
    },
    {
      name: "Fikaa",
      date: "2024-01-16",
      url: "https://www.trustpilot.com/reviews/65a565578081754b08e1057d",
      stars: 5,
      title: "Surabaya - Bali",
      text: "I had a really fantastic tour for 3 days going to Indonesia. and they had taken me to exciting places. I'd like to ge there with them next time again. Thank to Java volcano",
      verified: false,
    },
  ];
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 520;
      setReviewsPerView(isMobile ? 1 : 2);
      setCardWidth(isMobile ? window.innerWidth - 80 : 393); // 80px = padding kiri kanan (40px x 2)
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const maxIndex = Math.max(0, reviews.length - reviewsPerView);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const getStarColor = (stars) => {
    const colors = {
      1: "#ff3722",
      2: "#ff8622",
      3: "#ffce00",
      4: "#73cf11",
      5: "#00b67a",
    };
    return colors[stars] || colors[5];
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    });
  };

  const StarRating = ({ all, rating }) => {
    const color = getStarColor(rating);
    return (
      <div className={`${all ? "w-[162px]  mb-3" : "w-[99px]"}`}>
        <svg viewBox="0 0 251 46" xmlns="http://www.w3.org/2000/svg">
          <title>5 out of 5 star rating on Trustpilot</title>
          {[...Array(5)].map((_, index) => (
            <g key={index} className="tp-star">
              <path
                className="tp-star__canvas"
                fill={index < rating ? color : "#dcdce6"}
                d={`M${51.248 * index} 46.330002h46.375586V0H${
                  51.248 * index
                }z`}
              />
              <path
                className="tp-star__shape"
                d={`M${39.534 + 51.248 * index} 19.711433L${
                  13.23 + 51.248 * index
                } 38.80065l3.838216-11.797827L${
                  7.021 + 51.248 * index
                } 19.711433h12.418975l3.837417-11.798624 3.837418 11.798624h12.418975zM${
                  23.279 + 51.248 * index
                } 31.510075l7.183595-1.509576 2.862114 8.800152L${
                  23.279 + 51.248 * index
                } 31.510075z`}
                fill="#FFF"
              />
            </g>
          ))}
        </svg>
      </div>
    );
  };
  const VerificationBadge = ({ verified }) => {
    if (!verified) return null;

    return (
      <div className="relative inline-flex items-center text-[#6c6c85] group">
        <div className="flex items-center h-4 mt-0.5 overflow-hidden">
          <div className="flex-shrink-0 h-3.5 w-3.5 mr-1 mb-0.5">
            <svg
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7 14C10.866 14 14 10.866 14 7C14 3.13401 10.866 0 7 0C3.13401 0 0 3.13401 0 7C0 10.866 3.13401 14 7 14ZM6.09217 7.81401L9.20311 4.7031C9.44874 4.45757 9.84688 4.45757 10.0923 4.7031C10.338 4.94864 10.338 5.34673 10.0923 5.59226L6.62009 9.06448C6.59573 9.10283 6.56682 9.13912 6.53333 9.17256C6.28787 9.41821 5.88965 9.41821 5.64402 9.17256L3.7059 7.11031C3.46046 6.86464 3.46046 6.46669 3.7059 6.22102C3.95154 5.97548 4.34968 5.97548 4.59512 6.22102L6.09217 7.81401Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div className="text-[13px] font-normal whitespace-nowrap overflow-hidden text-ellipsis">
            Verified
          </div>
        </div>

        <div className="hidden group-hover:block absolute left-[-50px] top-full mt-3 w-[180px] sm:w-[250px] bg-white border border-[#dcdce6] rounded-sm shadow-[0px_4px_24px_rgba(0,0,0,0.15)] p-2 sm:p-4 text-[#1b1b21] leading-4 z-10 cursor-default">
          <div className="absolute left-[28%] sm:left-[20%] top-[-8px] h-3.5 w-3.5 bg-white border-l border-t border-[#dcdce6] transform rotate-45"></div>
          <div className="text-[13px] leading-4 font-bold mb-1">
            Verified review
          </div>
          <div className="text-[13px] leading-4">
            <a
              href="https://support.trustpilot.com/hc/articles/223402468#verified-reviews-2"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1a66ff] underline hover:no-underline"
            >
              Learn more
            </a>{" "}
            about review types
          </div>
        </div>
      </div>
    );
  };

  const ReviewCard = ({ review }) => {
    return (
      <div className="bg-white rounded-sm py-3 shadow-sm inline-block w-[calc(100vw-80px)] sm:w-[393px] h-[110px] mr-4 pl-5 align-top relative group">
        <div className="absolute inset-0.5 border-2 border-transparent rounded pointer-events-none group-focus-within:border-[#3c57bc] group-focus-within:shadow-[0_0_0_2px_#fff]"></div>

        <div className="flex gap-2 mb-1.5 items-center">
          <StarRating all={false} rating={review.stars} />
          <VerificationBadge verified={review.verified} />
        </div>

        <a
          href={review.url}
          target="_blank"
          rel="nofollow noopener noreferrer"
          className="block text-[#191919] no-underline outline-none"
        >
          <div className="text-sm font-bold h-4 mb-1.5 overflow-hidden text-ellipsis whitespace-nowrap w-full">
            {review.title}
          </div>
          <div className="text-[13px] leading-4 mb-2 max-h-8 overflow-hidden text-ellipsis break-words">
            {review.text}
          </div>
          <div className="flex text-[13px] text-[rgba(0,0,0,0.6)]">
            <div className="font-bold overflow-hidden text-ellipsis whitespace-nowrap leading-[120%]">
              {review.name},
            </div>
            <div className="flex-shrink-0 ml-0.5">
              {formatDate(review.date)}
            </div>
          </div>
        </a>
      </div>
    );
  };

  const NavigationButton = ({ direction, onClick, disabled }) => {
    const isLeft = direction === "left";
    return (
      <div
        className={`absolute top-0 h-full w-10 z-10 ${
          isLeft ? "left-0" : "right-0"
        } ${disabled ? "cursor-default" : "cursor-pointer"}`}
      >
        <button
          onClick={onClick}
          disabled={disabled}
          className={`absolute left-1/2 top-1/2 ${
            isLeft ? "-translate-x-1/2" : "-translate-x-1/2 rotate-180"
          } -translate-y-1/2 bg-transparent border-0 cursor-pointer block min-h-6 min-w-6 w-6 p-0 outline-none hover:bg-[#c2d5f7] hover:p-2 hover:w-10 hover:h-10 hover:rounded-full transition-all ${
            disabled ? "opacity-50" : ""
          }`}
          aria-label={`Carousel scroll ${direction}`}
          tabIndex={disabled ? -1 : 0}
        >
          <svg
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
          >
            <circle
              cx="12"
              cy="12"
              r="11.5"
              fill="none"
              stroke={disabled ? "#d1d1d1" : "#191919"}
            />
            <path
              fill={disabled ? "#d1d1d1" : "#191919"}
              d="M10.5088835 12l3.3080582-3.02451041c.2440777-.22315674.2440777-.5849653 0-.80812204-.2440776-.22315673-.6398058-.22315673-.8838834 0L9.18305826 11.595939c-.24407768.2231567-.24407768.5849653 0 .808122l3.75000004 3.4285714c.2440776.2231568.6398058.2231568.8838834 0 .2440777-.2231567.2440777-.5849653 0-.808122L10.5088835 12z"
            />
          </svg>
        </button>
      </div>
    );
  };

  return (
    <div className="mt-10 min-h-[150px] min-w-[300px] relative font-['Helvetica_Neue',Helvetica,Arial,sans-serif] text-xs text-[#191919]">
      {/* Left Section */}
      <div className="text-center sm:float-left sm:w-[200px] z-[100]">
        <a
          href="https://www.trustpilot.com/review/javavolcano-touroperator.com"
          target="_blank"
          rel="noopener noreferrer"
          className="block text-[#191919] no-underline outline-none relative"
        >
          <span className="block text-2xl mb-3 font-medium">Excellent</span>

          <span className="block mx-auto mb-3 w-[162px]">
            <StarRating all={true} rating={5} />
          </span>

          <span className="block text-[13px] leading-4 mb-4 font-light">
            Based on{" "}
            <strong className="border-b border-[rgba(25,25,25,0.6)] font-medium hover:border-transparent">
              36 reviews
            </strong>
          </span>

          <span className="block mx-auto w-[106px]">
            <svg viewBox="0 0 126 31" xmlns="http://www.w3.org/2000/svg">
              <title>Trustpilot</title>
              <path
                d="M33.074774 11.07005H45.81806v2.364196h-5.010656v13.290316h-2.755306V13.434246h-4.988435V11.07005h.01111zm12.198892 4.319629h2.355341v2.187433h.04444c.077771-.309334.222203-.60762.433295-.894859.211092-.287239.466624-.56343.766597-.79543.299972-.243048.633276-.430858.999909-.585525.366633-.14362.744377-.220953 1.12212-.220953.288863 0 .499955.011047.611056.022095.1111.011048.222202.033143.344413.04419v2.408387c-.177762-.033143-.355523-.055238-.544395-.077333-.188872-.022096-.366633-.033143-.544395-.033143-.422184 0-.822148.08838-1.199891.254096-.377744.165714-.699936.41981-.977689.740192-.277753.331429-.499955.729144-.666606 1.21524-.166652.486097-.244422 1.03848-.244422 1.668195v5.39125h-2.510883V15.38968h.01111zm18.220567 11.334883H61.02779v-1.579813h-.04444c-.311083.574477-.766597 1.02743-1.377653 1.369908-.611055.342477-1.233221.51924-1.866497.51924-1.499864 0-2.588654-.364573-3.25526-1.104765-.666606-.740193-.999909-1.856005-.999909-3.347437V15.38968h2.510883v6.948968c0 .994288.188872 1.701337.577725 2.1101.377744.408763.922139.618668 1.610965.618668.533285 0 .96658-.077333 1.322102-.243048.355524-.165714.644386-.37562.855478-.65181.222202-.265144.377744-.596574.477735-.972194.09999-.37562.144431-.784382.144431-1.226288v-6.573349h2.510883v11.323836zm4.27739-3.634675c.07777.729144.355522 1.237336.833257 1.535623.488844.287238 1.06657.441905 1.744286.441905.233312 0 .499954-.022095.799927-.055238.299973-.033143.588836-.110476.844368-.209905.266642-.099429.477734-.254096.655496-.452954.166652-.198857.244422-.452953.233312-.773335-.01111-.320381-.133321-.585525-.355523-.784382-.222202-.209906-.499955-.364573-.844368-.497144-.344413-.121525-.733267-.232-1.17767-.320382-.444405-.088381-.888809-.18781-1.344323-.287239-.466624-.099429-.922138-.232-1.355432-.37562-.433294-.14362-.822148-.342477-1.166561-.596573-.344413-.243048-.622166-.56343-.822148-.950097-.211092-.386668-.311083-.861716-.311083-1.436194 0-.618668.155542-1.12686.455515-1.54667.299972-.41981.688826-.75124 1.14434-1.005336.466624-.254095.97769-.430858 1.544304-.541334.566615-.099429 1.11101-.154667 1.622075-.154667.588836 0 1.15545.066286 1.688736.18781.533285.121524 1.02213.320381 1.455423.60762.433294.276191.788817.640764 1.07768 1.08267.288863.441905.466624.98324.544395 1.612955h-2.621984c-.122211-.596572-.388854-1.005335-.822148-1.204193-.433294-.209905-.933248-.309334-1.488753-.309334-.177762 0-.388854.011048-.633276.04419-.244422.033144-.466624.088382-.688826.165715-.211092.077334-.388854.198858-.544395.353525-.144432.154667-.222203.353525-.222203.60762 0 .309335.111101.552383.322193.740193.211092.18781.488845.342477.833258.475048.344413.121524.733267.232 1.177671.320382.444404.088381.899918.18781 1.366542.287239.455515.099429.899919.232 1.344323.37562.444404.14362.833257.342477 1.17767.596573.344414.254095.622166.56343.833258.93905.211092.37562.322193.850668.322193 1.40305 0 .673906-.155541 1.237336-.466624 1.712385-.311083.464001-.711047.850669-1.199891 1.137907-.488845.28724-1.04435.508192-1.644295.640764-.599946.132572-1.199891.198857-1.788727.198857-.722156 0-1.388762-.077333-1.999818-.243048-.611056-.165714-1.14434-.408763-1.588745-.729144-.444404-.33143-.799927-.740192-1.05546-1.226289-.255532-.486096-.388853-1.071621-.411073-1.745528h2.533103v-.022095zm8.288135-7.700208h1.899828v-3.402675h2.510883v3.402675h2.26646v1.867052h-2.26646v6.054109c0 .265143.01111.486096.03333.684954.02222.18781.07777.353524.155542.486096.07777.132572.199981.232.366633.298287.166651.066285.377743.099428.666606.099428.177762 0 .355523 0 .533285-.011047.177762-.011048.355523-.033143.533285-.077334v1.933338c-.277753.033143-.555505.055238-.811038.088381-.266642.033143-.533285.04419-.811037.04419-.666606 0-1.199891-.066285-1.599855-.18781-.399963-.121523-.722156-.309333-.944358-.552381-.233313-.243049-.377744-.541335-.466625-.905907-.07777-.364573-.13332-.784383-.144431-1.248384v-6.683825h-1.899827v-1.889147h-.02222zm8.454788 0h2.377562V16.9253h.04444c.355523-.662858.844368-1.12686 1.477644-1.414098.633276-.287239 1.310992-.430858 2.055369-.430858.899918 0 1.677625.154667 2.344231.475048.666606.309335 1.222111.740193 1.666515 1.292575.444405.552382.766597 1.193145.9888 1.92229.222202.729145.333303 1.513527.333303 2.3421 0 .762288-.099991 1.50248-.299973 2.20953-.199982.718096-.499955 1.347812-.899918 1.900194-.399964.552383-.911029.98324-1.533194 1.31467-.622166.33143-1.344323.497144-2.18869.497144-.366634 0-.733267-.033143-1.0999-.099429-.366634-.066286-.722157-.176762-1.05546-.320381-.333303-.14362-.655496-.33143-.933249-.56343-.288863-.232-.522175-.497144-.722157-.79543h-.04444v5.656393h-2.510883V15.38968zm8.77698 5.67849c0-.508193-.06666-1.005337-.199981-1.491433-.133321-.486096-.333303-.905907-.599946-1.281527-.266642-.37562-.599945-.673906-.988799-.894859-.399963-.220953-.855478-.342477-1.366542-.342477-1.05546 0-1.855387.364572-2.388672 1.093717-.533285.729144-.799928 1.701337-.799928 2.916578 0 .574478.066661 1.104764.211092 1.59086.144432.486097.344414.905908.633276 1.259432.277753.353525.611056.629716.99991.828574.388853.209905.844367.309334 1.355432.309334.577725 0 1.05546-.121524 1.455423-.353525.399964-.232.722157-.541335.97769-.905907.255531-.37562.444403-.79543.555504-1.270479.099991-.475049.155542-.961145.155542-1.458289zm4.432931-9.99812h2.510883v2.364197h-2.510883V11.07005zm0 4.31963h2.510883v11.334883h-2.510883V15.389679zm4.755124-4.31963h2.510883v15.654513h-2.510883V11.07005zm10.210184 15.963847c-.911029 0-1.722066-.154667-2.433113-.452953-.711046-.298287-1.310992-.718097-1.810946-1.237337-.488845-.530287-.866588-1.160002-1.12212-1.889147-.255533-.729144-.388854-1.535622-.388854-2.408386 0-.861716.133321-1.657147.388853-2.386291.255533-.729145.633276-1.35886 1.12212-1.889148.488845-.530287 1.0999-.93905 1.810947-1.237336.711047-.298286 1.522084-.452953 2.433113-.452953.911028 0 1.722066.154667 2.433112.452953.711047.298287 1.310992.718097 1.810947 1.237336.488844.530287.866588 1.160003 1.12212 1.889148.255532.729144.388854 1.524575.388854 2.38629 0 .872765-.133322 1.679243-.388854 2.408387-.255532.729145-.633276 1.35886-1.12212 1.889147-.488845.530287-1.0999.93905-1.810947 1.237337-.711046.298286-1.522084.452953-2.433112.452953zm0-1.977528c.555505 0 1.04435-.121524 1.455423-.353525.411074-.232.744377-.541335 1.01102-.916954.266642-.37562.455513-.806478.588835-1.281527.12221-.475049.188872-.961145.188872-1.45829 0-.486096-.066661-.961144-.188872-1.44724-.122211-.486097-.322193-.905907-.588836-1.281527-.266642-.37562-.599945-.673907-1.011019-.905907-.411074-.232-.899918-.353525-1.455423-.353525-.555505 0-1.04435.121524-1.455424.353525-.411073.232-.744376.541334-1.011019.905907-.266642.37562-.455514.79543-.588835 1.281526-.122211.486097-.188872.961145-.188872 1.447242 0 .497144.06666.98324.188872 1.458289.12221.475049.322193.905907.588835 1.281527.266643.37562.599946.684954 1.01102.916954.411073.243048.899918.353525 1.455423.353525zm6.4883-9.66669h1.899827v-3.402674h2.510883v3.402675h2.26646v1.867052h-2.26646v6.054109c0 .265143.01111.486096.03333.684954.02222.18781.07777.353524.155541.486096.077771.132572.199982.232.366634.298287.166651.066285.377743.099428.666606.099428.177762 0 .355523 0 .533285-.011047.177762-.011048.355523-.033143.533285-.077334v1.933338c-.277753.033143-.555505.055238-.811038.088381-.266642.033143-.533285.04419-.811037.04419-.666606 0-1.199891-.066285-1.599855-.18781-.399963-.121523-.722156-.309333-.944358-.552381-.233313-.243049-.377744-.541335-.466625-.905907-.07777-.364573-.133321-.784383-.144431-1.248384v-6.683825h-1.899827v-1.889147h-.02222z"
                fill="#191919"
              />
              <path
                fill="#00B67A"
                d="M30.141707 11.07005H18.63164L15.076408.177071l-3.566342 10.892977L0 11.059002l9.321376 6.739063-3.566343 10.88193 9.321375-6.728016 9.310266 6.728016-3.555233-10.88193 9.310266-6.728016z"
              />
              <path
                fill="#005128"
                d="M21.631369 20.26169l-.799928-2.463625-5.755033 4.153914z"
              />
            </svg>
          </span>
        </a>
      </div>

      {/* Right Section - Carousel */}
      <div className="hidden md:block sm:float-left sm:w-[calc(100%-200px)] mt-5 sm:mt-0 overflow-hidden px-10 relative">
        <NavigationButton
          direction="left"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        />

        <NavigationButton
          direction="right"
          onClick={handleNext}
          disabled={currentIndex >= maxIndex}
        />

        <div className="overflow-hidden relative">
          <div
            ref={carouselRef}
            className="h-full py-2 relative whitespace-nowrap transition-transform duration-300 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * (cardWidth + 16)}px)`,
            }}
          >
            {reviews.map((review, key) => (
              <ReviewCard key={key} review={review} />
            ))}
          </div>
        </div>

        <div
          className="text-[13px] font-light text-[#191919] leading-4 pl-5 mt-2"
          aria-hidden="true"
        >
          Showing our latest reviews
        </div>
      </div>
      <div className="clear-both"></div>
    </div>
  );
};

export default TrustpilotWidget;
