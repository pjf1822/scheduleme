import { Metadata } from "next";

import RootClient from "./components/RootClient";
export const metadata: Metadata = {
  title: "ScheduleMe – Simple Team Scheduling",
  description:
    "ScheduleMe is a straightforward team scheduling tool for managing shifts, roles, and availability.",
  keywords: [
    "employee shift scheduler",
    "free shift scheduling app",
    "online work schedule builder",
    "small business employee scheduling",
    "staff scheduling software",
    "shift planner for teams",
    "restaurant schedule maker",
    "simple scheduling app",
    "weekly schedule builder",
    "work schedule manager",
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
  return <RootClient />;
}
