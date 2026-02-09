// app/why-jvto/page.tsx
import {
  Shield,
  ArrowDown,
  Verified,
  Star,
  ShieldCheck as Security,
  BookOpen as MenuBook,
  Building as Business,
  MapPin as LocationOn,
  Home,
  Gavel,
  Lock,
  Ticket as ConfirmationNumber,
  MessageCircle as Chat,
  ShieldAlert as LocalPolice,
  Activity as MonitorHeart,
} from "lucide-react";
import Link from "next/link";
import TriangulationReviews from "./TriangulationReviews";

export default function WhyJvtoPage() {
  return (
    <>
      <main className="pt-[74px]">
        <section
          className="relative min-h-[600px] flex items-center justify-center bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCrGTSfff3zN-DpWYN4db7tmSSTtj2trlW7QsvlcO2yznrZaW8VgZSrhrMwus7ZZ4t4GGBWFxa50E4PafppUndmPRuiuRHhXWGbGK_ThutH24P461ZYuQSosD1BqVsGaCJX0REKMgy6ZUavqlBc3BEIStGAi8KAcqRdOpWC5fouXO2y8yetm0mwlRMmTmSE_pJxsielVl9MjBGml8ERZ2SfZVdf6qZVf3mrMgE-21HMGJ5AgQsvQYI-X6PIlBmNWTqi28Vx1rhczmt-')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(15,23,42,0.8)] to-[rgba(15,23,42,0.6)]"></div>
          <div className="container mx-auto px-6 py-20 relative z-10 text-center max-w-5xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-widest mb-8 shadow-sm">
              <Shield className="w-3.5 h-3.5 text-[#A6CE39]" />
              Established 2015
            </div>
            <h1 className="text-white text-5xl md:text-7xl font-extrabold leading-tight tracking-tight mb-8 drop-shadow-lg">
              Operational Certainty in East Java&apos;s{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A6CE39] to-white">
                Ring of Fire
              </span>
            </h1>
            <p className="text-slate-200 text-lg md:text-xl font-medium leading-relaxed max-w-4xl mx-auto mb-12 drop-shadow-md text-justify md:text-center">
              Not Just a Content Tour. This Is a Standardized Operation Led by
              Tourist Police Discipline, Validated by a Proven History Since
              2015.
            </p>

            {/* FIX: No event handlers in a Server Component. Keep exact style. */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/verify-jvto"
                className="h-14 px-10 bg-[#A6CE39] hover:bg-white text-[#111827] rounded-full font-bold transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#A6CE39]/40 transform hover:-translate-y-1"
              >
                <span>See The Proof</span>
                <ArrowDown className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        <section className="py-24 px-6 bg-[#F4F9E1]">
          <div className="container mx-auto max-w-4xl">
            <div className="relative">
              <span className="absolute -top-12 -left-12 text-[160px] text-[#A6CE39] opacity-20 font-black select-none pointer-events-none z-0">
                &quot;
              </span>
              <div className="relative z-10 text-center px-4">
                <h2 className="text-2xl md:text-4xl font-extrabold text-[#111827] leading-tight mb-8">
                  Choosing a tour operator for Mount Ijen or Mount Bromo is not
                  about who has the most visually appealing Instagram photos.{" "}
                  <span className="text-[#8ab51a]">
                    We operate in an active volcanic environment.
                  </span>
                </h2>
                <p className="text-slate-700 text-lg md:text-2xl leading-relaxed font-medium">
                  It is about who you trust when entering an active volcanic
                  environment—at night, in extreme temperatures, with real
                  exposure to toxic gas and sudden weather changes. JVTO (PT
                  Java Volcano Rendezvous) exists as a direct counterpoint to
                  unstructured “open trip” operators. We combine law-enforcement
                  discipline, verifiable operational history, and real physical
                  infrastructure to deliver one thing only: operational
                  certainty — not marketing promises.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 px-6 bg-white overflow-hidden">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col lg:flex-row gap-20 items-center">
              <div className="w-full lg:w-5/12 relative group">
                <div className="absolute -inset-4 bg-[#f8fafc] rounded-2xl transform rotate-3 transition-transform group-hover:rotate-1"></div>
                <div className="relative rounded-2xl overflow-hidden shadow-[0_20px_40px_-5px_rgba(17,24,39,0.1)] border border-slate-100">
                  <img
                    alt="Portrait of Bripka Agung Sambuko"
                    className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCb_OPfT0wKvI-umHBcFnbSTp_50ueobnh2OeEoniFhX7AlCe2-lPCZQJpL1ToO_nhSlvmS81S4pfVzOmntD0PoK3xLjFOS1WTf3XBFKvtcq-yzBOH0vjP5Ny5psuI3UPngeTkC3AV1w53bpwPhg9pPkCF8Kv2drmxVTxQgn0pV-lQEVqKumxFep1j4zm4rrD00YblYKYGGhtCGMAeYtLX-Qw83sZf72Y5FwFgATjbzMvDb-iN5S1pD0LiHTZXMRplF4JYJfm3RM_u3"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#111827] via-[#111827]/90 to-transparent p-8 pt-24">
                    <div className="flex items-center gap-2 text-[#A6CE39] mb-2">
                      <LocalPolice className="w-4 h-4 fill-current" />
                      <span className="text-xs font-bold uppercase tracking-wider">
                        Founder
                      </span>
                    </div>
                    <h3 className="text-white text-2xl font-bold">
                      Bripka Agung Sambuko
                    </h3>
                    <p className="text-slate-300 text-sm mt-1">
                      Active Tourist Police Officer (Pam Obvit)
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-7/12">
                <h2 className="text-4xl md:text-5xl font-extrabold text-[#111827] mb-8 leading-tight">
                  THE AUTHORITY: <br />
                  <span className="text-[#8ab51a]">POLICE-LED OPERATIONS</span>
                </h2>
                <p className="text-slate-600 text-lg leading-relaxed mb-8">
                  JVTO was founded and is led by Bripka Agung Sambuko, an active
                  Tourist Police officer (Pam Obvit) based in Bondowoso, East
                  Java. This is not a ceremonial title. His law-enforcement
                  background shapes the operational DNA of JVTO. Field
                  decisions—whether to proceed during heavy rain, halt a climb
                  due to sulfur gas exposure, or cancel an ascent entirely—are
                  made based on risk protocols, not commercial pressure.
                </p>
                <div className="bg-slate-50 border-l-4 border-[#111827] p-8 rounded-r-xl mb-10">
                  <p className="text-[#111827] italic text-lg font-medium leading-relaxed">
                    &quot;Operational certainty means we don&apos;t hope for
                    safety; we engineer it through strict protocol and active
                    oversight.&quot;
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                    Public Verification (Press Recognition)
                  </h4>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-4 pr-6 pl-4 py-3 bg-white border border-slate-200 shadow-sm rounded-xl hover:border-[#A6CE39] hover:shadow-md transition-all">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden shrink-0 border border-slate-100">
                        <img
                          alt="Detik.com logo"
                          className="w-10 h-auto"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJxN8ctxMpAx-xLd5tF3T7DNpyrMzxcGihfgACb0XaL4vVq47wZinj7konnEDJVmoRhDI9llZwFtBwNPbif8plClCmYUdEPN8khduHgTYUnJh9Iz2-ohVRwyJ7vXlH14eHiNPcEz5L7x2OJoCk76zaZNnvw5442otfOudqaEetSdwEA4WA2EQpIu7t-03vtKeHYPJxxd4XKiZt1X89bF1i6wA4gyp7OWgXlzFp4XJHbpzKptdlfN2HTO3jZP9ywNO9ECpM0WSoyUvG"
                        />
                      </div>
                      <div>
                        <span className="text-[#111827] font-bold block text-sm">
                          Detik.com (2021)
                        </span>
                        <span className="text-xs text-slate-500">
                          Safety &amp; health protocol enforcement in extreme
                          weather
                        </span>
                      </div>
                      <Verified className="w-5 h-5 text-[#A6CE39] ml-2" />
                    </div>

                    <div className="flex items-center gap-4 pr-6 pl-4 py-3 bg-white border border-slate-200 shadow-sm rounded-xl hover:border-[#A6CE39] hover:shadow-md transition-all">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden shrink-0 border border-slate-100">
                        <img
                          alt="Radar Jember logo"
                          className="w-10 h-auto"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3hHxgBs-5big0o95RmvBt-IEL-tF3S-4hVEBGSK3Qa9Dm0bIzEATK4jKjd31AZcu-wWUxQeBJHOZT-QE3WyBjcS63zH9UES0VMPIoFpPAIEO7AeuCksjYA_1q5kszv091gX8C_D5NaQRPuJFDFVTCCNDpfDDeZzUvof54WAoO7pKy1EnfzR75CeDAZxl1RFZXshqIsmQyrXX7OydawT13ly4oy1s8tMz9FVytddJeOLj3F6-lOcpDCu6hgaAIBf6PxtPz4sYrzIiN"
                        />
                      </div>
                      <div>
                        <span className="text-[#111827] font-bold block text-sm">
                          Radar Jember (2021)
                        </span>
                        <span className="text-xs text-slate-500">
                          Tourist Police unit supporting Ijen Geopark area
                        </span>
                      </div>
                      <Verified className="w-5 h-5 text-[#A6CE39] ml-2" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 px-6 bg-slate-50 border-y border-slate-200">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#111827] mb-4 uppercase tracking-tight">
                THE TIMELINE
              </h2>
              <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                Proven history (2015–now). Not a post-pandemic pop-up business.
              </p>
            </div>

            <div className="relative">
              <div className="absolute top-0 bottom-0 left-6 md:left-1/2 md:transform md:-translate-x-1/2 w-0.5 bg-slate-200 z-0"></div>

              {/* ... (TIMELINE CONTENT UNCHANGED) ... */}
              {/* NOTE: I’m keeping everything else as-is. */}
              {/* Your existing timeline blocks remain here exactly the same. */}

              {/* 2015 block */}
              <div className="relative md:grid md:grid-cols-[1fr_auto_1fr] md:gap-8 mb-16 items-center group">
                <div className="hidden md:flex flex-col items-end text-right">
                  <span className="text-[#8ab51a] font-black text-3xl mb-1">
                    2015
                  </span>
                  <h3 className="text-[#111827] font-bold text-xl">
                    The Roots
                  </h3>
                  <p className="text-slate-600 mt-2 text-sm leading-relaxed mb-4">
                    JVTO began as Ijen Miner Family Homestay, serving European
                    guests individually from a private residence.
                  </p>
                  <div className="w-48 h-32 rounded-lg overflow-hidden shadow-md border-2 border-white transform rotate-2 hover:rotate-0 transition-transform">
                    <img
                      alt="Cozy homestay photo from 2015"
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCN4bbepF4xRl7fW6GZfGR6EUMrH1y3aojQPjuKIghZFajW6-3ezcJKXlMJHKlklq9zf4nrrrmQk1_aQMQ4QMCHBbHkCXnjRYZ19KJxJZoEFnt8RXQHQUtUvCGmBu0RUW_NeK4fnXjG9_9vd0LrEiJFexAF11hHT_QxTK_sjKF2Zt1RRAKrFHBlDZa0GEM8iBSl1ktOdCKkYXujNIu8HS5l3w7Md3zArVDrAa9wpVKm1V3V70ste3V9VARSfs1HbQeoTLExNH5_8YzF"
                    />
                  </div>
                </div>

                <div className="flex justify-center md:py-2 pl-12 md:pl-0 relative">
                  <div className="absolute left-0 top-0 md:static w-12 h-12 rounded-full bg-[#A6CE39] text-[#111827] border-4 border-white shadow-lg flex items-center justify-center z-10">
                    <Security className="w-5 h-5" />
                  </div>
                  <div className="md:hidden">
                    <span className="text-[#8ab51a] font-bold text-sm">
                      2015
                    </span>
                    <h3 className="text-[#111827] font-bold text-lg">
                      The Roots
                    </h3>
                    <div className="w-full max-w-xs h-40 rounded-lg overflow-hidden shadow-md border-2 border-white mt-3">
                      <img
                        alt="Cozy homestay photo from 2015"
                        className="w-full h-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAW7qqBfj8c-C17M0dEHFCB-4RtcoePx_v0MnA7Qzkf9sRJBebPxxESvic8t5e2XNW43I2mRaZATi8BIelgpJi69EES6hNuX1kZtooEqCTxgOng04ff6DBtuuJlIsxVVguUpQZZrPEbwxzHqcfdoPAv0GmRL4Sq5zgpXgWwk7tih5vEJgERzoqRwBqpjLrAmPaLOViruwqJcTG1vDfopoawkE83TrkFozmMTJN0kzCGuVx26ob6-CeZVjLjAL-owyVmmHUAXZ3Cj4yX"
                      />
                    </div>
                  </div>
                </div>

                <div className="hidden md:block">
                  <p className="text-slate-400 text-sm italic">
                    Hospitality standards formed through direct human execution.
                  </p>
                </div>
              </div>

              {/* 2016 block */}
              <div className="relative md:grid md:grid-cols-[1fr_auto_1fr] md:gap-8 mb-16 items-center group">
                <div className="hidden md:block text-right">
                  <p className="text-slate-400 text-sm italic">
                    Early validation of service quality.
                  </p>
                </div>

                <div className="flex justify-center md:py-2 pl-12 md:pl-0 relative">
                  <div className="absolute left-0 top-0 md:static w-12 h-12 rounded-full bg-white text-[#8ab51a] border-4 border-[#A6CE39] shadow-lg flex items-center justify-center z-10">
                    <Star className="w-5 h-5" />
                  </div>
                  <div className="md:hidden">
                    <span className="text-[#8ab51a] font-bold text-sm">
                      2016
                    </span>
                    <h3 className="text-[#111827] font-bold text-lg">
                      Early Validation
                    </h3>
                    <div className="w-full max-w-xs h-40 rounded-lg overflow-hidden shadow-md border-2 border-white mt-3">
                      <img
                        alt="Booking.com Award Plaque"
                        className="w-full h-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7C2EdjpKbMQ_hQaU0hQnxlSJ0kKdC89XgMFIcLljxywMd4ozVjAKDDfdBXX-CWUmtHNETKEE0put1wyBIn9RHvq-A_orV4rsxwyzIMoBZlcRMncrhzT0w4_Qzw_fHzxsW3qkzAu8CH-Ow8zm6DmHOGHGYLCNu7yCNWk9EMztfVoPDV2ljc__BLTa_gbEX3s3Q8gzBqjMAGKzTjmUzKz8VfooQ1ll5c9_ZD42uZmxEM5GTYUKTa-G58sAPl4SOvsEMHInAD92Fpd9J"
                      />
                    </div>
                  </div>
                </div>

                <div className="hidden md:block">
                  <span className="text-[#8ab51a] font-black text-3xl mb-1 block">
                    2016
                  </span>
                  <h3 className="text-[#111827] font-bold text-xl">
                    Early Validation
                  </h3>
                  <p className="text-slate-600 mt-2 text-sm leading-relaxed mb-4">
                    Booking.com Guest Review Award — 9.2/10 score. The physical
                    award plaque remains preserved as a historical anchor of
                    service quality.
                  </p>
                  <div className="w-48 h-32 rounded-lg overflow-hidden shadow-md border-2 border-white transform -rotate-2 hover:rotate-0 transition-transform">
                    <img
                      alt="Booking.com Award Plaque"
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjbxpYVXPP_CLJ5JgTn0-SpmSB5LjDKWosDL_Z9jRR50vbIuzgiPMDQ97bs7XdZ-6ko4O7VDix4keM2hvW1qKwn2lmGVSnj9Mo-9WHE-UrLeRDex4AQLLLVplyqwQJDvDpfkGEL54c3AHFVzMxI1w6T6a6zYKfc1-AtB_WkynZeg2Qdtgly6E9TVgl0fHLTMGRtA637yntnn1xm-bLXRLw4uoefP2L2qBOqstIOLI7DCk4kfYivVSEtym2ujrm63qr_4wK35lfdDA7"
                    />
                  </div>
                </div>
              </div>

              {/* 2018 + Today blocks unchanged (as in your file) */}
              {/* Keep the rest exactly as you already have it */}
              {/* ... */}
            </div>
          </div>
        </section>

        <section className="py-24 px-6 bg-white">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#111827] mb-16 text-center uppercase tracking-tight">
              THE FORTRESS
            </h2>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              {/* ... FORTRESS UNCHANGED ... */}

              <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-[0_4px_20px_-2px_rgba(17,24,39,0.05)] hover:shadow-[0_20px_40px_-5px_rgba(17,24,39,0.1)] transition-shadow duration-300 flex flex-col h-full">
                <div className="flex items-center gap-5 mb-8">
                  <div className="w-14 h-14 bg-slate-50 text-[#8ab51a] rounded-xl flex items-center justify-center shrink-0">
                    <LocationOn className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#111827]">
                      Physical Headquarters
                    </h3>
                    <p className="text-slate-500 text-sm">
                      Bondowoso Operations Base
                    </p>
                  </div>
                </div>

                <div className="grow rounded-xl overflow-hidden h-64 bg-slate-100 relative mb-8 border border-slate-200 group">
                  <img
                    alt="Exterior photo of Bondowoso headquarters with signage"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzv4FiPAAfEPMcoyzMIbFIJ1B8Ie1Jh4b8Ox392SuADlQSMrL0tKrE_hscRZOCzD0_0fTcgg4aeKKO2s96tyPV3LCL2rMTRTjX3PPp3wUiMpcGgJTmF-aorfulsjeFvp323IQjd6qLah3QwJmZG0_ZsRR_4dAnh6yxcsWYhrv7Sa0H12mvhxrkLm_zNsY_0EjoCikp5RvffrkJLfVLTQzH8qhmwn1tFlNibl59S1DGPIkCsC7n8NGlxhWp-PJUOvsgsdxW4h3xm1ur"
                  />
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm">
                    <span className="text-xs font-bold text-[#111827] flex items-center gap-1">
                      <Verified className="w-3 h-3 text-[#A6CE39]" />
                      Verified Location
                    </span>
                  </div>
                </div>

                <address className="bg-slate-50 p-6 rounded-xl text-slate-600 not-italic text-sm border border-slate-200">
                  <strong className="text-[#111827] block mb-2 text-base font-bold flex items-center gap-2">
                    <Home className="w-4 h-4 text-[#8ab51a]" />
                    JVTO Headquarters
                  </strong>
                  Jl. Khairil Anwar No.102 A, Badean, Bondowoso
                  <br />
                  East Java, Indonesia 68214
                </address>
              </div>

              <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-[0_4px_20px_-2px_rgba(17,24,39,0.05)] hover:shadow-[0_20px_40px_-5px_rgba(17,24,39,0.1)] transition-shadow duration-300 flex flex-col h-full">
                <div className="flex items-center gap-5 mb-8">
                  <div className="w-14 h-14 bg-slate-50 text-[#8ab51a] rounded-xl flex items-center justify-center shrink-0">
                    <Gavel className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#111827]">
                      Legal Standing
                    </h3>
                    <p className="text-slate-500 text-sm">
                      PT Java Volcano Rendezvous
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-4 grow">
                  {/* ... LEGAL UNCHANGED ... */}
                  <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-[#A6CE39]/30 transition-colors group">
                    <div className="w-16 h-20 bg-slate-100 rounded shrink-0 overflow-hidden border border-slate-200">
                      <img
                        alt="NIB Document Preview"
                        className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjYqQSJX3UgvQdOczDcesWnGJwNt-YpnLv48RQfB6g5G7Px0ROQ78l25fmy43tOmJLLLakS3O2kq9KJaJx9oEJ_mxID3JEz00EbyoMaAIR8Nlp_cC-9QzU1OM8Z6qGh6LtQ0lTRsG6AI8h3mF3jBjVhkEhE0FRtk6GEaxo23kOQhKqEkcfRaCFy5k6NyyJR3ILwNxA8B09X57THXdU01kPKIu8HFXCWM-TDpHoriZ23d95hlPTxA0Q9oSL6TQuKEvCa5s0HLxokhTx"
                      />
                    </div>
                    <div className="w-full">
                      <div className="flex justify-between items-start w-full">
                        <h4 className="text-[#111827] font-bold text-sm">
                          NIB (Business ID)
                        </h4>
                        <span className="text-[10px] font-bold uppercase text-white bg-[#A6CE39] px-2 py-0.5 rounded">
                          Verified
                        </span>
                      </div>
                      <code className="text-[#111827] font-mono text-xs md:text-sm block mt-1 bg-[#A6CE39]/10 px-2 py-1 rounded w-fit">
                        1102230032918
                      </code>
                      <p className="text-[10px] text-slate-500 mt-1">
                        Licensed Activities: 79120 (Travel Agency), 79921 (Tour
                        Guide Services)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-[#A6CE39]/30 transition-colors group">
                    <div className="w-16 h-20 bg-slate-100 rounded shrink-0 overflow-hidden border border-slate-200">
                      <img
                        alt="AHU Registration Document Preview"
                        className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkMa07F9Phfe6IcH2xVOGS7iwO_wjGLuUAwnOHEOx2Nlf9z-60KFpsqwmQaddxo4dgG6HNC1XDCjZeaRQ4nC5TVqlu057m57uv5EQbN4ZTsUaoRuh3c-ypTLmME3pgUSfmQTzhQB_IEIGA3UPqUljlob44LaVwHQDca9XPK_RHSX-tYIfb1MfOhw_pb7v5nXGGlh4MjX-9_8zLh-xudNaz35P9neLbn7xAtAI3hz3RnfpN_4RaO0Y20WCuEBEWQUrhg7ziouP5k9sZ"
                      />
                    </div>
                    <div className="w-full">
                      <div className="flex justify-between items-start w-full">
                        <h4 className="text-[#111827] font-bold text-sm">
                          AHU Registration
                        </h4>
                        <span className="text-[10px] font-bold uppercase text-white bg-[#A6CE39] px-2 py-0.5 rounded">
                          Verified
                        </span>
                      </div>
                      <code className="text-[#111827] font-mono text-xs md:text-sm block mt-1 bg-[#A6CE39]/10 px-2 py-1 rounded w-fit">
                        Ministry of Law and Human Rights (AHU)
                      </code>
                      <p className="text-[10px] text-slate-500 mt-1">
                        Official legal incorporation record.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex items-center gap-3 text-sm text-slate-500 bg-slate-50 p-4 rounded-lg">
                  <Lock className="w-4 h-4 text-[#111827]" />
                  Legal documentation is not hidden. Guests are explicitly
                  invited to verify it.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ✅ TRIANGULATION REPLACED (style wrapper unchanged) */}
        <section className="py-24 px-6 bg-slate-50 border-y border-slate-200">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#111827] mb-4 uppercase tracking-tight">
                THE TRIANGULATION
              </h2>
              <p className="text-slate-600 text-lg">
                Real guest feedback across three platforms — with crew names
                that show we operate in-house, not outsourced.
              </p>
            </div>

            <TriangulationReviews />
          </div>
        </section>

        <section className="py-24 px-6 bg-white relative overflow-hidden">
          <div className="absolute inset-y-0 right-0 w-2/3 bg-gradient-to-l from-slate-50 to-transparent pointer-events-none"></div>
          <div className="container mx-auto max-w-5xl relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-16">
              <div className="w-full md:w-5/12">
                <h2 className="text-3xl md:text-4xl font-extrabold text-[#111827] mb-6 uppercase tracking-tight">
                  THE INNOVATION
                </h2>
                <h3 className="text-xl font-bold text-[#8ab51a] mb-6">
                  IJEN DIGITAL HEALTH SCREENING
                </h3>
                <p className="text-slate-600 text-lg mb-10 leading-relaxed">
                  Mount Ijen is an extreme environment. JVTO does not rely on
                  assumptions when it comes to guest health.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                    <span className="font-bold text-[#8ab51a] w-24 shrink-0">
                      Procedure
                    </span>
                    <span className="text-slate-600 text-sm">
                      Mandatory SpO₂ and blood-pressure screening prior to
                      ascent.
                    </span>
                  </li>
                  <li className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                    <span className="font-bold text-[#8ab51a] w-24 shrink-0">
                      System
                    </span>
                    <span className="text-slate-600 text-sm">
                      Digital recording to prevent forged medical clearance.
                    </span>
                  </li>
                  <li className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                    <span className="font-bold text-[#8ab51a] w-24 shrink-0">
                      Execution
                    </span>
                    <span className="text-slate-600 text-sm">
                      Licensed medical personnel conduct checks at the hotel or
                      office.
                    </span>
                  </li>
                  <li className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                    <span className="font-bold text-[#8ab51a] w-24 shrink-0">
                      Validation
                    </span>
                    <span className="text-slate-600 text-sm">
                      QR-code-based clearance for ascent access.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="w-full md:w-7/12">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl group border-4 border-white">
                  <img
                    alt="Guest undergoing digital health check with oximeter"
                    className="w-full h-auto object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTV1acV_WPXiYuXB1yJoIoF6JXrUr_s0M3qmEfwVva6i1YWzZHTR19F8ipMGj42EfQKIfmaaTURxttpUd46WRAy46YiKqOfMxIBW8J46r1Yv14NI-I7trYLX62ms-RpWgiKYN0iwK-QGJ0VP1W7UmMtHqtN1MR6SVjIYe5fTNn-W0mUx1JU1ENm380uoxLQO1BAI7vIBWQbE9QDLKopmlHGlPki3cVE-9RgMqSD8PAZ1tKhA3NujCm14U_305zS78Sx0ozjQYsGFkT"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl">
                      <div className="bg-[#A6CE39] p-2 rounded-lg text-[#111827]">
                        <MonitorHeart className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-lg">
                          SpO2 Monitor
                        </h4>
                        <p className="text-slate-300 text-xs">
                          Pre-ascent screening standard
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ... REST OF YOUR FILE UNCHANGED (VALUE, PARTNERS, CTA, JSON-LD) ... */}

        <section className="py-24 px-6 bg-slate-50 border-t border-slate-200">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#111827] mb-4 uppercase tracking-tight">
                WE OFFER MORE — TANGIBLE VALUE
              </h2>
              <p className="text-slate-600 text-lg">
                Included in every private package.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {/* ... VALUE CARDS UNCHANGED ... */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-[#A6CE39] hover:shadow-lg transition-all flex flex-col items-center text-center gap-3 group cursor-default h-full">
                <div className="w-full aspect-square rounded-lg overflow-hidden mb-2 bg-slate-100">
                  <img
                    alt="Sealed bottled drinking water"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRLyZ_O6bXGA5ZePop18HXvsE1pDtJQoHnG9PpGJiswUi4U77XuzJImNnUGdBZT__bmQINmjX2LW-evFYmgLMSiY2hKWVlGfjCm78YvcrNOK8mFxxrgLCe5ro6-MOx81Mj3gb5431Vi9vZDY7Fl-Y7ahP35gRyPKkXhm97QFhDkoxnfgyctkq15FcXfNLwjO4n5Uf5SOWtjCM5Notk77IoVSATI_J2Tcdp91-lH07nuOk4XkxMCJ5OhM6MhWGMSPl1mLgH-GD5ARes"
                  />
                </div>
                <div>
                  <h4 className="text-[#111827] text-sm font-bold mb-1">
                    Sealed Water
                  </h4>
                  <p className="text-xs text-slate-500">
                    Available daily in the vehicle
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-[#A6CE39] hover:shadow-lg transition-all flex flex-col items-center text-center gap-3 group cursor-default h-full">
                <div className="w-full aspect-square rounded-lg overflow-hidden mb-2 bg-slate-100">
                  <img
                    alt="Hotel breakfast"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDq0nHBJCS4AXTyPNj70vf-DuaNfWiBZZJ8ukk-xLVq14WQ3OUur7ZLugBVyNx2qrQcGHtdT9kRZNCvvfIQArlJMzCThYvwjfe8mqDXAzYjVk8b-pkRWKxwt7nuO4-fmRo5V688PSv0h3W7hSgMNkYXga0d1diFOVk-zRXu9ulR9Ji_zlX732qJkE2eDNnFl4he5Gm8VxqtYlizI4c7QwAC970CIDgObr8v3_v5sD90onH4e6mmmkT4SP0PMsv5st7Yl95BjnQUcIhu"
                  />
                </div>
                <div>
                  <h4 className="text-[#111827] text-sm font-bold mb-1">
                    Hotel Breakfast
                  </h4>
                  <p className="text-xs text-slate-500">
                    Included to support exertion
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-[#A6CE39] hover:shadow-lg transition-all flex flex-col items-center text-center gap-3 group cursor-default h-full">
                <div className="w-full aspect-square rounded-lg overflow-hidden mb-2 bg-slate-100">
                  <img
                    alt="Professional gas mask"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVxi1Sa1kQiAA6OdO8p70xoYWwWFF65FcVzfSOB7yLQnohhbVKyuMZGAFaIpOys4RW7T55FY4-tvXE5f7XORnxSLPdyKCf5v-eGaK7TJOF0HDHbRWqhB1fleEpkzGXCpZB45kED0l6-WNQMtFBqSRSNgZP6rKgBCVDKmsvEzJKaOn6tpWP7SkfhX3PNldJEl1nZ5EqZ_Le83Gb-6Rks4-LGLEmu_vaBlpN563IUH8CJK7_R85C6gSaKXnwQksmmr9w3hFnnLhUmgrJ"
                  />
                </div>
                <div>
                  <h4 className="text-[#111827] text-sm font-bold mb-1">
                    Professional Gas Masks
                  </h4>
                  <p className="text-xs text-slate-500">
                    Clean &amp; maintained
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-[#A6CE39] hover:shadow-lg transition-all flex flex-col items-center text-center gap-3 group cursor-default h-full">
                <div className="w-full aspect-square rounded-lg overflow-hidden mb-2 bg-slate-100">
                  <img
                    alt="JVTO Travel T-Shirt"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHXQmFkrYkwQSMyn4nMopkBz9lwtPLqh_8hXJFu6F6-7UYXWXl9Z7fWZYmc0cyxO3IT8jmctXk1NmTl5siVK_qNLq7phsZJXvf3M1eg-_MTazZOr6ViQu_2QVbNOkBw31_9J4JwWj0d4qLNLO-gVFB9l3_14YZlyx9qBA0nncaJmumJLrrXqtdyNgiVEhMxlf3wG4C2t3PJf3U8FksOmXDkHu87b8tOmQzcFWTq6SiXuo2ulTVeLV4CDJ4x_5YhnhGq-S_HyYuHgE6"
                  />
                </div>
                <div>
                  <h4 className="text-[#111827] text-sm font-bold mb-1">
                    JVTO Travel T-Shirt
                  </h4>
                  <p className="text-xs text-slate-500">Selected packages</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-[#A6CE39] hover:shadow-lg transition-all flex flex-col items-center text-center gap-3 group cursor-default h-full">
                <div className="w-full aspect-square rounded-lg overflow-hidden mb-2 bg-slate-100 flex items-center justify-center">
                  <ConfirmationNumber className="w-10 h-10 text-[#A6CE39]" />
                </div>
                <div>
                  <h4 className="text-[#111827] text-sm font-bold mb-1">
                    Prepaid Fees
                  </h4>
                  <p className="text-xs text-slate-500">
                    Entrance, parking, village contributions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Partners unchanged */}
        <section className="py-16 px-6 bg-white border-b border-slate-200">
          <h2 className="text-center text-xs font-bold uppercase tracking-widest text-slate-400 mb-10">
            Partners &amp; Ecosystem — External Trust Signals
          </h2>
          <div className="container mx-auto flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-60 hover:opacity-100 transition-opacity duration-500 grayscale hover:grayscale-0">
            <div className="flex items-center gap-2 group h-12">
              <img
                alt="ISIC Logo"
                className="h-full w-auto object-contain"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBIhmgg-HVDRs6YjVI3oGFUqdKk2yxcxk-U2Qauk-La-LhS-nuCkiJKg1Gl5j9tZ4CSkIDTmCJbPnR1A78SHajhHuq5763TAcNcEpvkFr9auGm_ggxTU6pfOO8oE2Xss4w6MxrXmnVFQRSH_S5rcB2l_LTIBkrlbVsc7XDkczpyl4VelBFZT9U3zaJ1M5fWf5nJ32kdW194bU9utNyubhHj7N7XQiGZtY442ofgqKGYX6kbmooHRqNyuOo10oc47spbS7cK8x6OuUyA"
              />
            </div>
            <div className="flex items-center gap-3 group h-12">
              <div className="h-full px-6 bg-slate-100 flex items-center justify-center rounded border border-slate-200">
                <span className="text-sm font-bold text-slate-600">HPWKI</span>
              </div>
            </div>
            <div className="flex items-center gap-3 group h-12">
              <div className="h-full px-6 bg-slate-100 flex items-center justify-center rounded border border-slate-200">
                <span className="text-sm font-bold text-slate-600">
                  INDECON
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 px-6 bg-[#111827] text-center border-t border-slate-200 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
          <div className="container mx-auto max-w-4xl relative z-10">
            <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-8 tracking-tight leading-tight">
              Safety. History. <br />
              <span className="text-[#A6CE39]">Operational Certainty.</span>
            </h2>
            <p className="text-slate-300 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-12">
              Do not gamble with travel in an active volcanic zone. Choose an
              operator with a real identity, a verifiable history, and
              enforceable legal standards.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link
                href="/verify-jvto"
                className="w-full sm:w-auto h-16 px-10 bg-[#A6CE39] hover:bg-white hover:text-[#111827] text-[#111827] rounded-xl font-bold text-lg transition-all flex items-center justify-center shadow-lg shadow-[#A6CE39]/20"
              >
                Book Your Private Tour
              </Link>

              <Link
                href="/verify-jvto"
                className="w-full sm:w-auto h-16 px-10 bg-transparent border-2 border-white/20 hover:bg-white/10 hover:border-white text-white rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3"
              >
                <Chat className="w-5 h-5" />
                Chat on WhatsApp
              </Link>
            </div>

            <p className="mt-16 text-slate-400 text-sm">
              © 2024 PT Java Volcano Rendezvous. All rights reserved.
              <br />
              Licensed Tour Operator in East Java.
            </p>
          </div>
        </section>
      </main>

      {/* JSON-LD unchanged (you can optionally add Review schema later) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": "https://javavolcano-touroperator.com/#website",
                  url: "https://javavolcano-touroperator.com/",
                  name: "Java Volcano Tour Operator",
                  publisher: {
                    "@id": "https://javavolcano-touroperator.com/#organization",
                  },
                  inLanguage: "en",
                },
                {
                  "@type": "WebPage",
                  "@id":
                    "https://javavolcano-touroperator.com/why-jvto#webpage",
                  url: "https://javavolcano-touroperator.com/why-jvto",
                  name: "Why Travel with JVTO? Operational Certainty & Proven History",
                  description:
                    "Why JVTO is built for active-volcano travel: police-led operations, proven history since 2015, verifiable headquarters, legal standing, multi-platform reviews, and Ijen digital health screening.",
                  isPartOf: {
                    "@id": "https://javavolcano-touroperator.com/#website",
                  },
                  about: {
                    "@id": "https://javavolcano-touroperator.com/#organization",
                  },
                  primaryImageOfPage: {
                    "@type": "ImageObject",
                    "@id":
                      "https://javavolcano-touroperator.com/why-jvto#heroImage",
                    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCrGTSfff3zN-DpWYN4db7tmSSTtj2trlW7QsvlcO2yznrZaW8VgZSrhrMwus7ZZ4t4GGBWFxa50E4PafppUndmPRuiuRHhXWGbGK_ThutH24P461ZYuQSosD1BqVsGaCJX0REKMgy6ZUavqlBc3BEIStGAi8KAcqRdOpWC5fouXO2y8yetm0mwlRMmTmSE_pJxsielVl9MjBGml8ERZ2SfZVdf6qZVf3mrMgE-21HMGJ5AgQsvQYI-X6PIlBmNWTqi28Vx1rhczmt-",
                  },
                  inLanguage: "en",
                  mainEntity: {
                    "@id":
                      "https://javavolcano-touroperator.com/why-jvto#article",
                  },
                  significantLink: [
                    "https://javavolcano-touroperator.com/verify-jvto",
                  ],
                },
                {
                  "@type": "BreadcrumbList",
                  "@id":
                    "https://javavolcano-touroperator.com/why-jvto#breadcrumbs",
                  itemListElement: [
                    {
                      "@type": "ListItem",
                      position: 1,
                      name: "Home",
                      item: "https://javavolcano-touroperator.com/",
                    },
                    {
                      "@type": "ListItem",
                      position: 2,
                      name: "Why JVTO",
                      item: "https://javavolcano-touroperator.com/why-jvto",
                    },
                  ],
                },
                {
                  "@type": "TravelAgency",
                  "@id": "https://javavolcano-touroperator.com/#organization",
                  name: "Java Volcano Tour Operator",
                  legalName: "PT Java Volcano Rendezvous",
                  alternateName: "JVTO",
                  url: "https://javavolcano-touroperator.com/why-jvto",
                  email: "hello@javavolcano-touroperator.com",
                  foundingDate: "2015",
                  description:
                    "Tourist Police-led private tour operator in East Java, evolved from Ijen Miner Family Homestay (2015). Focused on operational certainty, safety standards, and transparent pricing for active-volcano environments.",
                  logo: {
                    "@type": "ImageObject",
                    "@id": "https://javavolcano-touroperator.com/#logo",
                    url: "https://javavolcano-touroperator.com/assets/logo-jvto.png",
                  },
                  identifier: [
                    {
                      "@type": "PropertyValue",
                      propertyID: "NIB",
                      value: "1102230032918",
                    },
                    {
                      "@type": "PropertyValue",
                      propertyID: "KBLI",
                      value: "79120",
                    },
                    {
                      "@type": "PropertyValue",
                      propertyID: "KBLI",
                      value: "79921",
                    },
                  ],
                  address: {
                    "@type": "PostalAddress",
                    streetAddress: "Jl. Khairil Anwar No.102 A",
                    addressLocality: "Bondowoso",
                    addressRegion: "East Java",
                    postalCode: "68214",
                    addressCountry: "ID",
                  },
                  priceRange: "$$",
                  founder: {
                    "@id":
                      "https://javavolcano-touroperator.com/#agung-sambuko",
                  },
                  knowsAbout: [
                    "Volcanic safety operations",
                    "Risk mitigation in active volcano tourism",
                    "Private expedition logistics",
                    "Digital health screening for Mount Ijen",
                    "Mount Ijen",
                    "Mount Bromo",
                    "East Java",
                  ],
                  amenityFeature: [
                    {
                      "@type": "LocationFeatureSpecification",
                      name: "Daily Bottled Water",
                      value: true,
                    },
                    {
                      "@type": "LocationFeatureSpecification",
                      name: "Breakfast Included (Hotel)",
                      value: true,
                    },
                    {
                      "@type": "LocationFeatureSpecification",
                      name: "Professional Gas Masks (Ijen)",
                      value: true,
                    },
                    {
                      "@type": "LocationFeatureSpecification",
                      name: "Headlamps (Ijen)",
                      value: true,
                    },
                    {
                      "@type": "LocationFeatureSpecification",
                      name: "Digital Health Screening (Ijen)",
                      value: "Mandatory prior to ascent",
                    },
                    {
                      "@type": "LocationFeatureSpecification",
                      name: "Prepaid Entrance & Local Fees",
                      value: true,
                    },
                  ],
                  award: [
                    "Booking.com Guest Review Award 2016 (Score 9.2/10 - Homestay Era)",
                    "Stefan Loose Reiseführer Indonesien Recommendation 2018 (Featured as trusted local operator)",
                  ],
                  memberOf: [
                    {
                      "@type": "Organization",
                      name: "HPWKI Bondowoso",
                      description:
                        "Professional guides association trained in SAR and volcanic risk mitigation.",
                    },
                    {
                      "@type": "Organization",
                      name: "ISIC",
                      description:
                        "International Student Identity Card provider (digital verification).",
                    },
                    {
                      "@type": "Organization",
                      name: "INDECON",
                      description: "Indonesia ecotourism network.",
                    },
                  ],
                  aggregateRating: {
                    "@type": "AggregateRating",
                    ratingValue: "4.9",
                    reviewCount: "200",
                    bestRating: "5",
                    worstRating: "1",
                    description:
                      "Consolidated rating from Google, Trustpilot, and TripAdvisor.",
                  },
                  sameAs: [
                    "https://www.trustpilot.com/review/javavolcano-touroperator.com",
                    "https://g.page/javavolcano",
                    "https://www.tripadvisor.com/Attraction_Review-g317070-d12836253-Reviews-Java_Volcano_Tour_Operator",
                    "https://www.instagram.com/javavolcano.tour/",
                  ],
                  contactPoint: [
                    {
                      "@type": "ContactPoint",
                      contactType: "customer support",
                      email: "hello@javavolcano-touroperator.com",
                      availableLanguage: ["en", "id"],
                      url: "https://javavolcano-touroperator.com/",
                    },
                  ],
                },
                {
                  "@type": "Person",
                  "@id": "https://javavolcano-touroperator.com/#agung-sambuko",
                  name: "Agung Sambuko",
                  alternateName: ["Bripka Agung Sambuko", "Mr. Sam"],
                  jobTitle: "Tourist Police Officer",
                  affiliation: {
                    "@type": "GovernmentOrganization",
                    name: "Indonesian National Police",
                    department: "Tourist Police (Pam Obvit)",
                  },
                  knowsAbout: [
                    "Public safety protocols",
                    "Crisis management",
                    "Volcanic risk assessment",
                    "Tourism security operations",
                  ],
                  sameAs: [
                    "https://news.detik.com/berita-jawa-timur/d-5492690",
                  ],
                },
                {
                  "@type": "Service",
                  "@id":
                    "https://javavolcano-touroperator.com/why-jvto#tourService",
                  name: "Private Volcano Tour Operations (Mount Bromo & Mount Ijen)",
                  provider: {
                    "@id": "https://javavolcano-touroperator.com/#organization",
                  },
                  serviceType: [
                    "Private tour",
                    "Volcano tour",
                    "Tour guiding service",
                    "Travel agency service",
                  ],
                  areaServed: [
                    {
                      "@type": "AdministrativeArea",
                      name: "East Java",
                    },
                    {
                      "@type": "Country",
                      name: "Indonesia",
                    },
                  ],
                  description:
                    "Standardized private operations for active-volcano environments, with disciplined risk protocols, own crew execution (not outsourced), and pre-ascent health screening for Mount Ijen when applicable.",
                  termsOfService:
                    "https://javavolcano-touroperator.com/verify-jvto",
                },
                {
                  "@type": "Article",
                  "@id":
                    "https://javavolcano-touroperator.com/why-jvto#article",
                  headline:
                    "Why Travel with JVTO? Operational Certainty & Proven History",
                  description:
                    "Police-led operations, proven history since 2015, verifiable HQ and legality, multi-platform reviews, and Ijen digital health screening.",
                  inLanguage: "en",
                  author: {
                    "@id": "https://javavolcano-touroperator.com/#organization",
                  },
                  publisher: {
                    "@id": "https://javavolcano-touroperator.com/#organization",
                  },
                  isPartOf: {
                    "@id":
                      "https://javavolcano-touroperator.com/why-jvto#webpage",
                  },
                  image: [
                    {
                      "@type": "ImageObject",
                      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCb_OPfT0wKvI-umHBcFnbSTp_50ueobnh2OeEoniFhX7AlCe2-lPCZQJpL1ToO_nhSlvmS81S4pfVzOmntD0PoK3xLjFOS1WTf3XBFKvtcq-yzBOH0vjP5Ny5psuI3UPngeTkC3AV1w53bpwPhg9pPkCF8Kv2drmxVTxQgn0pV-lQEVqKumxFep1j4zm4rrD00YblYKYGGhtCGMAeYtLX-Qw83sZf72Y5FwFgATjbzMvDb-iN5S1pD0LiHTZXMRplF4JYJfm3RM_u3",
                      name: "Portrait of Bripka Agung Sambuko",
                    },
                    {
                      "@type": "ImageObject",
                      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBzv4FiPAAfEPMcoyzMIbFIJ1B8Ie1Jh4b8Ox392SuADlQSMrL0tKrE_hscRZOCzD0_0fTcgg4aeKKO2s96tyPV3LCL2rMTRTjX3PPp3wUiMpcGgJTmF-aorfulsjeFvp323IQjd6qLah3QwJmZG0_ZsRR_4dAnh6yxcsWYhrv7Sa0H12mvhxrkLm_zNsY_0EjoCikp5RvffrkJLfVLTQzH8qhmwn1tFlNibl59S1DGPIkCsC7n8NGlxhWp-PJUOvsgsdxW4h3xm1ur",
                      name: "JVTO Headquarters Exterior",
                    },
                    {
                      "@type": "ImageObject",
                      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBTV1acV_WPXiYuXB1yJoIoF6JXrUr_s0M3qmEfwVva6i1YWzZHTR19F8ipMGj42EfQKIfmaaTURxttpUd46WRAy46YiKqOfMxIBW8J46r1Yv14NI-I7trYLX62ms-RpWgiKYN0iwK-QGJ0VP1W7UmMtHqtN1MR6SVjIYe5fTNn-W0mUx1JU1ENm380uoxLQO1BAI7vIBWQbE9QDLKopmlHGlPki3cVE-9RgMqSD8PAZ1tKhA3NujCm14U_305zS78Sx0ozjQYsGFkT",
                      name: "Ijen Digital Health Screening",
                    },
                  ],
                  hasPart: [
                    {
                      "@type": "WebPageElement",
                      "@id":
                        "https://javavolcano-touroperator.com/why-jvto#hero",
                      name: "Hero — Operational Certainty",
                      description:
                        "Operational Certainty in East Java’s Ring of Fire. Standardized operation led by Tourist Police discipline, validated by proven history since 2015.",
                    },
                    {
                      "@type": "WebPageElement",
                      "@id":
                        "https://javavolcano-touroperator.com/why-jvto#authority",
                      name: "The Authority — Police-Led Operations",
                      description:
                        "Field decisions based on risk protocols, not commercial pressure. Supervised standards inherited from public-safety discipline.",
                    },
                    {
                      "@type": "WebPageElement",
                      "@id":
                        "https://javavolcano-touroperator.com/why-jvto#timeline",
                      name: "The Timeline — Proven History (2015–Now)",
                      description:
                        "2015 homestay roots, 2016 Booking.com award, 2018 Stefan Loose listing, and today as PT Java Volcano Rendezvous.",
                    },
                    {
                      "@type": "WebPageElement",
                      "@id":
                        "https://javavolcano-touroperator.com/why-jvto#fortress",
                      name: "The Fortress — Physical & Legal Legitimacy",
                      description:
                        "Verifiable physical HQ in Bondowoso and formal legal standing (NIB + AHU).",
                    },
                    {
                      "@type": "WebPageElement",
                      "@id":
                        "https://javavolcano-touroperator.com/why-jvto#triangulation",
                      name: "The Triangulation — Multi-Platform Reviews",
                      description:
                        "Independent reviews across Google, Trustpilot, and TripAdvisor to validate consistency and crew quality.",
                    },
                    {
                      "@type": "WebPageElement",
                      "@id":
                        "https://javavolcano-touroperator.com/why-jvto#innovation",
                      name: "The Innovation — Ijen Digital Health Screening",
                      description:
                        "Mandatory SpO2 and blood-pressure screening prior to ascent; digitally recorded and used for go/no-go decisions.",
                    },
                    {
                      "@type": "WebPageElement",
                      "@id":
                        "https://javavolcano-touroperator.com/why-jvto#value",
                      name: "We Offer More — Tangible Value",
                      description:
                        "Sealed water, hotel breakfast, professional gas masks, selected package T-shirt, and prepaid fees.",
                    },
                    {
                      "@type": "WebPageElement",
                      "@id":
                        "https://javavolcano-touroperator.com/why-jvto#cta",
                      name: "Closing CTA",
                      description:
                        "Safety. History. Operational certainty. Link to verification proof and booking.",
                    },
                  ],
                },
                {
                  "@type": "ItemList",
                  "@id":
                    "https://javavolcano-touroperator.com/why-jvto#reputationLinks",
                  name: "Independent reputation platforms",
                  itemListElement: [
                    {
                      "@type": "ListItem",
                      position: 1,
                      name: "Google Business Profile",
                      item: "https://g.page/javavolcano",
                    },
                    {
                      "@type": "ListItem",
                      position: 2,
                      name: "Trustpilot",
                      item: "https://www.trustpilot.com/review/javavolcano-touroperator.com",
                    },
                    {
                      "@type": "ListItem",
                      position: 3,
                      name: "TripAdvisor",
                      item: "https://www.tripadvisor.com/Attraction_Review-g317070-d12836253-Reviews-Java_Volcano_Tour_Operator",
                    },
                  ],
                },
                {
                  "@type": "Review",
                  "@id":
                    "https://javavolcano-touroperator.com/why-jvto#review-google-001",
                  itemReviewed: {
                    "@id": "https://javavolcano-touroperator.com/#organization",
                  },
                  author: {
                    "@type": "Person",
                    name: "Daniel K. (Dummy)",
                  },
                  publisher: {
                    "@type": "Organization",
                    name: "Google",
                  },
                  reviewRating: {
                    "@type": "Rating",
                    ratingValue: "5",
                    bestRating: "5",
                    worstRating: "1",
                  },
                  reviewBody:
                    "Our driver Pak Eko and escort guide Rani (JVTO crew) were professional and consistent from pickup to drop-off. Clear briefings, no improvisation, and everything matched the plan. This did not feel outsourced.",
                  datePublished: "2026-01-15T00:00:00Z",
                },
                {
                  "@type": "Review",
                  "@id":
                    "https://javavolcano-touroperator.com/why-jvto#review-trustpilot-001",
                  itemReviewed: {
                    "@id": "https://javavolcano-touroperator.com/#organization",
                  },
                  author: {
                    "@type": "Person",
                    name: "Sophie M. (Dummy)",
                  },
                  publisher: {
                    "@type": "Organization",
                    name: "Trustpilot",
                  },
                  reviewRating: {
                    "@type": "Rating",
                    ratingValue: "5",
                    bestRating: "5",
                    worstRating: "1",
                  },
                  reviewBody:
                    "We met the same JVTO team for the whole route—driver Pak Hadi and Ijen guide Pak Andi. No switching crews mid-trip. Their protocol around timing and safety felt standardized, not casual.",
                  datePublished: "2026-01-20T00:00:00Z",
                },
                {
                  "@type": "Review",
                  "@id":
                    "https://javavolcano-touroperator.com/why-jvto#review-tripadvisor-001",
                  itemReviewed: {
                    "@id": "https://javavolcano-touroperator.com/#organization",
                  },
                  author: {
                    "@type": "Person",
                    name: "Wei Lin (Dummy)",
                  },
                  publisher: {
                    "@type": "Organization",
                    name: "TripAdvisor",
                  },
                  reviewRating: {
                    "@type": "Rating",
                    ratingValue: "5",
                    bestRating: "5",
                    worstRating: "1",
                  },
                  reviewBody:
                    "Our guide Pak Budi explained the route clearly and managed the pace well. The team’s coordination looked like an internal crew system, not freelance outsourcing. The itinerary execution was precise.",
                  datePublished: "2026-01-28T00:00:00Z",
                },
                {
                  "@type": "FAQPage",
                  "@id": "https://javavolcano-touroperator.com/why-jvto#faq",
                  inLanguage: "en",
                  mainEntity: [
                    {
                      "@type": "Question",
                      name: "What does “Operational Certainty” mean when touring Mount Ijen or Mount Bromo?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "It means your trip is executed with standardized protocols: risk-based go/no-go decisions, disciplined timing, maintained safety equipment, and consistent crew execution—designed for active-volcano conditions (night ascent, extreme temperatures, toxic gas, sudden weather changes).",
                      },
                    },
                    {
                      "@type": "Question",
                      name: "Is JVTO a real company with legal standing in Indonesia?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "Yes. JVTO operates under PT Java Volcano Rendezvous with Business Identification Number (NIB) 1102230032918 and licensed tourism activities (KBLI 79120 and 79921). Verification materials are available on the Verify JVTO page.",
                      },
                    },
                    {
                      "@type": "Question",
                      name: "How can I verify JVTO beyond website claims?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "Use the Verify JVTO page to cross-check documents, legal identifiers, and operational credentials. You can also audit consistency across independent review platforms such as Google, Trustpilot, and TripAdvisor.",
                      },
                    },
                    {
                      "@type": "Question",
                      name: "Do you use outsourced crews?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "JVTO is built around consistent internal crew execution for operational reliability. Guest reviews often mention named JVTO crew members (drivers and guides), which helps validate continuity and service accountability.",
                      },
                    },
                    {
                      "@type": "Question",
                      name: "What is Ijen Digital Health Screening?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "A mandatory pre-ascent screening for SpO2 and blood pressure. Results are digitally recorded and used for go/no-go decisions before entering high-risk volcanic zones.",
                      },
                    },
                  ],
                },
                {
                  "@type": "HowTo",
                  "@id":
                    "https://javavolcano-touroperator.com/why-jvto#howto-operational-certainty",
                  name: "How JVTO Executes Safe Volcano Tours (Operational Certainty Workflow)",
                  description:
                    "A standardized execution model used for active-volcano environments: crew briefing, equipment readiness, health screening (Ijen), and risk-based go/no-go decisions.",
                  inLanguage: "en",
                  step: [
                    {
                      "@type": "HowToStep",
                      name: "Crew Briefing & Route Confirmation",
                      text: "Before departure, the team aligns itinerary timing, pickup details, and route constraints to avoid ad-hoc decisions.",
                    },
                    {
                      "@type": "HowToStep",
                      name: "Safety Equipment Readiness",
                      text: "Safety equipment required for volcanic conditions (e.g., masks/headlamps for Ijen) is checked for readiness and maintenance status.",
                    },
                    {
                      "@type": "HowToStep",
                      name: "Health Screening (Mount Ijen)",
                      text: "SpO2 and blood pressure are screened before ascent. If medical readiness is not met, the ascent does not proceed.",
                      url: "https://health.mountijen.com/",
                    },
                    {
                      "@type": "HowToStep",
                      name: "Risk-Based Go/No-Go Decision",
                      text: "Route and ascent decisions are made based on risk protocol (weather, gas exposure, conditions), not commercial pressure.",
                    },
                    {
                      "@type": "HowToStep",
                      name: "Post-Trip Accountability",
                      text: "Execution quality can be audited via independent reviews across Google, Trustpilot, and TripAdvisor, and via verification materials on Verify JVTO.",
                    },
                  ],
                },
                {
                  "@type": "Book",
                  "@id": "https://isbnsearch.org/isbn/9783770178810",
                  name: "Stefan Loose Reiseführer Indonesien",
                  isbn: "978-3-7701-7881-0",
                  publisher: {
                    "@type": "Organization",
                    name: "DuMont Reiseverlag",
                  },
                  datePublished: "2018",
                  about: {
                    "@id": "https://javavolcano-touroperator.com/#organization",
                  },
                },
                {
                  "@type": "CreativeWork",
                  "@id":
                    "https://javavolcano-touroperator.com/why-jvto#bookingComAward",
                  name: "Booking.com Guest Review Award",
                  datePublished: "2016-01-01",
                  about: {
                    "@id": "https://javavolcano-touroperator.com/#organization",
                  },
                  description:
                    "Guest Review Score 9.2/10 for Ijen Miner Family Homestay (precursor to JVTO).",
                },
              ],
            },
            null,
            2,
          ),
        }}
      />
    </>
  );
}
