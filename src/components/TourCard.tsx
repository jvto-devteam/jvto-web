'use client';

interface TourCardProps {
  title: string;
  image: string;
  description: string;
  price: string;
}

export default function TourCard({ title, image, description, price }: TourCardProps) {
  const handleBook = () => {
    alert(`Booking ${title}`);
  };

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden flex flex-col">
      <img src={image} alt={title} className="h-40 w-full object-cover" />
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4 flex-grow">{description}</p>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-orange-600 font-bold">{price}</span>
          <button
            onClick={handleBook}
            className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}

