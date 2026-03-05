"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Shifts, TeamMember, TeamRoles } from "@/lib/types/dbexports";
import { AddMemberToRole } from "./AddMemberToRole";
import CreateShift from "./shifts/CreateShift";

type Props = {
  selectedDate: string | null;
  availableMembers: TeamMember[];
  onClose: () => void;
  teamId: string;
  roles: TeamRoles[];
  shifts: Shifts[];
  onShiftCreated: (newShifts: Shifts[]) => void;
  onShiftAssigned: (updatedShift: Shifts) => void;
};

const AvailabilityModal = ({
  selectedDate,
  availableMembers,
  onClose,
  teamId,
  roles,
  shifts,
  onShiftCreated,
  onShiftAssigned,
}: Props) => {
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
              </li>
            ))}
          </ul>
        )}

        <CreateShift
          selectedDate={selectedDate}
          teamId={teamId}
          roles={roles}
          onShiftCreated={onShiftCreated}
        />
        {shifts.length > 0 && (
          <AddMemberToRole
            shifts={shifts}
            roles={roles}
            availableMembers={availableMembers}
            onShiftAssigned={onShiftAssigned}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AvailabilityModal;
