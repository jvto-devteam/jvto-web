'use client';

import { useState } from 'react';

interface Destination {
  id: number;
  name: string;
  image: string;
  description: string;
  details: string;
}

const destinations: Destination[] = [
  {
    id: 1,
    name: 'Bali, Indonesia',
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=60',
    description: 'Pulau tropis dengan pantai indah dan budaya yang kaya.',
    details:
      'Nikmati surfing, diving, dan suasana santai di kafe pinggir pantai.',
  },
  {
    id: 2,
    name: 'Tokyo, Jepang',
    image:
      'https://images.unsplash.com/photo-1549693578-d683be217e58?auto=format&fit=crop&w=800&q=60',
    description: 'Metropolitan modern dengan sentuhan budaya tradisional.',
    details:
      'Kunjungi kuil bersejarah, nikmati kuliner, dan jelajahi distrik futuristik.',
  },
  {
    id: 3,
    name: 'Paris, Prancis',
    image:
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=60',
    description: 'Kota romantis dengan arsitektur klasik dan seni kelas dunia.',
    details: 'Naik ke menara Eiffel dan jelajahi museum Louvre yang ikonik.',
  },
];

export default function Home() {
  const [query, setQuery] = useState('');
  const filtered = destinations.filter((d) =>
    d.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <main className="flex min-h-screen flex-col">
      <section
        className="bg-cover bg-center px-8 py-24 text-white"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1526779259212-939e64758e3f?auto=format&fit=crop&w=1600&q=60')",
        }}
      >
        <h1 className="mb-4 text-5xl font-bold">Jelajahi Dunia</h1>
        <p className="mb-8 max-w-xl text-lg">
          Temukan destinasi populer dan rencanakan liburan impianmu bersama
          kami.
        </p>
        <div className="mx-auto w-full max-w-2xl rounded bg-white p-4 text-gray-900 shadow">
          <input
            type="text"
            className="w-full rounded border p-2"
            placeholder="Cari destinasi..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </section>

      <section className="flex-1 p-8">
        <h2 className="mb-4 text-2xl font-semibold">Destinasi Populer</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((dest) => (
            <DestinationCard key={dest.id} dest={dest} />
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full text-center text-gray-600">
              Destinasi tidak ditemukan.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}

function DestinationCard({ dest }: { dest: Destination }) {
  const [show, setShow] = useState(false);
  return (
    <div className="overflow-hidden rounded border shadow transition hover:shadow-lg">
      <img
        src={dest.image}
        alt={dest.name}
        className="h-40 w-full object-cover"
      />
      <div className="p-4">
        <h3 className="mb-2 text-xl font-bold">{dest.name}</h3>
        <p className="mb-4 text-sm text-gray-700">{dest.description}</p>
        <button
          onClick={() => setShow((s) => !s)}
          className="text-blue-600 hover:underline"
        >
          {show ? 'Sembunyikan Detail' : 'Lihat Detail'}
        </button>
        {show && (
          <p className="mt-2 text-sm text-gray-600 transition">
            {dest.details}
          </p>
        )}
      </div>
    </div>
  );
}

