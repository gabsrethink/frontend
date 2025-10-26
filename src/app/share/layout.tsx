import { Icon } from "@/src/components/Icon"
import React from "react"

//Layout público para compartilhamento.
export default function ShareLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-blue-950 p-4 md:p-6 lg:p-8">
      <header className="flex justify-center mb-8">
        <Icon src="/logo.svg" alt="Logo" width={32} height={26} />
      </header>
      <main className="max-w-6xl mx-auto">
        <h1 className="text-heading-md text-white text-center mb-8">
          Lista de Filmes Compartilhada
        </h1>
        {children}
      </main>
    </div>
  )
}

