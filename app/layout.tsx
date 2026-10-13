import type { Metadata } from "next";
import localFont from "next/font/local";
import NavigationSkeleton from "@/components/NavigationSkeleton";
import "./globals.css";
import "@/features/home/styles/home.css";
import "@/features/home/styles/darajat-interior.css";
import "@/features/contact/styles/contact.css";

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
  title: "Hotel Darajat Pass | Resort & Hot Spring",
  description:
    "Nikmati udara sejuk Darajat, kamar nyaman, dan kolam air hangat alami untuk liburan keluarga di Hotel Darajat Pass.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${bodyFont.variable} ${headingFont.variable}`}>
      <body suppressHydrationWarning><NavigationSkeleton />{children}</body>
    </html>
  );
}
