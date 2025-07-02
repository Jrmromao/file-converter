import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Image, FileImage, Palette, Film } from "lucide-react";
import type { ReactNode } from "react";
import AdSense from "./components/AdSense";
import Link from "next/link";
import { Sun, Moon, Github } from "lucide-react";
import TopNavbar from "./components/TopNavbar";
import Footer from "./components/Footer";
import SessionProviderWrapper from "./components/SessionProviderWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PNG Convert - Free Online Image Converter | PNG, JPG, WebP, AVIF",
  description:
    "Convert and optimize your images online for free. Support for PNG, JPG, WebP, and AVIF formats. Fast, secure, and easy to use image converter with advanced features.",
  keywords:
    "image converter, png converter, jpg converter, webp converter, avif converter, image optimization, free image converter, online image converter",
  authors: [{ name: "PNG Convert" }],
  creator: "PNG Convert",
  publisher: "PNG Convert",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://pngconvert.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "PNG Convert - Free Online Image Converter",
    description:
      "Convert and optimize your images online for free. Support for PNG, JPG, WebP, and AVIF formats.",
    url: "https://pngconvert.app",
    siteName: "PNG Convert",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PNG Convert - Free Online Image Converter",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PNG Convert - Free Online Image Converter",
    description:
      "Convert and optimize your images online for free. Support for PNG, JPG, WebP, and AVIF formats.",
    images: ["/twitter-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "googlef61644379538afda",
  },
};

export type FileFormat = {
  value: string;
  label: string;
  icon: ReactNode;
};

export const fileFormats: FileFormat[] = [
  {
    value: "png",
    label: "PNG",
    icon: <Image className="w-5 h-5 text-blue-500" />,
  },
  {
    value: "jpg",
    label: "JPG",
    icon: <FileImage className="w-5 h-5 text-yellow-500" />,
  },
  {
    value: "webp",
    label: "WebP",
    icon: <Palette className="w-5 h-5 text-green-500" />,
  },
  {
    value: "avif",
    label: "AVIF",
    icon: <Film className="w-5 h-5 text-purple-500" />,
  },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta
          name="google-adsense-account"
          content="ca-pub-1009479093659621"
        ></meta>
        <AdSense pId="ca-pub-1009479093659621" />
      </head>
      <body className={inter.className}>
        <SessionProviderWrapper>
          <TopNavbar />
        </SessionProviderWrapper>
        {children}
        <Footer />
        {process.env.NODE_ENV !== "development" && (
          <GoogleAnalytics gaId="G-313BF1QH73" />
        )}
        <Toaster />
      </body>
    </html>
  );
}
