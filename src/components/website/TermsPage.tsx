import React from 'react';
import SEO from './SEO';
import Breadcrumbs from './Breadcrumbs';
import Link from "next/link";

const TermsPage: React.FC = () => {
  const breadcrumbCrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Travel Guide', path: '/travel-guide' },
    { name: 'Terms & Conditions', path: '/travel-guide/terms' },
  ];

  return (
    <>
      <SEO
        title="Booking, Payment, Cancellation & Guest Policy | JVTO Tours"
        description="Review the official terms and conditions for booking and traveling with Java Volcano Tour Operator (JVTO). Applies to all paid tours."
      />
      <div className="bg-background-light dark:bg-background-dark pt-20">
        <header className="py-12 bg-white dark:bg-ink-primary">
            <div className="container mx-auto px-4">
                <Breadcrumbs crumbs={breadcrumbCrumbs} />
                <div className="mt-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-ink-primary dark:text-white">Booking, Payment, Cancellation & Guest Policy</h1>
                    <p className="mt-2 text-sm text-ink-neutral-500 dark:text-ink-neutral-400">Last updated: October 30, 2025</p>
                    <p className="mt-4 text-lg text-ink-neutral-500 dark:text-ink-neutral-200 max-w-3xl">
                        Applies to all paid tours booked with Java Volcano Tour Operator (“JVTO”), operated by PT Java Volcano Rendezvous.
                    </p>
                </div>
            </div>
        </header>
        <main className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-3xl mx-auto prose dark:prose-invert prose-headings:text-ink-primary dark:prose-headings:text-white prose-headings:border-b prose-headings:border-ink-neutral-200 dark:prose-headings:border-ink-neutral-700 prose-headings:pb-2 prose-p:text-ink-neutral-700 dark:prose-p:text-ink-neutral-200 prose-li:text-ink-neutral-700 dark:prose-li:text-ink-neutral-200 prose-ul:list-disc prose-ul:ml-5 prose-strong:text-ink-primary dark:prose-strong:text-white">
            
            <section>
                <h2>1. Scope and Legal Entity</h2>
                <p>1.1 This policy applies to every tour booking made directly with Java Volcano Tour Operator {`("JVTO”)`}, the commercial brand of PT Java Volcano Rendezvous, a licensed Indonesian tourism company.</p>
                <p>1.2 {`"Tour”`} means any private itinerary operated by JVTO (for example: Bromo Sunrise, Bromo & Ijen 3D2N, Java Volcano Highlights 4D3N, etc.). JVTO does <strong>not</strong> sell open-group/shared tours and does <strong>not</strong> sell {`"transport only.”`} All itineraries are private, end-to-end, and run specifically for your party.</p>
                <p>1.3 By paying a deposit, full balance, or otherwise confirming a tour with JVTO, you agree to this policy in full.</p>
                <p>1.4 If this policy is updated, the version in force at the time you book (the version referenced on your invoice / Official Tour Voucher) will govern your booking.</p>
            </section>
            
            <section className="mt-8">
                <h2>2. Key Definitions</h2>
                <p><strong>{`"Day 1" / "Departure time"`}</strong><br/>
                The calendar date and local time (WIB / GMT+7) your tour is scheduled to begin, as shown on your confirmed voucher/itinerary. “Departure time” means the scheduled pickup time on Day 1.</p>
                <p><strong>{`"Deposit"`}</strong><br/>
                The initial amount you pay to secure your booking. By default this is <strong>20% of the total tour price</strong>.</p>
                <p><strong>{`"Remaining Balance" / "Final Balance"`}</strong><br/>
                The outstanding amount due after the Deposit.</p>
                <p><strong>{`"JVTO Travel Credit" / "Travel Credit"`}</strong><br/>
                A non-expiring credit issued by JVTO in Indonesian Rupiah (IDR), equal to 100% of what you have already paid for that booking.</p>
                <ul>
                    <li>It can be used to book the <strong>same or equivalent tour product</strong> (same base itinerary / same duration) at a future date.</li>
                    <li>If prices for that same product have increased later, JVTO will honor the value you already paid with <strong>no surcharge</strong>.</li>
                    <li>It can be <strong>transferred or gifted</strong> to someone else (another traveler can take the trip in your place).</li>
                    <li>It does <strong>not expire</strong>.</li>
                    <li>There is <strong>no rebooking fee</strong> to redeem it for the same product.</li>
                    <li>Travel Credit is the <strong>only</strong> form of refund JVTO provides. JVTO does not issue cash refunds.</li>
                </ul>
                <p><strong>{`"Start Location" / "Pickup Point"`}</strong><br/>
                Where JVTO collects you on Day 1. Common pickup points: Surabaya (airport / hotel / train station), Malang, Bali-origin handover (your Bali accommodation / agreed handoff point / ferry crossing).</p>
                <p><strong>{`"You" / "the Guest"`}</strong><br/>
                The lead traveler who made the booking and every traveler included under that same booking.</p>
            </section>
            
            <section className="mt-8">
                <h2>3. Booking & Confirmation</h2>
                <p><strong>3.1 How to book</strong><br/>
                (a) You select a private JVTO tour, choose travel dates, choose your group size tier (per-person pricing changes with group size), and enter your contact details (email + WhatsApp).<br/>
                (b) You complete secure checkout:</p>
                <ul>
                    <li>Normally you pay a <strong>20% Deposit</strong>.</li>
                    <li>If Day 1 is <strong>less than 14 days away</strong>, JVTO may require <strong>100% upfront</strong> at checkout.</li>
                </ul>
                <p><strong>3.2 After payment</strong><br/>
                Once payment is successful:<br/>
                (a) You get on-screen confirmation.<br/>
                (b) You receive an email receipt and a PDF Official Tour Voucher. This voucher includes: itinerary summary, pickup instructions, emergency contact, and “what happens next.”<br/>
                (c) You receive a secure link (“Complete Your Details”) where you submit pickup info (flight number, hotel name, etc.) without creating an account/login.</p>
                <p><strong>3.3 Pickup data requirement</strong><br/>
                You must submit accurate pickup information at least <strong>48 hours before Day 1</strong> so we can legally assign vehicles, allocate guides, secure permits (Bromo/Ijen), and block hotel rooms in your name. If you fail to provide correct pickup info in time, JVTO cannot guarantee smooth dispatch and any resulting failure to connect on Day 1 can be treated as a no-show (see Section 8).</p>
            </section>
            
            <section className="mt-8">
                <h2>4. Payment Terms</h2>
                <p><strong>4.1 Deposit</strong><br/>
                To secure your tour, you pay the Deposit (typically 20%) at checkout unless the tour starts in ≤14 days (see 4.2).</p>
                <p><strong>4.2 Late / last-minute bookings</strong><br/>
                If you book when Day 1 is less than 14 days away, JVTO may require 100% payment at checkout.</p>
                <p><strong>4.3 Remaining / Final Balance deadlines (if only Deposit was paid)</strong><br/>
                (a) <strong>Credit/Debit Card:</strong> Remaining Balance must be paid no later than <strong>5 calendar days before Day 1</strong>.<br/>
                (b) <strong>Bank Transfer / Wise:</strong> Remaining Balance must be paid no later than <strong>3 calendar days before Day 1</strong>.<br/>
                (c) <strong>Cash at JVTO Office:</strong> Allowed only if pre-approved in writing at time of booking.</p>
                <p><strong>4.4 Accepted payment methods</strong></p>
                <ul>
                    <li>Secure credit/debit card via SSL checkout.</li>
                    <li>Bank transfer / Wise transfer in IDR to PT Java Volcano Rendezvous corporate accounts.</li>
                    <li>Cash (Remaining Balance only) at {`JVTO's`} office on Day 1 if and only if this method was explicitly approved.</li>
                </ul>
                <p>All prices are in <strong>Indonesian Rupiah (IDR)</strong>. All bank/wire fees, card fees, and currency conversion costs are paid by you.</p>
                <p><strong>4.5 Non-payment / late payment</strong><br/>
                If you miss the payment deadline for the Remaining Balance, JVTO may treat the booking as cancelled due to non-payment. This is equivalent to a same-day cancellation / no-show scenario (see Section 8). The slot, vehicle, guides, permits, and rooms are not held open for unpaid bookings.</p>
            </section>
            
            <section className="mt-8">
                <h2>5. Cancellation by You (Before Day 1)</h2>
                <p><strong>5.1 Cancellation more than 48 hours before Day 1</strong><br/>
                If you cancel more than 48 hours before the scheduled pickup time on Day 1: You receive <strong>100% JVTO Travel Credit</strong> equal to everything you have already paid for that booking. There is <strong>no cash refund</strong>.</p>
                <p><strong>5.2 Cancellation less than 48 hours before Day 1</strong><br/>
                If you cancel inside the 48-hour window before Day 1: Your payment is <strong>forfeited in full</strong>. <strong>No Travel Credit</strong> is issued. <strong>No cash refund</strong> is issued. This is because logistics are already committed under your name.</p>
                <p><strong>5.3 Attempted {`"same-day"`} cancellation</strong><br/>
                If you try to cancel on the same calendar day as your scheduled pickup, that is treated as a no-show (see Section 8). Same rules: forfeited, no Travel Credit, no reschedule.</p>
            </section>

            <section className="mt-8">
                <h2>6. Reschedule Policy</h2>
                <p>{`"Reschedule"`} = moving your tour to a new start date but keeping the same tour product/itinerary.</p>
                <p><strong>6.1 Reschedule request more than 48 hours before Day 1</strong><br/>
                You are allowed <strong>one (1) free reschedule</strong>, if you request it {`>48`} hours before Day 1. The new date must be within a reasonable future window JVTO can actually operate. Peak/blackout periods may be unavailable. No penalty, no admin fee.</p>
                <p><strong>6.2 Reschedule request within 48 hours of Day 1</strong><br/>
                Rescheduling is <strong>not available</strong>. Your request is treated as a late cancellation (Section 5.2). Payment is forfeited; there is no Travel Credit.</p>
                 <p><strong>6.3 Trying to reschedule on Day 1 or after the trip starts</strong><br/>
                That is treated as no-show / day-of cancellation. See Section 8.</p>
            </section>

            <section className="mt-8">
                <h2>7. Changes or Cancellation by JVTO (Force Majeure / Safety)</h2>
                <p><strong>7.1 Operational reality</strong><br/>
                East Java and Bali are volcanic, seasonal, and culturally active. Access can be restricted at short notice due to eruptions, gas levels, landslide risk, flash floods, religious ceremonies, park closures, or police/government safety orders. Your safety comes first.</p>
                <p><strong>7.2 If JVTO must modify, delay, or cancel due to Force Majeure or mandatory safety restrictions</strong><br/>
                JVTO may, at its discretion: (a) adjust or replace activities/days with comparable alternatives, or (b) issue JVTO Travel Credit for any unused portion, or (c) issue a refund minus unrecoverable costs already committed under your name (park permits, jeep allocation, etc.).</p>
                <p><strong>7.3 Incidental costs</strong><br/>
                JVTO is not responsible for indirect or incidental costs you incur outside the tour itself, including but not limited to: flights, visas, travel insurance, personal equipment, missed connections, or accommodation you booked independently.</p>
            </section>
            
            <section className="mt-8">
                <h2>8. No-Show / Same-Day Cancellation / Day-Of Changes</h2>
                <p>This applies if, on Day 1, you: (a) do not appear at the agreed pickup point at the agreed pickup time, (b) attempt to cancel on the same calendar day as pickup, (c) refuse to depart once the driver/guide and vehicle are physically dispatched, or (d) abandon the itinerary after it has started.</p>
                <p><strong>Result:</strong></p>
                <ul>
                    <li>JVTO treats the booking as consumed.</li>
                    <li><strong>100% of your payment is forfeited.</strong></li>
                    <li><strong>No Travel Credit</strong> is issued.</li>
                    <li><strong>No reschedule</strong> is offered without paying again.</li>
                </ul>
                <p>There are no exceptions for oversleeping, missed or delayed flights, giving the wrong hotel location, late airport arrival, or private scheduling conflicts when the team is already on site.</p>
            </section>
            
            <section className="mt-8">
                <h2>9. {`What's`} Included / Not Included</h2>
                <p>Refer to your specific tour voucher for the exact list of inclusions and exclusions for your package. Typical items are listed on our <Link href="/travel-guide/booking-information">Booking Information</Link> page.</p>
            </section>

            <section className="mt-8">
                <h2>10. Health, Safety & Local Compliance</h2>
                <p><strong>10.1 Mandatory Ijen health clearance</strong><br/>
                Mount Ijen is regulated. Every visitor must hold a recent local medical/fitness certificate before entering. This is not optional; it is enforced by local authorities. JVTO arranges this medical screening for you, and it is included in the tour price.</p>
                <p><strong>10.2 If you are declared medically unfit</strong><br/>
                If the medical professional determines you are not fit to hike Ijen, you will not be permitted to enter the crater area. The rest of the tour continues as planned. There is no partial cash refund or compensation for the missed Ijen hike.</p>
                <p><strong>10.3 Safety and behavior</strong><br/>
                You must follow instructions from JVTO crew, rules set by park rangers and police, mandatory seatbelt use, and safety guidance from medical personnel.</p>
                <p><strong>10.4 Seasonal / cultural closures & conditions</strong><br/>
                Mount Ijen is routinely closed the first Friday of every month. Mount Bromo may close for Yadnya Kasada ceremony or for volcanic safety alerts. JVTO may adjust timing, routing, and activity order to meet safety, cultural, or regulatory requirements.</p>
            </section>
            
            <section className="mt-8">
                <h2>11. Group Terms (FOC / Complimentary Travelers)</h2>
                <p>For larger groups (schools, incentive groups, etc.):</p>
                <ul>
                    <li><strong>1 FOC</strong> (Free of Charge) for every <strong>18</strong> paying guests.</li>
                    <li><strong>2 FOC</strong> for <strong>35</strong> paying guests.</li>
                    <li><strong>3 FOC + 5% discount</strong> for groups of <strong>50+</strong> paying guests.</li>
                </ul>
            </section>

             <section className="mt-8">
                <h2>12. Official Contact Channels</h2>
                <p>To protect you against fraud and miscommunication, JVTO recognizes only the following channels for booking questions, payment confirmation, pickup detail updates, reschedule requests, and cancellation notices:</p>
                <ul>
                    <li><strong>WhatsApp:</strong> +62 822-4478-8833</li>
                    <li><strong>Email:</strong> info@javavolcano-touroperator.com</li>
                </ul>
            </section>

            <section className="mt-8">
                <h2>13. Legal Entity & Office Information</h2>
                <p><strong>Company Name:</strong> PT Java Volcano Rendezvous<br/>
                <strong>Brand / Trading Name:</strong> Java Volcano Tour Operator (JVTO)<br/>
                <strong>Registered Office:</strong> Jl. Khairil Anwar No.102 A, Badean, Bondowoso, East Java 68217, Indonesia<br/>
                <strong>Business ID (NIB):</strong> 1102230032918<br/>
                <strong>Tourism License (TDUP):</strong> 1102230032918 (Issued 11 Feb 2023)</p>
            </section>

            <section className="mt-8">
                <h2>14. Guest Responsibilities</h2>
                <p>By booking with JVTO, you agree to:</p>
                <ul>
                    <li>(a) Provide accurate contact details (email + WhatsApp) during checkout.</li>
                    <li>(b) Pay your Remaining Balance on time via the approved payment methods.</li>
                    <li>(c) Submit correct pickup details via the secure link at least 48 hours before Day 1.</li>
                    <li>(d) Be physically present and on time at the agreed pickup point on Day 1 with valid ID/passport.</li>
                    <li>(e) Follow safety instructions, including the legally required Ijen medical certificate process.</li>
                    <li>(f) Use only {`JVTO's`} official WhatsApp number and official domain email (Section 12) for all booking changes.</li>
                </ul>
            </section>

            <section className="mt-8">
                <h2>15. Final Locked Rules (Binding)</h2>
                <p>These are the non-negotiable site-wide rules that apply to every guest:</p>
                <ol>
                    <li><strong>Pay on time.</strong> Card balance: due 5 calendar days before Day 1. Bank/Wise balance: due 3 calendar days before Day 1. Missed payment can void the booking.</li>
                    <li><strong>Cancel more than 48 hours before Day 1 → You get JVTO Travel Credit.</strong> 100% of what {`you've`} paid becomes Travel Credit. No expiry. Transferable. No cash refunds, ever.</li>
                    <li><strong>Cancel less than 48 hours before Day 1 → Forfeited.</strong> No Travel Credit, no refund.</li>
                    <li><strong>Reschedule more than 48 hours before Day 1 → Allowed 1x, free.</strong> Subject to availability.</li>
                    <li><strong>Reschedule less than 48 hours before Day 1 / same-day cancel / no-show → Forfeited.</strong></li>
                    <li><strong>Ijen medical certificate → Mandatory by local law.</strong> JVTO arranges it and {`it's`} included in the package. No partial cash refund if you are found not fit to climb.</li>
                    <li><strong>Official channel rule.</strong> Only our official WhatsApp and email are recognized for coordination.</li>
                </ol>
            </section>
            
          </div>
        </main>
      </div>
    </>
  );
};

export default TermsPage;