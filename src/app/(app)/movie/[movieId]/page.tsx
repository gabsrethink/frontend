"use client";

import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import Image from "next/image";
import { useFavorites } from "@/src/hooks/useFavorites";
import { Movie } from "@/src/types/tmdb";
import api from "@/src/services/api";
import { Icon } from "@/src/components/Icon";
import { useState } from "react";

const fetcher = async (url: string): Promise<Movie> => {
  try {
    const { data } = await api.get(url);
    return data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Erro ao buscar detalhes do filme."
    );
  }
};

function getTmdbImageUrl(path: string | null) {
  if (!path) {
    return "/not-found.svg";
  }
  return `https://image.tmdb.org/t/p/w780${path}`;
}

function formatRuntime(minutes: number | undefined): string {
  if (!minutes) return "";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

function getBrazilianReleaseInfo(releaseDates: Movie["release_dates"]): {
  date: string | null;
  certification: string | null;
} {
  const brazilData = releaseDates?.results.find((r) => r.iso_3166_1 === "BR");
  if (!brazilData) {
    return { date: null, certification: null };
  }
  const theatricalRelease = brazilData.release_dates.find((d) => d.type === 3);
  const releaseInfo = theatricalRelease || brazilData.release_dates[0];
  const date = releaseInfo?.release_date
    ? new Date(releaseInfo.release_date).toLocaleDateString("pt-BR")
    : null;
  const certification = releaseInfo?.certification || null;
  return { date, certification };
}

function getDirectors(credits: Movie["credits"]): string {
  if (!credits?.crew) return "N/A";
  return credits.crew
    .filter((member) => member.job === "Director")
    .map((director) => director.name)
    .join(", ");
}

export default function MovieDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { movieId } = params;
  const { isFavorite, toggleFavorite } = useFavorites();
  const [isMutatingBookmark, setIsMutatingBookmark] = useState(false);

  const {
    data: movie,
    error,
    isLoading,
  } = useSWR<Movie>(movieId ? `/movies/details/${movieId}` : null, fetcher);

  if (isLoading) return <p className="text-white">Carregando detalhes...</p>;
  if (error) return <p className="text-red-500">Erro: {error.message}</p>;
  if (!movie) return <p className="text-white">Filme não encontrado.</p>;

  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "N/A";

  const posterUrl = getTmdbImageUrl(movie.poster_path);
  const ratingPercentage = Math.round(movie.vote_average * 10);
  const isBookmarked = isFavorite(movie.id);
  const { date: brazilianReleaseDate, certification } = getBrazilianReleaseInfo(
    movie.release_dates
  );
  const genres = movie.genres?.map((g) => g.name).join(", ") || "";
  const runtime = formatRuntime(movie.runtime);
  const directors = getDirectors(movie.credits);

  const handleToggleFavorite = async () => {
    if (isMutatingBookmark || !movie) return;
    setIsMutatingBookmark(true);
    try {
      await toggleFavorite(movie);
    } finally {
      setIsMutatingBookmark(false);
    }
  };

  return (
    <div className="text-white max-w-screen">
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-blue-500 hover:text-white transition-colors cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
          />
        </svg>
        Voltar
      </button>
      <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
        {/*Poster do filme*/}
        <div className="w-full md:w-1/3 lg:w-1/4 shrink-0">
          <div className="aspect-2/3 relative rounded-lg overflow-hidden shadow-lg">
            <Image
              src={posterUrl}
              alt={`Poster de ${movie.title}`}
              layout="fill"
              className=""
            />
          </div>
        </div>

        {/*Detalhes do filme*/}
        <div className="w-full md:w-2/3 lg:w-3/4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h1 className="text-heading-lg mb-1">
                {movie.title} ({year})
              </h1>
              <div className="flex items-center gap-3 text-body-sm text-blue-500 flex-wrap">
                {certification && (
                  <span className="border border-blue-500 px-1 py-0.5 rounded text-xs">
                    {certification}
                  </span>
                )}
                {brazilianReleaseDate && (
                  <span>{brazilianReleaseDate} (BR)</span>
                )}
                {genres && <span>• {genres}</span>}
                {runtime && <span>• {runtime}</span>}
              </div>
            </div>
          </div>

          {/* Avaliação */}
          <div className="flex items-center gap-4 my-6">
            <div className="relative h-16 w-16">
              <div className="absolute inset-0 rounded-full bg-blue-900 border-2 border-blue-500"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-xl font-bold">
                  {ratingPercentage}%
                </span>
              </div>
            </div>
            <span className="text-body-md font-medium">
              Avaliação dos usuários
            </span>
          </div>

          <div className="mb-4">
            <button
              onClick={handleToggleFavorite}
              className="h-12 w-12 rounded-full shrink-0
                         bg-blue-900 flex items-center justify-center
                         text-white hover:opacity-40 hover:text-black
                         transition-all cursor-pointer"
              title={
                isBookmarked
                  ? "Remover dos favoritos"
                  : "Adicionar aos favoritos"
              }
            >
              <Icon
                src={
                  isBookmarked
                    ? "/icon-bookmark-full.svg"
                    : "/icon-bookmark-empty.svg"
                }
                alt="Bookmark"
                width={18}
                height={18}
              />
            </button>
          </div>

          {/* Sinopse */}
          <h2 className="text-heading-md mb-2">Sinopse</h2>
          <p className="text-body-md text-white/80 leading-relaxed mb-6">
            {movie.overview || "Sinopse não disponível."}
          </p>

          {/* Diretores */}
          {directors !== "N/A" && (
            <div className="border-t border-blue-900 pt-4">
              <h3 className="text-body-md font-medium mb-1">Direção</h3>
              <p className="text-body-md text-white/80">{directors}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
