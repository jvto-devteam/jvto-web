'use client'
import React, { useState, FC, useEffect } from 'react';
import { testimonialsData } from '@/data/testimonials';
import JsonLd from '@/components/JsonLd';

interface PackageData {
  id: string;
  package_code: string;
  name: string;
  overview: string;
  departure: string;
  duration: { days: number; nights: number };
  included: string[];
  exclude: string[];
  itinerary: Array<{ id: string; day: number; title: string; details: string }>;
  accommodation: Array<{
    id: string;
    day: number;
    hotel: string;
    description: string;
    short_description: string;
    rating: number | null;
    banner: string[];
  }>;
  galleries: Array<{ id: string; image_url: string; alt_text: string; caption: string }>;
  package_price: Array<{ price_per_person: number; start: number; end: number | null }>;
}

const stripHtml = (html: string) => html.replace(/<[^>]*>?/gm, '');

const SanitizeHTML: FC<{ html: string }> = ({ html }) => (
  <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
);

const TABS = ['Overview', 'Itinerary', 'Accommodation', 'Inclusions', 'Reviews', 'FAQ'];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

// Transform package data structure
const transformPackageData = (pkg: any): PackageData => {
  return {
    id: pkg.id,
    package_code: pkg.code,
    name: pkg.name,
    overview: pkg.description,
    departure: pkg.start_destination?.name || 'N/A',
    duration: {
      days: parseInt(pkg.code.split('-')[0].replace('D', '')) || 3,
      nights: parseInt(pkg.code.split('-')[0].replace('D', '')) - 1 || 2
    },
    included: pkg.package_includes?.map((inc: any) => inc.item_includes.item) || [],
    exclude: pkg.package_excludes?.map((exc: any) => exc.item_excludes.item) || [],
    itinerary: pkg.package_itinerary_days?.map((day: any) => ({
      id: day.id,
      day: day.day_no,
      title: day.title,
      details: day.activity
    })) || [],
    accommodation: pkg.package_hotel_options?.map((hotel: any) => ({
      id: hotel.id,
      day: hotel.day_no,
      hotel: hotel.hotels.name,
      description: hotel.hotels.description || '',
      short_description: hotel.hotels.description || '',
      rating: null,
      banner: hotel.hotels.banner ? [hotel.hotels.banner] : []
    })) || [],
    galleries: pkg.package_images?.map((img: any) => ({
      id: img.id,
      image_url: img.url,
      alt_text: img.alt_text || '',
      caption: img.caption || ''
    })) || [],
    package_price: pkg.package_prices?.map((price: any) => ({
      price_per_person: price.price,
      start: price.price_tiers.min_pax,
      end: price.price_tiers.max_pax
    })) || []
  };
};

const TrustBar: FC = () => (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-y border-gray-200">
    <div className="flex items-start gap-4">
      <span className="material-symbols-outlined text-3xl text-primary mt-1">shield_person</span>
      <div>
        <h4 className="font-bold text-gray-800">Founder-Led Safety</h4>
        <p className="text-sm text-gray-500">Oversight by a Tourist Police Officer.</p>
      </div>
    </div>
    <div className="flex items-start gap-4">
      <span className="material-symbols-outlined text-3xl text-primary mt-1">verified</span>
      <div>
        <h4 className="font-bold text-gray-800">Verifiable Legitimacy</h4>
        <p className="text-sm text-gray-500">Gov't Licensed (TDUP).</p>
      </div>
    </div>
    <div className="flex items-start gap-4">
      <span className="material-symbols-outlined text-3xl text-primary mt-1">receipt_long</span>
      <div>
        <h4 className="font-bold text-gray-800">Financial Clarity</h4>
        <p className="text-sm text-gray-500">All-Inclusive. No Hidden Fees.</p>
      </div>
    </div>
  </div>
);

