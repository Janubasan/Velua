import type { Metadata } from "next";
import { Suspense } from "react";
import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = { title: "Entrar", robots: { index: false } };

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
