import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shoppe",
  description: "A modern e-commerce platform for clothing products",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className + " bg-[var(--background)] min-h-screen"}>
        <Navigation />
        <main className="pt-20 max-w-7xl mx-auto px-6 w-full min-h-[80vh]">
          <div className="bg-white/90 rounded-2xl shadow-2xl p-8 md:p-12 min-h-[60vh]">
            {children}
          </div>
        </main>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
