"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ShiftWithProfile, TeamMember, TeamRoles } from "@/lib/types/dbexports";
import { AddMemberToRole } from "./AddMemberToRole";
import CreateShift from "./CreateShift";
import ModalMembersSection from "./ModalMembersSection";

type Props = {
  selectedDate: string | null;
  availableMembers: TeamMember[];

  onClose: () => void;
  teamId: string;
  roles: TeamRoles[];
  shifts: ShiftWithProfile[];
  onShiftCreated: (newShifts: ShiftWithProfile[]) => void;
  onShiftAssigned: (updatedShift: ShiftWithProfile) => void;
  unavailableMembers: TeamMember[];
  onShiftDeleted: (shiftId: string) => void;
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
  onShiftDeleted,
}: Props) => {
  return (
    <Dialog open={!!selectedDate} onOpenChange={onClose} modal={false}>
      <DialogContent
        className=" 
     fixed     fixed left-[50%] top-1/2
 -translate-x-1/2 -translate-y-1/2

   max-w-[95vw]
    sm:max-w-6xl
    max-h-[90vh]
     max-h-[90vh] overflow-y-auto bg-[var(--brand-1)] border border-[color-mix(in_srgb,var(--brand-3)_40%,transparent)] shadow-xl"
      >
        <DialogHeader>
          <DialogTitle className="text-center text-white">
            {selectedDate}
          </DialogTitle>
        </DialogHeader>
        <CreateShift
          selectedDate={selectedDate}
          teamId={teamId}
          roles={roles}
          onShiftCreated={onShiftCreated}
        />
        {shifts.length > 0 && (
          <AddMemberToRole
            onShiftDeleted={onShiftDeleted}
            shifts={shifts}
            roles={roles}
            availableMembers={availableMembers}
            onShiftAssigned={onShiftAssigned}
          />
        )}
        <div className="grid md:grid-cols-2 gap-6 bg-[var(--brand-4)] p-3 rounded-lg border border-[var(--brand-3)] border-4">
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
