import type { PublicReviewItem } from "@/lib/publicContent/types";

interface HomeReviewsStaticProps {
  reviews: PublicReviewItem[];
  totalCount: number;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function starsColor(stars: number) {
  const colors: Record<number, string> = {
    1: "#ff3722",
    2: "#ff8622",
    3: "#ffce00",
    4: "#73cf11",
    5: "#00b67a",
  };
  return colors[stars] || colors[5];
}

function StarBar({ rating }: { rating: number }) {
  const color = starsColor(rating);
  return (
    <div className="inline-flex gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <span
          key={index}
          className="inline-block h-5 w-5 rounded-sm"
          style={{ backgroundColor: index < rating ? color : "#dcdce6" }}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

const HomeReviewsStatic: React.FC<HomeReviewsStaticProps> = ({
  reviews,
  totalCount,
}) => {
  return (
    <div className="mt-10 grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)] gap-8 items-start font-['Helvetica_Neue',Helvetica,Arial,sans-serif] text-[#191919]">
      <div className="text-center lg:text-left">
        <a
          href="https://www.trustpilot.com/review/javavolcano-touroperator.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-[#191919] no-underline"
        >
          <span className="block text-2xl mb-3 font-medium">Excellent</span>
          <span className="block mb-3">
            <StarBar rating={5} />
          </span>
          <span className="block text-[13px] leading-5 mb-4 font-light">
            Based on <strong className="font-medium">{totalCount} reviews</strong>
          </span>
          <span className="inline-flex items-center gap-2 text-sm font-semibold">
            <span className="h-5 w-5 rounded-sm bg-[#00B67A]" />
            Trustpilot
          </span>
        </a>
      </div>

      <div className="overflow-x-auto pb-4 scrollbar-hide">
        <div className="flex gap-4 min-w-max">
          {reviews.map((review, index) => {
            const reviewUrl =
              typeof review.url === "string" && review.url.trim().length > 0
                ? review.url
                : null;

            const body = (
              <>
                <div className="mb-2">
                  <StarBar rating={review.stars} />
                </div>
                <div className="text-sm font-bold mb-2 line-clamp-1">
                  {review.title}
                </div>
                <div className="text-[13px] leading-5 text-[#191919] min-h-[60px] line-clamp-3">
                  {review.text}
                </div>
                <div className="mt-4 text-[13px] text-[rgba(0,0,0,0.6)]">
                  <strong>{review.name}</strong>, {formatDate(review.date)}
                </div>
              </>
            );

            return reviewUrl ? (
              <a
                key={`${review.name}-${index}`}
                href={reviewUrl}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="block w-[300px] md:w-[360px] bg-white rounded-sm p-5 shadow-sm border border-[#e8e8ef] text-[#191919] no-underline"
              >
                {body}
              </a>
            ) : (
              <div
                key={`${review.name}-${index}`}
                className="w-[300px] md:w-[360px] bg-white rounded-sm p-5 shadow-sm border border-[#e8e8ef]"
              >
                {body}
              </div>
            );
          })}
        </div>
        <div className="mt-3 text-[13px] font-light text-[#191919]">
          Showing our latest reviews
        </div>
      </div>
    </div>
  );
};

export default HomeReviewsStatic;
