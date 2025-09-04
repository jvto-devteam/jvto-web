'use client';
import { useEffect } from 'react';
import { sendEvent } from '@/lib/gtag'; // Impor fungsi helper
import Hero from '@/components/Hero';
import FeaturedTours from '@/components/FeaturedTours';
import Newsletter from '@/components/Newsletter';

const packageData = {
  id: 'VOL-001',
  name: 'Tur Eksklusif Gunung Bromo',
  category: 'Tur Gunung Api',
  price: 1500000,
};

export default function Home() {
  useEffect(() => {
    // Kirim event saat halaman dimuat dengan struktur yang benar
    sendEvent({
      action: 'view_item',
      params: {
        currency: 'IDR',
        value: packageData.price,
        items: [
          {
            item_id: packageData.id,
            item_name: packageData.name,
            item_category: packageData.category,
            price: packageData.price,
            quantity: 1
          }
        ]
      },
    });
    
  }, []); // Dijalankan sekali saat komponen dimuat

  return (
    <main className="flex flex-col">
      <Hero />
      <FeaturedTours />
      <Newsletter />
    </main>
  );
}