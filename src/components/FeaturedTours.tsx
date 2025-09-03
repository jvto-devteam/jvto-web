import TourCard from './TourCard';

const tours = [
  {
    title: 'Bromo Sunrise',
    image:
      'https://images.unsplash.com/photo-1516916759473-0a0e6c47b7e5?auto=format&fit=crop&w=800&q=80',
    description:
      'Watch the sun rise over Mount Bromo in a once-in-a-lifetime experience.',
    price: '$120',
  },
  {
    title: 'Ijen Blue Fire',
    image:
      'https://images.unsplash.com/photo-1507835661777-60651b5ef8c7?auto=format&fit=crop&w=800&q=80',
    description:
      'Hike to the Ijen crater to witness the famous electric-blue flames.',
    price: '$150',
  },
  {
    title: 'Merapi Lava Tour',
    image:
      'https://images.unsplash.com/photo-1603810392499-67896dfa8b32?auto=format&fit=crop&w=800&q=80',
    description:
      'Explore the slopes of Merapi on a thrilling jeep adventure.',
    price: '$90',
  },
];

export default function FeaturedTours() {
  return (
    <section className="py-12 px-4 md:px-16 bg-gray-50">
      <h2 className="text-3xl font-bold text-center mb-8">Featured Tours</h2>
      <div className="grid gap-8 md:grid-cols-3">
        {tours.map((tour) => (
          <TourCard key={tour.title} {...tour} />
        ))}
      </div>
    </section>
  );
}

