"use client";

import { useState } from "react";
import { AssetsSelectorField } from "@/components/assets/AssetsSelectorField";

export default function TourPackageForm() {
  const [galleryAssetIds, setGalleryAssetIds] = useState<number[]>([]);

  return (
    <div className="space-y-4">
      {/* ...field lain: nama tour, harga, dst... */}

      <AssetsSelectorField
        label="Gallery Images"
        description="Pilih beberapa gambar untuk gallery tour."
        multiple={true}
        allowedTypes={["image"]}
        valueIds={galleryAssetIds}
        onChange={(ids) => setGalleryAssetIds(ids)} // ini yang kamu simpan ke DB
      />

    </div>
  );
}
