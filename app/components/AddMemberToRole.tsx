import { Shifts, TeamMember, TeamRoles } from "@/lib/types/dbexports";
import { groupShiftsByRole } from "@/lib/utils/roleSlots/groupSlotsByRole";
import { assignShiftAction } from "../actions/shifts/shiftActions";
type Props = {
  shifts: Shifts[];
  roles: TeamRoles[];
  availableMembers: TeamMember[];
};
export const AddMemberToRole = ({ shifts, roles, availableMembers }: Props) => {
  const grouped = groupShiftsByRole(shifts, roles);

  const handleAssign = async (shiftId: string, user_id: string) => {
    const value = user_id === "" ? null : user_id;

    await assignShiftAction(shiftId, value);
  };

  const assignedUserIds = new Set(
    shifts.map((shift) => shift.assigned_user_id).filter(Boolean),
  );
  return (
    <div className="border-t pt-4 space-y-4">
      <h3 className="font-semibold">Assign Members to Roles</h3>

      {[...grouped.entries()].map(([roleName, shifts]) => (
        <div key={roleName}>
          <h4 className="font-medium">{roleName}</h4>

          {shifts.map((shift: any) => (
            <div key={shift.id} className="flex gap-2 items-center">
              <span className="text-sm w-24">
                {shift.assigned_user_id ? "Filled" : "Open"}
              </span>

              <select
                value={shift.assigned_user_id ?? ""}
                onChange={(e) => handleAssign(shift.id, e.target.value)}
                className="border px-2 py-1"
              >
                <option value="">Unassigned</option>
                {shift.assigned_user_id &&
                  !availableMembers.some(
                    (m) => m.user_id === shift.assigned_user_id,
                  ) && (
                    <option value={shift.assigned_user_id}>
                      {shift.assigned_user_id}
                    </option>
                  )}
                {availableMembers
                  .filter(
                    (member) =>
                      !assignedUserIds.has(member.user_id) ||
                      member.user_id === shift.assigned_user_id,
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
