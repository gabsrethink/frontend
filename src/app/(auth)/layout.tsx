import NextImage from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-color-blue-950 px-6 py-12">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-10">
          <NextImage
            src="/logo.svg"
            alt="Logo do App de Filmes"
            width={38}
            height={32}
            priority
          />
        </div>
        {children}
      </div>
    </main>
  );
}
