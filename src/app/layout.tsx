import type { Metadata } from "next";
import { Bebas_Neue, Roboto_Condensed, Roboto, Permanent_Marker } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const fontHeading = Bebas_Neue({
  variable: "--font-heading",
  weight: "400",
  subsets: ["latin"],
});

const fontUi = Roboto_Condensed({
  variable: "--font-ui",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const fontBody = Roboto({
  variable: "--font-body",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

const fontAccent = Permanent_Marker({
  variable: "--font-accent",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Novel TV — Stream Different. No Limits.",
  description:
    "Movies. TV shows. Live TV. Originals. No limits. Just nonstop entertainment.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fontHeading.variable} ${fontUi.variable} ${fontBody.variable} ${fontAccent.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-text-primary font-body">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
