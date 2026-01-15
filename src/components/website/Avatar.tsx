// components/Avatar.tsx
import Image from "next/image";
import { getInitials } from "@/lib/avatar";

interface AvatarProps {
  name: string;
  photo?: string | null;
  size?: number;
}

export default function Avatar({
  name,
  photo,
  size = 56,
}: AvatarProps) {
  if (photo) {
    return (
      <Image
        src={photo}
        alt={name}
        width={size}
        height={size}
        className="rounded-full object-cover"
      />
    );
  }

  return (
    <div
      className="rounded-full flex items-center justify-center font-bold text-white bg-orange-500"
      style={{
        width: size,
        height: size,
        fontSize: size / 2.4,
      }}
    >
      {getInitials(name)}
    </div>
  );
}
