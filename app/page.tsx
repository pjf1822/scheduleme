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
};

export default function Home() {
  return <RootClient />;
}
