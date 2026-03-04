"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  RoleSlots,
  TeamMember,
  TeamRoles,
  TeamSchedule,
} from "@/lib/types/dbexports";
import { assignTeamScheduleBlockAction } from "../actions/teamSchedule/assignTeamScheduleBlock";
import { createBlockFromDate } from "@/lib/utils/dates/createBlockFromDate";
import AssignedMembersModalList from "./AssignedMembersModalList";
import { removeTeamScheduleBlockAction } from "../actions/teamSchedule/removeTeamScheduleBlockAction";
import RoleAssignment from "./RoleAssignment";
import { AddMemberToRole } from "./AddMemberToRole";

type Props = {
  selectedDate: string | null;
  availableMembers: TeamMember[];
  assignedMembers: TeamSchedule[];
  onClose: () => void;
  teamId: string;
  onAssign: (newBlock: TeamSchedule) => void;
  onRemove: (blockId: string) => void;
  roles: TeamRoles[];
  roleSlots: any[];
  setRoleSlots: React.Dispatch<React.SetStateAction<RoleSlots[]>>;
};

const AvailabilityModal = ({
  selectedDate,
  availableMembers,
  assignedMembers,
  onClose,
  teamId,
  onAssign,
  onRemove,
  roles,
  roleSlots,
  setRoleSlots,
}: Props) => {
  const handleAssign = async (member: TeamMember) => {
    if (!selectedDate) return;
    const { start_time, end_time } = createBlockFromDate(selectedDate);

    const newBlock = await assignTeamScheduleBlockAction(
      member.user_id,
      teamId,
      start_time,
      end_time,
    );
    onAssign(newBlock);
    onClose();
  };
  const handleRemove = async (block: TeamSchedule) => {
    await removeTeamScheduleBlockAction(block.id);

    onRemove(block.id);
  };

  return (
    <Dialog open={!!selectedDate} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Available on {selectedDate}</DialogTitle>
        </DialogHeader>
        {availableMembers.length === 0 ? (
          <p>No members more available on this date</p>
        ) : (
          <ul className="space-y-2">
            {availableMembers.map((member) => (
              <li
                key={member.id}
                className="p-2 border rounded flex justify-between items-center"
              >
                <span>{member.user_id}</span>
                <button
                  className="text-sm border rounded px-2 py-1"
                  onClick={() => handleAssign(member)}
                >
                  Assign
                </button>
              </li>
            ))}
          </ul>
        )}
        <AssignedMembersModalList
          assignedMembers={assignedMembers}
          onRemove={handleRemove}
        />
        <RoleAssignment
          selectedDate={selectedDate}
          teamId={teamId}
          roles={roles}
        />
        <AddMemberToRole
          roleSlots={roleSlots}
          roles={roles}
          availableMembers={availableMembers}
          onAssigned={(slotId, userId) => {
            setRoleSlots((prev) =>
              prev.map((slot) =>
                slot.id === slotId
                  ? { ...slot, assigned_user_id: userId || null }
                  : slot,
              ),
            );
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AvailabilityModal;
