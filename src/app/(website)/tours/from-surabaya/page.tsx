'use client';
import { useParams } from "next/navigation";

export default function ToursFrom() {
  const params = useParams();
  const { from } = params;

  return (
    <div>
      <h1>Tours: {from}</h1>
    </div>
  );
}
