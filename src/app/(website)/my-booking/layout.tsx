import MobileBookingNav from "./MobileBookingNav";

export default function MyBookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MobileBookingNav>{children}</MobileBookingNav>;
}
