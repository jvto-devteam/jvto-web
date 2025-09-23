import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // ==========================================================
      // GROUP 1: URL MANTAN PAKET TOUR (Specific Semantic Redirects)
      // Pengalihan dari struktur URL lama yang non-semantik ke URL baru yang kaya kata kunci.
      // Struktur URL lama: /packages/surabaya/3d2n/1 [7]
      // Perubahan ini sangat penting untuk SEO [8].
      {
        source: '/packages/surabaya/3d2n/1',
        destination: '/tours/3-day-bromo-ijen-overland-from-surabaya-to-bali/',
        permanent: true,
      },
      {
        source: '/packages/bali/4d3n/2',
        destination: '/tours/4-day-bali-java-epic-landscapes-to-surabaya/',
        permanent: true,
      },

      // ==========================================================
      // GROUP 2: KONSOLIDASI PILAR VALUE PROPOSITION (/why-jvto/)
      // Mengarahkan konten yang terfragmentasi ke pilar terpadu /why-jvto/the-jvto-difference/ [4, 8].
      {
        source: '/what-set-us-apart',
        destination: '/why-jvto/the-jvto-difference/',
        permanent: true,
      },
      {
        source: '/police-escort',
        destination: '/why-jvto/the-jvto-difference/',
        permanent: true,
      },
      {
        source: '/legality',
        destination: '/why-jvto/the-jvto-difference/',
        permanent: true,
      },
      {
        source: '/travel-tshirt',
        destination: '/why-jvto/the-jvto-difference/',
        permanent: true,
      },
      
      // Pengalihan ke hub bukti sosial baru [4].
      {
        source: '/reviews/',
        destination: '/why-jvto/reviews/',
        permanent: true,
      },
      
      // ==========================================================
      // GROUP 3: KONSOLIDASI INFORMASI & LOGISTIK (/travel-guide/)
      // Mengarahkan konten logistik yang tersebar ke hub /travel-guide/ baru [4, 8].
      
      // FAQ ke hub panduan perjalanan [4].
      {
        source: '/faq',
        destination: '/travel-guide/faq/',
        permanent: true,
      },

      // Konsolidasi informasi pemesanan (How to Book, Payment, T&Cs) ke satu panduan komprehensif [4, 8].
      {
        source: '/how-to-book',
        destination: '/travel-guide/booking-information/',
        permanent: true,
      },
      {
        source: '/payment-information',
        destination: '/travel-guide/booking-information/',
        permanent: true,
      },
      {
        source: '/terms-conditions',
        destination: '/travel-guide/booking-information/',
        permanent: true,
      },

      // Integrasi konten info perjalanan umum ke dalam tips perjalanan yang lebih luas [4].
      {
        source: '/accommodations',
        destination: '/travel-guide/java-travel-tips/',
        permanent: true,
      },
      {
        source: '/transportations',
        destination: '/travel-guide/java-travel-tips/',
        permanent: true,
      },
      
      // Pengalihan kontak ke halaman kontak utama [4].
      {
        source: '/office',
        destination: '/contact/',
        permanent: true,
      },
    ];
  },

};

export default nextConfig;
