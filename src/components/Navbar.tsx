"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/src/contexts/AuthContext";
import { Icon } from "./Icon";

function NavLink({
  href,
  iconSrc,
  label,
}: {
  href: string;
  iconSrc: string;
  label: string;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;
  const iconStyleClass = isActive
    ? "opacity-100"
    : "opacity-30 hover:opacity-75";

  return (
    <Link href={href} title={label}>
      <div
        className={`relative h-5 w-5 cursor-pointer text-white 
                    hover:text-red-500 transition-all ${iconStyleClass}`}
      >
        <Image
          src={iconSrc}
          alt={label}
          layout="fill"
          className="object-contain"
        />
      </div>
    </Link>
  );
}

function Avatar() {
  const { user, logOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logOut();
    router.push("/login");
  };

  const avatarSrc = user?.photoURL || "/avatar.svg";

  return (
    <div className="mt-auto flex flex-row md:flex-col items-center gap-6">
      <div className="h-8 w-8 rounded-full border border-white overflow-hidden">
        <Image
          src={avatarSrc}
          alt="Avatar do usuário"
          width={32}
          height={32}
          className="object-cover"
        />
      </div>
      <button onClick={handleLogout} title="Sair da conta">
        <Icon
          src="/logout.svg"
          alt="Sair"
          width={28}
          height={28}
          className="opacity-50 hover:opacity-100 cursor-pointer"
        />
      </button>
    </div>
  );
}

export function Navbar() {
  return (
    <>
      <nav
        className="hidden md:flex flex-col items-center gap-10 bg-blue-900 
             py-8 px-6 rounded-2xl w-24 shrink-0 fixed left-8 top-8 bottom-8"
      >
        <Icon src="/logo.svg" alt="Logo" width={32} height={26} />

        <div className="flex md:flex-col items-center gap-8">
          <NavLink
            href="/"
            iconSrc="/icon-nav-movies.svg"
            label="Início / Tendências"
          />
          <NavLink
            href="/favorites"
            iconSrc="/icon-nav-bookmark.svg"
            label="Favoritos"
          />
        </div>

        <Avatar />
      </nav>

      {/* Navbar mobile */}
      <nav className="md:hidden flex items-center justify-between bg-blue-900 p-4 rounded-lg w-full">
        <Icon src="/logo.svg" alt="Logo" width={25} height={20} />

        <div className="flex items-center gap-6">
          <NavLink
            href="/"
            iconSrc="/icon-nav-movies.svg"
            label="Início / Tendências"
          />
          <NavLink
            href="/favorites"
            iconSrc="/icon-nav-bookmark.svg"
            label="Favoritos"
          />
        </div>
        <Avatar />
      </nav>
    </>
  );
}
