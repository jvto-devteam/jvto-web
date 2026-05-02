'use client';
import React, { useState } from 'react';

const BookingForm: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [travelers, setTravelers] = useState(1);
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    phone?: string;
    travelDate?: string;
  }>({});

  const validate = (): boolean => {
    const newErrors: { fullName?: string; email?: string; phone?: string; travelDate?: string } = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    if (phone && !phoneRegex.test(phone)) {
      newErrors.phone = 'Please enter a valid phone number.';
    }

    if (!travelDate) {
        newErrors.travelDate = 'Travel date is required.';
    } else {
        const today = new Date();
        const selectedDate = new Date(travelDate);
        today.setHours(0, 0, 0, 0); 
        if (selectedDate < today) {
            newErrors.travelDate = 'Travel date cannot be in the past.';
        }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTravelersChange = (amount: number) => {
    setTravelers(prev => Math.max(1, prev + amount)); 
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      console.log({
        fullName,
        email,
        phone,
        travelDate,
        travelers,
      });
      alert('Booking request sent!');
      // Reset form
      setFullName('');
      setEmail('');
      setPhone('');
      setTravelDate('');
      setTravelers(1);
      setErrors({});
    }
  };

  // Styles Updated: Removed Dark Mode, cleaner gray borders, better focus states
  const inputStyles = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white focus:border-transparent transition-all text-gray-800 placeholder-gray-400";
  const labelStyles = "block text-sm font-bold mb-2 text-gray-700";
  const tooltipStyles = "absolute bottom-full mb-2 left-0 w-max max-w-xs p-2 text-xs text-white bg-gray-800 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-focus-within:opacity-100 group-hover:visible group-focus-within:visible transition-all duration-200 z-10 pointer-events-none";

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
       <div className="text-center mb-6">
         <h3 className="text-2xl font-bold text-gray-900">Book Your Adventure</h3>
         <p className="text-sm text-gray-500 mt-1">Fill out the form below to start planning.</p>
       </div>
      
      {/* Full Name */}
      <div className="relative group">
        <label htmlFor="fullName" className={labelStyles}>
          Full Name
        </label>
        <input
          type="text"
          id="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className={`${inputStyles} ${errors.fullName ? 'border-red-500 focus:ring-red-500 bg-red-50' : ''}`}
          placeholder="e.g. John Doe"
          required
        />
        <span className={tooltipStyles}>Enter your full name as on ID.</span>
        {errors.fullName && <p className="text-red-500 text-xs mt-1 font-medium">{errors.fullName}</p>}
      </div>

      {/* Email */}
      <div className="relative group">
        <label htmlFor="email" className={labelStyles}>
          Email Address
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`${inputStyles} ${errors.email ? 'border-red-500 focus:ring-red-500 bg-red-50' : ''}`}
          placeholder="you@example.com"
          required
        />
        <span className={tooltipStyles}>Booking confirmation will be sent here.</span>
        {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>}
      </div>

       {/* Phone */}
       <div className="relative group">
        <label htmlFor="phone" className={labelStyles}>
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={`${inputStyles} ${errors.phone ? 'border-red-500 focus:ring-red-500 bg-red-50' : ''}`}
          placeholder="+62..."
        />
        <span className={tooltipStyles}>Include country code for international numbers.</span>
        {errors.phone && <p className="text-red-500 text-xs mt-1 font-medium">{errors.phone}</p>}
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Date */}
        <div className="relative group">
            <label htmlFor="travelDate" className={labelStyles}>
            Travel Date
            </label>
            <input
              type="date"
              id="travelDate"
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
              className={`${inputStyles} ${errors.travelDate ? 'border-red-500 focus:ring-red-500 bg-red-50' : ''}`}
              required
            />
            {errors.travelDate && <p className="text-red-500 text-xs mt-1 font-medium">{errors.travelDate}</p>}
        </div>

        {/* Travelers Counter */}
        <div className="relative group">
            <label htmlFor="travelers" className={labelStyles}>
            Travelers
            </label>
            <div className="flex items-center h-[50px] border border-gray-200 rounded-sm overflow-hidden">
                <button 
                    type="button" 
                    onClick={() => handleTravelersChange(-1)} 
                    className="w-12 h-full flex items-center justify-center bg-gray-100 text-gray-600 hover:bg-gray-200 active:bg-gray-300 transition-colors"
                >
                    <span className="font-bold text-xl">-</span>
                </button>
                <input
                    type="text"
                    id="travelers"
                    value={travelers}
                    readOnly
                    className="w-full h-full text-center bg-white text-gray-800 font-semibold focus:outline-none cursor-default"
                />
                <button 
                    type="button" 
                    onClick={() => handleTravelersChange(1)} 
                    className="w-12 h-full flex items-center justify-center bg-gray-100 text-gray-600 hover:bg-gray-200 active:bg-gray-300 transition-colors"
                >
                    <span className="font-bold text-xl">+</span>
                </button>
            </div>
        </div>
      </div>

      {/* Private Tour Lock */}
      <div className="relative group">
        <label className={labelStyles}>
            Trip Type
        </label>
        <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-sm flex items-center gap-2 text-gray-500 cursor-not-allowed">
            <span className="material-symbols-outlined text-sm">lock</span>
            <span className="font-medium">Private Tour</span>
        </div>
        <p className="text-xs text-gray-400 mt-1">Exclusively for your group.</p>
      </div>
      
      <button
        type="submit"
        className="w-full px-6 py-4 mt-4 rounded-sm bg-green-600 text-white font-bold text-lg shadow-lg hover:bg-green-700 hover:shadow-green-200 hover:-translate-y-0.5 transition-all duration-200"
      >
        Request to Book
      </button>
    </form>
  );
};

export default BookingForm;