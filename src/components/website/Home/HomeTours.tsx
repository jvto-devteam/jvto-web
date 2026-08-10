import type { PackageListItem } from "@/lib/packages/getWebPackagesList";
import Section from "@/components/design/Section";
import SectionHeading from "@/components/design/SectionHeading";
import HomeToursClient from "./HomeToursClient";

interface HomeToursProps {
  surabayaPackages: PackageListItem[];
  baliPackages: PackageListItem[];
}

export default function HomeTours({ surabayaPackages, baliPackages }: HomeToursProps) {
  return (
    <Section surface="off" labelledBy="tours-heading">
      <SectionHeading
        id="tours-heading"
        eyebrow="§ 02"
        title={
          <>
            Find your <span className="text-jvto-orange">perfect route.</span>
          </>
        }
        aside={<>16 private itineraries &middot; 1D&ndash;6D</>}
      />
      <HomeToursClient
        surabayaPackages={surabayaPackages}
        baliPackages={baliPackages}
      />
    </Section>
  );
}
