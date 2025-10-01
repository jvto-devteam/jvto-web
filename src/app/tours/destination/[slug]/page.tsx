'use client'
import { useParams } from "next/navigation";

export default function ToursDestination() {
  const params = useParams();
  const { slug } = params;

  return (
    <div>
      <h1>Tours Destination: {slug}</h1>
    </div>
  );
}
