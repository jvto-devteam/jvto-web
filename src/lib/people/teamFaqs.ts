/**
 * Team FAQ — DERIVED from the canonical people record (content/entities/people.json),
 * never a parallel hardcoded copy. Every answer interpolates record values
 * (crew counts, the KTA membership credential type/issuer, the direct-managed
 * disclaimer, the medical partner's verifiable licence, the police-independence
 * disclaimer), so "FAQ == canonical record" holds by construction. The visible
 * FAQ section on /team and the FAQPage JSON-LD both render THIS output.
 */
import {
  getCrewCounts,
  getPublicCrew,
  getPublicMedicalPartner,
  getDisclaimer,
} from "./canonicalPeople";

export interface TeamFaq {
  question: string;
  answer: string;
}

export function buildTeamFaqs(): TeamFaq[] {
  const { total, guides, drivers } = getCrewCounts();
  const disc = getDisclaimer();
  const crew = getPublicCrew();
  const ktaType = crew[0]?.kta.credentialType ?? "HPWKI membership credential (KTA)";
  const ktaIssuer = crew[0]?.kta.issuer ?? "HPWKI (Himpunan Pelaku Wisata Khusus Ijen)";
  const mp = getPublicMedicalPartner();

  const faqs: TeamFaq[] = [
    {
      question: "How many guides and drivers does JVTO have?",
      answer: `JVTO operates with ${total} directly-managed field crew — ${guides} guides and ${drivers} drivers.`,
    },
    {
      question: "Are JVTO crew employees or freelancers hired per booking?",
      answer: disc.directManagedCrew,
    },
    {
      question: "What credential do JVTO guides and drivers hold?",
      answer: `Each JVTO crew member's KTA is a ${ktaType} issued by ${ktaIssuer} — a membership credential, not a government licence.`,
    },
  ];

  if (mp?.name && mp.role) {
    const str = mp.credentials?.str;
    const validTo = mp.credentials?.strValidTo;
    const verifier = str ? ` The medical licence is publicly verifiable (STR ${str}${validTo ? `, valid to ${validTo}` : ""}).` : "";
    faqs.push({
      question: "Who runs JVTO's mandatory Ijen health screening?",
      answer: `${mp.name}${mp.jobTitle ? ` (${mp.jobTitle})` : ""} ${mp.role}${verifier}`.replace(/\s+/g, " ").trim(),
    });
  }

  faqs.push({
    question: "Is JVTO endorsed by the Indonesian National Police?",
    answer: disc.policeIndependence,
  });

  return faqs;
}
