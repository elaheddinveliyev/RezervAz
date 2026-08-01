"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

type RoomPhotoCarouselProps = {
  photos: { name: string; src: string }[];
};

export default function RoomPhotoCarousel({ photos }: RoomPhotoCarouselProps) {
  const [index, setIndex] = useState(0);
  const roomCount = photos.length;

  useEffect(() => {
    const interval = setInterval(
      () => setIndex((current) => (current + 1) % roomCount),
      8000,
    );
    return () => clearInterval(interval);
  }, [roomCount]);

  if (!roomCount) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-[16px] border border-slate-200 shadow-sm">
      <div className="relative">
        <Image
          src={photos[index].src}
          alt={`${photos[index].name} photo`}
          width={900}
          height={540}
          className="h-[22rem] w-full object-cover sm:h-[30rem]"
        />
        <button
          type="button"
          aria-label="Previous room photo"
          onClick={() => setIndex((current) => (current - 1 + roomCount) % roomCount)}
          className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/65 text-white transition hover:bg-black/85"
        >
          <ChevronLeft className="h-6 w-6" aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="Next room photo"
          onClick={() => setIndex((current) => (current + 1) % roomCount)}
          className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/65 text-white transition hover:bg-black/85"
        >
          <ChevronRight className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
      <div className="bg-slate-900/90 px-4 py-3 text-white sm:px-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold">{photos[index].name} ({index + 1} of {roomCount})</p>
          <div className="flex items-center gap-1.5" aria-label="Choose room photo">
            {photos.map((photo, photoIndex) => (
              <button
                key={photo.src}
                type="button"
                aria-label={`Show ${photo.name}`}
                aria-current={photoIndex === index}
                onClick={() => setIndex(photoIndex)}
                className={`h-2 rounded-full transition-all ${photoIndex === index ? "w-6 bg-white" : "w-2 bg-white/45 hover:bg-white/75"}`}
              />
            ))}
          </div>
        </div>
        <p className="mt-1 text-xs opacity-90">
          The photo changes automatically every 8 seconds. Use the arrows or dots to choose manually.
        </p>
      </div>
    </div>
  );
}
