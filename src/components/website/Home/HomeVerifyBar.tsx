import Link from "@/components/website/AppLink";

// PKG-11a: the lime bar is the page's one "go" surface — it hands the visitor
// straight to the proof library. Navy-on-lime measures 8.5:1, so it stays a
// solid fill rather than a tint, and the whole strip reads as one target.
export default function HomeVerifyBar() {
  return (
    <div className="bg-jvto-lime">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <Link
          href="/verify-jvto"
          className="jvto-focus group -mx-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 rounded-sm px-2 py-3.5 text-xs font-bold text-jvto-navy transition-colors hover:bg-jvto-navy/[0.07] sm:text-sm"
        >
          <span
            aria-hidden="true"
            className="inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-jvto-navy text-[10px] font-black text-jvto-lime"
          >
            &#10003;
          </span>
          <span className="group-hover:underline">
            Credentials you can check — not logos you have to take on faith. Open the
            proof library
          </span>
          <span
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:translate-x-1"
          >
            &rarr;
          </span>
        </Link>
      </div>
    </div>
  );
}
