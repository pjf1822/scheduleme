import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
export const metadata: Metadata = {
  title: "ScheduleMe – Simple Team Scheduling",
  description:
    "ScheduleMe is a straightforward team scheduling tool for managing shifts, roles, and availability.",
  keywords: [
    "team scheduling",
    "shift scheduling",
    "schedule manager",
    "crew scheduling",
    "team planner",
  ],
  openGraph: {
    title: "ScheduleMe",
    description: "A straightforward schedule manager for teams.",
    url: "https://scheduleme.live",
    siteName: "ScheduleMe",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "ScheduleMe",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ScheduleMe",
    description: "A straightforward schedule manager for teams.",
    images: ["/logo.png"],
  },
};

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--brand-3)] px-6">
      <Card className="w-full max-w-md text-center bg-[var(--brand-4)]">
        <CardContent className="space-y-6 p-10 ">
          <Image
            src="/logo.png"
            alt="Logo"
            width={200}
            height={90}
            priority
            unoptimized
            className="mx-auto"
          />
          <p className="text-sm text-muted-foreground">
            A straightforward schedule manager
          </p>
          <Button asChild size="lg" className="w-full">
            <Link href="/auth/login">Sign In</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
