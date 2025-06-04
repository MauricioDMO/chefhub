import type { Metadata } from "next";
import { Dancing_Script, Red_Hat_Text } from "next/font/google";
import "./globals.css";

const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  subsets: ["latin"],
});

const redHatText = Red_Hat_Text({
  variable: "--font-red-hat-text",
  subsets: ["latin"],
});

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
        {children}
      </body>
    </html>
  );
}
