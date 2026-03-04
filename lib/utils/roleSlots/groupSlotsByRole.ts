import { TeamRoles, RoleSlots } from "@/lib/types/dbexports";

export function groupSlotsByRole(
  roleSlots: RoleSlots[],
  roles: TeamRoles[],
): Map<string, RoleSlots[]> {
  const map = new Map<string, RoleSlots[]>();

  roleSlots.forEach((slot) => {
    const role = roles.find((r) => r.id === slot.role_id);
    if (!role) return;

    let slots = map.get(role.name);

    if (!slots) {
      slots = [];
      map.set(role.name, slots);
    }

    slots.push(slot);
  });

  return map;
}
