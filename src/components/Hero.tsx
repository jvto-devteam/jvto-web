'use client';
import { useState } from 'react';

export default function Hero() {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      alert(`Searching for "${query}"`);
    }
  };

  return (
    <section
      className="relative w-full h-[70vh] flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          'url(https://images.unsplash.com/photo-1559511083-73820bea5d8d?auto=format&fit=crop&w=1400&q=80)',
      }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 text-center text-white p-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Java Volcano Tours</h1>
        <p className="mb-6 text-lg">
          Discover unforgettable adventures across Indonesia&apos;s volcanic landscape.
        </p>
        <form onSubmit={handleSearch} className="flex justify-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tours"
            className="p-2 rounded-l-md text-black w-64"
          />
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-r-md"
          >
            Search
          </button>
        </form>
      </div>
    </section>
  );
}

