"use client";

import * as React from "react";
import { useAuth } from "@/src/contexts/AuthContext";
import useSWR from "swr";

import { Movie, PaginatedMovieResponse } from "@/src/types/tmdb";
import { SearchBar } from "@/src/components/SearchBar";
import { MovieCard } from "@/src/components/MovieCard";
import api from "@/src/services/api";

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export default function HomePage() {
  const { user } = useAuth();
  const [query, setQuery] = React.useState("");

  const { data: trendingData, error: trendingError } =
    useSWR<PaginatedMovieResponse>(
      user ? "/movies/trending" : null,
      fetcher
    );

  // Resultados da pesquisa
  const { data: searchData, error: searchError } =
    useSWR<PaginatedMovieResponse>(
      user && query.length > 2 ? `/movies/search?query=${query}` : null,
      fetcher
    );
  const isLoadingTrending = !trendingData && !trendingError && !!user;
  const isSearching = query.length > 2;
  const isLoadingSearch = isSearching && !searchData && !searchError;
  const moviesToShow = isSearching
    ? searchData?.results
    : trendingData?.results?.slice(0, 8);
  const title = isSearching
    ? `Encontrados ${searchData?.total_results || 0} resultados para "${query}"`
    : "Tendências";

  return (
    <div className="w-full">
      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Buscar por filmes"
      />

      <section>
        <h2 className="text-heading-lg mb-6">{title}</h2>
        {(isLoadingTrending || isLoadingSearch) && <p>Carregando...</p>}
        {(trendingError || searchError) && (
          <p className="text-red-500">Erro ao buscar filmes.</p>
        )}
        {moviesToShow && moviesToShow.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {moviesToShow.map((movie: Movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
        {isSearching && !isLoadingSearch && moviesToShow?.length === 0 && (
          <p>Nenhum resultado encontrado.</p>
        )}
      </section>
    </div>
  );
}
