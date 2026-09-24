import fs from "node:fs";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "data");

function ensure() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function read<T>(file: string, fallback: T): T {
  ensure();
  const p = path.join(DATA_DIR, file);
  if (!fs.existsSync(p)) return fallback;
  try {
    return JSON.parse(fs.readFileSync(p, "utf-8")) as T;
  } catch {
    return fallback;
  }
}

function write(file: string, data: unknown) {
  ensure();
  const p = path.join(DATA_DIR, file);
  fs.writeFileSync(p, JSON.stringify(data, null, 2));
}

// ---------- tipos ----------
export interface User {
  id: string;
  email: string;
  name: string;
  passHash: string;
  createdAt: string;
}

export interface Variante {
  headline: string;
  angulo: string;
  palavras: number;
  score: number;
  html: string;
}

export interface Presell {
  id: string;
  userId: string;
  produto: string;
  nicho: string;
  idioma: string;
  tipo: string;
  link: string;
  mode: "local" | "llm";
  variantes: Variante[];
  createdAt: string;
}

export interface Progresso {
  [userId: string]: { [aulaSlug: string]: string }; // aula -> ISO date
}

// ---------- acesso ----------
export const db = {
  users: () => read<User[]>("users.json", []),
  saveUsers: (u: User[]) => write("users.json", u),

  presells: () => read<Presell[]>("presells.json", []),
  savePresells: (p: Presell[]) => write("presells.json", p),

  progress: () => read<Progresso>("progress.json", {}),
  saveProgress: (p: Progresso) => write("progress.json", p),

  sessions: () => read<Record<string, { userId: string; createdAt: string }>>("sessions.json", {}),
  saveSessions: (s: Record<string, { userId: string; createdAt: string }>) => write("sessions.json", s),
};

export function uid(prefix = "id"): string {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}
