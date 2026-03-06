import { ShiftWithProfile, TeamRoles } from "@/lib/types/dbexports";

type RoleGroup = {
  color: string | null;
  shifts: ShiftWithProfile[];
};

export function groupShiftsByRole(
  shifts: ShiftWithProfile[],
  roles: TeamRoles[],
): Map<string, RoleGroup> {
  const map = new Map<string, RoleGroup>();

  shifts.forEach((shift) => {
    const role = roles.find((r) => r.id === shift.role_id);
    if (!role) return;

    if (!map.has(role.name)) {
      map.set(role.name, { color: role.color ?? null, shifts: [] });
    }

    map.get(role.name)!.shifts.push(shift);
  });

  return map;
}
