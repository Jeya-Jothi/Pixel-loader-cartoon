import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./styles.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pixel-loader-cartoon.onrender.com"),
  title: {
    default:
      "Pixel Loader | Animated Pixel Portrait Loader for React & Next.js",
    template: "%s | Pixel Loader",
  },
  description:
    "A cinematic pixel-art loader component for React and Next.js. Reveal any image as an animated pixel portrait.",
  keywords: [
    "pixel loader",
    "react loader component",
    "next.js loader",
    "pixel art animation",
    "loading screen",
    "react component",
    "splash screen",
  ],
  authors: [{ name: "Jeya Jothi S" }],
  creator: "Jeya Jothi S",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Pixel Loader",
    title: "Pixel Loader | Animated Pixel Portrait Loader",
    description:
      "Reveal any image as an animated pixel portrait. Built for React and Next.js.",
    images: [
      { url: "/og.png", width: 1200, height: 630, alt: "Pixel Loader preview" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pixel Loader | Animated Pixel Portrait Loader",
    description:
      "Reveal any image as an animated pixel portrait. Built for React and Next.js.",
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
