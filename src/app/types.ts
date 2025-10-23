export interface PackageData {
  id: number;
  package_code: string;
  name: string;
  duration: Duration;
  departure: string;
  return: string;
  overview: string;
  galleries: GalleryItem[];
  itinerary: Itinerary[];
  accommodation: AccommodationDetail[];
  package_price: PackagePrice[];
  included: string[];
  exclude: string[];
}