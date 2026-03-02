"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TeamMember, TeamSchedule } from "@/lib/types/dbexports";
import { assignTeamScheduleBlockAction } from "../actions/assignTeamScheduleBlock";
import { createBlockFromDate } from "@/lib/utils/calendar/createBlockFromData";

type Props = {
  selectedDate: string | null;
  availableMembers: TeamMember[];
  onClose: () => void;
  teamId: string;
  onAssign: (newBlock: TeamSchedule) => void;
};

const AvailabilityModal = ({
  selectedDate,
  availableMembers,
  onClose,
  teamId,
  onAssign,
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

  return (
    <Dialog open={!!selectedDate} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Available on {selectedDate}</DialogTitle>
        </DialogHeader>

        {availableMembers.length === 0 ? (
          <p>No members available on this date</p>
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
      </DialogContent>
    </Dialog>
  );
};

export default AvailabilityModal;
