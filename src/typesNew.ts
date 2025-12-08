
export enum Difficulty {
  EASY = 'Easy',
  MODERATE = 'Moderate',
  CHALLENGING = 'Challenging',
  HARD = 'Hard'
}

export interface ItineraryDay {
  day: number;
  title: string;
  summary: string;
  activities: {
    type: string;
    name: string;
    description: string;
    timeWindow: string;
  }[];
  mealsPlan: {
    breakfast: string;
    lunch: string;
    dinner: string;
  };
}

export interface TourPackage {
  id: string;
  slug: string;
  name: string;
  shortLabel: string;
  originCity: string;
  duration: string;
  priceFrom: number;
  currency: string;
  difficulty: Difficulty;
  highlights: string[];
  imageUrl: string;
  gallery: string[];
  isPrivate: boolean;
  rating: number;
  reviewCount: number;
  tags: string[];
  description: string;
  inclusions: string[];
  exclusions: string[];
  travelerRequirements: string[];
  itinerary: ItineraryDay[];
}

export interface Testimonial {
  Reviewer_Name: string;
  Review_Date: string;
  Rating: string;
  Source: string;
  Review_Title: string;
  Review_Text: string;
  Traveler_Type: string;
  Key_Personnel_Mentioned: Record<string, string>;
  JVTO_Response_Date: string;
}
