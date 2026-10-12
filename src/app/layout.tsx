import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { BackToTop } from "@/components/layout/back-to-top";
import { ContactDock } from "@/components/layout/contact-dock";
import { MainContent } from "@/components/layout/main-content";
import { PageBackground } from "@/components/layout/page-background";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import ClickSpark from "@/components/react-bits/click-spark";
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
        <PageBackground />
        <Providers>
          <Terminal />
          <SiteHeader />
          <ClickSpark sparkColor={["#ffb000", "#ffcf66"]} sparkCount={10} sparkRadius={22} sparkSize={9}>
            <MainContent>{children}</MainContent>
            <SiteFooter />
          </ClickSpark>
          <ContactDock />
          <BackToTop />
        </Providers>
      </body>
    </html>
  );
}
