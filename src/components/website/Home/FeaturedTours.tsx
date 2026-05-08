import { ListTourPackage } from "@/types";
import FeaturedToursClient from "./FeaturedToursClient"; // Import Client Component
import { getPublicPackageList } from "@/lib/publicContent/packageListSnapshot";

async function getToursByLocation(id: number): Promise<ListTourPackage[]> {
  return getPublicPackageList({ fromId: id, limit: 6 });
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
