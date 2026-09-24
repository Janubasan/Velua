import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <span className="badge-gold mb-5">Erro 404</span>
      <h1 className="text-4xl font-black tracking-tight text-white">Página não encontrada</h1>
      <p className="mt-4 text-ink-100/65">
        O link que você seguiu não existe (ou foi movido). Volte para o roadmap do curso ou gere uma presell no Flow
        Engine.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/curso" className="btn btn-primary">
          Ver roadmap do curso
        </Link>
        <Link href="/flow" className="btn btn-ghost">
          ⚡ Flow Engine
        </Link>
      </div>
    </div>
  );
}
