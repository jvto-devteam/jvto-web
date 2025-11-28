import React, { useState } from 'react';
import { tourPackages } from '@/data';

const QuickQuoteForm: React.FC = () => {
  const [origin, setOrigin] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [pax, setPax] = useState(2);
  const [selectedPackage, setSelectedPackage] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would handle the form submission here
    console.log({ origin, travelDate, pax, selectedPackage, notes });
    alert('Quote request sent! Check the console for data.');
  };

  const inputStyles = "w-full px-4 py-3 bg-background-light dark:bg-background-dark border border-ink-neutral-200 dark:border-ink-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors text-base";
  const labelStyles = "block text-sm font-semibold mb-1 text-ink-neutral-700 dark:text-ink-neutral-200";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label htmlFor="origin" className={labelStyles}>Origin</label>
                <select id="origin" value={origin} onChange={e => setOrigin(e.target.value)} className={inputStyles}>
                    <option value="">Select city</option>
                    <option value="surabaya">Surabaya</option>
                    <option value="bali">Bali</option>
                    <option value="yogyakarta">Yogyakarta</option>
                    <option value="other">Other</option>
                </select>
            </div>
             <div>
                <label htmlFor="travelDate" className={labelStyles}>Approx. Date</label>
                <input type="date" id="travelDate" value={travelDate} onChange={e => setTravelDate(e.target.value)} className={inputStyles} />
            </div>
        </div>
        <div>
            <label htmlFor="pax" className={labelStyles}>Number of Travelers</label>
            <input type="number" id="pax" value={pax} min="1" onChange={e => setPax(parseInt(e.target.value, 10))} className={inputStyles} />
        </div>
        <div>
            <label htmlFor="package" className={labelStyles}>Preferred Package (optional)</label>
            <select id="package" value={selectedPackage} onChange={e => setSelectedPackage(e.target.value)} className={inputStyles}>
                <option value="">Browse packages...</option>
                {tourPackages.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
            </select>
        </div>
        <div>
            <label htmlFor="notes" className={labelStyles}>Notes (optional)</label>
            <textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} className={inputStyles} placeholder="Any special requests or questions?" rows={3}></textarea>
        </div>
        <button type="submit" className="w-full px-6 py-3 mt-2 rounded-xl bg-primary text-white font-semibold hover:bg-opacity-90 transition-colors duration-200">
            Get a Clear Quote
        </button>
    </form>
  );
};

export default QuickQuoteForm;