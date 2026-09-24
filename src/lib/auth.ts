import crypto from "node:crypto";
import { db, uid, type User } from "./db";

const ITER = 120_000;
const KEYLEN = 64;

function hash(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, KEYLEN).toString("hex");
}

export function createUser(email: string, password: string, name: string): { user?: User; error?: string } {
  const clean = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) return { error: "E-mail inválido." };
  if (password.length < 6) return { error: "A senha precisa ter no mínimo 6 caracteres." };
  const users = db.users();
  if (users.some((u) => u.email === clean)) return { error: "Este e-mail já está cadastrado." };
  const salt = crypto.randomBytes(16).toString("hex");
  const user: User = {
    id: uid("usr"),
    email: clean,
    name: name.trim() || clean.split("@")[0],
    passHash: `${salt}:${hash(password, salt)}`,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  db.saveUsers(users);
  return { user };
}

export function verifyUser(email: string, password: string): { user?: User; error?: string } {
  const clean = email.trim().toLowerCase();
  const user = db.users().find((u) => u.email === clean);
  if (!user) return { error: "E-mail ou senha incorretos." };
  const [salt, expected] = user.passHash.split(":");
  if (hash(password, salt) !== expected) return { error: "E-mail ou senha incorretos." };
  return { user };
}

export function createSession(userId: string): string {
  const token = crypto.randomBytes(32).toString("hex");
  const sessions = db.sessions();
  sessions[token] = { userId, createdAt: new Date().toISOString() };
  db.saveSessions(sessions);
  return token;
}

export function destroySession(token: string | undefined) {
  if (!token) return;
  const sessions = db.sessions();
  delete sessions[token];
  db.saveSessions(sessions);
}

export function userFromSession(token: string | undefined): User | null {
  if (!token) return null;
  const s = db.sessions()[token];
  if (!s) return null;
  return db.users().find((u) => u.id === s.userId) ?? null;
}

// Recebe o VALOR do cookie de sessão (não o header inteiro)
export function userFromCookies(token: string | undefined): User | null {
  return userFromSession(token);
}

export const COOKIE_NAME = "adag_session";
