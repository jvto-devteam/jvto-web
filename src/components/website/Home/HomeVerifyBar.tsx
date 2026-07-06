import Link from "@/components/website/AppLink";

export default function HomeVerifyBar() {
  return (
    <div className="bg-jvto-lime">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-3">
        <Link
          href="/verify-jvto"
          className="flex flex-wrap items-center gap-2 text-jvto-navy font-bold text-xs sm:text-sm hover:underline"
        >
          <span aria-hidden="true">&#10003;</span>
          <span>
            Credentials you can check — not logos you have to take on faith. Open the
            proof library
          </span>
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </div>
  );
}
