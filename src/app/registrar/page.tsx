import type { Metadata } from "next";
import RegisterForm from "@/components/RegisterForm";

export const metadata: Metadata = { title: "Criar conta", robots: { index: false } };

export default function RegistrarPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <RegisterForm />
    </div>
  );
}
