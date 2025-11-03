import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import "./globals.css";
import Providers from '@/components/Providers';
import ConditionalSiteComponents from '@/components/ConditionalSiteComponents';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'leaflet/dist/leaflet.css';

const publicSans = Public_Sans({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.bsimoveisdf.com.br'),
  title: {
    default: "Imóveis em Brasília - Casas e Apartamentos à Venda e Aluguel | BS Imóveis DF",
    template: "%s | BS Imóveis DF"
  },
  description: "🏠 Encontre seu imóvel ideal em Brasília e Distrito Federal. Casas, apartamentos e terrenos para venda e aluguel. ⭐ Atendimento especializado, financiamento facilitado. Confira!",
  keywords: ["imóveis brasília", "casas brasília df", "apartamentos brasília", "venda imóveis df", "aluguel brasília", "imobiliária brasília", "bs imóveis df", "imóveis distrito federal", "apartamento asa sul", "casa águas claras", "imóveis taguatinga", "aluguel asa norte"],
  authors: [{ name: "BS Imóveis DF" }],
  creator: "BS Imóveis DF",
  publisher: "BS Imóveis DF",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
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
  alternates: {
    canonical: 'https://www.bsimoveisdf.com.br',
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://www.bsimoveisdf.com.br",
    siteName: "BS Imóveis DF",
    title: "Imóveis em Brasília - Casas e Apartamentos | BS Imóveis DF",
    description: "🏠 Encontre seu imóvel ideal em Brasília e Distrito Federal. Casas, apartamentos e terrenos para venda e aluguel. Atendimento especializado!",
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'BS Imóveis DF - Imóveis em Brasília',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@bsimoveisdf",
    creator: "@bsimoveisdf",
    title: "Imóveis em Brasília - Casas e Apartamentos | BS Imóveis DF",
    description: "🏠 Encontre seu imóvel ideal em Brasília e Distrito Federal. Imóveis para venda e aluguel!",
    images: ['/og-image.jpg'],
  },
  verification: {
    google: 'fa5301674a0f6dac',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // LocalBusiness structured data
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": "BS Imóveis",
    "description": "Encontre seu imóvel ideal em Brasília e Distrito Federal. Casas, apartamentos e terrenos para venda e aluguel. Atendimento especializado na BS Imóveis.",
    "url": "https://www.bsimoveisdf.com.br",
    "logo": "https://www.bsimoveisdf.com.br/logo.png",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "BR",
      "addressRegion": "DF",
      "addressLocality": "Brasília",
      "streetAddress": "QR 218 Conj. O Lote 30"
    },
    "areaServed": {
      "@type": "City",
      "name": "Brasília"
    },
    "serviceType": ["Venda de Imóveis", "Aluguel de Imóveis", "Consultoria Imobiliária"]
  }

  return (
    <html lang="pt-BR">
      <head>
        <link rel="preload" as="font" href="/fontawesome/webfonts/fa-solid-900.woff2" type="font/woff2" crossOrigin="anonymous"/>
        <link rel="preload" as="font" href="/fontawesome/webfonts/fa-brands-400.woff2" type="font/woff2" crossOrigin="anonymous"/>
        <link rel="preload" as="font" href="/fontawesome/webfonts/fa-light-300.woff2" type="font/woff2" crossOrigin="anonymous"/>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema),
          }}
        />
      </head>
      <body
        className={`${publicSans.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <Providers>
          {children}
          <ConditionalSiteComponents />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            toastStyle={{
              backgroundColor: '#000000',
              color: '#ffffff'
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
