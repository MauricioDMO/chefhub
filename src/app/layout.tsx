import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import "./globals.css";
import { dancingScript, redHatText } from "@/ui/fonts";

export const metadata: Metadata = {
  title: "ChefHub",
  description: "ChefHub es una plataforma para aprender a preparar obras de maestras culinarias con tus propias manos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dancingScript.variable} ${redHatText.variable} ${redHatText.className} antialiased`}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
