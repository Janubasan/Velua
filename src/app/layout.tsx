import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "Amigo do Afiliado na Gringa — Mina de Tesouro",
    template: "%s | Amigo do Afiliado na Gringa",
  },
  description:
    "Masterclass completo de afiliação internacional: mineração de ofertas BuyGoods/Digistore24, presell validada, Google Ads fundo de funil, tracking offline por postback e rotina de gestão. Com gerador de presells com IA e template Notion.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="flex min-h-screen flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
