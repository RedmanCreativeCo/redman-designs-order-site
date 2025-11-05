import type { Metadata } from "next";
import { Geist, Playfair_Display, Dancing_Script, Great_Vibes, Pacifico } from "next/font/google";
import Header from "@/components/Header";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  subsets: ["latin"],
});

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  weight: "400",
  subsets: ["latin"],
});

const pacifico = Pacifico({
  variable: "--font-pacifico",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Redman Designs - Custom Products",
  description: "Order custom handcrafted products for your home and family.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${playfair.variable} ${dancingScript.variable} ${greatVibes.variable} ${pacifico.variable}`}>
      <body className="font-geist antialiased">
        <Header />
        {children}
      </body>
    </html>
  );
}
