'use client';
import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email.trim()) {
      alert(`Subscribed with ${email}`);
      setEmail('');
    }
  };

  return (
    <section className="py-12 px-4 md:px-16 text-center bg-orange-50">
      <h2 className="text-2xl font-bold mb-4">Get travel deals & tips</h2>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row justify-center gap-2 max-w-md mx-auto"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Your email"
          className="p-2 rounded-md flex-grow border"
        />
        <button
          type="submit"
          className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
        >
          Subscribe
        </button>
      </form>
    </section>
  );
}

