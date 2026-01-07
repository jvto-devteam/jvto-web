import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";
import Link from "next/link";

const documentPriorityNote = {
  title: "Document Priority Reminder (Bottom of Page)",
  paragraphs: [
    "Treat your Official E-Voucher / Invoice as the highest authority for your specific booking. If there is ever a difference between website wording and booking documents, the order of priority is:",
    "1. Official E-Voucher / Invoice (specific booking)",
    "2. Booking, Payment & Cancellation Policy",
    "3. Inclusions & Exclusions Policy",
    "4. General website text and informal communication",
    "Verify uncertainties via official JVTO channels before travel. Contact JVTO using the official contact details listed on the website if you are unsure how a rule applies.",
  ],
};

export function DocumentPriorityNote() {
  return (
    <Card className="mt-16 bg-accent border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-black">
          <Info className="w-5 h-5" /> {documentPriorityNote.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="prose prose-sm max-w-none text-muted-foreground">
        {documentPriorityNote.paragraphs.slice(0, 1).map((p, i) => (
          <p key={i}>{p}</p>
        ))}
        <ol className="list-decimal pl-5 font-medium text-foreground">
          <li>
            {documentPriorityNote.paragraphs[1].substring(
              documentPriorityNote.paragraphs[1].indexOf(".") + 2
            )}
          </li>
          <li>
            <Link
              href="/policy/booking-payment-cancellation"
              className="text-primary hover:text-lime-600"
            >
              {documentPriorityNote.paragraphs[2].substring(
                documentPriorityNote.paragraphs[2].indexOf(".") + 2
              )}
            </Link>
          </li>
          <li>
            <Link
              href="/policy/inclusions-exclusions"
              className="text-primary hover:text-lime-600"
            >
              {documentPriorityNote.paragraphs[3].substring(
                documentPriorityNote.paragraphs[3].indexOf(".") + 2
              )}
            </Link>
          </li>
          <li>
            {documentPriorityNote.paragraphs[4].substring(
              documentPriorityNote.paragraphs[4].indexOf(".") + 2
            )}
          </li>
        </ol>
        {documentPriorityNote.paragraphs.slice(5).map((p, i) => (
          <p key={i} className="text-xs mt-4">
            {p}
          </p>
        ))}
      </CardContent>
    </Card>
  );
}
