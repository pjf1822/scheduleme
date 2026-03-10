import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { createClient } from "@/lib/supabase/server";
import Navbar from "./components/layout/Navbar";
import { headers } from "next/headers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://scheduleme.live"),
  title: {
    default: "ScheduleMe",
    template: "%s | ScheduleMe",
  },
  description:
    "ScheduleMe is a simple team scheduling tool for managing shifts, availability, and roles.",
  openGraph: {
    title: "ScheduleMe",
    description: "A straightforward team scheduling platform.",
    url: "https://scheduleme.live",
    siteName: "ScheduleMe",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ScheduleMe",
    description: "A straightforward team scheduling platform.",
    images: ["/og.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const isOnBoarding = pathname.startsWith("/onboarding");
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;
  const hideNavbar = pathname === "/" || pathname.startsWith("/auth");

  return (
    <html lang="en">
      <head>
        <link
          rel="preconnect"
          href="https://seaxrzwhaxqdrjdsnbfc.supabase.co"
        />
        <link rel="preconnect" href="https://accounts.google.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-[var(--brand-4)] antialiased`}
      >
        {user?.email && user?.user_role && !isOnBoarding && !hideNavbar && (
          <Navbar userRole={user.user_role} email={user.email} />
        )}
        {children}
      </body>
    </html>
  );
}
