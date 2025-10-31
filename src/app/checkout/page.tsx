'use client'
import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar,
  Minus,
  Plus
} from 'lucide-react';

export default function CheckoutPage() {
  const [tourData, setTourData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(5);
  const [selectedTier, setSelectedTier] = useState('medium');
  const [travelerCount, setTravelerCount] = useState(5);
  const [currentMonth, setCurrentMonth] = useState('October 2024');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+62');

  // Load tour data from localStorage
  useEffect(() => {
    const savedTour = localStorage.getItem('selectedTour');
    if (savedTour) {
      setTourData(JSON.parse(savedTour));
    } else {
      // Redirect back if no tour selected
      window.location.href = '/tours';
    }
  }, []);

  // Price tiers
  const priceTiers = {
    small: { name: 'Small Group', range: '1-4 Travelers', price: 150, min: 1, max: 4 },
    medium: { name: 'Medium Group', range: '5-10 Travelers', price: 135, min: 5, max: 10 },
    large: { name: 'Large Group', range: '11+ Travelers', price: 120, min: 11, max: 50 }
  };

  // Format price to IDR
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Calculate totals
  const subtotal = priceTiers[selectedTier].price * travelerCount;
  const taxesAndFees = subtotal * 0.08; // 8% tax
  const total = subtotal + taxesAndFees;

  // Handle traveler count change
  const handleTravelerChange = (delta) => {
    const newCount = travelerCount + delta;
    const tier = priceTiers[selectedTier];
    if (newCount >= tier.min && newCount <= tier.max) {
      setTravelerCount(newCount);
    }
  };

  // Handle tier change
  const handleTierChange = (tier) => {
    setSelectedTier(tier);
    const tierData = priceTiers[tier];
    if (travelerCount < tierData.min) {
      setTravelerCount(tierData.min);
    } else if (travelerCount > tierData.max) {
      setTravelerCount(tierData.max);
    }
  };

  // Handle continue
  const handleContinue = () => {
    if (!email || !phone) {
      alert('Please fill in all contact information');
      return;
    }

    const checkoutData = {
      tour: tourData,
      date: `${currentMonth.split(' ')[0]} ${selectedDate}, ${currentMonth.split(' ')[1]}`,
      tier: selectedTier,
      travelers: travelerCount,
      pricePerPerson: priceTiers[selectedTier].price,
      subtotal,
      taxesAndFees,
      total,
      contact: { email, phone: countryCode + phone }
    };

    localStorage.setItem('checkoutData', JSON.stringify(checkoutData));
    // Navigate to next step (payment page)
    alert('Proceeding to payment... (Step 2)');
  };

  if (!tourData) return null;

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Page Header */}
        <div className="flex flex-col gap-4 mb-8">
          <h1 className="text-gray-900 dark:text-gray-100 text-4xl font-black text-center">
            Book Your All-Inclusive Tour
          </h1>
          
          {/* Progress Bar */}
          <div className="max-w-xl mx-auto w-full">
            <div className="flex flex-col gap-2">
              <div className="flex gap-6 justify-between">
                <p className="text-teal-600 text-base font-medium">Step 1 of 3</p>
              </div>
              <div className="rounded-full bg-gray-200 dark:bg-gray-700">
                <div className="h-2 rounded-full bg-teal-600" style={{ width: '33%' }}></div>
              </div>
              <p className="text-teal-600 text-sm font-bold">Your Trip</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
          {/* Left Column: Main Content */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Date Selection */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
              <h2 className="text-gray-900 dark:text-gray-100 text-xl font-bold px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                Select Your Date
              </h2>
              <div className="flex flex-wrap items-center justify-center p-4">
                <div className="flex w-full max-w-[336px] flex-1 flex-col">
                  <div className="flex items-center p-1 justify-between">
                    <button 
                      onClick={() => setCurrentMonth('September 2024')}
                      className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full p-2"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <p className="text-gray-900 dark:text-gray-100 text-base font-bold flex-1 text-center">
                      {currentMonth}
                    </p>
                    <button 
                      onClick={() => setCurrentMonth('November 2024')}
                      className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full p-2"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-1">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                      <p key={i} className="text-gray-500 dark:text-gray-400 text-xs font-bold flex h-10 items-center justify-center">
                        {day}
                      </p>
                    ))}
                    
                    {/* Calendar days */}
                    {[...Array(30)].map((_, i) => {
                      const day = i + 1;
                      const isDisabled = day === 1 || day === 20 || day === 21;
                      const isSelected = day === selectedDate;
                      
                      return (
                        <button
                          key={day}
                          onClick={() => !isDisabled && setSelectedDate(day)}
                          disabled={isDisabled}
                          className={`h-10 w-full text-sm font-medium ${
                            isDisabled 
                              ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' 
                              : isSelected
                                ? 'text-white font-bold'
                                : 'text-gray-900 dark:text-gray-100 hover:bg-teal-100 dark:hover:bg-teal-900/30'
                          } ${day === 1 ? 'col-start-4' : ''}`}
                        >
                          <div className={`flex size-full items-center justify-center rounded-full ${
                            isSelected ? 'bg-red-500' : ''
                          }`}>
                            {day}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Group Size Selection */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
              <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-5">
                <h2 className="text-gray-900 dark:text-gray-100 text-xl font-bold">
                  Choose Your Group Size
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Select a tier to see pricing. Minimum traveler count applies.
                </p>
              </div>
              <div className="p-6 flex flex-col gap-4">
                {/* Tiered Radio Group */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {Object.entries(priceTiers).map(([key, tier]) => (
                    <label
                      key={key}
                      className={`relative flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        selectedTier === key
                          ? 'border-teal-600 bg-teal-50 dark:bg-teal-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-teal-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="group-tier"
                        checked={selectedTier === key}
                        onChange={() => handleTierChange(key)}
                        className="absolute opacity-0"
                      />
                      <span className="font-bold text-gray-900 dark:text-gray-100">
                        {tier.name}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {tier.range}
                      </span>
                      <span className="text-lg font-bold text-teal-600 mt-2">
                        ${tier.price}/person
                      </span>
                    </label>
                  ))}
                </div>

                {/* Number of Travelers Stepper */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Number of Travelers
                  </label>
                  <div className="relative flex items-center max-w-[150px]">
                    <button
                      onClick={() => handleTravelerChange(-1)}
                      className="flex-shrink-0 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 inline-flex items-center justify-center border border-gray-200 dark:border-gray-600 rounded-l-md w-9 h-9 transition-colors"
                      type="button"
                    >
                      <Minus size={16} />
                    </button>
                    <input
                      className="shrink-0 border-t border-b border-gray-200 dark:border-gray-600 text-center text-gray-900 dark:text-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600 w-full h-9"
                      type="text"
                      value={travelerCount}
                      readOnly
                    />
                    <button
                      onClick={() => handleTravelerChange(1)}
                      className="flex-shrink-0 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 inline-flex items-center justify-center border border-gray-200 dark:border-gray-600 rounded-r-md w-9 h-9 transition-colors"
                      type="button"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Minimum of {priceTiers[selectedTier].min} travelers for this tier.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
              <h2 className="text-gray-900 dark:text-gray-100 text-xl font-bold px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                Contact Information
              </h2>
              <div className="p-6 flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-teal-600 focus:ring-teal-600 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2" htmlFor="phone-number">
                    WhatsApp / Phone Number
                  </label>
                  <div className="relative rounded-md shadow-sm flex">
                    <select
                      className="h-full rounded-l-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 py-2 pl-3 pr-7 focus:border-teal-600 focus:ring-teal-600 sm:text-sm"
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                    >
                      <option value="+62">ID +62</option>
                      <option value="+1">US +1</option>
                      <option value="+44">UK +44</option>
                      <option value="+61">AU +61</option>
                    </select>
                    <input
                      className="block w-full rounded-r-md border-gray-300 dark:border-gray-600 focus:border-teal-600 focus:ring-teal-600 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      id="phone-number"
                      type="tel"
                      placeholder="812-3456-7890"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
                <h3 className="text-gray-900 dark:text-gray-100 text-lg font-bold px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  Your Order Summary
                </h3>
                <div className="p-6 flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      alt={tourData.packageName}
                      className="w-20 h-20 rounded-md object-cover"
                      src={`https://javavolcano-touroperator.com/assets/${tourData.image}`}
                    />
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-gray-100">
                        {tourData.packageName}
                      </h4>
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar size={14} />
                        <span>
                          {currentMonth.split(' ')[0]} {selectedDate}, {currentMonth.split(' ')[1]}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <hr className="border-t border-gray-200 dark:border-gray-700" />
                  
                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Travelers ({priceTiers[selectedTier].name})
                      </span>
                      <span className="text-gray-900 dark:text-gray-100">
                        {travelerCount} x ${priceTiers[selectedTier].price}.00
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                      <span className="text-gray-900 dark:text-gray-100">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Taxes & Fees</span>
                      <span className="text-gray-900 dark:text-gray-100">
                        ${taxesAndFees.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  
                  <hr className="border-t border-gray-200 dark:border-gray-700" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900 dark:text-gray-100">Total</span>
                    <span className="text-2xl font-black text-teal-600">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={handleContinue}
                    disabled={!email || !phone}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}