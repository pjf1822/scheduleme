import { ShiftWithProfile, TeamMember, TeamRoles } from "@/lib/types/dbexports";
import { assignShiftAction, deleteShiftAction } from "../../actions/shifts";
import { groupShiftsByRole } from "@/lib/utils/shifts/groupShiftsByRole";
import { MemberAvatar } from "../uiPieces/MemberAvatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
type Props = {
  shifts: ShiftWithProfile[];
  roles: TeamRoles[];
  availableMembers: TeamMember[];
  onShiftAssigned: (updatedShift: ShiftWithProfile) => void;
  onShiftDeleted: (shiftId: string) => void;
};
export const AddMemberToRole = ({
  shifts,
  roles,
  availableMembers,
  onShiftAssigned,
  onShiftDeleted,
}: Props) => {
  const grouped = groupShiftsByRole(shifts, roles);

  const handleAssign = async (shiftId: string, user_id: string) => {
    const value = user_id === "unassigned" ? null : user_id;
    const updatedShift = await assignShiftAction(shiftId, value);
    onShiftAssigned(updatedShift);
  };

  const assignedUserIds = new Set(
    shifts.map((shift) => shift.assigned_user_id).filter(Boolean),
  );

  const handleDelete = async (shiftId: string) => {
    await deleteShiftAction(shiftId);
    onShiftDeleted(shiftId);
  };
  return (
    <div className="border-t pt-4 space-y-4">
      <h3 className="font-semibold text-white">Assign Members to Roles</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...grouped.entries()].map(([roleName, { color, shifts }]) => (
          <div
            key={roleName}
            className="border rounded-lg p-4 space-y-2 bg-[var(--brand-4)]"
          >
            <div className="flex items-center gap-2">
              {color && (
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: color }}
                />
              )}
              <h4 className="font-medium">{roleName}</h4>
            </div>

            <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
              {shifts.map((shift: any) => (
                <div key={shift.id} className="flex items-center gap-2 py-2 ">
                  {shift.assigned_user_id ? (
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 border border-green-300">
                      Filled
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 border border-gray-300">
                      Open
                    </span>
                  )}

                  <Select
                    value={shift.assigned_user_id ?? "unassigned"}
                    onValueChange={(val) => handleAssign(shift.id, val)}
                  >
                    <SelectTrigger className="w-[220px] border border-gray-300 rounded-md bg-white hover:border-gray-400 focus:ring-2 focus:ring-neutral-300">
                      <SelectValue placeholder="Assign member" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      {shift.assigned_user_id &&
                        !availableMembers.some(
                          (m) => m.user_id === shift.assigned_user_id,
                        ) && (
                          <SelectItem value={shift.assigned_user_id}>
                            <div className="flex items-center gap-2">
                              {shift.profiles?.avatar_url && (
                                <MemberAvatar member={shift} size="sm" />
                              )}
                              <span>{shift.profiles.display_name}</span>
                            </div>
                          </SelectItem>
                        )}
                      {availableMembers
                        .filter(
                          (member) =>
                            !assignedUserIds.has(member.user_id) ||
                            member.user_id === shift.assigned_user_id,
                        )
                        .map((member) => (
                          <SelectItem
                            key={member.id}
                            value={member.user_id ?? ""}
                          >
                            <div className="flex items-center gap-2">
                              {member?.profiles?.avatar_url && (
                                <MemberAvatar member={member} size="sm" />
                              )}
                              <span>{member?.profiles?.display_name}</span>
                            </div>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <button
                    onClick={() => handleDelete(shift.id)}
                    className="ml-auto w-[25px] text-red-400 hover:text-red-600 text-s border border-red-300 p-1 rounded-lg"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
