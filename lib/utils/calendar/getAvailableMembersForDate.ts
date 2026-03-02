import { BusyBlock, TeamMember } from "@/lib/types/dbexports";

export function getAvailableMembersForDate(
  dateStr: string,
  teamMembers: TeamMember[],
  busyBlocks: BusyBlock[],
) {
  return teamMembers.filter((member) => {
    const memberBlocks = busyBlocks.filter(
      (block) => block.user_id === member.user_id,
    );
    return !memberBlocks.some(
      (block) =>
        new Date(block.start_time).toISOString().split("T")[0] === dateStr,
    );
  });
}
