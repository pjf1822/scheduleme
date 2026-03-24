import { Metadata } from "next";

import RootClient from "./components/RootClient";
export const metadata: Metadata = {
  title: "ScheduleMe – Free Shift Scheduling for Small Teams",
  description:
    "Free team scheduling for salons, venues, and small businesses. No setup, no monthly bill. Just see who works what days.",
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
};

export default function Home() {
  return <RootClient />;
}
