"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Shifts, TeamMember, TeamRoles } from "@/lib/types/dbexports";
import { AddMemberToRole } from "./AddMemberToRole";
import CreateShift from "./CreateShift";
import ModalMembersSection from "./ModalMembersSection";

type Props = {
  selectedDate: string | null;
  availableMembers: TeamMember[];

  onClose: () => void;
  teamId: string;
  roles: TeamRoles[];
  shifts: Shifts[];
  onShiftCreated: (newShifts: Shifts[]) => void;
  onShiftAssigned: (updatedShift: Shifts) => void;
  unavailableMembers: TeamMember[];
};

const AvailabilityModal = ({
  selectedDate,
  availableMembers,
  unavailableMembers,
  onClose,
  teamId,
  roles,
  shifts,
  onShiftCreated,
  onShiftAssigned,
}: Props) => {
  return (
    <Dialog open={!!selectedDate} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">{selectedDate}</DialogTitle>
        </DialogHeader>
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
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            {availableMembers.length === 0 ? (
              <p>Every who is available is already working this day. </p>
            ) : (
              <ModalMembersSection
                members={availableMembers}
                title="Available"
              />
            )}
          </div>

          <div>
            {unavailableMembers.length > 0 && (
              <ModalMembersSection
                members={unavailableMembers}
                title="Unavailable"
                variant="unavailable"
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AvailabilityModal;
