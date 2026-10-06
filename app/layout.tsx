import type { Metadata } from "next";
import { Cormorant_Garamond, Lato } from "next/font/google";
import "./globals.css";

const bodyFont = Lato({
  variable: "--font-body",
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

const headingFont = Cormorant_Garamond({
  variable: "--font-heading",
  weight: ["300", "400"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Green Hero Darajat | Resort & Hot Spring",
  description:
    "Nikmati udara sejuk Darajat, kamar hangat, dan kolam air hangat alami untuk liburan keluarga di Green Hero Darajat.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${bodyFont.variable} ${headingFont.variable}`}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
