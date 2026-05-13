import Image from "next/image";
import Button from "../UI/Button";

interface HeroProps {
  title?: string;
  description?: string;
}

const Hero: React.FC<HeroProps> = ({
  title = "Tourist Police-Led Private Volcano Tours in East Java",
  description = "Private Bromo, Ijen & Tumpak Sewu tours from Surabaya or Bali. Licensed operator (NIB 1102230032918), led by an active Tourist Police officer.",
}) => {
  return (
    <div className="relative min-h-[87vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/img/hero/home-lite.webp"
          alt="Ijen Crater"
          fill
          priority
          unoptimized
          className="object-cover"
        />
        <div className="absolute inset-0 bg-jvto-navy/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-jvto-navy via-transparent to-jvto-navy/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center text-white mt-16">
        {/* Eyebrow chip */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-jvto-lime/40 bg-jvto-lime/10 backdrop-blur-sm mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-jvto-lime animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-jvto-lime">
            Tourist Police-Led · Licensed Operator
          </span>
        </div>

        <h1
          className="text-3xl md:text-6xl font-black leading-tight mb-6 tracking-tight max-w-5xl mx-auto"
          style={{ fontFamily: "Raleway, Inter, sans-serif" }}
        >
          {title}
        </h1>

        <p className="text-lg md:text-xl text-white/80 mb-4 max-w-3xl mx-auto font-light">
          {description}
        </p>

        {/* Hero body paragraph — new from wiki copy */}
        <p className="text-sm md:text-base text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed">
          Mr. Sam is a Tourist Police officer first, tour operator second. Every
          route decision, every written rule, and every safety boundary comes
          from someone who answers to police protocol — not a marketing brief.
        </p>

        {/* CTAs — mobile */}
        <div className="flex gap-3 justify-center md:hidden">
          <Button to="/tours" prefetch={false} variant="primary" size="md">
            Browse Tours
          </Button>
          <Button
            to="/verify-jvto"
            prefetch={false}
            variant="outline"
            size="md"
            className="border-white/50 text-white hover:bg-white hover:!text-jvto-navy rounded-full"
          >
            Verify JVTO
          </Button>
        </div>

        {/* CTAs — desktop */}
        <div className="md:flex gap-4 justify-center hidden">
          <Button to="/tours" prefetch={false} variant="primary" size="lg">
            Browse 16 Private Tours
          </Button>
          <Button
            to="/verify-jvto"
            prefetch={false}
            variant="outline"
            size="lg"
            className="border-white/50 text-white hover:bg-white hover:!text-jvto-navy rounded-full"
          >
            Verify Licenses &amp; Credentials
          </Button>
        </div>

        {/* Trustpilot badge */}
        <div className="mt-10">
          <a
            href="https://www.trustpilot.com/review/javavolcano-touroperator.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-1.5 outline-none focus:outline-offset-[-1px] focus:outline-2 focus:outline-blue-600"
            aria-label="Excellent — view Trustpilot reviews"
          >
            <div className="text-white underline font-medium whitespace-nowrap">
              Excellent
            </div>

            <div className="w-24 flex-shrink-0">
              <svg
                viewBox="0 0 251 46"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-auto"
              >
                <title>4.8 out of 5 star rating on Trustpilot</title>
                <g className="tp-star">
                  <path fill="#00B67A" d="M0 46.330002h46.375586V0H0z" />
                  <path
                    d="M39.533936 19.711433L13.230239 38.80065l3.838216-11.797827L7.02115 19.711433h12.418975l3.837417-11.798624 3.837418 11.798624h12.418975zM23.2785 31.510075l7.183595-1.509576 2.862114 8.800152L23.2785 31.510075z"
                    fill="#FFF"
                  />
                </g>
                <g className="tp-star">
                  <path
                    fill="#00B67A"
                    d="M51.24816 46.330002h46.375587V0H51.248161z"
                  />
                  <path
                    d="M74.990978 31.32991L81.150908 30 84 39l-9.660206-7.202786L64.30279 39l3.895636-11.840666L58 19.841466h12.605577L74.499595 8l3.895637 11.841466H91L74.990978 31.329909z"
                    fill="#FFF"
                  />
                </g>
                <g className="tp-star">
                  <path
                    fill="#00B67A"
                    d="M102.532209 46.330002h46.375586V0h-46.375586z"
                  />
                  <path
                    d="M142.066994 19.711433L115.763298 38.80065l3.838215-11.797827-10.047304-7.291391h12.418975l3.837418-11.798624 3.837417 11.798624h12.418975zM125.81156 31.510075l7.183595-1.509576 2.862113 8.800152-10.045708-7.290576z"
                    fill="#FFF"
                  />
                </g>
                <g className="tp-star">
                  <path
                    fill="#00B67A"
                    d="M153.815458 46.330002h46.375586V0h-46.375586z"
                  />
                  <path
                    d="M193.348355 19.711433L167.045457 38.80065l3.837417-11.797827-10.047303-7.291391h12.418974l3.837418-11.798624 3.837418 11.798624h12.418974zM177.09292 31.510075l7.183595-1.509576 2.862114 8.800152-10.045709-7.290576z"
                    fill="#FFF"
                  />
                </g>
                <g className="tp-star">
                  <path
                    fill="#00B67A"
                    d="M205.064416 46.330002h46.375587V0h-46.375587z"
                  />
                  <path
                    fill="#00B67A"
                    d="M205.064416 46.330002h23.187793V0h-23.187793z"
                  />
                  <path
                    d="M244.597022 19.711433l-26.3029 19.089218 3.837419-11.797827-10.047304-7.291391h12.418974l3.837418-11.798624 3.837418 11.798624h12.418975zm-16.255436 11.798642l7.183595-1.509576 2.862114 8.800152-10.045709-7.290576z"
                    fill="#FFF"
                  />
                </g>
              </svg>
            </div>

            <div className="w-20 flex-shrink-0">
              <svg
                viewBox="0 0 126 31"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-auto"
              >
                <title>Trustpilot</title>
                <path
                  fill="#FFFFFF"
                  d="M33.074774 11.07005H45.81806v2.364196h-5.010656v13.290316h-2.755306V13.434246h-4.988435V11.07005h.01111zm12.198892 4.319629h2.355341v2.187433h.04444c.077771-.309334.222203-.60762.433295-.894859.211092-.287239.466624-.56343.766597-.79543.299972-.243048.633276-.430858.999909-.585525.366633-.14362.744377-.220953 1.12212-.220953.288863 0 .499955.011047.611056.022095.1111.011048.222202.033143.344413.04419v2.408387c-.177762-.033143-.355523-.055238-.544395-.077333-.188872-.022096-.366633-.033143-.544395-.033143-.422184 0-.822148.08838-1.199891.254096-.377744.165714-.699936.41981-.977689.740192-.277753.331429-.499955.729144-.666606 1.21524-.166652.486097-.244422 1.03848-.244422 1.668195v5.39125h-2.510883V15.38968h.01111z"
                />
                <path
                  fill="#00B67A"
                  d="M30.141707 11.07005H18.63164L15.076408.177071l-3.566342 10.892977L0 11.059002l9.321376 6.739063-3.566343 10.88193 9.321375-6.728016 9.310266 6.728016-3.555233-10.88193 9.310266-6.728016z"
                />
                <path
                  fill="#005128"
                  d="M21.631369 20.26169l-.799928-2.463625-5.755033 4.153914z"
                />
              </svg>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Hero;
