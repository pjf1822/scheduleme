import { BusyBlock, ShiftWithProfile, TeamMember } from "@/lib/types/dbexports";

export function getAvailableMembers(
  teamMembers: TeamMember[],
  shifts: ShiftWithProfile[],
  busyBlocks: BusyBlock[],
  selectedDate: string | null,
) {
  const assignedUserIds = new Set(
    shifts.map((shift) => shift.assigned_user_id).filter(Boolean),
  );

  return teamMembers.filter(
    (member) =>
      !assignedUserIds.has(member.user_id) &&
      !busyBlocks.some(
        (block) =>
          block.user_id === member.user_id &&
          new Date(block.start_time).toISOString().split("T")[0] ===
            selectedDate,
      ),
  );
}
