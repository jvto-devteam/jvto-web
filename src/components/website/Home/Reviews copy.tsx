"use client";

import { useState } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import Button from "@/components/website/UI/Button";
import { PlatformIcon } from "@/components/PlatformIcon";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const allReviewsData = [
  {
    id: 1,
    author: "John Doe",
    platform: "Google",
    date: "2024-05-10",
    rating: 5,
    title: "Amazing Experience!",
    quote:
      "I had an unforgettable time exploring East Java with JVTO Tours. Highly recommended!",
  },
  {
    id: 2,
    author: "Jane Smith",
    platform: "Trustpilot",
    date: "2024-04-22",
    rating: 4,
    title: "Great Service!",
    quote: "The tour guide was knowledgeable and the experience was top-notch.",
  },
];
const platforms = [
  "All Reviews",
  "Google",
  "Trustpilot",
  "Tripadvisor",
  "Klook",
];
const aggregates = {
  overall: {
    avg_rating: 4.9,
    total_reviews: 1102,
  },
};

function ReviewCard({ review }: { review: any }) {
  return (
    <Card className="flex flex-col h-full shadow-soft hover:shadow-lg transition-shadow border-gray-100 bg-gray-50">
      <CardHeader>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold">
                {review.author?.charAt(0) ?? "A"}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full border border-white">
                <PlatformIcon platform={review.platform} className="h-3 w-3" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <h4 className="text-sm font-bold text-foreground">
                  {review.author}
                </h4>
              </div>
              <span className="text-xs text-muted-foreground block">
                {new Date(review.date).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
        <div className="flex text-yellow-400 text-sm">
          {[...Array(Math.round(review.rating || 5))].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-current" />
          ))}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow">
        <h5 className="font-bold text-foreground mb-2 line-clamp-1">
          {review.title || review.quote.substring(0, 50) + "..."}
        </h5>
        <p className="text-sm text-muted-foreground flex-grow mb-3 leading-relaxed line-clamp-3">
          {review.quote}
        </p>
        <Link
          href="/reviews"
          className="text-sm text-primary hover:underline font-medium mt-auto"
        >
          Read more
        </Link>
      </CardContent>
    </Card>
  );
}

export default function Reviews() {
  const [filter, setFilter] = useState("All Reviews");

  const filteredReviews =
    filter === "All Reviews"
      ? allReviewsData
      : allReviewsData.filter((r) => r.platform === filter);

  return (
    <section className="py-20 bg-muted/30 border-y">
      <div className="container mx-auto px-4 max-w-7xl">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-10 text-foreground">
          What our customers say
        </h2>

        <div className="bg-card-light rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-12">
          <div
            className="
            flex flex-nowrap
            items-center
            gap-6
            px-6 py-2
            border-b border-gray-200
            bg-gray-50
            overflow-x-auto
            no-scrollbar
            md:overflow-x-visible
          "
          >
            {platforms.map((p) => (
              <button
                key={p}
                onClick={() => setFilter(p)}
                className={cn(
                  "group flex items-center gap-2 text-sm whitespace-nowrap transition-colors py-2",
                  filter === p
                    ? "font-bold text-foreground border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {p !== "All Reviews" && (
                  <PlatformIcon platform={p} className="h-4 w-4 shrink-0" />
                )}
                <span>{p}</span>
              </button>
            ))}
          </div>

          <div className="bg-gray-50 px-6 py-6 md:px-8 md:py-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h3 className="text-xl font-bold text-foreground mb-1">
                Overall Rating
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-foreground">
                  {aggregates.overall.avg_rating.toFixed(1)}
                </span>
                <div className="flex text-yellow-400 text-lg">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-5 h-5",
                        i < Math.round(aggregates.overall.avg_rating)
                          ? "fill-current"
                          : "text-gray-300"
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground font-medium">
                  ({aggregates.overall.total_reviews} reviews)
                </span>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="lg" className="w-full md:w-auto">
                  Write a review
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <a
                    href="https://g.page/r/Cb3i9Eu0K5MREB0/review"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <PlatformIcon platform="Google" className="h-4 w-4" />
                    Google Review
                  </a>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <a
                    href="https://www.tripadvisor.com/Attraction_Review-g297715-d19983165-Reviews-Java_Volcano_Tour_Operator-Surabaya_East_Java_Java.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <PlatformIcon platform="Tripadvisor" className="h-4 w-4" />
                    Tripadvisor
                  </a>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <a
                    href="https://www.trustpilot.com/review/javavolcano-touroperator.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <PlatformIcon platform="Trustpilot" className="h-4 w-4" />
                    Trustpilot
                  </a>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <a
                    href="https://www.klook.com/activity/99790-3-day-mount-bromo-sunrise-ijen-madakaripura-trekking-trip-surabaya/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <PlatformIcon platform="Klook" className="h-4 w-4" />
                    Klook
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full relative"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {filteredReviews.slice(0, 12).map((review, index) => (
              <CarouselItem
                key={review.id}
                className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/4"
              >
                <div className="p-1 h-full">
                  <ReviewCard review={review} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {filteredReviews.length > 0 && (
            <>
              <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 flex bg-primary text-primary-foreground hover:bg-primary/80 shadow-none hover:translate-x-0 hover:translate-y-0" />
              <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 flex bg-primary text-primary-foreground hover:bg-primary/80 shadow-none hover:translate-x-0 hover:translate-y-0" />
            </>
          )}
        </Carousel>

        <div className="mt-12 text-center">
          <Button size="lg" variant="outline">
            <Link href="/reviews">See All Reviews</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
