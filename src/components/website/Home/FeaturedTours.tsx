import { ListTourPackage } from "@/types";
import FeaturedToursClient from "./FeaturedToursClient"; // Import Client Component

// Helper function untuk fetch
async function getToursByLocation(id: number): Promise<ListTourPackage[]> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  // Gunakan no-store agar data selalu fresh saat user refresh halaman
  const res = await fetch(`${siteUrl}/api/packages/web?from=${id}&limit=6`, {
    method: "GET",
    cache: "no-store", 
  });

  if (!res.ok) {
     console.error(`Failed to fetch tours for location ${id}`);
     return []; // Return array kosong agar tidak error fatal (white screen)
  }
  return res.json();
}

const FeaturedTours = async () => {
  // Fetch data Surabaya (4) dan Bali (3) secara PARALLEL (bersamaan)
  // Ini lebih cepat daripada fetch satu per satu
  const [surabayaTours, baliTours] = await Promise.all([
    getToursByLocation(4),
    getToursByLocation(3),
  ]);

  return (
    <section className="py-16">
      {/* Oper data ke Client Component.
        User akan menerima HTML yang berisi JSON data ini (SEO Friendly),
        tapi interaksi switch tab terjadi di browser.
      */}
      <FeaturedToursClient 
        surabayaTours={surabayaTours} 
        baliTours={baliTours} 
      />
    </section>
  );
};

export default FeaturedTours;