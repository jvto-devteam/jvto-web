"use client";

import * as React from "react";
import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import SEO from "./SEO";
import StructuredData from "./StructuredData";
import Breadcrumbs from "./Breadcrumbs";
import { tourPackages } from "@/data";
import { destinationsData } from "@/data/destinations";
import { formatIDR } from "@/utils/formatting";
import IjenHealthCertFAQ from "./IjenHealthCertFAQ";
import {
  DestinationProperty,
  TourPackage as TourPackageType,
  PriceTier,
} from "@/types";
import GpxMap from "./GpxMap";
import ElevationChart from "./ElevationChart";
import Modal from "./Modal";
import AccordionItem from "./AccordionItem";
import RouteMap from "./RouteMap";
import { miniFaqs } from "@/constants";

const getTourBySlug = (slug: string) => {
  return tourPackages.find((t) => t.slug === slug) || null;
};

function buildTourJsonLd(tour: TourPackageType) {
  const SITE_ORIGIN = "https://javavolcano-touroperator.com";
  const fullTourSlug = `/tours/${tour.slug}`;
  const AGENCY_ID = `${SITE_ORIGIN}/#travelagency`;

  const offers =
    tour.priceTiers?.map((tier) => ({
      "@type": "Offer",
      sku: `${tour.id}-${tier.pax}pax`,
      price: tier.pricePerPerson,
      priceCurrency: "IDR",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        unitText: "person",
        price: tier.pricePerPerson,
        priceCurrency: "IDR",
        eligibleQuantity: {
          "@type": "QuantitativeValue",
          value: tier.pax,
        },
      },
      availability: "https://schema.org/InStock",
      url: `${SITE_ORIGIN}/#${fullTourSlug}`,
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        returnPolicyCategory: "https://schema.org/Refundable",
        merchantReturnDays: 2,
        additionalProperty: [
          {
            "@type": "PropertyValue",
            name: "lateRescheduleFee",
            value: "50% may apply if rescheduling within the late window.",
          },
          {
            "@type": "PropertyValue",
            name: "voucherOption",
            value:
              "Voucher/reschedule paths may be offered when refunds are not possible.",
          },
        ],
      },
      validFrom: new Date().toISOString().split("T")[0],
    })) || [];

  return {
    "@context": "https://schema.org",
    "@type": ["Product", "TouristTrip"],
    name: tour.label,
    description: tour.description,
    image: [tour.imageUrl, ...(tour.gallery || [])],
    sku: tour.id,
    provider: {
      "@type": "TravelAgency",
      "@id": AGENCY_ID,
      name: "Java Volcano Tour Operator",
    },
    tripOrigin: tour.originCity,
    aggregateRating: tour.aggregateRating
      ? {
          "@type": "AggregateRating",
          ratingValue: tour.aggregateRating.ratingValue,
          reviewCount: tour.aggregateRating.reviewCount,
        }
      : undefined,
    offers: offers,
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "ijenHealthCertificateIncluded",
        value: "true",
        description:
          "Ijen health certificate is included and arranged by JVTO nurse at the hotel. No local cash payment required.",
      },
      {
        "@type": "PropertyValue",
        name: "tourModel",
        value: "Private, all-inclusive (no transport-only service).",
      },
    ],
  } as const;
}

const IconPill: React.FC<{ icon: string; text: string }> = ({ icon, text }) => (
  <div className="flex items-center gap-2 p-3 bg-background-light dark:bg-ink-primary rounded-lg border border-ink-neutral-200 dark:border-ink-neutral-700">
    <span className="material-symbols-outlined text-primary text-xl">
      {icon}
    </span>
    <span className="text-sm font-medium text-ink-primary dark:text-white">
      {text}
    </span>
  </div>
);

