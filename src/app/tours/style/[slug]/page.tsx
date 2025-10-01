'use client'
import { useParams } from "next/navigation";

export default function TourStyle() {
  const params = useParams();
  const { slug } = params;

  return (
    <div>
      <h1>Tours Style: {slug}</h1>
    </div>
  );
}
