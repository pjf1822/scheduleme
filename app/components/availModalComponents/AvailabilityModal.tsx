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
import Image from "next/image";
import UnavailableMembers from "./UnavailableMembers";

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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Available on {selectedDate}</DialogTitle>
        </DialogHeader>
        {availableMembers.length === 0 ? (
          <p>No members more available on this date</p>
        ) : (
          <ul className="flex gap-3 overflow-x-auto pb-2">
            {availableMembers.map((member) => (
              <li
                key={member.id}
                className="flex-shrink-0 flex flex-col items-center gap-2 p-3 border rounded w-24"
              >
                <Image
                  src={member?.profiles?.avatar_url || "/default-avatar.png"}
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                  alt="avatar"
                />

                <span className="text-sm text-center">
                  {member?.profiles?.display_name}
                </span>
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
        {unavailableMembers.length > 0 && (
          <UnavailableMembers unavailableMembers={unavailableMembers} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AvailabilityModal;
