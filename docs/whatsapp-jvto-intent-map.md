# JVTO WhatsApp Semi-Chatbot Intent Map (Baseline)

## Scope
- Target number: `6282244788833` (JVTO main WhatsApp).
- Use case: customer support pre-booking and booking assistance.
- Date: 2026-04-06.

## Data Basis
- Raw historical WhatsApp chat export for this number is not available yet.
- Baseline is derived from current JVTO support knowledge in:
  - `src/constants.ts`
  - `src/data.ts`
  - `src/data/faqs.ts`

This map is an estimated "rata-rata intent" baseline and should be recalibrated after 2-4 weeks of real chat logs.

## Estimated Intent Mix (Baseline)
| Intent | Estimated share | Typical examples |
|---|---:|---|
| Tour price + package recommendation | 22% | "Harga Bromo Ijen berapa?", "Best package from Surabaya?" |
| Availability + schedule/date | 13% | "Tanggal 17-19 ada slot?", "Can start tomorrow?" |
| Inclusions/exclusions clarity | 12% | "Sudah include hotel/jeep/tiket?", "Apa yang belum include?" |
| Booking steps + payment method | 12% | "Cara booking?", "Deposit berapa?", "Can I pay by card?" |
| Pickup/drop-off logistics | 10% | "Pickup dari Malang bisa?", "Drop di Banyuwangi?" |
| Cancellation/reschedule policy | 9% | "Kalau batal gimana?", "Reschedule bisa?" |
| Ijen health screening + fitness | 8% | "Medical check wajib?", "Saya asma aman?" |
| Gear/weather/trek difficulty | 6% | "Perlu jaket?", "Bromo trek berat?" |
| Private vs shared + customization | 5% | "Private atau gabung?", "Bisa custom route?" |
| Trust + payment verification/fraud check | 3% | "Nomor resmi JVTO?", "Rekening ini valid?" |

## Recommended Conversation Flow
1. Greeting + identify need in 1 line.
2. Intent detection by keyword and question pattern.
3. Send concise answer from template.
4. Ask 2-4 slot questions only (do not ask everything at once).
5. Confirm summary.
6. Handoff to human when:
   - custom route complexity,
   - safety/medical special case,
   - payment dispute,
   - sentiment is angry/confused.

## Minimum Slots Per Lead
- `travel_dates` (exact/approximate)
- `pax_total`
- `pickup_city`
- `tour_preference` (Bromo, Ijen, Tumpak Sewu, combo)
- `nationality_or_language`

## Handoff Triggers (Must Escalate)
- Mentions: accident, sickness, asthma risk, panic, unsafe.
- Payment proof mismatch or fraud suspicion.
- Last-minute request (`<48h`) needing manual operations.
- Guest asks for legal/policy exception.

## KPI to Track Once Live
- Auto-reply containment rate.
- Human handoff rate by intent.
- First response time.
- Booking conversion from WhatsApp.
- Top unresolved questions (for template updates).

