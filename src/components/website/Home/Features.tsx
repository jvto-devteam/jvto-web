import { ShieldCheck, BadgeCheck, Building2, Star } from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    {
      icon: <ShieldCheck className="w-8 h-8 text-jvto-green" />,
      title: "Police-Led Safety",
      desc: "Active Tourist Police Founder"
    },
    {
      icon: <BadgeCheck className="w-8 h-8 text-jvto-green" />,
      title: "Licensed Operator",
      desc: "No. 1102230032918"
    },
    {
      icon: <Building2 className="w-8 h-8 text-jvto-green" />,
      title: "Bondowoso Office",
      desc: "Visit Us Anytime"
    },
    {
      icon: <Star className="w-8 h-8 text-jvto-green" />,
      title: "4.9★ Guest Reviews",
      desc: "Google & TripAdvisor"
    }
  ];

  return (
    <section className="py-8 bg-gray-50 border-b border-gray-200">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {features.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-4 rounded-sm bg-white shadow-sm border border-gray-100"
            >
              <div className="mt-1">{item.icon}</div>
              <div>
                <h2 className="font-bold text-lg mb-1">{item.title}</h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
