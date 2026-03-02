import { BusyBlock, TeamMember, TeamSchedule } from "@/lib/types/dbexports";

function toLocalDateString(date: Date) {
  return (
    date.getFullYear() +
    "-" +
    String(date.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(date.getDate()).padStart(2, "0")
  );
}

export function getAssignableMembersForDate(
  dateStr: string | null,
  teamMembers: TeamMember[],
  busyBlocks: BusyBlock[],
  scheduleBlocks: TeamSchedule[],
): TeamMember[] {
  if (!dateStr) return [];

  console.log(dateStr);
  // users busy that day
  const busyUserIds = new Set(
    busyBlocks
      .filter((b) => toLocalDateString(new Date(b.start_time)) === dateStr)
      .map((b) => b.user_id),
  );
  console.log(busyUserIds, "people who are busy");

  // users already scheduled
  const assignedUserIds = new Set(
    scheduleBlocks
      .filter((b) => toLocalDateString(new Date(b.start_time)) === dateStr)
      .map((b) => b.user_id),
  );

  // final assignable users
  return teamMembers.filter(
    (member) =>
      !busyUserIds.has(member.user_id) && !assignedUserIds.has(member.user_id),
  );
}
