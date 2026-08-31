import type { Metadata } from "next";
import { Montserrat, DM_Sans, Press_Start_2P } from "next/font/google";
import { LanguageProvider } from "./contexts/LanguageContext";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["800"],
  variable: "--font-montserrat",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
});

const pressStart = Press_Start_2P({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-press-start",
});

export const metadata: Metadata = {
  title: "Samsu Alam — Full Stack Developer",
  description:
    "Samsu Alam — Full Stack Developer based in Gorontalo, Indonesia. Building modern, responsive web applications.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body className={`${montserrat.variable} ${dmSans.variable} ${pressStart.variable}`}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
