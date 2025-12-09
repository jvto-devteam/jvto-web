import Link from "next/link";

export default function BookingPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow">
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-12">
              <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
                Official Terms & Conditions
              </h1>
              <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                This document constitutes the comprehensive Global Terms and Conditions (T&C) for all bookings made with the Java Volcano Tour Operator (JVTO).
              </p>
            </div>

            <div className="prose prose-lg max-w-none mx-auto text-muted-foreground">
                <h2 className="font-headline text-3xl font-bold tracking-tight mt-12 mb-4">Section 1: Operator Identity, Scope of Contract, and Product Definition</h2>
                
                <h3 className="font-headline text-2xl font-bold tracking-tight mt-8 mb-4">1.1 Operator Identity and Registration</h3>
                <p>You are entering into a contract with the Java Volcano Tour Operator (JVTO).</p>
                <ul className="list-none p-0">
                    <li><strong>Trading Name:</strong> Java Volcano Tour Operator (JVTO)</li>
                    <li><strong>Legal Entity:</strong> PT Java Volcano Rendezvous (an Indonesian-registered company)</li>
                    <li><strong>Registered Office:</strong> Jl. Khairil Anwar No.102 A, Badean, Bondowoso, East Java 68217, Indonesia</li>
                    <li><strong>Registration Number:</strong> Business ID & Tourism Licence No. 1102230032918</li>
                </ul>

                <h3 className="font-headline text-2xl font-bold tracking-tight mt-8 mb-4">1.2 Official Channels and Communication</h3>
                <p>All official communications, payment requests, and contracts will be issued only via the following channels:</p>
                <ul>
                    <li><strong>Website & Secure Checkout:</strong> https://javavolcano-touroperator.com</li>
                    <li><strong>WhatsApp:</strong> +62 822-4478-8833</li>
                    <li><strong>Email:</strong> info@javavolcano-touroperator.com</li>
                </ul>
                <p>Any offer or payment request received outside these channels must be treated as suspicious and verified directly with JVTO.</p>

                <h3 className="font-headline text-2xl font-bold tracking-tight mt-8 mb-4">1.3 Product Definition (Private Tours Only)</h3>
                <p>JVTO specializes exclusively in integrated private tour packages. JVTO does not sell open join-in group tours. JVTO does not sell standalone {`"transport-only"`} services as its core product.</p>

                <h2 className="font-headline text-3xl font-bold tracking-tight mt-12 mb-4">Section 2: Booking, Confirmation, and Payments</h2>
                <h3 className="font-headline text-2xl font-bold tracking-tight mt-8 mb-4">2.1 Booking Confirmation</h3>
                <p>A booking is considered confirmed only when all of the following conditions are met:</p>
                <ol>
                    <li>The guest selects a specific JVTO package (route, dates, group size, etc.).</li>
                    <li>The required deposit or full payment is successfully paid using an approved payment method.</li>
                    <li>JVTO issues an Official E-Voucher / Booking Confirmation (digitally) showing the booking reference, itinerary outline, dates, participants, and key inclusions.</li>
                </ol>
                <p>Enquiries, quotations, or screenshots alone do not constitute a confirmed booking.</p>
                
                <h3 className="font-headline text-2xl font-bold tracking-tight mt-8 mb-4">2.2 Payment Schedule and Currency</h3>
                <ul>
                    <li><strong>Deposit:</strong> A standard 20% deposit of the total package price is required to secure a booking, unless otherwise specified in writing.</li>
                    <li><strong>Balance:</strong> The final balance due date will be specified on your Official E-Voucher.</li>
                    <li><strong>Currency:</strong> All official JVTO pricing and accounting are in Indonesian Rupiah (IDR). Any currency shown on the website is indicative only, and the final exchange rate is determined by the guest’s bank or card provider.</li>
                </ul>

                <h3 className="font-headline text-2xl font-bold tracking-tight mt-8 mb-4">2.3 Non-Payment and Invalid Payment</h3>
                <p>If required payments are not received by the stated deadlines, or are made to unauthorized accounts, JVTO may treat the booking as unconfirmed or cancelled. Payments must be made via official channels.</p>

                <h2 className="font-headline text-3xl font-bold tracking-tight mt-12 mb-4">Section 3: Cancellation, Reschedule, and Travel Credit</h2>
                <h3 className="font-headline text-2xl font-bold tracking-tight mt-8 mb-4">3.1 Cancellation by the Guest (No Cash Refunds)</h3>
                <p>JVTO operates a strict no cash refund policy for guest-initiated cancellations. Compensation is handled exclusively through JVTO Travel Credit.</p>
                <ul className="list-none p-0">
                    <li><strong>48 Hours or More Before Day 1:</strong> 100% of all payments made will be converted into JVTO Travel Credit.</li>
                    <li><strong>Less Than 48 Hours Before Day 1:</strong> The guest may forfeit up to 100% of the package cost.</li>
                    <li><strong>No-Show:</strong> May result in forfeiture of up to 100% of the package cost, with no Travel Credit issued.</li>
                </ul>

                <h3 className="font-headline text-2xl font-bold tracking-tight mt-8 mb-4">3.2 JVTO Travel Credit</h3>
                <p>Travel Credit is issued in IDR, does not expire, and can be transferred to another traveler with written confirmation. It can be used for future private tours at the prevailing rates.</p>

                <h3 className="font-headline text-2xl font-bold tracking-tight mt-8 mb-4">3.3 Reschedule Policy</h3>
                <p>Minor corrections that do not affect permits or inventory may be made without extra charge. Changes affecting issued permits, tickets, or room allocations will incur any extra costs charged to the guest. Guests may be permitted one free reschedule prior to the 48-hour cutoff, subject to availability.</p>

                <h2 className="font-headline text-3xl font-bold tracking-tight mt-12 mb-4">Section 4: Scope of Service (Inclusions and Exclusions)</h2>
                <h3 className="font-headline text-2xl font-bold tracking-tight mt-8 mb-4">4.1 All-Inclusive Inclusions</h3>
                <p>The term {`"all-inclusive"`} means that the price covers all elements necessary to execute the confirmed itinerary, specifically the items listed below (and further specified on the E-Voucher):</p>
                <ul>
                    <li>Private transport with driver (door-to-door within agreed areas).</li>
                    <li>Private 4WD jeep for Bromo sunrise (if applicable).</li>
                    <li>Park entrance tickets and permits for destinations stated (Bromo, Ijen, waterfalls, etc.).</li>
                    <li>Licensed local guides and on-trip support.</li>
                    <li>Accommodation as specified in the program.</li>
                    <li>All breakfasts at the booked hotels.</li>
                    <li>Selected lunches and dinners during key segments, such as Bondowoso and after Tumpak Sewu hikes, as described in your program.</li>
                    <li>Ijen health screening for tours that include Ijen night hikes.</li>
                    <li>Essential safety gear for Ijen (gas mask and trekking poles).</li>
                    <li>Bottled mineral water during overland days.</li>
                    <li>JVTO travel T-shirt (where noted in the itinerary).</li>
                </ul>

                <h3 className="font-headline text-2xl font-bold tracking-tight mt-8 mb-4">4.2 Exclusions (Guest Responsibility)</h3>
                <p>The tour price does not include:</p>
                <ul>
                    <li>International and domestic flights.</li>
                    <li>Personal travel insurance (Guests must hold appropriate insurance).</li>
                    <li>Personal expenses (tips, laundry, snacks, drinks, optional activities).</li>
                    <li>Visas or other immigration fees.</li>
                    <li>Extra meals or room upgrades not explicitly written in the program.</li>
                </ul>

                <h2 className="font-headline text-3xl font-bold tracking-tight mt-12 mb-4">Section 5: Safety, Health, and Operational Changes</h2>
                <h3 className="font-headline text-2xl font-bold tracking-tight mt-8 mb-4">5.1 Mandatory Ijen Health Screening</h3>
                <p>For tours including the Ijen night hike, the Ijen health screening delivered by trained medical staff is a standard and mandatory inclusion. If a guest is denied medical clearance for the Ijen ascent, they will not be permitted to participate in that component of the tour. The cost related to the Ijen hike is considered integrated and utilized, thus non-refundable. Screening is an auxiliary safety tool and does not replace prior consultation with a medical doctor.</p>
                
                <h3 className="font-headline text-2xl font-bold tracking-tight mt-8 mb-4">5.2 Changes by JVTO (Force Majeure)</h3>
                <p>JVTO reserves the right to adjust routes, timing, accommodation, or activities when reasonably necessary for safety, legal compliance, or operational reasons. If a major component of the itinerary is significantly altered or cancelled due to such external events, JVTO will propose reasonable alternatives or offer Travel Credit for the unused portion, as described in the Booking, Payment & Cancellation Policy.</p>

                <h3 className="font-headline text-2xl font-bold tracking-tight mt-8 mb-4">5.3 Police Escort for Groups</h3>
                <p>The coordination of an official traffic police escort is a regulated service that JVTO can arrange for certain large groups (typically 18+ pax, or official school/incentive trips) on specific road segments. Escort is subject to availability and formal approval from the relevant Traffic Police unit via a written order (SPRIN).</p>
                
                <h3 className="font-headline text-2xl font-bold tracking-tight mt-8 mb-4">5.4 Guest Responsibilities</h3>
                <p>Guests must hold appropriate personal travel insurance. Guests must follow safety instructions from the JVTO crew and licensed guides, provide accurate information, and be ready at the agreed pickup point on time. Failure to meet these responsibilities may limit {`JVTO's`} ability to deliver the tour.</p>
                
                <h2 className="font-headline text-3xl font-bold tracking-tight mt-12 mb-4">Section 6: Governing Law and Document Hierarchy</h2>
                 <h3 className="font-headline text-2xl font-bold tracking-tight mt-8 mb-4">6.1 Governing Law and Authority</h3>
                <p>This contract is governed by the official corporate policies of PT Java Volcano Rendezvous.</p>

                <h3 className="font-headline text-2xl font-bold tracking-tight mt-8 mb-4">6.2 Document Hierarchy</h3>
                <p>In the event of any difference or inconsistency between sources, the order of priority is strictly enforced:</p>
                <ol>
                    <li>Your Official E-Voucher / Invoice for the confirmed booking (prevails above all).</li>
                    <li>JVTO Booking, Payment & Cancellation Policy.</li>
                    <li>JVTO Inclusions & Exclusions Policy.</li>
                    <li>JVTO Official Booking Guide — How to Book.</li>
                    <li>JVTO Privacy & Data Protection Policy.</li>
                    <li>General website content, marketing material, chats, and informal communication.</li>
                </ol>
                <p>This Booking Information page on the website serves as a plain-language summary to aid understanding. For full legal wording, the official PDF policy documents are the final reference.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
