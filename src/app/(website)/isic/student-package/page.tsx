import Link from "next/link";
import { type Metadata } from "next";
import TourCard from "@/components/website/TourCard";
import Button from "@/components/website/UI/Button";
import { ListTourPackage } from "@/types";
import Image from "next/image";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { 
  ShieldCheck, 
  Users, 
  Ticket, 
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { getPageSeo } from "@/lib/content/getPageSeo";
import { getWebPackagesList } from "@/lib/packages/getWebPackagesList";
export const revalidate = 3600;

const fallbackSeo = {
  title: "Explore Java's Volcanoes with ISIC Benefits | JVTO",
  h1: "Explore Java's Volcanoes with ISIC Benefits",
  description:
    "Exclusive student deals for ISIC cardholders on safe, all-inclusive volcano tours in East Java with Java Volcano Tour Operator.",
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("/isic/student-package", fallbackSeo);
  return {
    title: seo.title,
    description: seo.description,
  };
}

async function getAllTours(): Promise<ListTourPackage[]> {
  // Refactored 2026-04-29 (Phase 7 deploy-readiness): direct helper call
  // (was self-fetch broke SSG with ECONNREFUSED). categoryId=2 = student package.
  try {
    return (await getWebPackagesList({ categoryId: 2, limit: 8 })) as unknown as ListTourPackage[];
  } catch (error) {
    console.error("Failed to fetch student tours", error);
    return [];
  }
}

export default async function IsicStudentPackagePage() {
  const seo = await getPageSeo("/isic/student-package", fallbackSeo);
  const studentPackages = await getAllTours();
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://javavolcano-touroperator.com";
  const pageRow = seo.row
    ? {
        route: seo.row.route,
        lang: seo.row.lang,
        seo: seo.row.seo,
        content: seo.row.content,
        created_at: seo.row.created_at,
        updated_at: seo.row.updated_at,
      }
    : {
        route: "/isic/student-package",
        lang: "en",
        seo: {
          title: seo.title,
          description: seo.description,
        },
        content: {
          h1: seo.h1,
        },
      };
  const packageListSchema = {
    "@type": "ItemList",
    "@id": `${siteUrl}/isic/student-package#packages`,
    name: "ISIC student packages",
    numberOfItems: studentPackages.length,
    itemListElement: studentPackages.map((tour, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${siteUrl}/${tour.slug}`,
      name: tour.name,
    })),
  };

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans">
      <PageJsonLdCombined
        pageRow={pageRow as any}
        extraSchemas={[packageListSchema]}
      />
      <main className="flex-grow">
        
        {/* ================= HERO SECTION ================= */}
        <section className="relative h-[60vh] md:h-[75vh] flex items-center justify-center text-center text-white overflow-hidden">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <Image 
              src="https://legacy.javavolcano-touroperator.com/assets/img/destinations/2d-1n-surabaya-bromo-1-day-tours-1679725846337/bromo6.webp" // Replace with your hero image path
              alt="Students at Mount Bromo"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
          
          {/* Content */}
          <div className="relative z-10 container mx-auto px-4 flex flex-col items-center">
            {/* ISIC Logo Placeholder from design */}
            <div className="mb-6">
              <Image 
                src="https://legacy.javavolcano-touroperator.com/assets/img/isic-logo.svg" // Replace with ISIC logo path
                alt="ISIC Student"
                width={180}
                height={80}
                className="h-auto"
              />
            </div>
            <h1 className="font-black text-4xl md:text-6xl tracking-tight mb-4 drop-shadow-lg">
              {seo.h1}
            </h1>
            <p className="text-lg md:text-xl font-medium max-w-3xl drop-shadow-md">
              {seo.description}
            </p>
          </div>
        </section>

        {/* ================= EXCLUSIVE PACKAGES GRID ================= */}
        <section className="py-16 md:py-24 bg-background" id="packages">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-black text-3xl md:text-4xl text-foreground mb-4">
                Exclusive Student Package for ISIC Cardholders
              </h2>
              <p className="text-muted-foreground max-w-3xl mx-auto">
                JVTO collaborates with ISIC to offer student-friendly pricing structures for safe, all-inclusive volcano tours. These prices are only available to ISIC cardholders. To redeem, you must have a valid ISIC card.
              </p>
            </div>
            
            {studentPackages.length > 0 ? (
                <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {studentPackages.map((tour) => (
                    <div key={tour.id} className="h-full">
                      <TourCard tour={tour} />
                    </div>
                  ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-muted/20 rounded-sm">
                    <p className="text-muted-foreground">No packages currently available.</p>
                </div>
            )}
          </div>
        </section>

        {/* ================= WHAT IS STUDENT PACKAGE? ================= */}
        {/* Adapting original "What Stays the Same" content to the design's icon layout */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-black text-3xl text-foreground">
                What is <span className="text-primary">Student Package?</span>
              </h2>
              <p className="text-muted-foreground mt-4 max-w-3xl mx-auto">
                Opting for a student package does <strong>not</strong> mean cutting corners. It's designed for students travelling in small groups, offering a fairer pricing structure while maintaining our high standards.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Feature 1 */}
              <div className="bg-background border border-border p-8 rounded-sm text-center flex flex-col items-center shadow-sm">
                <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                  <Users size={40} />
                </div>
                <h4 className="font-bold text-xl mb-3">Private Structure</h4>
                <p className="text-muted-foreground">Strictly private tour structure. No mixed groups.</p>
              </div>

              {/* Feature 2 */}
              <div className="bg-background border border-border p-8 rounded-sm text-center flex flex-col items-center shadow-sm">
                <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                  <Ticket size={40} />
                </div>
                <h4 className="font-bold text-xl mb-3">All-Inclusive</h4>
                <p className="text-muted-foreground">Includes park fees, permits, and transport.</p>
              </div>

              {/* Feature 3 */}
              <div className="bg-background border border-border p-8 rounded-sm text-center flex flex-col items-center shadow-sm">
                <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                  <ShieldCheck size={40} />
                </div>
                <h4 className="font-bold text-xl mb-3">High Safety</h4>
                <p className="text-muted-foreground">Same high safety standards, including health screening.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= NEED AN ISIC CARD? SECTION ================= */}
        <section className="py-16 bg-background overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-12 bg-muted/30 rounded-sm p-8 md:p-12 relative">
              
              {/* Left Column: Image & Card Graphic */}
              <div className="flex-1 relative w-full max-w-md md:max-w-none">
                <div className="relative z-10">
                  <Image 
                    src="https://legacy.javavolcano-touroperator.com/assets/img/isic-card.png" // Replace with student & card graphic
                    alt="Student with ISIC Card"
                    width={500}
                    height={400}
                    className="w-full h-auto object-contain"
                  />
                </div>
                {/* Decorative background elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 rounded-full blur-3xl -z-0" />
              </div>

              {/* Right Column: Content */}
              <div className="flex-1 text-left">
                <h2 className="font-black text-3xl md:text-4xl text-foreground mb-6">
                  Need an ISIC Card?
                </h2>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  The International Student Identity Card (ISIC) is the only globally recognized proof of full-time student status. Get yours today to unlock thousands of benefits!
                </p>
                <Button size="lg" className="w-full md:w-auto">
                  <a href="https://www.isic.org/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    BUY NOW <ArrowRight size={20} />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ================= HOW TO APPLY (VISUAL STEPS) ================= */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="font-black text-3xl md:text-4xl text-center mb-16 text-foreground">
              How to Apply the ISIC Code
            </h2>
            
            <div className="flex flex-col gap-16 md:gap-24 max-w-5xl mx-auto">
              {/* Step 1 */}
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                <div className="flex-1 flex justify-center">
                  <div className="relative w-64 shadow-xl rounded-[2rem] overflow-hidden border-4 border-muted">
                    <Image src="/assets/img/isic/isic-step-1.jpg" alt="Step 1" width={256} height={512} className="w-full h-auto" />
                  </div>
                </div>
                <div className="flex-1 flex flex-col items-start">
                  <span className="text-8xl font-black text-muted/30 leading-none mb-4">1</span>
                  <h3 className="text-2xl font-bold mb-4">Choose Your Adventure</h3>
                  <p className="text-muted-foreground text-lg">Visit our website and select the volunteer or tour package you wish to book. Click on the "Book Now" button.</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-12">
                <div className="flex-1 flex justify-center">
                  <div className="relative w-64 shadow-xl rounded-[2rem] overflow-hidden border-4 border-muted">
                    <Image src="/assets/img/isic/isic-step-2.jpg" alt="Step 2" width={256} height={512} className="w-full h-auto" />
                  </div>
                </div>
                <div className="flex-1 flex flex-col items-start md:items-end text-left md:text-right">
                  <span className="text-8xl font-black text-muted/30 leading-none mb-4">2</span>
                  <h3 className="text-2xl font-bold mb-4">Fill in Your Details</h3>
                  <p className="text-muted-foreground text-lg">Complete the booking form with your personal details. In the "Discount Code" field, enter your unique ISIC code.</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                <div className="flex-1 flex justify-center">
                  <div className="relative w-64 shadow-xl rounded-[2rem] overflow-hidden border-4 border-muted">
                    <Image src="/assets/img/isic/isic-step-3.jpg" alt="Step 3" width={256} height={512} className="w-full h-auto" />
                  </div>
                </div>
                <div className="flex-1 flex flex-col items-start">
                  <span className="text-8xl font-black text-muted/30 leading-none mb-4">3</span>
                  <h3 className="text-2xl font-bold mb-4">Apply & Verify</h3>
                  <p className="text-muted-foreground text-lg">Click "Apply". The discount will be calculated. Proceed with your booking. We may ask to verify your ISIC card upon arrival.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
      </main>
    </div>
  );
}