const JvtoAdvantage: FC = () => (
  <div className="bg-gray-50 p-6 rounded-2xl my-8">
    <div className="flex flex-col md:flex-row items-center gap-6">
      <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=250&auto=format&fit=crop" alt="Founder Mr. Sam" className="w-24 h-24 rounded-full object-cover border-4 border-primary"/>
      <div>
        <h3 className="text-xl font-bold text-gray-900">The JVTO Advantage: Security & Trust</h3>
        <p className="mt-2 text-gray-600">
          Founded by an active-duty Tourist Police officer, JVTO was created to provide a travel experience built on unwavering integrity and safety. We are a government-certified PT, guaranteeing full legal compliance and transparent, all-inclusive pricing.
        </p>
        <a href="#why-jvto" className="text-primary font-semibold mt-2 inline-block">Learn More &rarr;</a>
      </div>
    </div>
  </div>
);

const faqs = [
    { q: "What should I wear for the volcano hikes?", a: "We recommend layering your clothing. It can be very cold before sunrise (close to freezing), but will warm up quickly once the sun is out. A warm jacket, beanie, and gloves are essential. Comfortable hiking shoes are also a must." },
    { q: "Is the trek to Ijen Crater difficult?", a: "The trek is moderately challenging. It involves a 3km uphill hike in the dark. The path is well-defined but can be steep in sections. A good level of fitness is recommended. Our guides will be there to assist you." },
    { q: "Are the tours suitable for children?", a: "Mount Bromo is generally suitable for children who can handle the early start. For Ijen Crater, due to the sulfuric gases and challenging night hike, we do not recommend it for young children or individuals with respiratory issues." },
    { q: "What is included in the price?", a: "Our tours are all-inclusive, covering private transport, accommodation, all entrance fees, a 4WD Jeep for Bromo, trekking gear for Ijen (gas mask, headlamp), and meals as specified in the itinerary. Please see the 'Inclusions' tab for full details." }
];

