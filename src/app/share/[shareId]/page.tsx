"use client";

import { MovieCard } from "@/src/components/MovieCard";
import { SharedListResponse } from "@/src/types/tmdb";
import { useParams } from "next/navigation";
import useSWR from "swr";

const publicApiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

const fetcher = async (url: string): Promise<SharedListResponse> => {
  const res = await fetch(url);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(
      errorData.message || "Não foi possível carregar a lista compartilhada."
    );
  }
  return res.json();
};

export default function SharePage() {
  const params = useParams();
  const { shareId } = params;

  const {
    data: sharedListData,
    error,
    isLoading,
  } = useSWR<SharedListResponse>(
    shareId ? `${publicApiBaseUrl}/share/${shareId}` : null,
    fetcher
  );

  const movies = sharedListData?.movieDetails || [];

  return (
    <div>
      {isLoading && (
        <p className="text-body-md text-white text-center">
          Carregando lista...
        </p>
      )}

      {error && (
        <p className="text-red-500 text-body-md text-center">{error.message}</p>
      )}

      {/* Grid de Filmes */}
      {!isLoading && !error && movies.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} showBookmark={false} />
          ))}
        </div>
      )}

      {/* Nenhum Resultado */}
      {!isLoading && !error && movies.length === 0 && (
        <p className="text-body-md text-white text-center">
          Esta lista de favoritos está vazia.
        </p>
      )}
    </div>
  );
}
