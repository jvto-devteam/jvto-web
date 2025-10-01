'use client'
import { useParams } from "next/navigation";

export default function DestinationDetail() {
  const params = useParams();
  const { slug } = params;

  return (
    <div>
      <h1>Tours Slug: {slug}</h1>
    </div>
  );
}
