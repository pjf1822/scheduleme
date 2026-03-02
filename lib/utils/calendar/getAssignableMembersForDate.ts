import { BusyBlock, TeamMember, TeamSchedule } from "@/lib/types/dbexports";
import { getAvailableMembersForDate } from "./getAvailableMembersForDate";

export function getAssignableMembersForDate(
  dateStr: string | null,
  teamMembers: TeamMember[],
  busyBlocks: BusyBlock[],
  assignedMembers: TeamSchedule[],
): TeamMember[] {
  if (!dateStr) return [];
  const assignedUserIds = new Set(assignedMembers.map((b) => b.user_id));

  const availableMembers = dateStr
    ? getAvailableMembersForDate(dateStr, teamMembers, busyBlocks).filter(
        (member) => !assignedUserIds.has(member.user_id),
      )
    : [];
  return availableMembers;
}
