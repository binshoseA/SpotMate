"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CalendarDays,
  LogOut,
  MapPin,
  PlusCircle,
  UserRound
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

const navLinks = [
  { href: "/spots", label: "Spot", icon: MapPin },
  { href: "/activities", label: "Aktivitas", icon: CalendarDays },
  { href: "/activities/create", label: "Buat", icon: PlusCircle },
  { href: "/profile", label: "Profil", icon: UserRound }
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, signOut } = useAuth();

  async function handleSignOut() {
    await signOut();
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/85 backdrop-blur-xl">
      <div className="container-page flex min-h-16 items-center justify-between gap-3 py-3">
        <Link href="/" className="group inline-flex items-center gap-2">
          <span className="grid size-10 place-items-center rounded-lg bg-ink text-sm font-black text-white shadow-card transition group-hover:-rotate-3">
            SM
          </span>
          <span className="text-lg font-black text-ink">SpotMate</span>
        </Link>

        <nav className="hidden items-center gap-1 rounded-lg border border-ink/10 bg-white p-1 shadow-sm md:flex">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active =
              pathname === link.href ||
              (link.href !== "/spots" && pathname.startsWith(link.href));

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-bold transition ${
                  active
                    ? "bg-campus text-white"
                    : "text-ink/70 hover:bg-campus/10 hover:text-campus"
                }`}
              >
                <Icon size={17} aria-hidden />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {!loading && user ? (
            <button
              type="button"
              onClick={handleSignOut}
              className="secondary-button px-3 py-2"
              title="Logout"
            >
              <LogOut size={17} aria-hidden />
              <span className="hidden sm:inline">Logout</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="secondary-button px-3 py-2">
                Login
              </Link>
              <Link href="/register" className="primary-button px-3 py-2">
                Daftar
              </Link>
            </div>
          )}
        </div>
      </div>

      <nav className="container-page flex gap-2 overflow-x-auto pb-3 md:hidden">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const active =
            pathname === link.href ||
            (link.href !== "/spots" && pathname.startsWith(link.href));

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`inline-flex min-w-fit items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold transition ${
                active
                  ? "bg-campus text-white"
                  : "border border-ink/10 bg-white text-ink/70"
              }`}
            >
              <Icon size={16} aria-hidden />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
