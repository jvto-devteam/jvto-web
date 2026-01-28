import { Notice, PathLink } from "@/components/ui";

export default function AuthorityShield() {
  return (
    <div className="mt-8 space-y-6">
      <Notice title="Authority Shield (proof-backed)">
        <div className="space-y-3">
          <div>This is the fastest way to understand our trust claims. Each element links to proof.</div>

          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>
              Police &amp; safety documents: <PathLink href="/why-jvto/proof-transparency/police-safety/" />
            </li>
            <li>
              Legal entity &amp; licenses: <PathLink href="/why-jvto/proof-transparency/legal/" />
            </li>
            <li>
              Health screening evidence (Ijen): <PathLink href="/travel-guide/ijen-health-screening" />
            </li>
          </ul>
        </div>
      </Notice>

      <Notice title="What we do NOT promise">
        <div className="space-y-3">
          <div>We do not promise natural phenomena. Volcano conditions, weather, closures, and visibility can change.</div>
          <div>
            What we offer is disciplined planning, honest communication, and safer decision-making when the situation
            changes.
          </div>
        </div>
      </Notice>

      <Notice title="Read the practical rulebook">
        <ul className="mt-2 list-disc space-y-2 pl-5">
          <li>
            Travel Guide hub: <PathLink href="/travel-guide" />
          </li>
          <li>
            Booking steps: <PathLink href="/travel-guide/booking-information" />
          </li>
          <li>
            Safety &amp; screening: <PathLink href="/travel-guide/ijen-health-screening" />
          </li>
          <li>
            Binding terms: <PathLink href="/policy/" />
          </li>
        </ul>
      </Notice>
    </div>
  );
}
