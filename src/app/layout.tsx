import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { BackToTop } from "@/components/layout/back-to-top";
import { MainContent } from "@/components/layout/main-content";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Terminal } from "@/components/terminal";
import { siteConfig } from "@/config/site";
import { Providers } from "./providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}>
      <body className="min-h-full overflow-x-clip">
        <noscript>
          <style>{"[data-hero-content]{visibility:visible!important}"}</style>
        </noscript>
        <Providers>
          <Terminal />
          <SiteHeader />
          <MainContent>{children}</MainContent>
          <SiteFooter />
          <BackToTop />
        </Providers>
      </body>
    </html>
  );
}
