"use client";

import { useState } from "react";
import { useFavorites } from "@/src/hooks/useFavorites";
import { Button } from "@/src/components/Button";
import { MovieCard } from "@/src/components/MovieCard";

export default function FavoritesPage() {
  const { favoriteMovies, shareId, isLoading } = useFavorites();
  const [copySuccess, setCopySuccess] = useState(false);

  const handleShare = () => {
    if (!shareId) return;
    const shareUrl = `${window.location.origin}/share/${shareId}`;

    navigator.clipboard.writeText(shareUrl).then(
      () => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      },
      (err) => {
        console.error("Falha ao copiar link: ", err);
        alert("Falha ao copiar o link.");
      }
    );
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-heading-lg">Meus Favoritos</h1>
        {shareId && (
          <Button onClick={handleShare} className="text-body-sm">
            {copySuccess ? "Copiado!" : "Copiar Link"}
          </Button>
        )}
      </div>
      {isLoading && <p className="text-body-md">Carregando favoritos...</p>}

      {!isLoading && favoriteMovies && favoriteMovies.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
          {favoriteMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}

      {!isLoading && (!favoriteMovies || favoriteMovies.length === 0) && (
        <p className="text-heading-sm">
          Não há nenhum filme adicionado aos favoritos.
        </p>
      )}
    </div>
  );
}
