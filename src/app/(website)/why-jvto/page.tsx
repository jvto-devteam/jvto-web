// app/why-jvto/page.tsx
import {
  Shield,
  ArrowDown,
  Verified,
  Star,
  Circle,
  Volcano,
  Menu,
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
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* FIX: Server Component-safe (no onClick). Keeps original style. */}
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
                  This demands more than just a driver and a camera. It requires
                  protocols, relationships, and rapid-response capabilities
                  built over a decade. When you book JVTO, you are buying peace
                  of mind. You are securing a logistics chain managed by
                  professionals who understand that safety is the precursor to
                  enjoyment. This is operational certainty — not marketing
                  promises.
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
                      Active Tourist Police Officer
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-7/12">
                <h2 className="text-4xl md:text-5xl font-extrabold text-[#111827] mb-8 leading-tight">
                  THE AUTHORITY: <br />
                  <span className="text-[#8ab51a]">POLICE LEADERSHIP</span>
                </h2>
                <p className="text-slate-600 text-lg leading-relaxed mb-8">
                  Bripka Agung Sambuko, an active Tourist Police officer, leads
                  our operations with disciplined precision. This isn&apos;t
                  just a tour company; it&apos;s a security-focused operation
                  that prioritizes guest safety through established law
                  enforcement protocols.
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
                    Media Verification
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
                          Detik.com Coverage
                        </span>
                        <span className="text-xs text-slate-500">
                          Feature on Police-Led Tourism
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
                          Radar Jember
                        </span>
                        <span className="text-xs text-slate-500">
                          Community Safety Profile
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
                A decade of proven operational history.
              </p>
            </div>
            <div className="relative">
              <div className="absolute top-0 bottom-0 left-6 md:left-1/2 md:transform md:-translate-x-1/2 w-0.5 bg-slate-200 z-0"></div>

              <div className="relative md:grid md:grid-cols-[1fr_auto_1fr] md:gap-8 mb-16 items-center group">
                <div className="hidden md:flex flex-col items-end text-right">
                  <span className="text-[#8ab51a] font-black text-3xl mb-1">
                    2015
                  </span>
                  <h3 className="text-[#111827] font-bold text-xl">
                    The Roots
                  </h3>
                  <p className="text-slate-600 mt-2 text-sm leading-relaxed mb-4">
                    Founded on the principles of discipline and service.
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
                    Humble beginnings, high standards.
                  </p>
                </div>
              </div>

              <div className="relative md:grid md:grid-cols-[1fr_auto_1fr] md:gap-8 mb-16 items-center group">
                <div className="hidden md:block text-right">
                  <p className="text-slate-400 text-sm italic">
                    Consistent service quality recognized.
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
                    Establishing a reputation for reliability.
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

              <div className="relative md:grid md:grid-cols-[1fr_auto_1fr] md:gap-8 mb-16 items-center group">
                <div className="hidden md:flex flex-col items-end text-right">
                  <span className="text-[#8ab51a] font-black text-3xl mb-1">
                    2018
                  </span>
                  <h3 className="text-[#111827] font-bold text-xl">
                    Independent Editorial Recognition
                  </h3>
                  <p className="text-slate-600 mt-2 text-sm leading-relaxed mb-4">
                    Featured in the Stefan Loose guidebook{" "}
                    <strong className="text-[#8ab51a]">(Page 437)</strong>.
                  </p>
                  <div className="w-48 h-32 rounded-lg overflow-hidden shadow-md border-2 border-white transform rotate-2 hover:rotate-0 transition-transform">
                    <img
                      alt="Stefan Loose Guidebook Page"
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzGcF3jM7aeNt05coFnEuv2MOYAdWCO10HruX8U39oD7jPPKkKscwgy1v0oAgDUAPqKS-W8fZK3RhE1_5qLF0nEJt31GZu4DeCMX3OJH8STJw1_X0KCVQBCmk-L2HP1SQgxYpqpCMiX3lmycQX6Pn814tSHN9YIiFAIUC00eNrBodLbDaeEYaZU0nd5nkmo_MXxSTgAZcMslTyfV8A6NSJtD6nYBBgxeasxcMqxnBqS7hp9y65fHQ2Q0LkAVz5EKw8kQa6miLqgRrk"
                    />
                  </div>
                </div>
                <div className="flex justify-center md:py-2 pl-12 md:pl-0 relative">
                  <div className="absolute left-0 top-0 md:static w-12 h-12 rounded-full bg-white text-[#8ab51a] border-4 border-[#A6CE39] shadow-lg flex items-center justify-center z-10">
                    <MenuBook className="w-5 h-5" />
                  </div>
                  <div className="md:hidden">
                    <span className="text-[#8ab51a] font-bold text-sm">
                      2018
                    </span>
                    <h3 className="text-[#111827] font-bold text-lg">
                      Independent Editorial Recognition
                    </h3>
                    <p className="text-slate-600 text-sm mt-1 mb-2">
                      Stefan Loose guidebook (Page 437).
                    </p>
                    <div className="w-full max-w-xs h-40 rounded-lg overflow-hidden shadow-md border-2 border-white">
                      <img
                        alt="Stefan Loose Guidebook Page"
                        className="w-full h-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCC37GziDaxP-TsXDIWuu5ynIH1Lm8Wrxkhev0sDDdQhfC3hO8dncBEVJ3-gREmkc3194qscVC72IOSip8ytVpz0XYpxbe9oU8zDp3yRvSGxj2ZEK52m2ERG_HT_va-ZtwpeQZX3xIuyyDwYhKINaTBZ6u00LosHyDkywzuTFQSFAStNNd8b6FtdId6qxa9dEZWCzk_nUxAXYXQXUdb-geEvgEuknS7bbJhYVESPbSXoGGCPS-S5ZxwIIPDHzk4TSJ5XS9uuRnc_Gtl"
                      />
                    </div>
                  </div>
                </div>
                <div className="hidden md:block">
                  <p className="text-slate-400 text-sm italic">
                    Objective 3rd party validation.
                  </p>
                </div>
              </div>

              <div className="relative md:grid md:grid-cols-[1fr_auto_1fr] md:gap-8 items-center group">
                <div className="hidden md:block text-right">
                  <p className="text-slate-400 text-sm italic">
                    Fully incorporated and compliant.
                  </p>
                </div>
                <div className="flex justify-center md:py-2 pl-12 md:pl-0 relative">
                  <div className="absolute left-0 top-0 md:static w-12 h-12 rounded-full bg-[#111827] text-[#A6CE39] border-4 border-slate-200 shadow-lg flex items-center justify-center z-10">
                    <Business className="w-5 h-5" />
                  </div>
                  <div className="md:hidden">
                    <span className="text-[#8ab51a] font-bold text-sm">
                      Today
                    </span>
                    <h3 className="text-[#111827] font-bold text-lg">
                      Formal Corporate Entity
                    </h3>
                    <div className="w-full max-w-xs h-40 rounded-lg overflow-hidden shadow-md border-2 border-white mt-3">
                      <img
                        alt="Corporate team or office interior"
                        className="w-full h-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnZyLyxuGhVCZZabmE8MQsDj8bhVRE5S3ai1m-3qjwsY5A3MTgRHy1eBcADs-QLVmMcH2Y9GM0IXccZfhMv_cuCLwK4iJKp0ok6PIuhNmOb0W0XEuKTGgNRHSvdehy1otGWWG_0RXvLVA_FEDHERRiOI0mEkwIOR9SNxEtiDp6eSJ9wid41_zj9viyTCheeyck8G7wrCaat57bf6Eu33jdT9sEO0N3qAaHrF1YjcMY10io_R5XEz6gwxSLa52xMEOnvhSljJmJH3ic"
                      />
                    </div>
                  </div>
                </div>
                <div className="hidden md:block">
                  <span className="text-[#8ab51a] font-black text-3xl mb-1 block">
                    Today
                  </span>
                  <h3 className="text-[#111827] font-bold text-xl">
                    Formal Corporate Entity
                  </h3>
                  <p className="text-slate-600 mt-2 text-sm leading-relaxed mb-4">
                    Operating as PT Java Volcano Rendezvous.
                  </p>
                  <div className="w-48 h-32 rounded-lg overflow-hidden shadow-md border-2 border-white transform -rotate-2 hover:rotate-0 transition-transform">
                    <img
                      alt="Corporate team or office interior"
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBx6H6eQaReVDcYRPuaCLGR2ZZl-rC3RMlIDhN1oGuxqcN1d7-_0JKPendR3_Pw0op5ocW1ZA7YiEGVdr-XN1AZOqSQKjqk3lFSzLz5zSXFpP7YzIUU-Im4FcIHadncrhX2sD5EJPnKKXsC6VDOJrTxs_SmxsREAnRrB-3P5xTSdhtK4lSZ_J4YNJXht-QiovhmyCyEqppRyvXvP92cxHR8Gpf_BzW4RAuEJ8-_SM_2nehK15LTTdOhY2DRimY-VLqjurnset1ZIzFv"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 px-6 bg-white">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#111827] mb-16 text-center uppercase tracking-tight">
              THE FORTRESS
            </h2>
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
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
                    JVTO Base Camp
                  </strong>
                  Jl. Raya Bromo No. 12, Probolinggo
                  <br />
                  East Java, Indonesia 67222
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
                        Registered Tour Operator
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
                        Formal Corporate Entity
                      </code>
                      <p className="text-[10px] text-slate-500 mt-1">
                        Official Legal Incorporation
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex items-center gap-3 text-sm text-slate-500 bg-slate-50 p-4 rounded-lg">
                  <Lock className="w-4 h-4 text-[#111827]" />
                  Fully accountable under Indonesian Law.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 px-6 bg-slate-50 border-y border-slate-200">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#111827] mb-4 uppercase tracking-tight">
                THE TRIANGULATION
              </h2>
              <p className="text-slate-600 text-lg">
                Three pillars of reputation that can&apos;t be manipulated.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-[0_4px_20px_-2px_rgba(17,24,39,0.05)] hover:shadow-[0_20px_40px_-5px_rgba(17,24,39,0.1)] transition-all relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-[#00b67a]"></div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <img
                      alt="Trustpilot Logo"
                      className="h-8 w-auto"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAr9I9GuzepmhGASX1LWtwgHytbfHyWxkvFGWVSe_iE91aJr1Diy4_PNQxM38Nt9lsYiULPURmcwmCwxAk0EOTo1zHrf3cnN4yMKGlD3hpFkbTjXfzmvCVinVd_oucprCWtf1gMwOsJpHEiNdK9bT8dbcp_XvBWjPXpTg1ECe6qUQh_8qvT863AmxUXVo17-CXFHtNOaVDcy7Rwa-VRQmoCn6u-pOLNnqRD50_e8HBhvGI3J29qBWW30fjF3z_iWCwJp_ZIx2fPyjwq"
                    />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-[#111827] mb-2">
                  Corporate Integrity
                </h3>
                <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                  Verifiable reviews of our business practices and reliability.
                </p>
                <div className="flex items-center gap-1 mb-6 text-[#00b67a]">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
              </div>
              <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-[0_4px_20px_-2px_rgba(17,24,39,0.05)] hover:shadow-[0_20px_40px_-5px_rgba(17,24,39,0.1)] transition-all relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-[#4285f4]"></div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <img
                      alt="Google Logo"
                      className="h-8 w-auto"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxpj_QUCgoc2gIN5G4PDJCYLfK2HCfiIWftHEme-vc2x2D_RbFXFOGovMjup4XqQVtgAKF835ZQKiVT6dhBeQMcFjKJ53-qYGgD__BL5-G46d4FCiTmy3rQv0mtoZ6ZD0lI5lAhgZtHvEIfYTvOMfbaYJePGoWzYXnCN96AkOmHYSblBulzepBIv_bh9BZQVXIu9U0KU34UQJov7caM8DkSVaz1NvBiV3AhnBxHtSbd5yBwmp6Z_ucxtklQSvLg3Sw-DRELvv2cqwg"
                    />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-[#111827] mb-2">
                  Physical Performance
                </h3>
                <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                  Location-based validation of our actual field operations.
                </p>
                <div className="flex items-center gap-1 mb-6 text-[#F4B400]">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
              </div>
              <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-[0_4px_20px_-2px_rgba(17,24,39,0.05)] hover:shadow-[0_20px_40px_-5px_rgba(17,24,39,0.1)] transition-all relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-[#34e0a1]"></div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <img
                      alt="TripAdvisor Logo"
                      className="h-8 w-auto"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZWm8403DFAVbR_y-nLDqRfA34YVFe4wCSSaCFzS1DYi35afA5bgZO0Qf8dBGyLokZCIkRKZC9eL7kaa27ghficcqThNLzbnkTxfBfhon3lgC-l7eq_pWqcCe5JZrgUWP3PCc8cCwrDRNPiMWc6te7aajNftaqW_pSXpTqxpQBPrmLAEM4cOymzCb-C3nxjICM-2oVYpwzUGM66FQpvPcgco8NXK92eIZeoW1w7tQf9EDRrueCxlHsWAWBn-aM76UUKQxYUnDoIk_W"
                    />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-[#111827] mb-2">
                  Itinerary Quality
                </h3>
                <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                  Detailed traveler feedback on experience and execution.
                </p>
                <div className="flex items-center gap-1 mb-6 text-[#34e0a1]">
                  <Circle className="w-3 h-3 fill-current" />
                  <Circle className="w-3 h-3 fill-current" />
                  <Circle className="w-3 h-3 fill-current" />
                  <Circle className="w-3 h-3 fill-current" />
                  <Circle className="w-3 h-3 fill-current" />
                </div>
              </div>
            </div>
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
                  Ijen Digital Health Screening
                </h3>
                <p className="text-slate-600 text-lg mb-10 leading-relaxed">
                  We don&apos;t guess your fitness. We measure it. A data-driven
                  approach to high-altitude safety.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                    <span className="font-bold text-[#8ab51a] w-24 shrink-0">
                      Procedure
                    </span>
                    <span className="text-slate-600 text-sm">
                      Mandatory pre-climb assessment.
                    </span>
                  </li>
                  <li className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                    <span className="font-bold text-[#8ab51a] w-24 shrink-0">
                      System
                    </span>
                    <span className="text-slate-600 text-sm">
                      Digital data logging for every guest.
                    </span>
                  </li>
                  <li className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                    <span className="font-bold text-[#8ab51a] w-24 shrink-0">
                      Execution
                    </span>
                    <span className="text-slate-600 text-sm">
                      Real-time SpO2 and blood pressure monitoring.
                    </span>
                  </li>
                  <li className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                    <span className="font-bold text-[#8ab51a] w-24 shrink-0">
                      Validation
                    </span>
                    <span className="text-slate-600 text-sm">
                      Go/No-Go safety protocols based on medical data.
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
                          Standard Equipment
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 px-6 bg-slate-50 border-t border-slate-200">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#111827] mb-4 uppercase tracking-tight">
                TANGIBLE VALUE
              </h2>
              <p className="text-slate-600 text-lg">
                Included in every package.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-[#A6CE39] hover:shadow-lg transition-all flex flex-col items-center text-center gap-3 group cursor-default h-full">
                <div className="w-full aspect-square rounded-lg overflow-hidden mb-2 bg-slate-100">
                  <img
                    alt="Sealed Mineral Water"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRLyZ_O6bXGA5ZePop18HXvsE1pDtJQoHnG9PpGJiswUi4U77XuzJImNnUGdBZT__bmQINmjX2LW-evFYmgLMSiY2hKWVlGfjCm78YvcrNOK8mFxxrgLCe5ro6-MOx81Mj3gb5431Vi9vZDY7Fl-Y7ahP35gRyPKkXhm97QFhDkoxnfgyctkq15FcXfNLwjO4n5Uf5SOWtjCM5Notk77IoVSATI_J2Tcdp91-lH07nuOk4XkxMCJ5OhM6MhWGMSPl1mLgH-GD5ARes"
                  />
                </div>
                <div>
                  <h4 className="text-[#111827] text-sm font-bold mb-1">
                    Sealed Water
                  </h4>
                  <p className="text-xs text-slate-500">Hygiene Guaranteed</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-[#A6CE39] hover:shadow-lg transition-all flex flex-col items-center text-center gap-3 group cursor-default h-full">
                <div className="w-full aspect-square rounded-lg overflow-hidden mb-2 bg-slate-100">
                  <img
                    alt="Hot Breakfast Setup"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDq0nHBJCS4AXTyPNj70vf-DuaNfWiBZZJ8ukk-xLVq14WQ3OUur7ZLugBVyNx2qrQcGHtdT9kRZNCvvfIQArlJMzCThYvwjfe8mqDXAzYjVk8b-pkRWKxwt7nuO4-fmRo5V688PSv0h3W7hSgMNkYXga0d1diFOVk-zRXu9ulR9Ji_zlX732qJkE2eDNnFl4he5Gm8VxqtYlizI4c7QwAC970CIDgObr8v3_v5sD90onH4e6mmmkT4SP0PMsv5st7Yl95BjnQUcIhu"
                  />
                </div>
                <div>
                  <h4 className="text-[#111827] text-sm font-bold mb-1">
                    Hotel Breakfast
                  </h4>
                  <p className="text-xs text-slate-500">Premium Start</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-[#A6CE39] hover:shadow-lg transition-all flex flex-col items-center text-center gap-3 group cursor-default h-full">
                <div className="w-full aspect-square rounded-lg overflow-hidden mb-2 bg-slate-100">
                  <img
                    alt="Professional Gas Mask"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVxi1Sa1kQiAA6OdO8p70xoYWwWFF65FcVzfSOB7yLQnohhbVKyuMZGAFaIpOys4RW7T55FY4-tvXE5f7XORnxSLPdyKCf5v-eGaK7TJOF0HDHbRWqhB1fleEpkzGXCpZB45kED0l6-WNQMtFBqSRSNgZP6rKgBCVDKmsvEzJKaOn6tpWP7SkfhX3PNldJEl1nZ5EqZ_Le83Gb-6Rks4-LGLEmu_vaBlpN563IUH8CJK7_R85C6gSaKXnwQksmmr9w3hFnnLhUmgrJ"
                  />
                </div>
                <div>
                  <h4 className="text-[#111827] text-sm font-bold mb-1">
                    Professional Gas Masks
                  </h4>
                  <p className="text-xs text-slate-500">Safety Critical</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-[#A6CE39] hover:shadow-lg transition-all flex flex-col items-center text-center gap-3 group cursor-default h-full">
                <div className="w-full aspect-square rounded-lg overflow-hidden mb-2 bg-slate-100">
                  <img
                    alt="JVTO Branded T-Shirt"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHXQmFkrYkwQSMyn4nMopkBz9lwtPLqh_8hXJFu6F6-7UYXWXl9Z7fWZYmc0cyxO3IT8jmctXk1NmTl5siVK_qNLq7phsZJXvf3M1eg-_MTazZOr6ViQu_2QVbNOkBw31_9J4JwWj0d4qLNLO-gVFB9l3_14YZlyx9qBA0nncaJmumJLrrXqtdyNgiVEhMxlf3wG4C2t3PJf3U8FksOmXDkHu87b8tOmQzcFWTq6SiXuo2ulTVeLV4CDJ4x_5YhnhGq-S_HyYuHgE6"
                  />
                </div>
                <div>
                  <h4 className="text-[#111827] text-sm font-bold mb-1">
                    JVTO T-Shirt
                  </h4>
                  <p className="text-xs text-slate-500">Official Gear</p>
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
                  <p className="text-xs text-slate-500">No Hidden Costs</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-6 bg-white border-b border-slate-200">
          <h2 className="text-center text-xs font-bold uppercase tracking-widest text-slate-400 mb-10">
            External Trust Signals
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
              Operational certainty is not an accident. It is the result of
              intention, investment, and integrity. Join the hundreds of
              travelers who chose the peace of mind that comes with proven
              competence.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <button className="w-full sm:w-auto h-16 px-10 bg-[#A6CE39] hover:bg-white hover:text-[#111827] text-[#111827] rounded-xl font-bold text-lg transition-all flex items-center justify-center shadow-lg shadow-[#A6CE39]/20">
                Book Your Private Tour
              </button>
              <button className="w-full sm:w-auto h-16 px-10 bg-transparent border-2 border-white/20 hover:bg-white/10 hover:border-white text-white rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3">
                <Chat className="w-5 h-5" />
                Chat on WhatsApp
              </button>
            </div>
            <p className="mt-16 text-slate-400 text-sm">
              © 2024 PT Java Volcano Rendezvous. All rights reserved.
              <br />
              Licensed Tour Operator in East Java.
            </p>
          </div>
        </section>
      </main>

      {/* SUPER-LENGTH JSON-LD covering the full page content */}
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
                  "@type": "Organization",
                  "@id": "https://javavolcano-touroperator.com/#organization",
                  name: "Java Volcano Tour Operator",
                  legalName: "PT Java Volcano Rendezvous",
                  url: "https://javavolcano-touroperator.com/why-jvto",
                  email: "hello@javavolcano-touroperator.com",
                  logo: {
                    "@type": "ImageObject",
                    "@id":
                      "https://javavolcano-touroperator.com/#logoImageObject",
                    url: "https://javavolcano-touroperator.com/assets/logo-jvto.png",
                  },
                  foundingDate: "2015",
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
                  founder: {
                    "@id":
                      "https://javavolcano-touroperator.com/#agung-sambuko",
                  },
                  knowsAbout: [
                    "Volcanic Safety Operations",
                    "Risk Mitigation in Active Volcano Tourism",
                    "Private Expedition Management",
                    "Digital Health Screening for Mount Ijen",
                    "Mount Ijen",
                    "Mount Bromo",
                  ],
                  memberOf: [
                    { "@type": "Organization", name: "ISIC" },
                    { "@type": "Organization", name: "HPWKI Bondowoso" },
                    { "@type": "Organization", name: "INDECON" },
                  ],
                  sameAs: [
                    "https://www.google.com/maps",
                    "https://www.tripadvisor.com",
                    "https://www.trustpilot.com",
                  ],
                  contactPoint: [
                    {
                      "@type": "ContactPoint",
                      contactType: "customer support",
                      email: "hello@javavolcano-touroperator.com",
                      availableLanguage: ["en", "id"],
                    },
                  ],
                },

                {
                  "@type": "Person",
                  "@id": "https://javavolcano-touroperator.com/#agung-sambuko",
                  name: "Agung Sambuko",
                  alternateName: "Bripka Agung Sambuko",
                  jobTitle: "Tourist Police Officer",
                  affiliation: {
                    "@type": "GovernmentOrganization",
                    name: "Indonesian National Police",
                    department: "Tourist Police (Pam Obvit)",
                  },
                  knowsAbout: [
                    "Public Safety Protocols",
                    "Crisis Management",
                    "Volcanic Risk Assessment",
                    "Tourism Security Operations",
                  ],
                  sameAs: [
                    "https://news.detik.com/berita-jawa-timur/d-5492690",
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
                  "@type": "Award",
                  "@id":
                    "https://javavolcano-touroperator.com/why-jvto#bookingAward",
                  name: "Booking.com Guest Review Award",
                  datePublished: "2015",
                  description:
                    "Guest Review Score 9.2/10 for Ijen Bondowoso Homestay (JVTO precursor entity)",
                },

                {
                  "@type": "Article",
                  "@id":
                    "https://javavolcano-touroperator.com/why-jvto#article",
                  headline:
                    "Why Travel with JVTO? Operational Certainty & Proven History",
                  about: [
                    {
                      "@id":
                        "https://javavolcano-touroperator.com/#organization",
                    },
                    {
                      "@id":
                        "https://javavolcano-touroperator.com/#agung-sambuko",
                    },
                  ],
                  isPartOf: {
                    "@id":
                      "https://javavolcano-touroperator.com/why-jvto#webpage",
                  },
                  inLanguage: "en",
                  author: {
                    "@id": "https://javavolcano-touroperator.com/#organization",
                  },
                  publisher: {
                    "@id": "https://javavolcano-touroperator.com/#organization",
                  },
                  image: [
                    {
                      "@type": "ImageObject",
                      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCb_OPfT0wKvI-umHBcFnbSTp_50ueobnh2OeEoniFhX7AlCe2-lPCZQJpL1ToO_nhSlvmS81S4pfVzOmntD0PoK3xLjFOS1WTf3XBFKvtcq-yzBOH0vjP5Ny5psuI3UPngeTkC3AV1w53bpwPhg9pPkCF8Kv2drmxVTxQgn0pV-lQEVqKumxFep1j4zm4rrD00YblYKYGGhtCGMAeYtLX-Qw83sZf72Y5FwFgATjbzMvDb-iN5S1pD0LiHTZXMRplF4JYJfm3RM_u3",
                      name: "Portrait of Bripka Agung Sambuko",
                    },
                    {
                      "@type": "ImageObject",
                      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCN4bbepF4xRl7fW6GZfGR6EUMrH1y3aojQPjuKIghZFajW6-3ezcJKXlMJHKlklq9zf4nrrrmQk1_aQMQ4QMCHBbHkCXnjRYZ19KJxJZoEFnt8RXQHQUtUvCGmBu0RUW_NeK4fnXjG9_9vd0LrEiJFexAF11hHT_QxTK_sjKF2Zt1RRAKrFHBlDZa0GEM8iBSl1ktOdCKkYXujNIu8HS5l3w7Md3zArVDrAa9wpVKm1V3V70ste3V9VARSfs1HbQeoTLExNH5_8YzF",
                      name: "2015 Homestay Roots",
                    },
                    {
                      "@type": "ImageObject",
                      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBjbxpYVXPP_CLJ5JgTn0-SpmSB5LjDKWosDL_Z9jRR50vbIuzgiPMDQ97bs7XdZ-6ko4O7VDix4keM2hvW1qKwn2lmGVSnj9Mo-9WHE-UrLeRDex4AQLLLVplyqwQJDvDpfkGEL54c3AHFVzMxI1w6T6a6zYKfc1-AtB_WkynZeg2Qdtgly6E9TVgl0fHLTMGRtA637yntnn1xm-bLXRLw4uoefP2L2qBOqstIOLI7DCk4kfYivVSEtym2ujrm63qr_4wK35lfdDA7",
                      name: "Booking.com Award Plaque",
                    },
                    {
                      "@type": "ImageObject",
                      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDzGcF3jM7aeNt05coFnEuv2MOYAdWCO10HruX8U39oD7jPPKkKscwgy1v0oAgDUAPqKS-W8fZK3RhE1_5qLF0nEJt31GZu4DeCMX3OJH8STJw1_X0KCVQBCmk-L2HP1SQgxYpqpCMiX3lmycQX6Pn814tSHN9YIiFAIUC00eNrBodLbDaeEYaZU0nd5nkmo_MXxSTgAZcMslTyfV8A6NSJtD6nYBBgxeasxcMqxnBqS7hp9y65fHQ2Q0LkAVz5EKw8kQa6miLqgRrk",
                      name: "Stefan Loose Guidebook Page",
                    },
                    {
                      "@type": "ImageObject",
                      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBzv4FiPAAfEPMcoyzMIbFIJ1B8Ie1Jh4b8Ox392SuADlQSMrL0tKrE_hscRZOCzD0_0fTcgg4aeKKO2s96tyPV3LCL2rMTRTjX3PPp3wUiMpcGgJTmF-aorfulsjeFvp323IQjd6qLah3QwJmZG0_ZsRR_4dAnh6yxcsWYhrv7Sa0H12mvhxrkLm_zNsY_0EjoCikp5RvffrkJLfVLTQzH8qhmwn1tFlNibl59S1DGPIkCsC7n8NGlxhWp-PJUOvsgsdxW4h3xm1ur",
                      name: "Headquarters Exterior",
                    },
                    {
                      "@type": "ImageObject",
                      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBTV1acV_WPXiYuXB1yJoIoF6JXrUr_s0M3qmEfwVva6i1YWzZHTR19F8ipMGj42EfQKIfmaaTURxttpUd46WRAy46YiKqOfMxIBW8J46r1Yv14NI-I7trYLX62ms-RpWgiKYN0iwK-QGJ0VP1W7UmMtHqtN1MR6SVjIYe5fTNn-W0mUx1JU1ENm380uoxLQO1BAI7vIBWQbE9QDLKopmlHGlPki3cVE-9RgMqSD8PAZ1tKhA3NujCm14U_305zS78Sx0ozjQYsGFkT",
                      name: "Ijen Digital Health Screening",
                    },
                  ],
                  hasPart: [
                    {
                      "@type": "CreativeWork",
                      name: "Hero Section",
                      text: "Operational Certainty in East Java's Ring of Fire. Not Just a Content Tour. This Is a Standardized Operation Led by Tourist Police Discipline, Validated by a Proven History Since 2015.",
                    },
                    {
                      "@type": "CreativeWork",
                      name: "Intro Narrative",
                      text: "Choosing a tour operator for Mount Ijen or Mount Bromo is not about who has the most visually appealing Instagram photos. We operate in an active volcanic environment.",
                    },
                    {
                      "@type": "CreativeWork",
                      name: "The Authority: Police Leadership",
                      text: "Bripka Agung Sambuko, an active Tourist Police officer, leads our operations with disciplined precision.",
                      about: {
                        "@id":
                          "https://javavolcano-touroperator.com/#agung-sambuko",
                      },
                    },
                    {
                      "@type": "CreativeWork",
                      name: "The Timeline",
                      text: "A decade of proven operational history.",
                      hasPart: [
                        {
                          "@type": "Event",
                          name: "2015 — The Roots",
                          startDate: "2015-01-01",
                          description:
                            "Founded on the principles of discipline and service.",
                        },
                        {
                          "@type": "Event",
                          name: "2016 — Early Validation",
                          startDate: "2016-01-01",
                          description:
                            "Establishing a reputation for reliability.",
                          award: {
                            "@id":
                              "https://javavolcano-touroperator.com/why-jvto#bookingAward",
                          },
                        },
                        {
                          "@type": "Event",
                          name: "2018 — Independent Editorial Recognition",
                          startDate: "2018-01-01",
                          description:
                            "Featured in the Stefan Loose guidebook (Page 437).",
                          subjectOf: {
                            "@id": "https://isbnsearch.org/isbn/9783770178810",
                          },
                        },
                        {
                          "@type": "Event",
                          name: "Today — Formal Corporate Entity",
                          description:
                            "Operating as PT Java Volcano Rendezvous.",
                        },
                      ],
                    },
                    {
                      "@type": "CreativeWork",
                      name: "The Fortress",
                      text: "Physical Headquarters (Bondowoso Operations Base) and Legal Standing (PT Java Volcano Rendezvous; NIB 1102230032918; AHU Registration).",
                      about: {
                        "@id":
                          "https://javavolcano-touroperator.com/#organization",
                      },
                    },
                    {
                      "@type": "CreativeWork",
                      name: "The Triangulation",
                      text: "Three pillars of reputation that can't be manipulated: Trustpilot, Google Business Profile, and TripAdvisor.",
                    },
                    {
                      "@type": "CreativeWork",
                      name: "The Innovation",
                      text: "Ijen Digital Health Screening: Mandatory pre-climb assessment with digital data logging, SpO2 and blood pressure monitoring, and go/no-go protocols.",
                    },
                    {
                      "@type": "CreativeWork",
                      name: "Tangible Value",
                      text: "Included in every package: sealed water, hotel breakfast, professional gas masks, JVTO t-shirt (selected packages), prepaid fees with no hidden costs.",
                    },
                    {
                      "@type": "CreativeWork",
                      name: "External Trust Signals",
                      text: "ISIC, HPWKI, INDECON.",
                    },
                    {
                      "@type": "CreativeWork",
                      name: "Closing CTA",
                      text: "Safety. History. Operational Certainty. Book Your Private Tour. Chat on WhatsApp.",
                    },
                  ],
                },

                {
                  "@type": "Service",
                  "@id":
                    "https://javavolcano-touroperator.com/why-jvto#tourService",
                  name: "Private Volcano Tour Operations (Bromo & Ijen)",
                  provider: {
                    "@id": "https://javavolcano-touroperator.com/#organization",
                  },
                  areaServed: [
                    { "@type": "AdministrativeArea", name: "East Java" },
                    { "@type": "Country", name: "Indonesia" },
                  ],
                  serviceType: [
                    "Private tour",
                    "Volcano tour",
                    "Tour guiding service",
                    "Travel agency service",
                  ],
                  description:
                    "Standardized private tour operations focused on safety and operational certainty for active-volcano environments.",
                },

                {
                  "@type": "Dataset",
                  "@id":
                    "https://javavolcano-touroperator.com/why-jvto#healthScreening",
                  name: "Ijen Digital Health Screening Procedure",
                  description:
                    "Digital logging of pre-climb SpO2 and blood pressure checks used to support go/no-go safety decisions.",
                  creator: {
                    "@id": "https://javavolcano-touroperator.com/#organization",
                  },
                  inLanguage: "en",
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
                      name: "Trustpilot",
                      item: "https://www.trustpilot.com",
                    },
                    {
                      "@type": "ListItem",
                      position: 2,
                      name: "Google Business Profile",
                      item: "https://www.google.com/maps",
                    },
                    {
                      "@type": "ListItem",
                      position: 3,
                      name: "TripAdvisor",
                      item: "https://www.tripadvisor.com",
                    },
                  ],
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
