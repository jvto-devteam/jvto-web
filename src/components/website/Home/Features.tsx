import { ShieldCheck, FileText, UserCheck } from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    {
      icon: <ShieldCheck className="w-8 h-8 text-jvto-green" />,
      title: "Tourist Police Led",
      desc: "Safety mindset shaped by field experience and cooperation with local authorities in East Java."
    },
    {
      icon: <UserCheck className="w-8 h-8 text-jvto-green" />,
      title: "Private & Personal",
      desc: "Private-only vehicles and guide team for your group on every itinerary. No strangers."
    },
    {
      icon: <FileText className="w-8 h-8 text-jvto-green" />,
      title: "Written Transparency",
      desc: "Clear written inclusions, cancellation rules, and Ijen health screening steps before you pay."
    }
  ];

  return (
    <section className="py-8 bg-gray-50 border-b border-gray-200">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((item, index) => (
            <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-white shadow-sm border border-gray-100">
              <div className="mt-1">{item.icon}</div>
              <div>
                <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;