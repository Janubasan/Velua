import Link from "next/link";
import { userFromCookies } from "@/lib/auth";
import { cookies } from "next/headers";
import LogoutButton from "./LogoutButton";

const links = [
  { href: "/curso", label: "Curso" },
  { href: "/metricas", label: "Métricas & Cases" },
  { href: "/rotina", label: "Rotina 15min" },
  { href: "/flow", label: "Flow Engine" },
  { href: "/notion", label: "Template Notion" },
];

export default function Nav() {
  const user = userFromCookies(cookies().get("adag_session")?.value);

  return (
    <header className="sticky top-0 z-50 border-b border-ink-700/80 bg-ink-950/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gold-500 text-lg font-black text-ink-950">A</span>
          <span className="hidden leading-tight sm:block">
            <span className="block text-sm font-extrabold tracking-tight text-white">Amigo do Afiliado</span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-500">na Gringa</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-ink-100/70 transition hover:bg-ink-800 hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link href="/flow/biblioteca" className="btn btn-ghost btn-sm hidden sm:inline-flex">
                Biblioteca
              </Link>
              <span className="hidden text-xs text-ink-100/60 sm:block">{user.email}</span>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost btn-sm">
                Entrar
              </Link>
              <Link href="/registrar" className="btn btn-primary btn-sm">
                Criar conta
              </Link>
            </>
          )}
        </div>
      </div>

      {/* mobile nav */}
      <nav className="flex gap-1 overflow-x-auto border-t border-ink-700/60 px-3 py-2 lg:hidden">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium text-ink-100/70 hover:bg-ink-800 hover:text-white"
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
