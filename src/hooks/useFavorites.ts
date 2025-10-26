"use client";

import React from "react";
import useSWR, { mutate, useSWRConfig } from "swr"; // Importa useSWRConfig
import { useAuth } from "@/src/contexts/AuthContext";
import { Movie, FavoritesResponse } from "@/src/types/tmdb"; // Lembre-se de verificar/renomear
import api from "../services/api";

const FAVORITES_KEY = "/favorites";

const getFavorites = async (url: string): Promise<FavoritesResponse> => {
  const { data } = await api.get<FavoritesResponse>(url);
  return data;
};

export function useFavorites() {
  const { user } = useAuth();
  useSWRConfig();

  const { data: favoritesData, isLoading: swrLoading } = useSWR(
    user ? FAVORITES_KEY : null,
    getFavorites
  );

  const favoriteMovies = favoritesData?.movieDetails;

  const favoriteIds = React.useMemo(() => {
    return new Set(favoriteMovies?.map((movie) => movie.id) || []);
  }, [favoriteMovies]);

  const isFavorite = (movieId: number) => {
    return favoriteIds.has(movieId);
  };

  const addFavorite = async (movieToAdd: Movie) => {
    if (!user || !movieToAdd) return;

    const optimisticData: FavoritesResponse = {
      movieDetails: [...(favoriteMovies || []), movieToAdd],
      shareId: favoritesData?.shareId || "",
    };

    try {
      //Atualização otimizada pra evitar erros em cliques rápidos
      await mutate(FAVORITES_KEY, optimisticData, {
        optimisticData: optimisticData,
        rollbackOnError: true,
        populateCache: true,
        revalidate: false,
      });

      await api.post("/favorites/add", { movieId: movieToAdd.id });
    } catch (error) {
      console.error("Falha ao adicionar favorito:", error);
    }
  };

  const removeFavorite = async (movieId: number) => {
    if (!user) return;

    const optimisticData: FavoritesResponse = {
      movieDetails:
        favoriteMovies?.filter((movie) => movie.id !== movieId) || [],
      shareId: favoritesData?.shareId || "",
    };

    try {
      await mutate(FAVORITES_KEY, optimisticData, {
        optimisticData: optimisticData,
        rollbackOnError: true,
        populateCache: true,
        revalidate: false,
      });

      await api.post("/favorites/remove", { movieId });
    } catch (error) {
      console.error("Falha ao remover favorito:", error);
    }
  };

  const toggleFavorite = (movie: Movie) => {
    if (!movie) return;
    if (isFavorite(movie.id)) {
      removeFavorite(movie.id);
    } else {
      addFavorite(movie);
    }
  };

  return {
    favoriteMovies: favoriteMovies || [],
    shareId: favoritesData?.shareId,
    isFavorite,
    toggleFavorite,
    isLoading: swrLoading,
  };
}
