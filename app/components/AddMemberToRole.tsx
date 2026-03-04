import { TeamMember, TeamRoles } from "@/lib/types/dbexports";
import { assignRoleSlotAction } from "../actions/roleSlots/roleSlotActions";
import { groupSlotsByRole } from "@/lib/utils/roleSlots/groupSlotsByRole";
type Props = {
  roleSlots: any[];
  roles: TeamRoles[];
  availableMembers: TeamMember[];
  onAssigned: (slotId: string, userId: string | null) => void;
};
export const AddMemberToRole = ({
  roleSlots,
  roles,
  availableMembers,
  onAssigned,
}: Props) => {
  const grouped = groupSlotsByRole(roleSlots, roles);

  const handleAssign = async (slotId: string, user_id: string) => {
    const value = user_id === "" ? null : user_id;

    await assignRoleSlotAction(slotId, value);
    onAssigned(slotId, value);
  };
  const assignedUserIds = new Set(
    roleSlots.map((slot) => slot.assigned_user_id).filter(Boolean),
  );
  return (
    <div className="border-t pt-4 space-y-4">
      <h3 className="font-semibold">Assign Members to Roles</h3>

      {[...grouped.entries()].map(([roleName, slots]) => (
        <div key={roleName}>
          <h4 className="font-medium">{roleName}</h4>

          {slots.map((slot: any) => (
            <div key={slot.id} className="flex gap-2 items-center">
              <span className="text-sm w-24">
                {slot.assigned_user_id ? "Filled" : "Open"}
              </span>

              <select
                value={slot.assigned_user_id ?? ""}
                onChange={(e) => handleAssign(slot.id, e.target.value)}
                className="border px-2 py-1"
              >
                <option value="">Unassigned</option>
                {slot.assigned_user_id &&
                  !availableMembers.some(
                    (m) => m.user_id === slot.assigned_user_id,
                  ) && (
                    <option value={slot.assigned_user_id}>
                      {slot.assigned_user_id}
                    </option>
                  )}
                {availableMembers
                  .filter(
                    (member) =>
                      !assignedUserIds.has(member.user_id) ||
                      member.user_id === slot.assigned_user_id,
                  )
                  .map((member) => (
                    <option key={member.id} value={member.user_id ?? ""}>
                      {member.user_id}
                    </option>
                  ))}
              </select>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
