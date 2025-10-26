import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "../contexts/AuthContext";
import AuthRedirector from "../components/AuthRedirector";

export const metadata: Metadata = {
  title: "Lista de Filmes",
  description: "Desafio de lista de filmes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          <AuthRedirector>{children}</AuthRedirector>
        </AuthProvider>
      </body>
    </html>
  );
}
