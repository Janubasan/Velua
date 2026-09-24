import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { userFromCookies } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import BibliotecaClient from "@/components/BibliotecaClient";

export const metadata: Metadata = {
  title: "Minha biblioteca de presells",
  robots: { index: false },
};

export default function BibliotecaPage() {
  const user = userFromCookies(cookies().get("adag_session")?.value);
  if (!user) redirect("/login?next=/flow/biblioteca");

  const presells = db
    .presells()
    .filter((p) => p.userId === user.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <header className="mb-8">
        <span className="badge-gold mb-4">Biblioteca</span>
        <h1 className="h-section">Minhas presells</h1>
        <p className="mt-3 text-ink-100/65">
          {presells.length === 0
            ? "Você ainda não salvou presells. Gere uma no Flow Engine e clique em “Salvar na biblioteca”."
            : `${presells.length} presell(s) salva(s).`}
        </p>
      </header>

      {presells.length === 0 ? (
        <Link href="/flow" className="btn btn-primary">
          ⚡ Ir para o Flow Engine
        </Link>
      ) : (
        <BibliotecaClient presells={JSON.parse(JSON.stringify(presells))} />
      )}
    </div>
  );
}
