import type { Metadata } from "next";
import "./globals.css";
import "./style.css";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import CartModal from "@/components/CartModal";

export const metadata: Metadata = {
  title: "InjetNobre - Estojos Premium para Relógios",
  description:
    "Estojos profissionais para relógios a partir de 100 unidades por R$ 2,50 cada. Qualidade premium para revendedores e joalherias.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <CartProvider>
          <Header />
          <CartModal />
          <main>{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}
