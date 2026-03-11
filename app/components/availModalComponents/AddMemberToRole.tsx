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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&display=swap');

        .amr-wrap {
          font-family: 'DM Mono', monospace;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .amr-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 2px;
        }

        /* Role column */
        .amr-role-col {
          border: 1px solid rgba(255,255,255,0.05);
          background: rgba(255,255,255,0.01);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .amr-role-header {
          padding: 10px 14px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          background: rgba(255,255,255,0.025);
          display: flex;
          align-items: center;
          gap: 8px;
          position: relative;
        }

        .amr-role-bar {
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 2px;
        }

        .amr-role-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .amr-role-name {
          font-size: 12px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .amr-role-count {
          margin-left: auto;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 14px;
          color: rgba(255,255,255,0.75);
          letter-spacing: 0.06em;
          flex-shrink: 0;
        }

        /* Shift rows */
        .amr-shifts {
          display: flex;
          flex-direction: column;
          gap: 1px;
          padding: 8px;
          max-height: 220px;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.06) transparent;
        }

        .amr-shift-row {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 7px 8px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.04);
          transition: border-color 0.15s;
        }

        .amr-shift-row:hover {
          border-color: rgba(255,255,255,0.08);
        }

        /* Status pip */
        .amr-status {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .amr-status.filled { background: #4ade80; }
        .amr-status.open {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.2);
        }

        /* Native select */
        .amr-select-wrap {
          position: relative;
          flex: 1;
          min-width: 0;
        }

        .amr-select {
          width: 100%;
          appearance: none;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          color: #f5f0e8;
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.05em;
          padding: 6px 24px 6px 8px;
          outline: none;
          cursor: pointer;
          transition: border-color 0.15s;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .amr-select:focus {
          border-color: rgba(250,204,21,0.3);
        }

        .amr-select option {
          background: #111;
          color: #f5f0e8;
        }

        .amr-select-arrow {
          position: absolute;
          right: 7px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: rgba(255,255,255,0.18);
          font-size: 9px;
        }

        /* Delete button */
        .amr-delete {
          width: 22px;
          height: 22px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: 1px solid #ff000075;
          color: red;
          font-size: 9px;
          cursor: pointer;
          transition: border-color 0.15s, color 0.15s, background 0.15s;
          padding: 0;
          line-height: 1;
        }

        .amr-delete:hover {
          border-color: rgba(248,113,113,0.4);
          color: #f87171;
          background: rgba(248,113,113,0.06);
        }
      `}</style>

      <div className="amr-wrap">
        <div className="amr-grid">
          {[...grouped.entries()].map(([roleName, { color, shifts }]) => {
            const filledCount = shifts.filter(
              (s: any) => s.assigned_user_id,
            ).length;

            return (
              <div key={roleName} className="amr-role-col">
                <div className="amr-role-header">
                  <div
                    className="amr-role-bar"
                    style={{ background: color ?? "#facc15" }}
                  />
                  <span
                    className="amr-role-dot"
                    style={{ background: color ?? "#facc15" }}
                  />
                  <span className="amr-role-name">{roleName}</span>
                  <span className="amr-role-count">
                    {filledCount}/{shifts.length}
                  </span>
                </div>

                <div className="amr-shifts">
                  {shifts.map((shift: any) => {
                    const isFilled = !!shift.assigned_user_id;
                    return (
                      <div key={shift.id} className="amr-shift-row">
                        <span
                          className={`amr-status ${isFilled ? "filled" : "open"}`}
                        />
                        <div className="amr-select-wrap">
                          <select
                            className="amr-select"
                            value={shift.assigned_user_id ?? "unassigned"}
                            onChange={(e) =>
                              handleAssign(shift.id, e.target.value)
                            }
                          >
                            <option value="unassigned">Unassigned</option>

                            {shift.assigned_user_id &&
                              !availableMembers.some(
                                (m) => m.user_id === shift.assigned_user_id,
                              ) && (
                                <option value={shift.assigned_user_id}>
                                  {shift.profiles?.display_name ?? "Unknown"}
                                </option>
                              )}
                            {availableMembers
                              .filter(
                                (member) =>
                                  !assignedUserIds.has(member.user_id) ||
                                  member.user_id === shift.assigned_user_id,
                              )
                              .map((member) => (
                                <option
                                  key={member.id}
                                  value={member.user_id ?? ""}
                                >
                                  {member?.profiles?.display_name}
                                </option>
                              ))}
                          </select>
                          <span className="amr-select-arrow">▾</span>
                        </div>
                        <button
                          title="Delete shift"
                          onClick={() => handleDelete(shift.id)}
                          className="amr-delete"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
