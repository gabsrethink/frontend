"use client";

import Image from "next/image";
import { Movie } from "@/src/types/tmdb";
import { useFavorites } from "@/src/hooks/useFavorites";
import { Icon } from "./Icon";
import { useState } from "react";
import Link from "next/link";

interface MovieCardProps {
  movie: Movie;
  showBookmark?: boolean;
}

function getTmdbImageUrl(movie: Movie): string | null {
  if (movie.backdrop_path) {
    return `https://image.tmdb.org/t/p/w300${movie.backdrop_path}`;
  }
  if (movie.poster_path) {
    return `https://image.tmdb.org/t/p/w342${movie.poster_path}`;
  }
  return null;
}

export function MovieCard({ movie, showBookmark = true }: MovieCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isBookmarked = showBookmark ? isFavorite(movie.id) : false;
  const [isMutating, setIsMutating] = useState(false);

  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "N/A";

  const initialImageUrl = getTmdbImageUrl(movie);
  const [imgSrc, setImgSrc] = useState(initialImageUrl || "/not-found.svg");

  const handleImageError = () => {
    setImgSrc("/not-found.svg");
  };

  const handleToggleFavorite = async () => {
    if (isMutating || !showBookmark) return;
    setIsMutating(true);
    try {
      await toggleFavorite(movie);
    } finally {
      setIsMutating(false);
    }
  };

  return (
    <div className="relative group rounded-lg overflow-hidden">
      <Link href={`/movie/${movie.id}`} className="block">
        <div className="w-full h-auto aspect-video relative">
          <Image
            src={imgSrc}
            alt={movie.title}
            layout="fill"
            className="object-cover"
            onError={handleImageError}
          />
        </div>

        <div
          className="absolute inset-0 bg-black/50 flex items-center justify-center
                     opacity-0 group-hover:opacity-100 transition-opacity duration-300
                     cursor-pointer z-10"
        >
          <div
            className="bg-white/20 backdrop-blur-sm rounded-full
                       py-2 px-5 flex items-center gap-3 text-white"
          >
            <span className="font-medium">Mostrar Detalhes</span>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 z-5 pointer-events-none bg-linear-to-t from-black/70 to-transparent">
          <div className="flex items-center gap-2 text-body-sm text-white/80">
            <span>{year}</span>
          </div>
          <h3 className="text-heading-sm md:text-heading-md font-medium text-white truncate">
            {movie.title}
          </h3>
        </div>
      </Link>

      {showBookmark && (
        <button
          onClick={handleToggleFavorite}
          disabled={isMutating}
          className="z-20 cursor-pointer absolute top-4 right-4 h-10 w-10 rounded-full
                     bg-black/50 flex items-center justify-center
                     text-white hover:opacity-40 hover:text-black
                     transition-all"
          title={
            isBookmarked ? "Remover dos favoritos" : "Adicionar aos favoritos"
          }
        >
          {isMutating ? (
            <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
          ) : (
            <Icon
              src={
                isBookmarked
                  ? "/icon-bookmark-full.svg"
                  : "/icon-bookmark-empty.svg"
              }
              alt="Bookmark"
              width={14}
              height={14}
            />
          )}
        </button>
      )}
    </div>
  );
}
