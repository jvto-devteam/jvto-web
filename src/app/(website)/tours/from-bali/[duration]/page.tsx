'use client';
import { useParams } from "next/navigation";

export default function ToursFromDuration() {
  const params = useParams();
  const { from, duration } = params;

  return (
    <div>
      <h1>Tours: {from} {duration}</h1>
    </div>
  );
}
