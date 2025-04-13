
import type { Metadata } from "next";
import "../../public/styles/Profile.css";
import "../../public/styles/pMain.css";
import "../../public/styles/pAnimelist.css";
import "../../public/styles/globals.css"
import "../../public/styles/pStats.css"
import "../../public/styles/stats.css"
import "../app/globals.css"
import "../../public/styles/login.css"
import "../../public/styles/index.css"
import { ApolloWrapper } from "./graphql/ApolloWraper";
import { Inter } from "next/font/google";


import type { Viewport } from 'next';
import SessionWrapper from "./components/SessionWrapper";
import { UserProvider } from "./components/userInfoWrapper";
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});




export const metadata: Metadata = {
  title: "AyoList",
  description: "AyoList created by MichalAniol",
  icons: {
    icon: "/favicons/logo.ico", // Główna ikona
    apple: "/favicons/apple-touch-logo.png", // Ikona dla iOS
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {



  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicons/logo-32x32.png" sizes="32x32" />
        <link rel="icon" href="/favicons/logo-16x16.png" sizes="16x16" />
        <link rel="apple-touch-icon" href="/favicons/apple-touch-logo.png" sizes="180x180" />
        <link rel="icon" href="/favicons/android-chrome-192x192.png" sizes="192x192" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css" integrity="sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg==" crossOrigin="anonymous" referrerPolicy="no-referrer" />


      </head>


      <body className={`${inter.variable} `}>

        <UserProvider>
          <SessionWrapper>
            <ApolloWrapper>

              {children}

            </ApolloWrapper>
          </SessionWrapper>
        </UserProvider>
      </body>
    </html>
  );
}