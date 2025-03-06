import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";

const inter = Inter({ subsets: ["latin"], weight: ["600"] });

export const metadata: Metadata = {
  title: "Kasar Labs",
  description: "An engineering and research laboratory of Starknet core devs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="h-full">
      <body
        className={`${inter.className} bg-black text-white flex flex-col min-h-screen`}
      >
        <Header />
        <main className="flex-grow w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
