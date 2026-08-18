import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "LaptopWise — Smart Laptop Checker, Hardware Inspector & Clean Buying Companion",
  description: "Verify used & new laptop authenticity, hardware specs, SMART battery health, budget matching, and AI comparison before buying.",
  authors: [{ name: "Muhammad Anza Muneeb Khan", url: "https://github.com/anzamuneebkhanofficial" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className="min-h-screen flex flex-col bg-[#080c14] text-slate-100 antialiased selection:bg-indigo-500 selection:text-white"
        suppressHydrationWarning
      >
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
