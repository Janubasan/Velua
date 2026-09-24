"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  async function registrar() {
    setLoading(true);
    setErro("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErro(data.error || "Erro ao criar conta.");
        return;
      }
      router.push("/curso");
      router.refresh();
    } catch {
      setErro("Falha de conexão.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card mx-auto w-full max-w-md">
      <h1 className="text-2xl font-black tracking-tight text-white">Criar conta</h1>
      <p className="mt-2 text-sm text-ink-100/60">
        Salve seu progresso no curso e suas presells geradas no Flow Engine.
      </p>

      <div className="mt-6 space-y-4">
        <div>
          <label className="label">Nome</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Como quer ser chamado" />
        </div>
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
            onKeyDown={(e) => e.key === "Enter" && registrar()}
            placeholder="mínimo 6 caracteres"
          />
        </div>
        {erro && <p className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">{erro}</p>}
        <button onClick={registrar} disabled={loading} className="btn btn-primary w-full py-3.5">
          {loading ? "Criando…" : "Criar conta grátis"}
        </button>
      </div>

      <p className="mt-5 text-center text-sm text-ink-100/55">
        Já tem conta?{" "}
        <Link href="/login" className="link-gold">
          Entrar
        </Link>
      </p>
    </div>
  );
}
