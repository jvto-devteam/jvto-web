import StructuredData from "@/components/website/StructuredData";
import Link from "next/link";
import { type Metadata } from "next";
import Button from "@/components/website/UI/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Check,
  ShieldCheck,
  FileText,
  Lock,
  HeartPulse,
  BookOpen,
  Star,
  User,
  Users,
  ArrowRight,
} from "lucide-react";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
import Sidebar from "./sidebar";

export default async function WhyJVTOPage() {
  const row = await getContentPage("/why-jvto", "en");
  if (!row) return notFound();

  const content = row.content as any;

  // Assumption: content has { h1?: string, body_md: string }
  const h1 = content?.h1 ?? "Why JVTO";
  const body = content?.body_md ?? "";

  return (
    <div className="flex min-h-screen bg-background">
      <StructuredData data={whyJVTOSchema} />
      <Sidebar />

      <main className="flex-1 pt-24">
        <section className="py-12 md:py-16 bg-accent border-b">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h1 className="font-black text-2xl md:text-5xl mb-6">
              Why Travel with JVTO?
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              JVTO is a tourist police-led, registered Indonesian travel
              company. We run private, all-inclusive volcano tours in East Java
              with a non-negotiable focus on safety, transparency, and
              community.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button>
                <Link className="flex" href="/travel-guide">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Read Our Travel Guide
                </Link>
              </Button>
              <Button variant="outline">
                <Link href="/travel-guide/booking-information">
                  How to Book
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <div className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <section className="mb-16 md:mb-24">
                <h2 className="font-black text-xl md:text-3xl mb-12 text-center">
                  What Makes JVTO Different
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {differenceCards.map((card, index) => (
                    <Link key={index} href={card.link} className="group block">
                      <Card className="h-full transition-all duration-300 hover:shadow-xl hover:border-primary/50">
                        <CardHeader className="flex-col items-start gap-4 md:flex-row">
                          <div
                            className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl shrink-0 bg-lime-400 text-primary`}
                          >
                            <card.icon className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-black text-lg md:text-xl text-xl group-hover:text-primary mb-2">
                              {card.title}
                            </h3>
                            <p className="text-muted-foreground text-sm">
                              {card.description}
                            </p>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="inline-flex items-center text-primary font-medium group-hover:text-primary/80 text-sm ml-auto">
                            Read more
                            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="font-black text-xl md:text-3xl mb-12 text-center">
                  Trust, Community & Guests
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {trustTiles.map((tile, index) => (
                    <Link key={index} href={tile.link} className="group block">
                      <Card className="h-full p-6 text-center transition-all duration-300 hover:shadow-xl hover:border-primary/50">
                        <div className="w-16 h-16 rounded-lg bg-lime-400 flex items-center justify-center text-2xl mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                          <tile.icon className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="font-black text-lg md:text-xl group-hover:text-primary mb-2">
                          {tile.title}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {tile.description}
                        </p>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
