

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
        today.setHours(0, 0, 0, 0); // Reset time to compare dates only
        if (selectedDate < today) {
            newErrors.travelDate = 'Travel date cannot be in the past.';
        }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTravelersChange = (amount: number) => {
    setTravelers(prev => Math.max(1, prev + amount)); // Ensure travelers is at least 1
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
      alert('Booking request sent! (Check console for data)');
      // Reset form on successful submission if desired
      setFullName('');
      setEmail('');
      setPhone('');
      setTravelDate('');
      setTravelers(1);
      setErrors({});
    }
  };

  const inputStyles = "w-full px-4 py-3 bg-background-light dark:bg-ink-primary border border-ink-neutral-200 dark:border-ink-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors text-base";
  const labelStyles = "block text-sm font-semibold mb-1 text-ink-neutral-700 dark:text-ink-neutral-200";
  const tooltipStyles = "absolute bottom-full mb-2 w-max max-w-xs p-2 text-xs text-white bg-ink-neutral-900 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-focus-within:opacity-100 group-hover:visible group-focus-within:visible transition-all duration-200 z-10 pointer-events-none";

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
       <h3 className="text-xl font-bold text-ink-primary dark:text-white text-center">Book Your Adventure</h3>
      
      <div className="relative group">
        <label htmlFor="fullName" className={labelStyles}>
          Full Name
        </label>
        <input
          type="text"
          id="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className={`${inputStyles} ${errors.fullName ? 'border-red-500' : ''}`}
          placeholder="e.g. John Doe"
          required
          aria-invalid={!!errors.fullName}
          aria-describedby={errors.fullName ? "fullName-error fullName-tooltip" : "fullName-tooltip"}
        />
        <span id="fullName-tooltip" role="tooltip" className={tooltipStyles}>Please enter your full name as it appears on your ID.</span>
        {errors.fullName && <p id="fullName-error" className="text-red-500 text-xs mt-1" role="alert">{errors.fullName}</p>}
      </div>

      <div className="relative group">
        <label htmlFor="email" className={labelStyles}>
          Email Address
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`${inputStyles} ${errors.email ? 'border-red-500' : ''}`}
          placeholder="you@example.com"
          required
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error email-tooltip" : "email-tooltip"}
        />
        <span id="email-tooltip" role="tooltip" className={tooltipStyles}>{`We'll`} send your booking confirmation here.</span>
        {errors.email && <p id="email-error" className="text-red-500 text-xs mt-1" role="alert">{errors.email}</p>}
      </div>

       <div className="relative group">
        <label htmlFor="phone" className={labelStyles}>
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={`${inputStyles} ${errors.phone ? 'border-red-500' : ''}`}
          placeholder="(Optional)"
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? "phone-error phone-tooltip" : "phone-tooltip"}
        />
        <span id="phone-tooltip" role="tooltip" className={tooltipStyles}>Include country code for international numbers.</span>
        {errors.phone && <p id="phone-error" className="text-red-500 text-xs mt-1" role="alert">{errors.phone}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="relative group">
            <label htmlFor="travelDate" className={labelStyles}>
            Travel Date
            </label>
            <input
              type="date"
              id="travelDate"
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
              className={`${inputStyles} ${errors.travelDate ? 'border-red-500' : ''}`}
              required
              aria-invalid={!!errors.travelDate}
              aria-describedby={errors.travelDate ? "date-error date-tooltip" : "date-tooltip"}
            />
            <span id="date-tooltip" role="tooltip" className={tooltipStyles}>Select your desired start date for the tour.</span>
            {errors.travelDate && <p id="date-error" className="text-red-500 text-xs mt-1" role="alert">{errors.travelDate}</p>}
        </div>
        <div className="relative group">
            <label htmlFor="travelers" className={labelStyles}>
            Travelers
            </label>
            <div className="flex items-center h-12">
            <button type="button" onClick={() => handleTravelersChange(-1)} className="w-12 h-full flex items-center justify-center bg-ink-neutral-200 dark:bg-ink-neutral-700 rounded-l-lg font-bold text-xl hover:bg-ink-neutral-300 dark:hover:bg-ink-neutral-600 focus:outline-none focus:ring-2 focus:ring-primary">-</button>
            <input
                type="text"
                id="travelers"
                value={travelers}
                readOnly
                className="w-full h-full text-center px-2 bg-background-light dark:bg-ink-primary border-t border-b border-ink-neutral-200 dark:border-ink-neutral-700 focus:outline-none text-base"
                aria-describedby="travelers-tooltip"
            />
            <button type="button" onClick={() => handleTravelersChange(1)} className="w-12 h-full flex items-center justify-center bg-ink-neutral-200 dark:bg-ink-neutral-700 rounded-r-lg font-bold text-xl hover:bg-ink-neutral-300 dark:hover:bg-ink-neutral-600 focus:outline-none focus:ring-2 focus:ring-primary">+</button>
            </div>
            <span id="travelers-tooltip" role="tooltip" className={tooltipStyles}>Select the number of people in your group.</span>
        </div>
      </div>

      <div className="relative group">
        <label htmlFor="tripType" className={labelStyles}>
            Trip Type
        </label>
        <div className={`${inputStyles.replace('py-3', 'py-0')} h-12 bg-ink-neutral-200/50 dark:bg-ink-neutral-900/50 cursor-not-allowed flex items-center gap-2`}>
            <span className="material-symbols-outlined text-primary text-base ml-1">lock</span>
            <span>Private Tour</span>
        </div>
        <span id="tripType-tooltip" role="tooltip" className={tooltipStyles}>All our tours are private to ensure a personalized and high-quality experience.</span>
      </div>
      
      <button
        type="submit"
        className="w-full px-6 py-3 mt-2 rounded-xl bg-primary text-white font-semibold hover:bg-opacity-90 transform hover:scale-105 transition-transform duration-200"
      >
        Request to Book
      </button>
    </form>
  );
};

export default BookingForm;