"use client";

import { Icon } from "./Icon";

interface SearchBarProps {
  value: string;
  onChange: (newValue: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Buscar filmes...",
}: SearchBarProps) {
  return (
    <div className="flex items-center w-full gap-4 mb-6">
      <Icon
        src="/icon-search.svg"
        alt="Buscar"
        width={24}
        height={24}
        className="shrink-0"
      />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="search-input"
      />
    </div>
  );
}
