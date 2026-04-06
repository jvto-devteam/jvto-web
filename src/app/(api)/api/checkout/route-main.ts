import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateInitialPaymentAmount } from "@/lib/packages/paymentPolicy";

// Helper untuk menangani BigInt saat convert ke JSON
function serializeBooking(booking: any) {
  return JSON.parse(
    JSON.stringify(booking, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}

function generateBookingCode() {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `JVTO-${timestamp}${random}`;
}

function createSlug(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Ganti spasi dengan -
    .replace(/[^\w\-]+/g, "") // Hapus karakter non-word
    .replace(/\-\-+/g, "-"); // Ganti dash berulang dengan satu dash
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Destructure data dari payload frontend
    // Pastikan frontend mengirim struktur: { contact, packageId, date, pax, addon, ... }
    const {
      contact,
      packageId,
      durationId,
      date, // Format: "YYYY-MM-DD"
      pax,
      addon = [], // Array of addons
      pricePerPerson,
    } = body;

    if (!contact?.email || !contact?.customerName || !packageId || !date) {
      return NextResponse.json(
        { message: "Data tidak lengkap (Contact, Package, atau Date hilang)" },
        { status: 400 }
      );
    }

    // 2. Gunakan Transaction untuk konsistensi data
    const result = await prisma.$transaction(async (tx) => {
      // A. Create Customer
      // Kita buat customer baru setiap booking (bisa diubah logicnya untuk cek email existing)
      const newCustomer = await tx.customers.create({
        data: {
          name: contact.customerName,
          email: contact.email,
          phone: contact.phone,
          order_channel_id: 1,
          created_at: new Date(),
        },
      });

      // B. Create Booking
      // Asumsi: end_date sama dengan start_date + 2 hari (Default 3D2N) jika tidak ada info durasi
      const startDateObj = new Date(date);
      const endDateObj = new Date(date);
      endDateObj.setDate(startDateObj.getDate() + 2);

      const bookingCode = generateBookingCode();
      const baseSlug = createSlug(contact.customerName);
      const uniqueSuffix = Date.now().toString().slice(-6); // Ambil 6 digit terakhir waktu
      const bookingSlug = `${baseSlug}-${uniqueSuffix}`;

      const newBooking = await tx.bookings.create({
        data: {
          booking_code: bookingCode,
          customer_id: newCustomer.id,
          package_id: BigInt(packageId),
          duration_id: BigInt(durationId),
          slug: bookingSlug,
          order_channel_id: 1,
          booking_date: new Date(),
          start_date: startDateObj,
          end_date: endDateObj,
          total_participants: Number(pax),
          booking_status: "PENDING",
          payment_status: "UNPAID",
          trip_status: "PRE_TRIP",
          created_at: new Date(),
        },
      });

      // C. Create Booking Add-ons (Jika ada)
      let totalAddOn = 0;

      if (addon && addon.length > 0) {
        const addonsData = addon.map((item: any) => {
          const itemTotal = Number(item.subtotal);
          totalAddOn += itemTotal; // Akumulasi total add-on

          return {
            booking_id: newBooking.id,
            price: Number(item.price),
            quantity: Number(item.qty),
            total: itemTotal,
            created_at: new Date(),
          };
        });

        if (addonsData.length > 0) {
          await tx.booking_addons.createMany({
            data: addonsData,
          });
        }
      }

      const packageTotal = Number(pricePerPerson) * Number(pax);
      const totalBeforeDiscount = packageTotal + totalAddOn;
      const grandTotal = totalBeforeDiscount; // Discount 0
      const depositAmount = calculateInitialPaymentAmount(date, grandTotal);

      const depositDueDate = new Date();
      depositDueDate.setDate(depositDueDate.getDate() + 1); // +1 Hari dari sekarang

      // 7. Insert Booking Payment Terms (BAGIAN BARU)
      await tx.booking_payment_terms.create({
        data: {
          booking_id: newBooking.id,
          deposit_payment_method_id: BigInt(3), // Hardcoded ID 3
          deposit_due_date: depositDueDate,
          deposit_amount: depositAmount,
          total_before_discount: totalBeforeDiscount,
          total_discount: 0,
          total_add_on: totalAddOn,
          grandtotal: grandTotal,
          total_payment: 0,
          balance: grandTotal, // Balance awal = Grand Total
          created_at: new Date(),
        },
      });

      return newBooking;
    });

    return NextResponse.json(
      {
        message: "Booking success",
        data: serializeBooking(result),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/checkout error:", error);
    return NextResponse.json(
      { message: "Failed to process booking", error: String(error) },
      { status: 500 }
    );
  }
}