const FaqItem: FC<{ q: string, a: string }> = ({ q, a }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-left py-4">
        <span className="font-semibold text-gray-800">{q}</span>
        <span className={`material-symbols-outlined transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>expand_more</span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
        <div className="pb-4 text-gray-600">
          {a}
        </div>
      </div>
    </div>
  );
};

const BookingWidget: FC<{ pkg: PackageData }> = ({ pkg }) => {
  const [travelers, setTravelers] = useState(2);
  const [pricePerPerson, setPricePerPerson] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  React.useEffect(() => {
    const validTravelers = Math.max(1, travelers);
    const priceTier = pkg.package_price.find(p => validTravelers >= (p.start ?? 1) && (p.end === null || validTravelers <= p.end)) 
      || pkg.package_price[pkg.package_price.length -1];
    
    if (priceTier) {
      const ppp = priceTier.price_per_person;
      setPricePerPerson(ppp);
      setTotalPrice(ppp * validTravelers);
    }
  }, [travelers, pkg.package_price]);

  return (
    <>
      <div className="flex justify-between items-baseline">
        <p className="text-2xl font-bold text-gray-900">{formatCurrency(pricePerPerson)}</p>
        <span className="text-gray-500 text-sm">/ person</span>
      </div>
      <div className="mt-6 space-y-4">
        <div>
          <label htmlFor="travelers" className="block text-sm font-medium text-gray-700">Travelers</label>
          <input 
            type="number" 
            id="travelers"
            value={travelers}
            onChange={(e) => setTravelers(parseInt(e.target.value, 10) || 1)}
            min="1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
        </div>
      </div>
      <div className="mt-6 border-t pt-4">
        <div className="flex justify-between items-center text-gray-600">
          <span>{formatCurrency(pricePerPerson)} x {travelers} travelers</span>
          <span className="font-bold text-gray-900">{formatCurrency(totalPrice)}</span>
        </div>
      </div>
      <button className="mt-6 w-full bg-primary hover:bg-opacity-90 text-white font-bold py-3 px-6 rounded-full transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
        Book Now
      </button>
      <p className="text-xs text-gray-500 text-center mt-4">Secure checkout &amp; instant confirmation</p>
    </>
  )
}

const PackageDetail: FC<{ pkg: any }> = ({ pkg: rawPkg }) => {
  const pkg = transformPackageData(rawPkg);
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const baseUrl = 'https://javavolcano-touroperator.com';
  const tourUrl = `${baseUrl}/tours/${rawPkg.slug}`;

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % pkg.galleries.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + pkg.galleries.length) % pkg.galleries.length);
  };

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextImage();
      else if (e.key === 'ArrowLeft') prevImage();
      else if (e.key === 'Escape') closeLightbox();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isLightboxOpen, currentImageIndex]);

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': baseUrl },
      { '@type': 'ListItem', 'position': 2, 'name': 'Tours', 'item': `${baseUrl}/#tours` },
      { '@type': 'ListItem', 'position': 3, 'name': pkg.name, 'item': tourUrl },
    ]
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map(faq => ({
      '@type': 'Question',
      'name': faq.q,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.a
      }
    }))
  };
  
  const lowestPrice = pkg.package_price.reduce((min, p) => p.price_per_person < min.price_per_person ? p : min, pkg.package_price[0]);

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': ['Product', 'TouristTrip'],
    'name': pkg.name,
    'description': `Private, safety-led volcano itinerary covering ${pkg.name} with all-inclusive pricing.`,
    'sku': pkg.package_code,
    'image': pkg.galleries.map(g => g.image_url),
    'provider': {
      '@id': 'https://javavolcano-touroperator.com/#travelagency',
    },
    'tripOrigin': pkg.departure,
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': '4.9',
      'reviewCount': '200'
    },
    'offers':{
      '@type':'Offer',
      'price': lowestPrice.price_per_person,
      'priceCurrency':'IDR',
      'availability':'https://schema.org/InStock',
      'url': tourUrl
    },
    'itinerary': pkg.itinerary.map(item => ({
      '@type': 'TouristAttraction',
      'name': `Day ${item.day}: ${item.title}`,
      'description': stripHtml(item.details)
    }))
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Overview':
        return (
          <div>
            <SanitizeHTML html={pkg.overview} />
            <TrustBar />
            <JvtoAdvantage />
          </div>
        );
      case 'Itinerary':
        return (
          <div className="space-y-6 border-l-2 border-primary ml-2 pl-6">
            {pkg.itinerary.map(item => (
              <div key={item.id} className="relative">
                <div className="absolute -left-[34px] top-1 h-4 w-4 bg-primary rounded-full border-4 border-white"></div>
                <p className="font-semibold text-primary">Day {item.day}: {item.title}</p>
                <div className="prose-sm max-w-none text-gray-600 mt-1">
                   <SanitizeHTML html={item.details.replace(/#next-stop#/g, '<br/><br/>')} />
                </div>
              </div>
            ))}
          </div>
        );
      case 'Accommodation':
        return pkg.accommodation && pkg.accommodation.length > 0 ? (
          <div className="space-y-6">
            {pkg.accommodation.map(acc => (
              <div key={acc.id} className="bg-gray-50 rounded-lg shadow-sm overflow-hidden border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3">
                  <div className="md:col-span-1">
                    <img src={acc.banner[0]} alt={acc.hotel} className="w-full h-48 md:h-full object-cover"/>
                  </div>
                  <div className="md:col-span-2 p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-500">Day {acc.day}</p>
                        <h5 className="font-bold text-lg text-gray-800">{acc.hotel}</h5>
                      </div>
                      {acc.rating && (
                         <div className="flex items-center bg-yellow-400 text-white text-sm font-bold px-2 py-1 rounded">
                           <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                           <span>{acc.rating}</span>
                         </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{acc.description || acc.short_description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : <p>Accommodation details are not available for this package.</p>;
      case 'Inclusions':
        return (
          <>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold text-green-700 text-lg mb-4">What's Included</h4>
                <ul className="space-y-2">
                  {pkg.included.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                      <SanitizeHTML html={item} />
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-red-700 text-lg mb-4">What's Not Included</h4>
                <ul className="space-y-2">
                  {pkg.exclude.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                      <SanitizeHTML html={item} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-8 bg-gray-50 p-6 rounded-2xl border">
                <h4 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">workspace_premium</span>
                    Our Charter Promise (Pillar 2)
                </h4>
                <p className="text-gray-600 mb-4">As part of our commitment to Financial Clarity, we provide more than just the basics. The following are standard provisions in our tours, with no extra surcharges:</p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <li className="flex items-start gap-3"><span className="material-symbols-outlined text-green-600 mt-1">gpp_good</span><div><span className="font-semibold">Professional-Grade Safety Gear:</span> We provide quality gas masks & trekking poles for your safety and comfort.</div></li>
                    <li className="flex items-start gap-3"><span className="material-symbols-outlined text-green-600 mt-1">water_drop</span><div><span className="font-semibold">Continuous Hydration:</span> A constant supply of bottled mineral water is available throughout your journey.</div></li>
                    <li className="flex items-start gap-3"><span className="material-symbols-outlined text-green-600 mt-1">diamond</span><div><span className="font-semibold">Exclusive Mementos:</span> Receive a complimentary travel T-shirt and a Certificate of Accomplishment for your epic hikes.</div></li>
                </ul>
            </div>
          </>
        );
      case 'Reviews':
        return (
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">What Our Adventurers Say</h3>
            <div className="space-y-6 mb-8">
              {testimonialsData.slice(0, 3).map(t => (
                <div key={t.id} className="bg-gray-50 p-4 rounded-lg border">
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => <span key={i} className={`material-symbols-outlined text-yellow-400 ${i < t.rating ? 'filled' : ''}`} style={{ fontVariationSettings: `'FILL' ${i < t.rating ? 1 : 0}` }}>star</span>)}
                  </div>
                  <blockquote className="italic text-gray-600">"{t.quote}"</blockquote>
                  <p className="mt-2 text-right font-semibold text-gray-800">- {t.author}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 bg-primary/10 p-6 rounded-2xl border border-primary/20">
                <h4 className="font-bold text-gray-800 text-lg mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">reviews</span>
                    Verifiable Excellence (Pillar 4)
                </h4>
                <p className="text-gray-600 mb-4">Our commitment to excellence is validated by a global community of travelers. See our uncensored, firsthand reviews on the world's most trusted platforms.</p>
                <div className="flex flex-wrap gap-3">
                    <a href="https://www.google.com/maps/place/Java+Volcano+Tour+Operator" target="_blank" rel="noopener noreferrer" className="inline-block bg-white text-ink-primary px-4 py-3 rounded-lg font-semibold hover:bg-ink-neutral-200 transition-colors shadow-sm">Google Reviews</a>
                    <a href="https://www.trustpilot.com/review/javavolcano-touroperator.com" target="_blank" rel="noopener noreferrer" className="inline-block bg-white text-ink-primary px-4 py-3 rounded-lg font-semibold hover:bg-ink-neutral-200 transition-colors shadow-sm">Trustpilot</a>
                    <a href="https://www.tripadvisor.com/" target="_blank" rel="noopener noreferrer" className="inline-block bg-white text-ink-primary px-4 py-3 rounded-lg font-semibold hover:bg-ink-neutral-200 transition-colors shadow-sm">TripAdvisor</a>
                </div>
            </div>
          </div>
        );
      case 'FAQ':
        return (
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h3>
            {faqs.map(faq => <FaqItem key={faq.q} q={faq.q} a={faq.a} />)}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <JsonLd schema={productSchema} />
      <JsonLd schema={breadcrumbSchema} />
      <JsonLd schema={faqSchema} />

      {/* Header */}
      <div className="p-6">
        <h2 className="text-3xl font-bold text-gray-900">{pkg.name}</h2>
        <div className="mt-2 text-sm text-gray-500 flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="flex items-center gap-1"><span className="material-symbols-outlined text-base text-primary">schedule</span> {pkg.duration.days} Days / {pkg.duration.nights} Nights</span>
          <span className="flex items-center gap-1"><span className="material-symbols-outlined text-base text-primary">location_on</span> Departs from {pkg.departure}</span>
           <span className="flex items-center gap-1"><span className="material-symbols-outlined text-base text-yellow-500">star</span> {productSchema.aggregateRating.ratingValue} Rating</span>
        </div>
      </div>
      
      {/* Image Carousel */}
      <div className="relative group">
        <div className="aspect-[16/10] bg-gray-200 dark:bg-gray-800">
            <img 
                src={`https://javavolcano-touroperator.com/assets/`+pkg.galleries[currentImageIndex].image_url} 
                alt={pkg.galleries[currentImageIndex].alt_text || `Image ${currentImageIndex + 1} for ${pkg.name}`} 
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => openLightbox(currentImageIndex)}
            />
        </div>
        
        {/* Carousel Controls */}
        <button 
            onClick={prevImage}
            className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/50 dark:bg-black/50 backdrop-blur-sm text-ink-primary dark:text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Previous image"
        >
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <button 
            onClick={nextImage}
            className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/50 dark:bg-black/50 backdrop-blur-sm text-ink-primary dark:text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Next image"
        >
            <span className="material-symbols-outlined">arrow_forward_ios</span>
        </button>
        
        {/* Thumbnails */}
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/50 to-transparent">
            <div className="flex justify-center gap-2">
                {pkg.galleries.slice(0, 8).map((img, index) => (
                    <button key={img.id} onClick={() => setCurrentImageIndex(index)} className={`w-16 h-10 rounded-md overflow-hidden transition-all ${currentImageIndex === index ? 'ring-2 ring-primary ring-offset-2 ring-offset-black/50' : 'opacity-70 hover:opacity-100'}`}>
                        <img src={`https://javavolcano-touroperator.com/assets/`+img.image_url} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                ))}
            </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8">
            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
                {TABS.map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
              </div>
            {/* Tab Content */}
            {renderContent()}
          </div>
          <aside className="lg:col-span-4">
             <div className="lg:sticky lg:top-6">
               <div className="bg-white rounded-2xl shadow-card border p-6">
                 <BookingWidget pkg={pkg} />
               </div>
             </div>
          </aside>
        </div>
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div 
            className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4"
            onClick={closeLightbox}
            role="dialog"
            aria-modal="true"
        >
            <img 
                src={pkg.galleries[currentImageIndex].image_url} 
                alt={pkg.galleries[currentImageIndex].alt_text || `Image ${currentImageIndex + 1} for ${pkg.name}`}
                className="max-w-full max-h-full object-contain"
                onClick={e => e.stopPropagation()}
            />
            
            {/* Lightbox Controls */}
            <button
                onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
                className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2"
                aria-label="Close lightbox"
            >
                <span className="material-symbols-outlined text-3xl">close</span>
            </button>
            <button 
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="absolute top-1/2 left-4 -translate-y-1/2 text-white bg-black/50 rounded-full p-2"
                aria-label="Previous image"
            >
                <span className="material-symbols-outlined">arrow_back_ios_new</span>
            </button>
            <button 
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="absolute top-1/2 right-4 -translate-y-1/2 text-white bg-black/50 rounded-full p-2"
                aria-label="Next image"
            >
                <span className="material-symbols-outlined">arrow_forward_ios</span>
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
                {currentImageIndex + 1} / {pkg.galleries.length}
            </div>
        </div>
      )}
    </div>
  );
};

export default function App({ pkg }: { pkg: any }) {
  return <PackageDetail pkg={pkg}/>
}