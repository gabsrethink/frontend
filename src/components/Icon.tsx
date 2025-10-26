"use client";

import Image from "next/image";

interface IconProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  onClick?: () => void;
}

export function Icon({
  src,
  alt,
  className,
  width = 24,
  height = 24,
  onClick,
}: IconProps) {
  return (
    <div
      className={`relative ${className || ""}`}
      style={{ width, height }}
      onClick={onClick}
    >
      <Image src={src} alt={alt} layout="fill" className="object-contain" />
    </div>
  );
}
