import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";
import Link from "next/link";

const documentPriorityNote = {
    title: "Document priority reminder",
    paragraphs: [
      "This Travel Guide is written in plain language to help you understand how JVTO operates. If there is ever a difference between wording on this page and your booking documents, the order of priority is:",
      "1. Your Official E-Voucher / Invoice for the specific tour or group",
      "2. The Booking, Payment & Cancellation Policy",
      "3. The Inclusions & Exclusions Policy",
      "4. The Privacy & Data Protection Policy",
      "5. General website text and informal communication",
      "If you are unsure how a rule applies to your case, please contact JVTO using the official contact details listed on this website before you travel."
    ]
  }

export function DocumentPriorityNote(){
    return (
        <Card className="mt-16 bg-accent">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Info className="w-5 h-5"/> {documentPriorityNote.title}</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none text-muted-foreground">
                {documentPriorityNote.paragraphs.slice(0,1).map((p,i) => <p key={i}>{p}</p>)}
                <ol className="list-decimal pl-5 font-medium text-foreground">
                    <li>{documentPriorityNote.paragraphs[1].substring(documentPriorityNote.paragraphs[1].indexOf('.') + 2)}</li>
                    <li>
                      <Link href="/policy/booking-cancellation" className="text-primary hover:underline">{documentPriorityNote.paragraphs[2].substring(documentPriorityNote.paragraphs[2].indexOf('.') + 2)}</Link>
                    </li>
                    <li><Link href="/travel-guide/inclusions-exclusions-policy" className="text-primary hover:underline">{documentPriorityNote.paragraphs[3].substring(documentPriorityNote.paragraphs[3].indexOf('.') + 2)}</Link></li>
                    <li><Link href="/travel-guide/privacy-policy" className="text-primary hover:underline">{documentPriorityNote.paragraphs[4].substring(documentPriorityNote.paragraphs[4].indexOf('.') + 2)}</Link></li>
                    <li>{documentPriorityNote.paragraphs[5].substring(documentPriorityNote.paragraphs[5].indexOf('.') + 2)}</li>
                </ol>
                {documentPriorityNote.paragraphs.slice(6).map((p,i) => <p key={i} className="text-xs">{p}</p>)}
            </CardContent>
        </Card>
    )
}
