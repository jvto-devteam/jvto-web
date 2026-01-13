"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";
import Link from "next/link";

export const reviews = [
  {
    id: "695a253c9aedd5ee816d03ff",
    platform: "Trustpilot",
    author: "Jiang Tianjian",
    rating: 5,
    date: "2026-01-04",
    title: "Fantastic trip",
    content:
      "The tour guides were extremely friendly and accommodating. One of our friends was injured and they helped him as well. Overall, fantastic planning from the team!",
    url: "https://www.trustpilot.com/reviews/695a253c9aedd5ee816d03ff",
    staff_mentions: [],
  },
  {
    id: "65a8bc6504960ff06cf62132",
    platform: "Trustpilot",
    author: "John Joyce",
    rating: 5,
    date: "2025-12-30",
    title: "What an unbelievable experience",
    content:
      "What an unbelievable experience I don't think there is a better tour guide anywhere than Anjas the personal touch he provides and the knowledge he as over everywhere we went will put this company head and shoulders above the rest. One experience we are never going to forget 😁😘",
    url: "https://www.trustpilot.com/reviews/65a8bc6504960ff06cf62132",
    staff_mentions: ["Anjas"],
  },
  {
    id: "6683a76c67279bb28f2e4cf6",
    platform: "Trustpilot",
    author: "Sisca",
    rating: 5,
    date: "2025-12-27",
    title: "Professional and Knowledgable Guides",
    content:
      "JVTO takes pride in assuring their customers by giving them prompt prior information and were quick to answer any questions we had. The driver Yandi and guide Boy, who were assigned to us, were great. We had a wonderful time at Ijen today, were blessed with good weather, and Boy took wonderful photos for us and took us to the scenic spots. Both of them were helpful and kind through the whole tour.",
    url: "https://www.trustpilot.com/reviews/6683a76c67279bb28f2e4cf6",
    staff_mentions: ["Yandi", "Boy"],
  },
  {
    id: "66b8aa2fee6c99d4ad8b3ed8",
    platform: "Trustpilot",
    author: "Geoffrey",
    rating: 5,
    date: "2025-12-02",
    title: "Great tour",
    content:
      "Rendi and Fredi were great tour hosts .all your needs were taken care of throughout the tour . All the days were fully explained in advance what to expect and when to be ready",
    url: "https://www.trustpilot.com/reviews/66b8aa2fee6c99d4ad8b3ed8",
    staff_mentions: ["Rendi", "Fredi"],
  },
  {
    id: "66b8ab579abb0a6afbb8aecd",
    platform: "Trustpilot",
    author: "Jason Li",
    rating: 5,
    date: "2025-10-18",
    title: "Ahboy was a phenomenal Ijen guide from start to end.",
    content:
      "Ahboy was a phenomenal Ijen guide from start to end. Not only was he incredibly knowledgeable and went out of his way to make sure everything we needed was sorted out (safety, logistics, equipment), he also made sure to build a strong bond with each one of us. Above all, an amazing and fun person to be around and we're glad he was able to show Ijen to us!",
    url: "https://www.trustpilot.com/reviews/66b8ab579abb0a6afbb8aecd",
    staff_mentions: ["Ahboy"],
  },
  {
    id: "66b8ac377f8008b575d160bb",
    platform: "Trustpilot",
    author: "ella ryan",
    rating: 5,
    date: "2025-10-18",
    title: "Visiting Mount Ijen",
    content:
      "Visiting Mount Ijen was such a beautiful experience. We had a great time with our guide Ahboy he was so fun and helpful!",
    url: "https://www.trustpilot.com/reviews/66b8ac377f8008b575d160bb",
    staff_mentions: ["Ahboy"],
  },
  {
    id: "66b8af0504096a5eec4a1f71",
    platform: "Trustpilot",
    author: "Nina nguyen",
    rating: 5,
    date: "2025-10-12",
    title: "I recently joined a tour to East Java...",
    content:
      "I recently joined a tour to East Java with JVTO, and it was absolutely incredible! Our guide, Gufron, and driver, Holili, made the entire trip so comfortable and safe. Gufron was so knowledgeable, friendly, and attentive. He made sure we are safe during the hike and help taking many pictures for us. He also chooses good spots for photos 🤣. Thanks to both of them, we got to see the best of East Java — from sunrise at Mount Bromo to the blue fire of Ijen — all perfectly organized and stress-free. However, keep in mind, ljen can be dangerous when going down to see the blue fire, requiring hiker to be good in shape. It's sad when we went back to Bali and couldn't find good tour guide like them.",
    url: "https://www.trustpilot.com/reviews/66b8af0504096a5eec4a1f71",
    staff_mentions: ["Gufron", "Holili"],
  },
  {
    id: "66b8aff642a78e48bdfcf9b1",
    platform: "Trustpilot",
    author: "Karthika TS",
    rating: 4,
    date: "2025-10-10",
    title: "Being a solo traveler it was safe and...",
    content:
      "Being a solo traveler it was safe and stress free experience with JVTO. The staffs were on time and friendly. Loved the hotels and food recommendations got from the guides. Thank you for the patience and support for the treks!",
    url: "https://www.trustpilot.com/reviews/66b8aff642a78e48bdfcf9b1",
    staff_mentions: [],
  },
  {
    id: "66b8c17f61907569fcb5a7fe",
    platform: "Trustpilot",
    author: "Tobias W.",
    rating: 5,
    date: "2025-09-17",
    title: "Perfect trip",
    content:
      "We can only praise the JVTO team, and above all our guide Rendi and our driver Joyo, in the highest terms. We came across JVTO by chance, and looking back, we are incredibly grateful for the great experience and unforgettable memories. From pick-up to support/accompaniment and communication to the spectacular unsolicited photo sessions followed by photo uploads, everything was perfect. We were always kept fully informed about the itinerary, the accommodations we chose were great, and we were always helped with ideas and transportation services when it came to meals. We wish the JVTO team all the best!",
    url: "https://www.trustpilot.com/reviews/66b8c17f61907569fcb5a7fe",
    staff_mentions: ["Rendi", "Joyo"],
  },
  {
    id: "66b8c5ec17dea7f42c82e310",
    platform: "Trustpilot",
    author: "Divya_ Stri",
    rating: 5,
    date: "2025-09-15",
    title: "Ijen and Bromo tour",
    content:
      "Our driver Yandi was really reliable and friendly. He briefed us on what to expect for the day and was really helpful throughout our trip. Our guide for Mount Ijen was Gufron and he was really encouraging throughout the hike and helpful. He guided us well and was really friendly too. would recommend this tour to family and friends in the future!",
    url: "https://www.trustpilot.com/reviews/66b8c5ec17dea7f42c82e310",
    staff_mentions: ["Yandi", "Gufron"],
  },
  {
    id: "681110b6d382710bfb4c327e",
    platform: "Trustpilot",
    author: "Megane",
    rating: 5,
    date: "2025-08-20",
    title: "On a vécu une superbe expérience avec...",
    content:
      "On a vécu une superbe expérience avec Oboy qui nous a guidé tout le long du voyage. L'expérience était vraiment top! Je recommande Oboy, qui a vraiment été au petit soin pour nous.",
    url: "https://www.trustpilot.com/reviews/681110b6d382710bfb4c327e",
    staff_mentions: ["Oboy"],
  },
  {
    id: "68230809884c9a6bb75d54ec",
    platform: "Trustpilot",
    author: "Olivia McGhie",
    rating: 5,
    date: "2025-08-16",
    title: "East Java Tour Bali>Surabaya 4D2N",
    content:
      "Our driver Goyo and Guide Ehboy were fantastic! We had such an incredible experience on the tour around East Java. Goyo was an expert driver, whilst Ehboy's guidance and knowledge of the areas was informative and reassuring. Would definitely recommend to anyone thinking of booking. We loved our time on this trip!",
    url: "https://www.trustpilot.com/reviews/68230809884c9a6bb75d54ec",
    staff_mentions: ["Goyo", "Ehboy"],
  },
  {
    id: "6833039ee699d6d856f3bdce",
    platform: "Trustpilot",
    author: "Luke Chatwin",
    rating: 5,
    date: "2025-08-16",
    title: "East Java Tour Bali to Surabaya 4D3N",
    content:
      "Guide Ehboy and driver Goyo were great! Had an amazing tour and enjoyed each bit of it. Would definitely recommend for anyone considering a trip to the highlights of East Java.",
    url: "https://www.trustpilot.com/reviews/6833039ee699d6d856f3bdce",
    staff_mentions: ["Ehboy", "Goyo"],
  },
  {
    id: "683a9b005ab4d58d23dca253",
    platform: "Trustpilot",
    author: "Wing Shan Lui",
    rating: 5,
    date: "2025-08-03",
    title: "The 4D3N volcano trip is really worth going!!",
    content:
      "We joined the tour from 31/7 to 3/8. We have had a great trip with our driver, Dika, he was being very helpful and caring, sharing things about Indonesia with us, taking us to different local and good restaurants, and also taking good care of us. He also provided flexibility for us to decide our schedules, I highly appreciate his professionalism!! Besides, for the Ijen tour, our guide, Rendi, also helped us a lot, he kept asking about our condition when we went up the mountain so that we were able to rest at any time. When we went down the steep crater, he held our hands to prevent us from falling. I like his energy that makes our journey so happy and memorable!",
    url: "https://www.trustpilot.com/reviews/683a9b005ab4d58d23dca253",
    staff_mentions: ["Dika", "Rendi"],
  },
  {
    id: "6840069123b9159ddb95605d",
    platform: "Trustpilot",
    author: "Siobhan",
    rating: 5,
    date: "2025-07-26",
    title: "Ijen and Bromo tour",
    content:
      "We had such an amazing experience doing Ijen, Mount Bromo and the waterfall. It truly was a once in a lifetime experience. Our driver Johan went above and beyond to help us, he was always in such a happy, positive mood even with the early starts and it really added to the experience. We loved the music he played and couldn't help but sing along with him to the songs! He was so helpful and a true expert getting us everywhere nice and early and showing us where to go for the best sunrise during Bromo. My husband actually forgot to bring trousers and Johan was quick to let him borrow his and he also gave me his extra jacket at one point to stay warm. I cannot fully express my gratitude for everything Johan did. He is a true asset to your company! I hope one day we can do another tour with him.",
    url: "https://www.trustpilot.com/reviews/6840069123b9159ddb95605d",
    staff_mentions: ["Johan"],
  },
  {
    id: "6857c2bef34bcf699479ec09",
    platform: "Trustpilot",
    author: "Iain Maclean",
    rating: 5,
    date: "2025-07-25",
    title: "My wife and I did the Java Volcano tour...",
    content:
      "My wife and I did the Java Volcano tour visiting Ijen with Eboy as our guide. We can't speak highly enough of him he is an excellent guide. From start to finish he made sure we were safe, having fun and told us many interesting facts about Ijen. He was truly fantastic and our experience would not have been the same without him. Would highly recommend to all!",
    url: "https://www.trustpilot.com/reviews/6857c2bef34bcf699479ec09",
    staff_mentions: ["Eboy"],
  },
  {
    id: "68764f7619c244744882ea09",
    platform: "Trustpilot",
    author: "Alicia",
    rating: 5,
    date: "2025-07-25",
    title: "Thank You JVTO for an Amazing Trip 🌄📸",
    content:
      "We really loved and were very satisfied with this trip. Throughout the journey, we were well taken care of by Yandi and Kiki, who gave us many helpful suggestions for our itinerary. At Madakaripura, our guide Alim helped us take lots of great photos and videos, which made us really happy. Although the weather at Mount Ijen wasn't ideal, the views at Bromo were absolutely stunning, and the waterfall was also incredibly impressive. We're truly grateful to JVTO for arranging and preparing this trip for us. It was a wonderful and fun experience, and one we'll remember for a long time.",
    url: "https://www.trustpilot.com/reviews/68764f7619c244744882ea09",
    staff_mentions: ["Yandi", "Kiki", "Alim"],
  },
  {
    id: "68825a454ef3b15a03fc3a47",
    platform: "Trustpilot",
    author: "Dani Ernst",
    rating: 4,
    date: "2025-07-15",
    title: "We did the Java Tour with our guide...",
    content:
      "We did the Java Tour with our guide Fredy. He was soo friendly and helpful! He made the trip very easy for us. Thank you so much, Fredy! Maybe it would be good to know that the tours are very heavy and also dangerours, for example the climb down Ijen to the blue fire..",
    url: "https://www.trustpilot.com/reviews/68825a454ef3b15a03fc3a47",
    staff_mentions: ["Fredy"],
  },
  {
    id: "6882d3d2cb01c6335e87baeb",
    platform: "Trustpilot",
    author: "Rai Y",
    rating: 4,
    date: "2025-06-22",
    title: "3D2N Ijen, Bromo and Madakapuri Waterfall",
    content:
      "Hello. I would like to give my review for the trip! Overall we are very happy with the service given by the local guide! Freddy our guide and driver was excellent in taking care of us and meeting our needs. He is also fun to talk to, and helped us to take nice photos too. Towards the end, we felt really sad to say goodbye 🥲 Boi, our local guide over at Ijen was amazing. He briefed us on Ijen and throughout the tough difficult trail, he guided us and make sure we are ok. We felt safe with him and we are so so glad he was very patient with us. He is also funny too 😆 Overall the trip was amazing, we loved it. The only feedback we have were the accomodation For the first accommodation, Baratha Hotel, the walls were very thin and the room was too dark. When we were trying to get some rest, the guests next room were making too much noise that we can't get enough sleep for the Ijen hike 😣 And then when we went to the second accommodation, Joglo Kecombrang, it was not well lit and the walls were too thin. There was a nearby neighbour who was playing loud music and because we were very tired from Ijen, we can't sleep for Bromo. Worst of all, the water heater was not working so I didn't shower for that night, making me very cranky and agitated because of the lack of sleep and no water heater. Other than that, the trip, the guides and experience was amazing. Definitely recommended (but with a change in accommodation)",
    url: "https://www.trustpilot.com/reviews/6882d3d2cb01c6335e87baeb",
    staff_mentions: ["Freddy", "Boi"],
  },
  {
    id: "6884abe81a07648212569608",
    platform: "Trustpilot",
    author: "Nash Ville",
    rating: 5,
    date: "2025-06-04",
    title: "we booked 4d3n ijen-tumpak sewu- bromo- ...",
    content:
      "we booked 4d3n ijen-tumpak sewu- bromo- it was arranged smoothly from the airport till bck to hotel on the last day- the teams are very professional, efficient and friendly. many thanks to rendi our guide - and joyo the driver for making our trip memorable-enjoyed every adventures and moments in surabaya. tqvm",
    url: "https://www.trustpilot.com/reviews/6884abe81a07648212569608",
    staff_mentions: ["Rendi", "Joyo"],
  },
  {
    id: "688f726868ecc5feb10a8fa3",
    platform: "Trustpilot",
    author: "Eileen Chua",
    rating: 5,
    date: "2025-05-31",
    title: "The overall experience was great",
    content:
      "The overall experience was great. Guide Ahboy is efficient and takes the extra miles to ensure the tour goes smoothly and ample time is provided for each attraction. Driver Joy is very experienced and ensures the car safety of the passengers. 100 would recommend!",
    url: "https://www.trustpilot.com/reviews/688f726868ecc5feb10a8fa3",
    staff_mentions: ["Ahboy", "Joy"],
  },
  {
    id: "68a00d2a3591c7c75b8ca839",
    platform: "Trustpilot",
    author: "Gokul Adapa",
    rating: 5,
    date: "2025-05-25",
    title: "Best Experience with JVTO",
    content:
      "Thanks JVTO we had a best experience with Mount Bromo,Ijen,Mandakaripura waterfalls. Thanks to Toufic Guide for being friendly and helpful.",
    url: "https://www.trustpilot.com/reviews/68a00d2a3591c7c75b8ca839",
    staff_mentions: ["Toufic"],
  },
  {
    id: "68a00d8837e6f7e230ce5c98",
    platform: "Trustpilot",
    author: "Basia DM",
    rating: 5,
    date: "2025-05-13",
    title: "East Java - Great experiance",
    content:
      "Great experiance! Thank you JVTO, and thank you Gufron! Best guide! East Java is wonderfull and the experiance - unforgetable!",
    url: "https://www.trustpilot.com/reviews/68a00d8837e6f7e230ce5c98",
    staff_mentions: ["Gufron"],
  },
  {
    id: "68a57463cc9f0897c2fb5149",
    platform: "Trustpilot",
    author: "Noelia Carrasco",
    rating: 5,
    date: "2025-04-30",
    title: "Great experience, higly recommended!",
    content:
      "We did 4D3N from Bali to Surabaya visiting Mount Ijen, Bromo, Tumpak Sewu and Madakaripura Waterfall and we cannot be so grateful! Everything went perfect, and our driver Yandi help us with everything! The local guides were also amazing! And the hotels perfect!",
    url: "https://www.trustpilot.com/reviews/68a57463cc9f0897c2fb5149",
    staff_mentions: ["local guides", "Yandi"],
  },
  {
    id: "68c777ed4e24dcb6b907258c",
    platform: "Trustpilot",
    author: "Yandi Junaidi",
    rating: 5,
    date: "2024-08-11",
    title: "Trip 4D3N Ijen-Bromo-Tumpak sewu",
    content:
      "Hi!! I'm veri happy with java volcano service. about the guide and the driver. they're very professional and had very well service for us thank you for unforgettable experience",
    url: "https://www.trustpilot.com/reviews/68c777ed4e24dcb6b907258c",
    staff_mentions: ["guide", "driver"],
  },
  {
    id: "68ca3538165229b8147b53af",
    platform: "Trustpilot",
    author: "Alfi Layalin",
    rating: 5,
    date: "2024-08-11",
    title: "Bromo - Tumpak sewu",
    content:
      "Spending my 3 days in Indonesia It was so amazing, all they offered to visit the natural places was so stunning. Highly recommend you to book this tour..",
    url: "https://www.trustpilot.com/reviews/68ca3538165229b8147b53af",
    staff_mentions: [],
  },
  {
    id: "68e88dc1cc246a2f8568d916",
    platform: "Trustpilot",
    author: "Ghufrano Septyan",
    rating: 5,
    date: "2024-08-11",
    title: "Best 3D 2N Trip",
    content:
      "Had an amazing 3D 2N trip, thanks to Java Volcano Tour Operator who make our trip well-organized. Everything was taken care of, both the Tour Guide and The Customer Service are fast solving our problem while on travel 👍. The bromo part really worth to visit again.",
    url: "https://www.trustpilot.com/reviews/68e88dc1cc246a2f8568d916",
    staff_mentions: ["Tour Guide"],
  },
  {
    id: "68eb9bb3aaf3d528d97fcfb7",
    platform: "Trustpilot",
    author: "Gean Delipta",
    rating: 5,
    date: "2024-08-11",
    title: "Perfect itenerary",
    content:
      "We booked for 3days 2 nightijen and bromoIt was a great and adventurous trip for both if us. Thanks Guys and team who guided us throughout the trip. They also sent us back to our destinated hotel safely at the forth day. Recomended this travel agency in Surabaya Big Thanks to java volcano tour operator",
    url: "https://www.trustpilot.com/reviews/68eb9bb3aaf3d528d97fcfb7",
    staff_mentions: ["team"],
  },
  {
    id: "68f2e7621dc7ff8281797e3d",
    platform: "Trustpilot",
    author: "Anjas Setyawan",
    rating: 5,
    date: "2024-08-11",
    title: "Best Travel Agent",
    content:
      "I hadn't used a tour company for many years, and this time I was pleasantly surprised by the excellent service! Compared to the tours I joined with my family when I was younger, this experience was much better overall. highly recommend this travel agent",
    url: "https://www.trustpilot.com/reviews/68f2e7621dc7ff8281797e3d",
    staff_mentions: [],
  },
  {
    id: "68f33075f3905283fc849cc8",
    platform: "Trustpilot",
    author: "Rendi Rivaldi",
    rating: 5,
    date: "2024-08-11",
    title: "Thanks for java volcano",
    content:
      "we had great experience during our trip 3D2N especially sunrise at the bromo and thanks for the professional guide can take unforgettable memory for us",
    url: "https://www.trustpilot.com/reviews/68f33075f3905283fc849cc8",
    staff_mentions: ["professional guide"],
  },
  {
    id: "692e9b276ce47e5c83ed1ecd",
    platform: "Trustpilot",
    author: "Ahmad lutfi Haqi",
    rating: 5,
    date: "2024-08-11",
    title: "Kudos to Java Volcano.",
    content:
      "Kudos to Java Volcano. Literally gave us such an unforgettable experience 3D2N for Bromo-Ijen. All experience crews that accompany us literally helps us documentating such a wonderful momeries till we out of storage. Do visit, everyone!",
    url: "https://www.trustpilot.com/reviews/692e9b276ce47e5c83ed1ecd",
    staff_mentions: ["experience crews"],
  },
  {
    id: "694f2b7b6b98b5e928cbbabe",
    platform: "Trustpilot",
    author: "sa'ad ramadhan",
    rating: 5,
    date: "2024-07-02",
    title: "Fantastic Tour with Java Volcano Tour Operator",
    content:
      "My trip to Kawah Ijen with Java Volcano Tour Operator was amazing. From booking to the tour itself, everything was handled with professionalism. Our guide was knowledgeable, the experience was safe and well-organized, and witnessing the blue flames and sunrise was unforgettable. I highly recommend Java Volcano Tour Operator for anyone seeking an incredible adventure in Indonesia.",
    url: "https://www.trustpilot.com/reviews/694f2b7b6b98b5e928cbbabe",
    staff_mentions: ["guide"],
  },
  {
    id: "69538f76dead3f5394830f65",
    platform: "Trustpilot",
    author: "Angga Riski Ariwardana",
    rating: 5,
    date: "2024-01-18",
    title: "East Java tour (Bromo Volcano, Tumpak Sewu Waterfall, Ijen Crater)",
    content:
      "My wife and I had an unforgettable and spectacular honeymoon when we did the East Java tour with this company. The well-experienced driver drove as very safely and carefully. The kind-hearted guide also looked after us very well and gave us really satisfied answers when we asked him about anything during the tour. Both of them were punctual and did a great job. The car was also so comfortable. We would love to recommend this company to our friends and relatives. Thank you very much!",
    url: "https://www.trustpilot.com/reviews/69538f76dead3f5394830f65",
    staff_mentions: ["driver", "guide"],
  },
  {
    id: "65a565578081754b08e1057d",
    platform: "Trustpilot",
    author: "Fikaa",
    rating: 5,
    date: "2024-01-16",
    title: "Surabaya - Bali",
    content:
      "I had a really fantastic tour for 3 days going to Indonesia. and they had taken me to exciting places. I'd like to ge there with them next time again. Thank to Java volcano",
    url: "https://www.trustpilot.com/reviews/65a565578081754b08e1057d",
    staff_mentions: [],
  },
];

