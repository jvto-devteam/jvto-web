export interface BookingData {
  id: number;
  booking_code: string;
  url: string; // Hash URL
  status: string;
  customer_name: string;
  customer_id: number;
  package_name: string;
  channel: string;
  package_link: string;
  duration: string;
  travel_date_start: string;
  travel_date_end: string;
  total_pax: number;
  
  // Logistik
  pickup: string;
  pickup_time: string;
  drop: string;
  drop_time: string;
  special_requirements: string | null;

  // Ukuran Kaos
  tshirt_sizes: {
    xs: number;
    s: number;
    m: number;
    l: number;
    xl: number;
    xxl: number;
  };

  // Data Crew & Mobil
  crews: {
    guides: Array<{ id: number; name: string; photo: string; role: string }>;
    drivers: Array<{ id: number; name: string; photo: string; role: string }>;
  };
  vehicle_specs: Array<{
    name: string;
    capacity: string;
    banner: string;
    interior: string[];
  }>;

  // Itinerary
  itineraries: Array<{
    day: number;
    title: string;
    itinerary: string;
    activity: string; // HTML string
  }>;

  // Akomodasi
  accommodations: Array<{
    day: number;
    name: string;
    banner: string;
    rooms: string;
  }>;

  // Add-ons
  addons: Array<{
    id: number;
    name: string;
    qty: number;
    price: number;
    subtotal: number;
  }>;

  // Keuangan
  finance: {
    grand_total: number;
    total_addons: number;
    dp_amount: number;
    balance: number;
    paid_amount: number;
    due_date: string;
    payment_method: string | null; // 'cc', 'wise', 'cash'
    payment_link: string | null;
    payment_history: Array<{
      id: number;
      nominal: number;
      description: string;
      reference: string | null;
      method: string;
      created_at: string;
    }>;
  };

  // Static Content
  faq: Record<string, Record<string, string>>;
  packing_recommendations: Record<string, string[]>;
  essential_checklist: Array<{ item: string; checked: boolean }>;
}