import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Lavinya Perde | Balıkesir Perde, Halı ve Dekorasyon",
    template: "%s | Lavinya Perde"
  },
  description: "Balıkesir'in güvenilir perde ve dekorasyon mağazası. Fon perde, tül perde, stor perde, halı, duvar kağıdı ve profesyonel montaj hizmeti. Ücretsiz keşif ve ölçüm.",
  keywords: [
    "perde",
    "balıkesir perde",
    "fon perde",
    "tül perde",
    "stor perde",
    "halı",
    "duvar kağıdı",
    "perde montajı",
    "ev dekorasyon",
    "balıkesir dekorasyon",
    "perde dikimi",
    "perde modelleri",
    "lavinya perde"
  ],
  authors: [{ name: "Lavinya Perde" }],
  creator: "Lavinya Perde",
  publisher: "Lavinya Perde",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://lavinyaperde.com",
    siteName: "Lavinya Perde",
    title: "Lavinya Perde | Balıkesir Perde, Halı ve Dekorasyon",
    description: "Balıkesir'in güvenilir perde ve dekorasyon mağazası. Fon perde, tül perde, stor perde, halı, duvar kağıdı ve profesyonel montaj hizmeti.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Lavinya Perde - Perde ve Dekorasyon",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lavinya Perde | Balıkesir Perde, Halı ve Dekorasyon",
    description: "Balıkesir'in güvenilir perde ve dekorasyon mağazası. Fon perde, tül perde, stor perde, halı, duvar kağıdı ve profesyonel montaj hizmeti.",
    images: ["/og-image.jpg"],
  },
  verification: {
    // Google Search Console doğrulama kodu eklenebilir
    // google: "your-google-verification-code",
  },
  alternates: {
    canonical: "https://lavinyaperde.com",
  },
  category: "home decoration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#8b669e" />
        <meta name="geo.region" content="TR-10" />
        <meta name="geo.placename" content="Balıkesir" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

