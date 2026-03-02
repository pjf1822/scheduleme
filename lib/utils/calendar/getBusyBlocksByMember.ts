import { BusyBlock, TeamMember } from "@/lib/types/dbexports";

export function getBusyBlocksByMember(
  teamMembers: TeamMember[],
  busyBlocks: BusyBlock[],
) {
  return teamMembers.map((member) => ({
    member,
    blocks: busyBlocks.filter((block) => block.user_id === member.user_id),
  }));
}
