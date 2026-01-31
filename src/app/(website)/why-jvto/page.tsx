"use client";

import { useState } from "react";
import {
  Mountain,
  ShieldCheck,
  BadgeCheck,
  Users,
  MessageSquareText,
  History,
  Handshake,
  Timer,
  ChevronDown,
  Check,
} from "lucide-react";

export default function WhyJVTOPAGE() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="bg-[#f6f8f6] text-[#0d1b12] md:py-30 py-20 overflow-x-hidden antialiased">
      {/* Hero Section */}
      <section className="relative">
        <div className="px-4 py-8 sm:px-10 lg:px-40 flex justify-center">
          <div className="w-full max-w-[960px]">
            <div className="@container">
              <div className="@[480px]:p-4">
                <div
                  className="relative flex min-h-[480px] flex-col gap-6 items-center justify-center rounded-xl p-8 text-center overflow-hidden shadow-lg"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(13, 27, 18, 0.5) 0%, rgba(13, 27, 18, 0.7) 100%), url('https://lh3.googleusercontent.com/aida-public/AB6AXuAvw93ZYDhRCpohyjlosfEkkYLNB1ndJOsLUeB5sMqASm8bLRG5pCOLzcRGwX4dDEj3p0lJjJF7WPW-oR-0I5z70RjMRflDu70DUa6E3wiFeWVvPtppyWrufMSQ6Zor8-tCnSHsMF3R05efRNiDmH21cERm1TGOE15_e6XkTGF_nthouWk9gaBLNLOzNSUetqDSWuUMvgRXRiPX_Fsa8puWenc9iNoj2aDmOYfWJefQutZe5Zfiaqid6MbXPpkKG5xd0qSJK2aNP3M')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="flex flex-col gap-4 max-w-[700px] z-10">
                    <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] md:text-5xl lg:text-6xl drop-shadow-md">
                      Why Choose Java Volcano Tour Operator?
                    </h1>
                    <h2 className="text-gray-200 text-base font-normal leading-relaxed md:text-lg max-w-xl mx-auto">
                      Your safety, our transparency. Experience Bromo & Ijen
                      with verified local experts who put you first.
                    </h2>
                  </div>
                  <div className="z-10 mt-4">
                    <button className="flex items-center justify-center rounded-lg h-12 px-6 bg-[#11d452] hover:bg-green-500 text-[#0d1b12] text-base font-bold tracking-[0.015em] transition-transform transform hover:scale-105 shadow-xl">
                      <span>How to Book & Pay</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section: The Trust Stack */}
      <section className="w-full">
        <div className="px-4 py-10 sm:px-10 lg:px-40 flex justify-center">
          <div className="max-w-[960px] flex-1">
            <div className="flex flex-col gap-10 px-4 py-6 @container">
              <div className="flex flex-col gap-3 text-center md:text-left">
                <h1 className="text-[#0d1b12] tracking-tight text-3xl font-bold leading-tight md:text-4xl max-w-[720px]">
                  The Trust Stack
                </h1>
                <p className="text-[#4c9a66] text-base font-medium leading-normal max-w-[720px]">
                  Built on safety protocols, absolute transparency, and deep
                  local expertise.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Card 1: Safety */}
                <div className="flex flex-col gap-4 rounded-xl border border-[#e7f3eb] bg-[#ffffff] p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-[#11d452] h-10 w-10 flex items-center justify-center bg-[#11d452]/10 rounded-full">
                    <ShieldCheck size={24} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-[#0d1b12] text-lg font-bold leading-tight">
                      Safety First
                    </h2>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Rigorous vehicle maintenance and mandatory driver rest
                      periods ensuring a safe journey through volcanic terrain.
                    </p>
                    <a
                      className="text-[#11d452] text-sm font-bold mt-2 hover:underline"
                      href="#"
                    >
                      Learn more about safety
                    </a>
                  </div>
                </div>

                {/* Card 2: Transparency */}
                <div className="flex flex-col gap-4 rounded-xl border border-[#e7f3eb] bg-[#ffffff] p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-[#11d452] h-10 w-10 flex items-center justify-center bg-[#11d452]/10 rounded-full">
                    <BadgeCheck size={24} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-[#0d1b12] text-lg font-bold leading-tight">
                      Proof & Transparency
                    </h2>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Clear pricing with absolute transparency—no hidden fees,
                      unexpected costs, or forced shopping stops.
                    </p>
                    <a
                      className="text-[#11d452] text-sm font-bold mt-2 hover:underline"
                      href="#"
                    >
                      See pricing policy
                    </a>
                  </div>
                </div>

                {/* Card 3: Local Team */}
                <div className="flex flex-col gap-4 rounded-xl border border-[#e7f3eb] bg-[#ffffff] p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-[#11d452] h-10 w-10 flex items-center justify-center bg-[#11d452]/10 rounded-full">
                    <Users size={24} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-[#0d1b12] text-lg font-bold leading-tight">
                      Local Team
                    </h2>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      100% local guides and drivers who know the terrain
                      intimately and respect the Tenggerese culture.
                    </p>
                    <a
                      className="text-[#11d452] text-sm font-bold mt-2 hover:underline"
                      href="#"
                    >
                      Meet the guides
                    </a>
                  </div>
                </div>

                {/* Card 4: Guest Voices */}
                <div className="flex flex-col gap-4 rounded-xl border border-[#e7f3eb] bg-[#ffffff] p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-[#11d452] h-10 w-10 flex items-center justify-center bg-[#11d452]/10 rounded-full">
                    <MessageSquareText size={24} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-[#0d1b12] text-lg font-bold leading-tight">
                      Guest Voices
                    </h2>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Real, verified reviews from travelers like you on trusted
                      3rd party platforms like TripAdvisor and Google.
                    </p>
                    <a
                      className="text-[#11d452] text-sm font-bold mt-2 hover:underline"
                      href="#"
                    >
                      Read reviews
                    </a>
                  </div>
                </div>

                {/* Card 5: History */}
                <div className="flex flex-col gap-4 rounded-xl border border-[#e7f3eb] bg-[#ffffff] p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-[#11d452] h-10 w-10 flex items-center justify-center bg-[#11d452]/10 rounded-full">
                    <History size={24} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-[#0d1b12] text-lg font-bold leading-tight">
                      History
                    </h2>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Over 10 years of operational experience delivering
                      high-quality private tours across East Java.
                    </p>
                    <a
                      className="text-[#11d452] text-sm font-bold mt-2 hover:underline"
                      href="#"
                    >
                      Our story
                    </a>
                  </div>
                </div>

                {/* Card 6: Partners */}
                <div className="flex flex-col gap-4 rounded-xl border border-[#e7f3eb] bg-[#ffffff] p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-[#11d452] h-10 w-10 flex items-center justify-center bg-[#11d452]/10 rounded-full">
                    <Handshake size={24} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-[#0d1b12] text-lg font-bold leading-tight">
                      Partners
                    </h2>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Official partnerships with registered tourism bodies and
                      verified local networks to ensure smooth operations.
                    </p>
                    <a
                      className="text-[#11d452] text-sm font-bold mt-2 hover:underline"
                      href="#"
                    >
                      View partners
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Verification Section */}
      <section className="bg-[#f0f7f2] border-y border-[#e7f3eb] py-12">
        <div className="px-4 sm:px-10 lg:px-40 flex justify-center">
          <div className="max-w-[960px] flex-1 flex flex-col md:flex-row gap-10">
            {/* Text Content */}
            <div className="flex-1 flex flex-col justify-center gap-4">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm mb-2">
                <Timer size={30} className="text-[#11d452]" />
              </div>
              <h2 className="text-[#0d1b12] text-3xl font-bold leading-tight tracking-[-0.015em]">
                Verify Us in 60 Seconds
              </h2>
              <p className="text-gray-600 text-lg">
                Don't just take our word for it. Here is how you can verify our
                legitimacy and safety record right now.
              </p>
            </div>
            {/* Checklist */}
            <div className="flex-1 bg-white rounded-xl p-6 shadow-sm border border-[#e7f3eb]">
              <div className="flex flex-col gap-4">
                <label className="flex gap-x-3 items-start cursor-pointer group">
                  <input
                    checked
                    className="mt-1 h-5 w-5 rounded border-2 border-gray-300 bg-transparent text-[#11d452] checked:bg-[#11d452] checked:border-[#11d452] focus:ring-0 focus:ring-offset-0 transition-colors"
                    type="checkbox"
                    readOnly
                  />
                  <span className="text-[#0d1b12] text-base font-normal leading-normal group-hover:text-[#11d452] transition-colors">
                    Check our 500+
                    <span className="underline">TripAdvisor reviews</span> for
                    recent guest experiences
                  </span>
                </label>
                <label className="flex gap-x-3 items-start cursor-pointer group">
                  <input
                    checked
                    className="mt-1 h-5 w-5 rounded border-2 border-gray-300 bg-transparent text-[#11d452] checked:bg-[#11d452] checked:border-[#11d452] focus:ring-0 focus:ring-offset-0 transition-colors"
                    type="checkbox"
                    readOnly
                  />
                  <span className="text-[#0d1b12] text-base font-normal leading-normal group-hover:text-[#11d452] transition-colors">
                    Verify our Business Registration Number (NIB) listed in the
                    footer
                  </span>
                </label>
                <label className="flex gap-x-3 items-start cursor-pointer group">
                  <input
                    checked
                    className="mt-1 h-5 w-5 rounded border-2 border-gray-300 bg-transparent text-[#11d452] checked:bg-[#11d452] checked:border-[#11d452] focus:ring-0 focus:ring-offset-0 transition-colors"
                    type="checkbox"
                    readOnly
                  />
                  <span className="text-[#0d1b12] text-base font-normal leading-normal group-hover:text-[#11d452] transition-colors">
                    Test our response time on WhatsApp (average &lt; 10 mins)
                  </span>
                </label>
                <label className="flex gap-x-3 items-start cursor-pointer group">
                  <input
                    checked
                    className="mt-1 h-5 w-5 rounded border-2 border-gray-300 bg-transparent text-[#11d452] checked:bg-[#11d452] checked:border-[#11d452] focus:ring-0 focus:ring-offset-0 transition-colors"
                    type="checkbox"
                    readOnly
                  />
                  <span className="text-[#0d1b12] text-base font-normal leading-normal group-hover:text-[#11d452] transition-colors">
                    Review our detailed itinerary and inclusion lists
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section: Quick Answers */}
      <section className="w-full py-16">
        <div className="px-4 sm:px-10 lg:px-40 flex justify-center">
          <div className="max-w-[800px] w-full flex flex-col gap-8">
            <div className="text-center mb-4">
              <h2 className="text-[#0d1b12] text-3xl font-bold mb-3">
                Quick Answers
              </h2>
              <p className="text-gray-500">
                Everything you need to know before booking your adventure.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              {/* FAQ Item 1 */}
              <div className="group bg-white rounded-lg border border-[#e7f3eb] overflow-hidden">
                <button
                  onClick={() => toggleFaq(0)}
                  className="flex justify-between items-center w-full p-5 cursor-pointer text-[#0d1b12] font-bold text-lg hover:bg-gray-50 transition-colors"
                >
                  <span>Is my booking secure?</span>
                  <ChevronDown
                    className={`transition-transform duration-300 ${
                      openFaq === 0 ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === 0 && (
                  <div className="px-5 pb-5 pt-0 text-gray-600 leading-relaxed border-t border-[#e7f3eb]">
                    <div className="pt-4">
                      Yes. We use industry-standard encrypted payment gateways.
                      We require a deposit to secure your booking, with the
                      remainder payable upon arrival or via transfer, giving you
                      flexibility and peace of mind.
                    </div>
                  </div>
                )}
              </div>

              {/* FAQ Item 2 */}
              <div className="group bg-white rounded-lg border border-[#e7f3eb] overflow-hidden">
                <button
                  onClick={() => toggleFaq(1)}
                  className="flex justify-between items-center w-full p-5 cursor-pointer text-[#0d1b12] font-bold text-lg hover:bg-gray-50 transition-colors"
                >
                  <span>What is the cancellation policy?</span>
                  <ChevronDown
                    className={`transition-transform duration-300 ${
                      openFaq === 1 ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === 1 && (
                  <div className="px-5 pb-5 pt-0 text-gray-600 leading-relaxed border-t border-[#e7f3eb]">
                    <div className="pt-4">
                      We offer full refunds for cancellations made up to 7 days
                      before your tour date. Cancellations within 7 days may be
                      subject to a small administrative fee to cover pre-booked
                      logistics.
                    </div>
                  </div>
                )}
              </div>

              {/* FAQ Item 3 */}
              <div className="group bg-white rounded-lg border border-[#e7f3eb] overflow-hidden">
                <button
                  onClick={() => toggleFaq(2)}
                  className="flex justify-between items-center w-full p-5 cursor-pointer text-[#0d1b12] font-bold text-lg hover:bg-gray-50 transition-colors"
                >
                  <span>Do I need special insurance?</span>
                  <ChevronDown
                    className={`transition-transform duration-300 ${
                      openFaq === 2 ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === 2 && (
                  <div className="px-5 pb-5 pt-0 text-gray-600 leading-relaxed border-t border-[#e7f3eb]">
                    <div className="pt-4">
                      While our vehicles and drivers are insured, we strongly
                      recommend that all hikers and travelers carry personal
                      travel insurance that covers trekking and outdoor
                      activities for their own protection.
                    </div>
                  </div>
                )}
              </div>

              {/* FAQ Item 4 */}
              <div className="group bg-white rounded-lg border border-[#e7f3eb] overflow-hidden">
                <button
                  onClick={() => toggleFaq(3)}
                  className="flex justify-between items-center w-full p-5 cursor-pointer text-[#0d1b12] font-bold text-lg hover:bg-gray-50 transition-colors"
                >
                  <span>How do I contact the driver?</span>
                  <ChevronDown
                    className={`transition-transform duration-300 ${
                      openFaq === 3 ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === 3 && (
                  <div className="px-5 pb-5 pt-0 text-gray-600 leading-relaxed border-t border-[#e7f3eb]">
                    <div className="pt-4">
                      You will be added to a WhatsApp group with your dedicated
                      operations manager and driver 24 hours before your trip
                      begins, ensuring seamless communication.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}