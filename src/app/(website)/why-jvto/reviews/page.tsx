import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import  Button  from "@/components/website/UI/Button";
import { companyHistory } from "@/lib/legal";
import { SITE_CONFIG } from "@/lib/site-config";
import { type Metadata } from 'next';
import { Check, Shield, Star, Users } from "lucide-react";

export const metadata: Metadata = {
    title: 'Guest Reviews & Long-Term Feedback',
    description: 'Read how guests describe their private volcano tours with JVTO and see independent reviews from Google, Tripadvisor and Trustpilot, plus early homestay-era recognition.',
};

export default function ReviewsPage() {

    const reviewPlatforms = [
        {
          name: "Google Business Profile",
          icon: "⭐",
          color: "bg-blue-50 border-blue-200",
          link: SITE_CONFIG.proofLinks.googleReviews,
          description: "Live reviews from guests on Google Maps and Business Profile"
        },
        {
          name: "Tripadvisor",
          icon: "✈️",
          color: "bg-green-50 border-green-200",
          link: SITE_CONFIG.proofLinks.tripadvisor,
          description: "Independent reviews on the world's largest travel platform"
        },
        {
          name: "Trustpilot",
          icon: "🏆",
          color: "bg-purple-50 border-purple-200",
          link: SITE_CONFIG.proofLinks.trustpilot,
          description: "Transparent guest feedback on Trustpilot"
        }
      ];
    
      const reviewThemes = [
        {
          title: "Safety and Honesty",
          description: "Clear briefings, realistic explanations about blue fire, weather, closures",
          icon: Shield
        },
        {
          title: "Private, Flexible Routes",
          description: "Ability to adjust stops for rest, food or health during private tours",
          icon: Check
        },
        {
          title: "Local Connection",
          description: "Travelling with local guides and drivers who know the area well",
          icon: Users
        },
        {
          title: "Smooth Logistics",
          description: "Airport pickups, ferries, transfers, and coordination across destinations",
          icon: Star
        }
      ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow pt-24">
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-4xl">
             <nav className="mb-8 text-sm text-muted-foreground">
                <Link href="/why-jvto" className="hover:text-primary">Why JVTO</Link>
                <span className="mx-2">›</span>
                <span className="text-foreground font-medium">Reviews</span>
            </nav>
            <div className="text-center mb-12">
              <h1 className="font-black uppercase text-4xl md:text-5xl tracking-tight">
                Guest Reviews & Long-Term Proof
              </h1>
              <div className="prose prose-lg max-w-none mx-auto text-muted-foreground text-center mt-4">
                  <p>We encourage you to read reviews on platforms we don’t control. These platforms contain feedback from guests hosted over many years, including from private tours under JVTO and earlier homestay-era trips.</p>
              </div>
                 <div className="not-prose flex gap-4 justify-center mt-8">
                    <Button variant="outline">
                        <a href={SITE_CONFIG.proofLinks.googleReviews} target="_blank" rel="noopener noreferrer">Google Reviews</a>
                    </Button>
                     <Button variant="outline">
                        <a href={SITE_CONFIG.proofLinks.tripadvisor} target="_blank" rel="noopener noreferrer">TripAdvisor</a>
                    </Button>
                     <Button variant="outline">
                        <a href={SITE_CONFIG.proofLinks.trustpilot} target="_blank" rel="noopener noreferrer">Trustpilot</a>
                    </Button>
                </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-accent">
            <div className="container mx-auto px-4">
                <h2 className="text-center font-black uppercase text-3xl tracking-tight mb-8">What Guests Usually Highlight</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                     {reviewThemes.map((theme, index) => {
                        const Icon = theme.icon;
                        return (
                            <Card key={index}>
                                <CardHeader>
                                    <Icon className="w-8 h-8 text-primary mb-2" />
                                    <CardTitle className="font-black">{theme.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">{theme.description}</p>
                                </CardContent>
                            </Card>
                        )
                     })}
                </div>
                 <div className="mt-8 text-center text-sm text-muted-foreground">
                    <p>Our booking, payment and Travel Credit rules are transparent and written in our <Link href="/travel-guide/booking-information" className="underline hover:text-primary">Travel Guide</Link>, which guests can read before confirming.</p>
                </div>
            </div>
        </section>

        <section className="py-12 md:py-16">
            <div className="container mx-auto px-4 max-w-4xl text-center">
                 <h2 className="font-black uppercase text-3xl tracking-tight mb-8">Early Recognition (Homestay Era)</h2>
                 <p className="text-muted-foreground max-w-2xl mx-auto mb-8">Before JVTO existed as a full travel company, our local homestay and early tours received guest awards and mentions in international guidebooks. These images show that history.</p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
                    {companyHistory.awards_and_recognition.map((item, index) => (
                        <Card key={index}>
                            <CardContent className="p-4">
                            <div className="relative aspect-video w-full overflow-hidden rounded-sm">
                                <Image
                                src={item.url}
                                alt={item.alt_text}
                                fill
                                className="object-contain"
                                sizes="(max-width: 768px) 100vw, 50vw"
                                />
                            </div>
                            <p className="text-sm text-center mt-2 text-muted-foreground">{item.caption}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <Button><Link href="/why-jvto/our-story">Read Our Full Story</Link></Button>
            </div>
        </section>

      </main>
    </div>
  );
}
