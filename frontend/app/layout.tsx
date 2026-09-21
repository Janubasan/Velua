import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Velua - Web4 Trading Protocol | Brokerage Level",
  description: "Protocolo.JEV + Web 4.0 Automation - Agentes autônomos que aprendem com erros e se auto-substituem. Auditoria on-chain Arbitrum.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased bg-[#0a0a0f] text-gray-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
