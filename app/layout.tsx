import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const bodyFont = localFont({
  src: [
    { path: "./fonts/Lato-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/Lato-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-body",
  display: "swap",
});

const headingFont = localFont({
  src: [
    { path: "./fonts/CormorantGaramond-Variable.ttf", weight: "300 700", style: "normal" },
    { path: "./fonts/CormorantGaramond-Italic-Variable.ttf", weight: "300 700", style: "italic" },
  ],
  variable: "--font-heading",
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
