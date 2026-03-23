import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { createClient } from "@/lib/supabase/server";
import Navbar from "./components/layout/Navbar";
import { headers } from "next/headers";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";

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
        url: "/fulllogo.png",
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
  const hideNavbar =
    pathname === "/" ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/invite");
  return (
    <html lang="en">
      <head>
        <link
          rel="preconnect"
          href="https://seaxrzwhaxqdrjdsnbfc.supabase.co"
          crossOrigin=""
        />
        <link
          rel="preconnect"
          href="https://accounts.google.com"
          crossOrigin=""
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "ScheduleMe",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web",
              url: "https://scheduleme.live",
            }),
          }}
        />
      </head>

      <Script id="google-analytics" strategy="afterInteractive">
        {`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-48B33FX3C3');
    `}
      </Script>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-black antialiased`}
      >
        {user?.email && user?.user_role && !isOnBoarding && !hideNavbar && (
          <Navbar userRole={user.user_role} email={user.email} />
        )}
        {children}
        <Analytics />
      </body>
    </html>
  );
}
