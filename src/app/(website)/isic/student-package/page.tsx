import Link from "next/link";
import Button from "@/components/website/UI/Button";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "ISIC Student Deals | Fair Volcano Tours in East Java",
  description:
    "See how ISIC students can access fair, all-inclusive volcano tour packages with Java Volcano Tour Operator while keeping the same safety and service standards.",
};

export default function IsicStudentPackagePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow pt-24">
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <nav className="mb-8 text-center text-sm text-muted-foreground">
              <Link href="/" className="hover:text-primary">
                Home
              </Link>
              <span className="mx-2">›</span>
              <Link href="/isic" className="hover:text-primary">
                ISIC
              </Link>
              <span className="mx-2">›</span>
              <span className="text-foreground font-medium">
                Student Package
              </span>
            </nav>

            <div className="text-center mb-12">
              <h1 className="font-black uppercase text-4xl md:text-5xl tracking-tight">
                ISIC Student Deals for East Java Volcano Tours
              </h1>
              <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                JVTO collaborates with ISIC to offer student-friendly pricing
                structures for safe, all-inclusive volcano tours, addressing the
                higher costs international students often face.
              </p>
            </div>

            <div className="prose prose-lg max-w-none mx-auto text-muted-foreground">
              <h2 className="font-black uppercase text-3xl tracking-tight mt-12 mb-4 text-foreground">
                How It Works
              </h2>
              <p>
                If you are a verified ISIC cardholder, you may be eligible for
                special rates on selected private tour packages. Our goal is to
                make high-quality, safe travel more accessible without
                compromising on the standards we promise all our guests.
              </p>

              <h2 className="font-black uppercase text-3xl tracking-tight mt-12 mb-4 text-foreground">
                What Stays the Same
              </h2>
              <div>
                Opting for a student package does not mean cutting corners. You
                receive the same:
                <ul>
                  <li>Private tour structure (no mixed groups)</li>
                  <li>Inclusions for park fees, permits, and transport</li>
                  <li>
                    High standard of safety, including Ijen health screening
                  </li>
                  <li>Experienced local guides and drivers</li>
                </ul>
                The difference is in the pricing structure, designed to be
                fairer for students travelling in small groups.
              </div>

              <h2 className="font-black uppercase text-3xl tracking-tight mt-12 mb-4 text-foreground">
                How to Enquire
              </h2>
              <div>
                To find out which packages are eligible and what the student
                rates are:
                <ol>
                  <li>Have your valid ISIC card details ready.</li>
                  <li>
                    Contact us via our official channels with your preferred
                    dates, group size, and mention that you are an ISIC
                    cardholder.
                  </li>
                  <li>
                    We will provide you with the available options and pricing.
                  </li>
                </ol>
              </div>
              <div className="text-center not-prose mt-8">
                <Button>
                  <Link href="/contact">Contact Us for ISIC Rates</Link>
                </Button>
              </div>

              <div className="mt-12">
                For more details on our standard booking procedures, please
                refer to our{" "}
                <Link href="/travel-guide/booking-information">
                  Booking Information
                </Link>
                page.
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