const TrustpilotStar = ({ color = "white" }: { color?: string }) => (
  <svg className="w-full h-full" viewBox="0 0 24 24" fill={color}>
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>
  </svg>
);

const TrustpilotLogo = () => (
  <svg className="w-8 h-8 text-[#00b67a] fill-current" viewBox="0 0 24 24">
    <path d="M12 1L9 9H1L7 14L5 23L12 18L19 23L17 14L23 9H15L12 1Z"></path>
  </svg>
);

const VerifiedIcon = () => (
  <svg className="w-4 h-4 text-gray-500 fill-current" viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </svg>
);

const ReviewCard = ({ review }: { review: (typeof reviews)[0] }) => {
  const rating = Math.floor(review.rating);
  return (
    <Link
      href={review.url || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="snap-start shrink-0 w-full sm:w-[320px] bg-card flex flex-col"
    >
      <div className="flex items-center gap-1 mb-2">
        <div className="flex p-1 gap-0.5">
          {[...Array(5)].map((_, i) => {
            const starColor = i < rating ? "white" : "#dcdce6";
            let bg = "#ff8622"
            if(rating == 5){
              bg = "#00b67a"
            }
            else if(rating == 4){
              bg = "#73cf11"
            }
            else if(rating == 3){
              bg = "#ffce00"
            }

            return (
              <div
                key={i}
                className={`w-4 h-4 ${
                  i < rating ? `bg-[${bg}]` : "bg-[#f4f4f5]"
                } flex items-center justify-center`}
              >
                <TrustpilotStar color={starColor} />
              </div>
            );
          })}
        </div>
        <div className="flex items-center text-xs text-[#f4f4f5]-foreground ml-2 gap-1">
          <VerifiedIcon />
          Verified
        </div>
      </div>
      <h3 className="font-bold text-foreground mb-2 line-clamp-1 uppercase">
        {review.title}
      </h3>
      <p className="text-[#f4f4f5]-foreground text-sm mb-4 line-clamp-3 leading-relaxed">
        {review.content}
      </p>
      <div className="mt-auto text-xs text-[#f4f4f5]-foreground">
        <span className="font-semibold text-foreground">{review.author}</span>,{" "}
        {new Date(review.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </div>
    </Link>
  );
};

export default function TrustpilotReviews() {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -340 : 340;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const recentReviews = [...reviews]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);
  const overallRating = 4.8;
  const fullStars = Math.floor(overallRating);
  const hasHalfStar = overallRating % 1 !== 0;

  return (
    <div className="bg-background py-12 md:py-20">
      <div className="container mx-auto bg-card rounded-xl shadow-card p-6 md:p-8 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
        <div className="flex flex-col items-center lg:items-start space-y-4 border-b lg:border-b-0 border-border pb-6 lg:pb-0 lg:pr-6">
          <h2 className="text-3xl font-bold text-foreground">Excellent</h2>
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => {
              if (i < fullStars) {
                return (
                  <div
                    key={i}
                    className="w-8 h-8 bg-[#00b874] flex items-center justify-center"
                  >
                    <TrustpilotStar />
                  </div>
                );
              }
              if (i === fullStars && hasHalfStar) {
                return (
                  <div
                    key={i}
                    className="w-8 h-8 bg-gradient-to-r from-[#00b874] from-50% to-[#f4f4f5] to-50% flex items-center justify-center"
                  >
                    <TrustpilotStar />
                  </div>
                );
              }
              return (
                <div
                  key={i}
                  className="w-8 h-8 bg-[#f4f4f5] flex items-center justify-center"
                >
                  <TrustpilotStar />
                </div>
              );
            })}
          </div>
          <p className="text-sm text-[#f4f4f5]-foreground">
            Based on
            <a
              className="ml-2 underline decoration-border hover:decoration-[#00b67a] transition-colors font-medium"
              href="#"
            >
              {reviews.length} reviews
            </a>
          </p>
          <div className="flex items-center gap-2 mt-2 w-full">
            <TrustpilotLogo />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-foreground tracking-tight">
                Trustpilot
              </span>
            </div>
          </div>
        </div>
        <div className="relative min-w-0">
          <div className="relative flex items-center min-w-0">
            <button
              onClick={() => scroll("left")}
              className="hidden md:flex absolute -left-5 transform translate-x-[-100%] z-10 w-7 h-7 bg-card rounded-full shadow-md items-center justify-center border border-border text-[#f4f4f5]-foreground hover:bg-accent transition-colors disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto gap-6 pb-4 md:pb-0 px-2 no-scrollbar w-full snap-x snap-mandatory"
            >
              {recentReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>

            <button
              onClick={() => scroll("right")}
              className="hidden md:flex absolute -right-5 transform translate-x-[100%] z-10 w-7 h-7 bg-card rounded-full shadow-md items-center justify-center border border-border text-foreground hover:bg-accent transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <p className="mt-5 text-xs text-[#f4f4f5]-foreground">
            Showing our latest reviews
          </p>

        </div>
      </div>
    </div>
  );
}