const Section: React.FC<{
  title: string;
  children: React.ReactNode;
  className?: string;
}> = ({ title, children, className = "" }) => (
  <section className={`py-8 ${className}`}>
    <h2 className="h3 text-ink-primary dark:text-white mb-4">{title}</h2>
    <div className="prose dark:prose-invert max-w-none text-ink-neutral-700 dark:text-ink-neutral-300">
      {children}
    </div>
  </section>
);

const formatGpxMetric = (
  prop: DestinationProperty
): { label: string; value: string } | null => {
  if (typeof prop.value !== "number") return null;

  // Round to integer, except for distance which gets one decimal place.
  const roundedValue = Math.round(prop.value);

  switch (prop.propertyID) {
    case "gpxTotalDistanceKm":
      return { label: "Distance", value: `${prop.value.toFixed(1)} km` };
    case "gpxElevationGainM":
      return { label: "Elevation Gain", value: `${roundedValue} m` };
    case "gpxElevationLossM":
      return { label: "Elevation Loss", value: `${roundedValue} m` };
    case "gpxMinElevationM":
      return { label: "Min Elevation", value: `${roundedValue} m` };
    case "gpxMaxElevationM":
      return { label: "Max Elevation", value: `${roundedValue} m` };
    default:
      return null;
  }
};

const gpxMetricOrder = [
  "gpxTotalDistanceKm",
  "gpxElevationGainM",
  "gpxElevationLossM",
  "gpxMinElevationM",
  "gpxMaxElevationM",
];

const parseBounds = (
  boundsStr: string
): [[number, number], [number, number]] | null => {
  const parts = boundsStr.split(" ");
  if (parts.length !== 2) return null;
  const [minCoords, maxCoords] = parts;
  const [lat_min, lon_min] = minCoords.split(",").map(Number);
  const [lat_max, lon_max] = maxCoords.split(",").map(Number);
  if ([lat_min, lon_min, lat_max, lon_max].some(isNaN)) return null;
  // Leaflet bounds are [[lat_min, lon_min], [lat_max, lon_max]]
  return [
    [lat_min, lon_min],
    [lat_max, lon_max],
  ];
};

const TourDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [isIjenFaqOpen, setIsIjenFaqOpen] = React.useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [openExpectation, setOpenExpectation] = useState<string | null>(
    "fitness"
  );
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const tour = getTourBySlug(slug);
  const metaDescription = React.useMemo(
    () =>
      `Book the ${tour.label}: A ${tour.durationDays}-day/${
        tour.durationNights
      }-night private, all-inclusive tour. Key experiences include: ${tour.keyExperiences.join(
        ", "
      )}. Secure your adventure with a licensed operator.`,
    [tour]
  );

  const destinationsWithGpx = React.useMemo(() => {
    if (!tour) return [];

    const uniqueDestinations = (tour.itineraryDays || tour.itinerary)
      .flatMap((day) => day.activities)
      .map((activity) => activity.destinationName)
      .filter((name): name is string => !!name)
      .map((name) => {
        const normalizedName = name.toLowerCase();
        return destinationsData.find(
          (dest) =>
            dest.name.toLowerCase() === normalizedName ||
            (normalizedName === "mount ijen" && dest.id === "ijen") ||
            (normalizedName.includes("bromo") && dest.id === "bromo")
        );
      })
      .filter(
        (dest): dest is NonNullable<typeof dest> =>
          !!dest && !!dest.gpxTrack && !!dest.gpxElevationProfile
      )
      .filter(
        (dest, index, self) => self.findIndex((d) => d.id === dest.id) === index
      );

    return uniqueDestinations;
  }, [tour]);

  const routeStops = React.useMemo(() => {
    if (!tour) return [];
    return tour.route
      .map((routeName) => {
        const dest = destinationsData.find((d) =>
          d.name
            .toLowerCase()
            .includes(routeName.toLowerCase().replace("mount-", ""))
        );
        if (dest) {
          return {
            name: dest.name,
            coords: [dest.geo.latitude, dest.geo.longitude] as [number, number],
          };
        }
        return null;
      })
      .filter(
        (stop): stop is { name: string; coords: [number, number] } =>
          stop !== null
      );
  }, [tour]);

  const images = React.useMemo(
    () => [tour.imageUrl, ...(tour.gallery || [])].filter(Boolean),
    [tour]
  );

  if (!slug) {
    return <div>Loading tour...</div>;
  }
  if (!tour) {
    return (
      <div className="container mx-auto px-4 py-36 text-center">
        <h1 className="text-4xl font-bold">Tour Not Found</h1>
        <p className="mt-4 text-lg">
          We {`couldn't`} find the tour you were looking for.
        </p>
        <Link
          href="/tours"
          className="mt-8 inline-block px-8 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-opacity-90"
        >
          Back to All Tours
        </Link>
      </div>
    );
  }

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => setIsLightboxOpen(false);
  const nextImage = () =>
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () =>
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

  const origin = tour.originCity;
  const fullTourSlug = `/tours/${slug}`;
  const jsonLd = buildTourJsonLd(tour);
  const breadcrumbCrumbs = [
    { name: "Home", path: "/" },
    { name: "Tours", path: "/tours" },
    {
      name: `From ${origin.charAt(0).toUpperCase() + origin.slice(1)}`,
      path: `/tours/from/${origin}`,
    },
    { name: tour.label, path: fullTourSlug },
  ];

  const basePrice =
    tour.priceTiers && tour.priceTiers.length > 0
      ? Math.min(...tour.priceTiers.map((p) => p.pricePerPerson))
      : 0;

  const itineraryData = tour.itineraryDays || tour.itinerary;

  return (
    <>
      <SEO title={`${tour.label} | JVTO Tours`} description={metaDescription} />
      <StructuredData data={jsonLd} />

      <main className="bg-background-light dark:bg-background-dark pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <header>
                <Breadcrumbs crumbs={breadcrumbCrumbs} />
                <h1 className="mt-4 h2 text-ink-primary dark:text-white">
                  {tour.label}
                </h1>
                <p className="mt-3 text-lg text-ink-neutral-700 dark:text-ink-neutral-300">
                  {tour.description}
                </p>
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                  <IconPill
                    icon="schedule"
                    text={`${tour.durationDays}D/${tour.durationNights}N`}
                  />
                  <IconPill icon="tour" text="Private Tour" />
                  <IconPill icon="fitness_center" text={tour.physicality} />
                  {tour.aggregateRating && (
                    <IconPill
                      icon="star"
                      text={`${tour.aggregateRating.ratingValue}/5 (${tour.aggregateRating.reviewCount} reviews)`}
                    />
                  )}
                </div>
              </header>

              <div className="space-y-4">
                <div
                  className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl shadow-lg group cursor-pointer"
                  onClick={() => openLightbox(currentImageIndex)}
                >
                  <img
                    src={images[currentImageIndex]}
                    alt={`Main view of the ${tour.label} tour.`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-white text-6xl">
                      zoom_in
                    </span>
                  </div>
                </div>
                {images.length > 1 && (
                  <div className="grid grid-cols-5 md:grid-cols-8 gap-2">
                    {images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`aspect-square w-full rounded-lg overflow-hidden focus:outline-none focus:ring-2 ring-offset-2 ring-offset-background-light dark:ring-offset-background-dark ${
                          currentImageIndex === index
                            ? "ring-2 ring-primary"
                            : "opacity-70 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={img}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-6 bg-white dark:bg-ink-primary rounded-2xl border border-ink-neutral-200 dark:border-ink-neutral-700">
                <h3 className="text-xl font-bold text-ink-primary dark:text-white mb-2">
                  Why Book This Tour with JVTO?
                </h3>
                <p className="text-ink-neutral-700 dark:text-ink-neutral-300">
                  As a government-licensed tour operator with a physical office
                  and a team founded by a Tourist Police officer, we guarantee
                  accountability and safety. Our all-inclusive pricing means no
                  surprise costs.{" "}
                  <Link
                    href="/why-jvto/the-jvto-difference"
                    className="text-primary font-semibold hover:underline"
                  >
                    Learn more about the JVTO Difference.
                  </Link>
                </p>
              </div>

              {tour.recommendedFor && tour.recommendedFor.length > 0 && (
                <Section title="Recommended For" className="!pt-0">
                  <div className="flex flex-wrap gap-2">
                    {tour.recommendedFor.map((travelerType) => (
                      <span
                        key={travelerType}
                        className="text-sm font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 px-3 py-1.5 rounded-full"
                      >
                        {travelerType}
                      </span>
                    ))}
                  </div>
                </Section>
              )}

              <Section title="Day-by-Day Itinerary">
                <div className="space-y-6">
                  {itineraryData.map((day) => (
                    <div
                      key={day.day}
                      className="p-4 border-l-4 border-primary bg-background-light dark:bg-ink-primary rounded-r-lg"
                    >
                      <h3 className="font-bold text-lg text-ink-primary dark:text-white">
                        Day {day.day}: {day.title}
                      </h3>
                      {"summary" in day && day.summary && (
                        <p className="mt-1">{day.summary}</p>
                      )}
                      {"details" in day && day.details && (
                        <p className="mt-1">{day.details}</p>
                      )}

                      {"mealsPlan" in day && (
                        <div className="flex items-center gap-4 mt-3 text-sm">
                          <span className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-base">
                              drive_eta
                            </span>{" "}
                            {day.drivingTime || "N/A"}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-base">
                              bed
                            </span>{" "}
                            {day.overnight || "N/A"}
                          </span>
                        </div>
                      )}

                      <ul className="mt-3 space-y-2 text-sm">
                        {day.activities.map((activity) => (
                          <li
                            key={activity.name}
                            className="flex items-start gap-3"
                          >
                            <span className="material-symbols-outlined text-primary text-base mt-0.5">
                              route
                            </span>
                            <span>
                              <strong>
                                {activity.name}
                                {activity.destinationName
                                  ? ` (${activity.destinationName})`
                                  : ""}
                                :
                              </strong>{" "}
                              {activity.description || activity.notes}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </Section>

              {routeStops.length > 0 && (
                <Section title="Tour Route Overview">
                  <p className="mb-4 text-sm not-prose">
                    This map shows the general overland route for your tour. The
                    actual path and timings may vary based on road conditions.
                  </p>
                  <RouteMap stops={routeStops} />
                </Section>
              )}

              <Section title="Inclusions & Exclusions" className="!pt-0">
                <p className="text-center font-semibold text-ink-primary dark:text-white bg-green-100 dark:bg-green-900/50 py-2 px-4 rounded-lg">
                  No Hidden Costs. The Price You See is The Price You Pay.
                </p>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold flex items-center gap-2 text-green-700 dark:text-green-400">
                      <span className="material-symbols-outlined">
                        check_circle
                      </span>{" "}
                      {`What's`} Included
                    </h3>
                    <ul className="mt-2 space-y-1 list-none">
                      {tour.inclusions.map((item) => {
                        const isIjenCert = item
                          .toLowerCase()
                          .includes("ijen health");
                        return (
                          <li
                            key={item}
                            className={`flex items-start gap-2 ${
                              isIjenCert
                                ? "font-semibold text-green-800 dark:text-green-300"
                                : ""
                            }`}
                          >
                            <span
                              className={`material-symbols-outlined text-green-500 text-sm mt-1`}
                            >
                              {isIjenCert ? "health_and_safety" : "check"}
                            </span>
                            <span>{item}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold flex items-center gap-2 text-red-600 dark:text-red-400">
                      <span className="material-symbols-outlined">cancel</span>{" "}
                      {`What's`} Not Included
                    </h3>
                    <ul className="mt-2 space-y-1 list-disc list-inside">
                      {tour.exclusions.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Section>

              <Section title="What to Expect on Your Tour" className="!pt-0">
                <div className="space-y-2 not-prose">
                  <AccordionItem
                    title="Physicality & Fitness"
                    isOpen={openExpectation === "fitness"}
                    onClick={() =>
                      setOpenExpectation(
                        openExpectation === "fitness" ? null : "fitness"
                      )
                    }
                  >
                    <p>
                      This tour is rated as <strong>{tour.physicality}</strong>.
                    </p>
                    {tour.travelerRequirements &&
                      tour.travelerRequirements.length > 0 && (
                        <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg border border-yellow-200 dark:border-yellow-700">
                          <div className="flex items-start gap-3">
                            <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-400 mt-1">
                              info
                            </span>
                            <div>
                              <h4 className="font-semibold text-ink-primary dark:text-white">
                                Important Traveler Requirements
                              </h4>
                              <ul className="mt-2 list-disc list-inside space-y-1 text-sm text-yellow-800 dark:text-yellow-200">
                                {tour.travelerRequirements.map((req, index) => (
                                  <li key={index}>{req}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                  </AccordionItem>
                  <AccordionItem
                    title="Packing List"
                    isOpen={openExpectation === "packing"}
                    onClick={() =>
                      setOpenExpectation(
                        openExpectation === "packing" ? null : "packing"
                      )
                    }
                  >
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-bold text-ink-primary dark:text-white">
                          Gear We Provide
                        </h4>
                        {tour.gearProvided && tour.gearProvided.length > 0 ? (
                          <ul className="list-disc list-inside text-sm">
                            {tour.gearProvided.map((item) => (
                              <li key={item.item}>{item.item}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm">
                            Standard safety equipment provided as needed.
                          </p>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-ink-primary dark:text-white">
                          What We Recommend You Bring
                        </h4>
                        {tour.gearRecommended &&
                        tour.gearRecommended.length > 0 ? (
                          <div className="space-y-3">
                            {tour.gearRecommended.map((cat) => (
                              <div key={cat.category}>
                                <h5 className="font-semibold text-sm">
                                  {cat.category}
                                </h5>
                                <ul className="list-disc list-inside text-sm">
                                  {cat.items.map((item) => (
                                    <li key={item}>{item}</li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm">
                            Comfortable clothing and sturdy shoes are always
                            recommended.
                          </p>
                        )}
                      </div>
                    </div>
                  </AccordionItem>
                  <AccordionItem
                    title="Safety & Important Notes"
                    isOpen={openExpectation === "safety"}
                    onClick={() =>
                      setOpenExpectation(
                        openExpectation === "safety" ? null : "safety"
                      )
                    }
                  >
                    <div className="space-y-4 text-sm">
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
                        <p>
                          <strong>Ijen Blue Fire Disclosure:</strong> The famous{" "}
                          {`"blue fire"`} is a natural phenomenon.{" "}
                          <strong>Its visibility is not guaranteed</strong> and
                          depends entirely on volcanic activity, weather, and
                          wind conditions on the day of your trek. Our guides
                          will ensure you have the best possible chance to
                          witness it safely.
                        </p>
                      </div>
                      <p>
                        <strong>Gas Mask Hygiene:</strong> All provided gas
                        masks are professionally cleaned and inspected before
                        each use.
                      </p>
                      <div>
                        <button
                          onClick={() => setIsIjenFaqOpen((prev) => !prev)}
                          className="flex justify-between items-center w-full p-4 mt-2 text-left font-semibold text-ink-primary dark:text-white bg-white dark:bg-ink-primary rounded-lg border border-ink-neutral-200 dark:border-ink-neutral-700 hover:bg-ink-neutral-50 dark:hover:bg-ink-neutral-900/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                          aria-expanded={isIjenFaqOpen}
                          aria-controls="ijen-faq-content"
                        >
                          <span>
                            More on: Ijen Health Certificate & Trek Details
                          </span>
                          <span
                            className={`material-symbols-outlined transition-transform duration-300 ${
                              isIjenFaqOpen ? "rotate-180" : ""
                            }`}
                          >
                            expand_more
                          </span>
                        </button>
                        {isIjenFaqOpen && <IjenHealthCertFAQ />}
                      </div>
                    </div>
                  </AccordionItem>
                </div>
              </Section>

              <Section title="Frequently Asked Questions" className="!pt-0">
                <div className="space-y-2 not-prose">
                  {miniFaqs.map((faq, index) => (
                    <AccordionItem
                      key={index}
                      title={faq.question}
                      isOpen={openFaqIndex === index}
                      onClick={() =>
                        setOpenFaqIndex(openFaqIndex === index ? null : index)
                      }
                    >
                      <p>{faq.answer}</p>
                    </AccordionItem>
                  ))}
                </div>
              </Section>

              {destinationsWithGpx.length > 0 && (
                <Section title="Trekking & Route Analytics" className="!pt-0">
                  <div className="space-y-6">
                    {destinationsWithGpx.map((dest) => {
                      if (!dest) return null;
                      const gpxProps = dest.properties
                        .filter((p) => gpxMetricOrder.includes(p.propertyID))
                        .sort(
                          (a, b) =>
                            gpxMetricOrder.indexOf(a.propertyID) -
                            gpxMetricOrder.indexOf(b.propertyID)
                        );

                      const boundsProp = dest.properties.find(
                        (p) => p.propertyID === "gpxBoundingBox"
                      );
                      const track = dest.gpxTrack;
                      let bounds: [[number, number], [number, number]] | null =
                        null;
                      if (boundsProp && typeof boundsProp.value === "string") {
                        bounds = parseBounds(boundsProp.value);
                      }

                      if (gpxProps.length === 0) return null;

                      return (
                        <div
                          key={dest.id}
                          className="p-4 bg-background-light dark:bg-ink-primary rounded-lg border border-ink-neutral-200 dark:border-ink-neutral-700"
                        >
                          <h4 className="font-bold text-lg text-ink-primary dark:text-white">
                            {dest.name}
                          </h4>
                          <p className="text-sm text-ink-neutral-500 mb-4">
                            GPX-derived metrics for the primary trail.
                          </p>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                              {gpxProps.map((prop) => {
                                const formatted = formatGpxMetric(prop);
                                if (!formatted) return null;
                                return (
                                  <div
                                    key={prop.propertyID}
                                    className="p-3 bg-white dark:bg-ink-neutral-900/50 rounded-lg border border-ink-neutral-200 dark:border-ink-neutral-700"
                                  >
                                    <p className="text-xs font-semibold uppercase text-ink-neutral-500">
                                      {formatted.label}
                                    </p>
                                    <p className="text-lg font-bold text-primary">
                                      {formatted.value}
                                    </p>
                                  </div>
                                );
                              })}
                            </div>
                            {dest.gpxElevationProfile &&
                              dest.gpxElevationProfile.length > 0 && (
                                <div className="p-4 bg-white dark:bg-ink-neutral-900/50 rounded-lg border border-ink-neutral-200 dark:border-ink-neutral-700">
                                  <h5 className="font-semibold text-ink-neutral-500 dark:text-ink-neutral-400 text-sm mb-2">
                                    Elevation Profile
                                  </h5>
                                  <ElevationChart
                                    data={dest.gpxElevationProfile}
                                  />
                                </div>
                              )}
                          </div>
                          {track && bounds && (
                            <div className="mt-4">
                              <h5 className="font-semibold text-ink-neutral-500 dark:text-ink-neutral-400 text-sm mb-2">
                                Route Map
                              </h5>
                              <GpxMap track={track} bounds={bounds} />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </Section>
              )}

              {tour.featuredReviews && tour.featuredReviews.length > 0 && (
                <Section title="What Our Travelers Say" className="!pt-0">
                  {tour.featuredReviews.map((review, index) => (
                    <blockquote
                      key={index}
                      className="p-4 bg-background-light dark:bg-ink-primary rounded-lg border-l-4 border-primary mb-4"
                    >
                      <p className="italic">{`"${review.text}"`}</p>
                      <footer className="text-right mt-2 font-semibold">
                        - {review.author}, via {review.source}
                      </footer>
                    </blockquote>
                  ))}
                  <Link
                    href="/why-jvto/reviews"
                    className="text-primary font-semibold hover:underline"
                  >
                    Read All Reviews →
                  </Link>
                </Section>
              )}
            </div>

            {/* Sticky Sidebar */}
            <aside className="lg:col-span-1 lg:sticky top-24">
              <div className="bg-white dark:bg-ink-primary p-6 rounded-2xl shadow-lg border border-ink-neutral-200 dark:border-ink-neutral-700">
                <h3 className="text-xl font-bold text-center mb-4 text-ink-primary dark:text-white">
                  Pricing per Person
                </h3>
                {tour.priceTiers && tour.priceTiers.length > 0 ? (
                  <div className="space-y-2">
                    {tour.priceTiers
                      .sort((a, b) => a.pax - b.pax)
                      .map((tier: PriceTier) => (
                        <div
                          key={tier.pax}
                          className="flex justify-between items-center text-sm p-3 rounded-lg even:bg-background-light dark:even:bg-ink-neutral-900/50"
                        >
                          <span className="text-ink-neutral-700 dark:text-ink-neutral-300">
                            {tier.pax} traveler{tier.pax > 1 ? "s" : ""}
                          </span>
                          <span className="font-semibold text-primary text-base">
                            {formatIDR(tier.pricePerPerson)}
                          </span>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-lg font-bold text-primary">
                      Price on Request
                    </p>
                    <p className="text-sm text-ink-neutral-500 mt-1">
                      Please contact us for a custom quote.
                    </p>
                  </div>
                )}
                <Link
                  to={`${fullTourSlug}/book`}
                  className="block w-full text-center mt-6 px-5 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-opacity-90 transition-colors"
                >
                  Book This Tour
                </Link>
                <p className="text-xs text-center mt-2 text-ink-neutral-500">
                  You {`won't`} be charged yet
                </p>
              </div>
            </aside>
          </div>
        </div>

        {/* Lightbox Modal */}
        <Modal
          isOpen={isLightboxOpen}
          onClose={closeLightbox}
          title={`${tour.label} - Image Gallery`}
        >
          <div className="relative">
            <img
              src={images[currentImageIndex]}
              alt={`Enlarged view of ${tour.label} tour, image ${
                currentImageIndex + 1
              }`}
              className="w-full h-auto object-contain rounded-lg max-h-[75vh]"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  aria-label="Previous image"
                  className="absolute top-1/2 left-0 sm:-left-4 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                >
                  <span className="material-symbols-outlined">
                    arrow_back_ios_new
                  </span>
                </button>
                <button
                  onClick={nextImage}
                  aria-label="Next image"
                  className="absolute top-1/2 right-0 sm:-right-4 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                >
                  <span className="material-symbols-outlined">
                    arrow_forward_ios
                  </span>
                </button>
              </>
            )}
          </div>
        </Modal>

        {/* Sticky Footer for Mobile */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-t border-ink-neutral-200 dark:border-ink-neutral-700 p-3">
          <div className="container mx-auto flex items-center justify-between">
            <div>
              <p className="text-xs text-ink-neutral-500">From</p>
              <p className="font-bold text-ink-primary dark:text-white">
                {basePrice > 0 ? formatIDR(basePrice) : "On Request"}
              </p>
            </div>
            <Link
              href={`${fullTourSlug}/book`}
              className="px-6 py-4 rounded-lg bg-primary text-white font-semibold"
            >
              Book Now
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};

export default TourDetail;
