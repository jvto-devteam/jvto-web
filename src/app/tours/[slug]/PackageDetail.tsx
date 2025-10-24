'use client'
import React, { useState } from 'react';
import { 
  Star, 
  Check, 
  X, 
  ChevronDown, 
  ChevronUp,
  CreditCard,
  Award,
  Users,
  ShieldCheck,
  ArrowRight,
  Wifi,
  UtensilsCrossed,
  Flame
} from 'lucide-react';

export default function PackageDetail({ pkg }) {
  const [openModal, setOpenModal] = useState(false);
  const [modalImage, setModalImage] = useState('');
  const [openDay, setOpenDay] = useState(1);
  const [openFaq, setOpenFaq] = useState(null);

  // Format price to IDR
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Get lowest price
  const lowestPrice = pkg.package_prices.reduce((min, p) => 
    p.price < min ? p.price : min, pkg.package_prices[0]?.price || 0
  );

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <a className="text-xl font-bold text-blue-600" href="#">
            {pkg.order_channels.name}
          </a>
          <nav className="hidden md:flex items-center space-x-6">
            <a className="text-gray-600 dark:text-gray-400 hover:text-blue-600" href="#">Tours</a>
            <a className="text-gray-600 dark:text-gray-400 hover:text-blue-600" href="#">About Us</a>
            <a className="text-gray-600 dark:text-gray-400 hover:text-blue-600" href="#">Contact</a>
          </nav>
          <div className="flex items-center space-x-4">
            <a className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700" href="#">
              Book Now
            </a>
          </div>
        </header>

        <main>
          {/* Breadcrumb */}
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            <a className="hover:text-blue-600" href="#">Home</a> /
            <a className="hover:text-blue-600" href="#"> Tours</a> /
            <span className="text-gray-900 dark:text-gray-100"> {pkg.name}</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">{pkg.name}</h1>

          {/* Image Gallery */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 h-[450px] mb-8">
            {pkg.package_images.slice(0, 5).map((img, idx) => (
              <div
                key={img.id}
                onClick={() => {
                  setOpenModal(true);
                  setModalImage(img.url);
                }}
                className={`${idx === 0 ? 'col-span-2 row-span-2' : ''} rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity`}
              >
                <img
                  alt={img.alt_text || img.caption}
                  className="w-full h-full object-cover"
                  src={`https://javavolcano-touroperator.com/assets/`+img.url}
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Quick Info Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl text-center">
                  <p className="text-gray-600 dark:text-gray-400">Starting Price</p>
                  <p className="text-2xl font-semibold">{formatPrice(lowestPrice)}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl text-center">
                  <p className="text-gray-600 dark:text-gray-400">Duration</p>
                  <p className="text-2xl font-semibold">{pkg.durations.day} Days</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl text-center">
                  <p className="text-gray-600 dark:text-gray-400">Rating</p>
                  <div className="flex items-center justify-center space-x-1">
                    <p className="text-2xl font-semibold">{pkg.aggregate_rating_value || '4.9'}</p>
                    <Star className="text-yellow-500 fill-yellow-500" size={20} />
                  </div>
                </div>
              </div>

              {/* Overview */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Overview Tours</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{pkg.description}</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex flex-col items-center justify-center">
                    <CreditCard className="text-blue-600 mb-2" size={32} />
                    <span className="text-sm font-medium">Secure Payment</span>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex flex-col items-center justify-center">
                    <Award className="text-blue-600 mb-2" size={32} />
                    <span className="text-sm font-medium">Founder-Led Safety</span>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex flex-col items-center justify-center">
                    <Users className="text-blue-600 mb-2" size={32} />
                    <span className="text-sm font-medium">Verifiable Legitimacy</span>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex flex-col items-center justify-center">
                    <ShieldCheck className="text-blue-600 mb-2" size={32} />
                    <span className="text-sm font-medium">Verified Guides</span>
                  </div>
                </div>
              </div>

              {/* Tour Details */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Tour Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Inclusions */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <Check className="text-green-500 mr-2" size={24} />
                      Inclusions
                    </h3>
                    <ul className="space-y-2">
                      {pkg.package_includes.map((item) => (
                        <li key={item.id} className="flex items-start text-gray-600 dark:text-gray-400">
                          <ArrowRight className="text-blue-600 mr-2 mt-1 flex-shrink-0" size={16} />
                          <span dangerouslySetInnerHTML={{ __html: item.item_includes.item }} />
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Exclusions */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <X className="text-red-500 mr-2" size={24} />
                      Exclusions
                    </h3>
                    <ul className="space-y-2">
                      {pkg.package_excludes.map((item) => (
                        <li key={item.id} className="flex items-start text-gray-600 dark:text-gray-400">
                          <ArrowRight className="text-blue-600 mr-2 mt-1 flex-shrink-0" size={16} />
                          <span dangerouslySetInnerHTML={{ __html: item.item_excludes.item }} />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Itinerary */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Itinerary</h2>
                <div className="space-y-4">
                  {pkg.package_itinerary_days.map((day) => (
                    <div key={day.id} className="bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <button
                        onClick={() => setOpenDay(openDay === day.day_no ? null : day.day_no)}
                        className="w-full text-left p-4 font-semibold flex justify-between items-center cursor-pointer"
                      >
                        Day {day.day_no}: {day.title}
                        {openDay === day.day_no ? (
                          <ChevronUp size={24} />
                        ) : (
                          <ChevronDown size={24} />
                        )}
                      </button>
                      {openDay === day.day_no && (
                        <div className="px-4 pb-4 text-gray-600 dark:text-gray-400">
                          <p className="mb-4">{day.activity}</p>

                          {day.package_itinerary_day_details.length > 0 && (
                            <ul className="space-y-3 border-l-2 border-blue-600 ml-2 pl-6">
                              {day.package_itinerary_day_details
                                .sort((a, b) => a.sort_order - b.sort_order)
                                .map((detail) => (
                                  <li key={detail.id}>
                                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                                      {detail.time}
                                    </p>
                                    <p>{detail.notes}</p>
                                  </li>
                                ))}
                            </ul>
                          )}
                          {day.meal_breakfast || day.meal_lunch || day.meal_dinner ? (
                          <div className="bg-blue-50 dark:bg-gray-700 ml-2 p-4 my-4 border-l-2 border-blue-600">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <p className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center">
                                  <UtensilsCrossed size={18} className="mr-2 text-blue-600" />
                                  Meals Included:
                                </p>
                                <div className="space-y-1">
                                  {day.meal_breakfast && <p>• Breakfast</p>}
                                  {day.meal_lunch && <p>• Lunch</p>}
                                  {day.meal_dinner && <p>• Dinner</p>}
                                  {!day.meal_breakfast && !day.meal_lunch && !day.meal_dinner && (
                                    <p>• No meals included</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          ) : ''}

                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Accommodation */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Accommodation</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Rest and recharge in comfort. We've carefully selected accommodations that offer the best location and amenities.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pkg.package_hotel_options.map((option) => (
                    <div key={option.id} className="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden">
                      <img
                        alt={option.hotels.name}
                        className="w-full h-48 object-cover"
                        src={`https://javavolcano-touroperator.com/assets/img/hotels/`+option.hotels.banner}
                      />
                      <div className="p-6">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Day {option.day_no}</p>
                        <h3 className="text-xl font-semibold my-1">{option.hotels.name}</h3>
                        <div className="flex items-center space-x-1 text-yellow-500 mb-2">
                          {[...Array(4)].map((_, i) => (
                            <Star key={i} size={16} className="fill-yellow-500" />
                          ))}
                          <Star size={16} />
                        </div>
                        <p className="text-sm text-blue-600 mb-3">{option.hotels.address}</p>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          {option.hotels.description || 'Comfortable accommodation with excellent amenities.'}
                        </p>
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center">
                            <Wifi className="text-blue-600 mr-1" size={16} />
                            Wifi
                          </div>
                          <div className="flex items-center">
                            <UtensilsCrossed className="text-blue-600 mr-1" size={16} />
                            Restaurant
                          </div>
                          <div className="flex items-center">
                            <Flame className="text-blue-600 mr-1" size={16} />
                            Hot Water
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-6">Reviews</h2>
                <div className="space-y-6">
                  {/* Review 1 */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          AJ
                        </div>
                        <div>
                          <p className="font-semibold">Alex Johnson</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">March 2024</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={16} className="fill-yellow-500 text-yellow-500" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                      "An unforgettable experience! The views were breathtaking and the guides were incredibly knowledgeable. Everything was seamless from pickup to drop-off. Highly recommend!"
                    </p>
                  </div>

                  {/* Review 2 */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          MG
                        </div>
                        <div>
                          <p className="font-semibold">Maria Garcia</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">February 2024</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {[...Array(4)].map((_, i) => (
                          <Star key={i} size={16} className="fill-yellow-500 text-yellow-500" />
                        ))}
                        <Star size={16} className="text-yellow-500" />
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                      "The Ijen blue fire was magical, and the Bromo sunrise was out of this world. The drivers and guides were fantastic. A must-do trip in East Java."
                    </p>
                  </div>

                  {/* Review 3 */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          DL
                        </div>
                        <div>
                          <p className="font-semibold">David Lee</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">January 2024</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={16} className="fill-yellow-500 text-yellow-500" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                      "Perfect organization, comfortable hotels, and stunning natural beauty. The Madakaripura Waterfall was a hidden gem. Worth every penny!"
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  {[
                    {
                      id: 1,
                      question: "What is the fitness level required?",
                      answer: "This tour requires a moderate fitness level. The Ijen trek involves a 1.5-2 hour hike uphill and steep descent into the crater. Bromo involves shorter walks with optional pony rides. If you can walk for 2-3 hours with breaks, you'll be fine."
                    },
                    {
                      id: 2,
                      question: "What should I pack for the tour?",
                      answer: "Essential items include: warm layers (temperatures can drop to 5°C at night), trekking shoes, waterproof jacket, headlamp/flashlight, sunscreen, personal medications, and a small backpack. We provide gas masks and trekking poles for Ijen."
                    },
                    {
                      id: 3,
                      question: "Is the blue fire at Ijen guaranteed?",
                      answer: "The blue fire phenomenon is natural and depends on weather conditions. It's visible on most clear nights, but can be obscured by rain, fog, or strong winds. We time the trek to maximize your chances of seeing it, typically between 2-4 AM."
                    },
                    {
                      id: 4,
                      question: "Can I join the tour if I have respiratory issues?",
                      answer: "The sulfur fumes at Ijen can be challenging for those with asthma or respiratory conditions. We provide gas masks, but if you have serious respiratory issues, please consult your doctor before booking. The Bromo portion should be fine for most visitors."
                    },
                    {
                      id: 5,
                      question: "What meals are included?",
                      answer: "The tour includes 2 breakfasts and 1 dinner as specified in the itinerary. Lunches and additional meals are at your own expense, giving you flexibility to choose based on your preferences and dietary needs. We can recommend good local restaurants."
                    },
                    {
                      id: 6,
                      question: "Is travel insurance required?",
                      answer: "While not mandatory, we highly recommend travel insurance covering trip interruptions, medical emergencies, and lost luggage. The trekking at altitude involves some risks, and insurance provides peace of mind."
                    }
                  ].map((faq) => (
                    <div key={faq.id} className="bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <button
                        onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                        className="w-full text-left p-4 font-semibold flex justify-between items-center cursor-pointer"
                      >
                        {faq.question}
                        {openFaq === faq.id ? (
                          <ChevronUp size={24} />
                        ) : (
                          <ChevronDown size={24} />
                        )}
                      </button>
                      {openFaq === faq.id && (
                        <div className="px-4 pb-4 text-gray-600 dark:text-gray-400">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing */}
              {/* <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Pricing</h2>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                  <div className="space-y-4">
                    {pkg.package_prices.map((price) => (
                      <div key={price.id} className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3 last:border-0">
                        <div>
                          <p className="font-semibold">{price.price_tiers.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {price.price_tiers.min_pax} {price.price_tiers.max_pax ? `- ${price.price_tiers.max_pax}` : '+'} Persons
                          </p>
                        </div>
                        <p className="text-xl font-bold text-blue-600">{formatPrice(price.price)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div> */}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl text-center">
                  <p className="text-gray-600 dark:text-gray-400">Starting from</p>
                  <p className="text-4xl font-bold my-2">
                    {formatPrice(lowestPrice)}
                    <span className="text-base font-normal text-gray-600 dark:text-gray-400">/person</span>
                  </p>
                  <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                    Book This Tour
                  </button>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-4">
                    Free cancellation up to 48 hours before the tour.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Modal */}
        {openModal && (
          <div
            onClick={() => setOpenModal(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 transition-opacity"
          >
            <div onClick={(e) => e.stopPropagation()} className="relative max-w-4xl max-h-[90vh] mx-4">
              <img src={`https://javavolcano-touroperator.com/assets/`+modalImage} alt="Popup" className="rounded-lg object-contain w-full h-full" />
              <button
                onClick={() => setOpenModal(false)}
                className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70"
              >
                <X size={24} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}