"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/curso";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  async function entrar() {
    setLoading(true);
    setErro("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErro(data.error || "Erro ao entrar.");
        return;
      }
      router.push(next);
      router.refresh();
    } catch {
      setErro("Falha de conexão.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card mx-auto w-full max-w-md">
      <h1 className="text-2xl font-black tracking-tight text-white">Entrar</h1>
      <p className="mt-2 text-sm text-ink-100/60">
        Acesse para salvar progresso e sua biblioteca de presells.
      </p>

      <div className="mt-6 space-y-4">
        <div>
          <label className="label">E-mail</label>
          <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@email.com" />
        </div>
        <div>
          <label className="label">Senha</label>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && entrar()}
            placeholder="••••••"
          />
        </div>
        {erro && <p className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">{erro}</p>}
        <button onClick={entrar} disabled={loading} className="btn btn-primary w-full py-3.5">
          {loading ? "Entrando…" : "Entrar"}
        </button>
      </div>

      <p className="mt-5 text-center text-sm text-ink-100/55">
        Não tem conta?{" "}
        <Link href="/registrar" className="link-gold">
          Criar conta grátis
        </Link>
      </p>
    </div>
  );
}
