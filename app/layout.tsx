import type { Metadata } from "next";
import { Montserrat, DM_Sans } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Samsu Alam — Full Stack Developer",
  description:
    "Samsu Alam — Full Stack Developer based in Gorontalo, Indonesia. Building modern, responsive web applications.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} ${dmSans.variable}`}>
        {children}
      </body>
    </html>
  );
}
