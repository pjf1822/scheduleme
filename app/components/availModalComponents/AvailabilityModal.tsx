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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&display=swap');

        .modal-overlay [role="dialog"] {
          font-family: 'DM Mono', monospace !important;
        }

        .avail-modal {
          background: #0e0e0e !important;
          border: 1px solid rgba(255,255,255,0.08) !important;
          border-radius: 0 !important;
          box-shadow: 0 0 0 1px rgba(250,204,21,0.06), 0 32px 80px rgba(0,0,0,0.8) !important;
          padding: 0 !important;
          max-width: min(95vw, 900px) !important;
          max-height: 90vh !important;
          overflow: hidden !important;
          display: flex !important;
          flex-direction: column !important;
          font-family: 'DM Mono', monospace;
        }

        .avail-modal-scroll {
          overflow-y: auto;
          flex: 1;
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.08) transparent;
        }

        .avail-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 28px 18px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.02);
          flex-shrink: 0;
        }

        .avail-modal-eyebrow {
          font-size: 9px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #facc15;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }

        .avail-modal-eyebrow::before {
          content: '';
          display: block;
          width: 18px;
          height: 1px;
          background: #facc15;
        }

        .avail-modal-date {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 36px;
          color: #f5f0e8;
          letter-spacing: 0.04em;
          line-height: 1;
        }

        .avail-modal-date span { color: #facc15; }

        .avail-modal-counts {
          display: flex;
          gap: 1px;
          flex-shrink: 0;
        }

        .avail-count-chip {
          padding: 8px 14px;
          border: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.015);
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 60px;
          text-align: center;
        }

        .avail-count-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 24px;
          line-height: 1;
          color: #f5f0e8;
        }

        .avail-count-num.green { color: #4ade80; }
        .avail-count-num.red { color: #f87171; }

        .avail-count-label {
          font-size: 8px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.2);
        }

        .avail-modal-body {
          padding: 14px 18px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        /* Section wrapper */
        .avail-section {
          border: 1px solid rgba(255,255,255,0.05);
          background: rgba(255,255,255,0.01);
          overflow: hidden;
          margin-bottom: 2px;
          padding:10px
        }

        .avail-section-label {
          padding: 10px 18px;
          border-bottom: 1px solid rgba(255,255,255,0.4);
          background: rgba(255,255,255,0.02);
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .avail-section-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 16px;
          color: #facc15;
          letter-spacing: 0.1em;
          opacity: 0.5;
        }

        .avail-section-title {
          font-size: 16px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.99);
        }

        .avail-section-line {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.04);
        }

        .avail-section-content {
          padding: 18px 18px;
        }

        /* Members grid */
        .avail-members-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2px;
        }

        .avail-members-col {
          border: 1px solid rgba(255,255,255,0.05);
          background: rgba(255,255,255,0.01);
          overflow: hidden;
        }

        .avail-members-col-header {
          padding: 10px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          background: rgba(255,255,255,0.02);
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .avail-members-col-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .avail-members-col-dot.available { background: #4ade80; }
        .avail-members-col-dot.unavailable { background: #f87171; opacity: 0.6; }

        .avail-members-col-title {
          font-size: 13px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.75);
        }

        .avail-members-col-content {
          padding: 14px 14px;
        }

        .avail-all-busy {
          font-size: 13px;
          letter-spacing: 0.1em;
          color: rgba(255,255,255,0.72);
          padding: 12px 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .avail-all-busy::before { content: '—'; color: #facc15; opacity: 0.5; }

        @media (max-width: 600px) {
          .avail-modal-header { padding: 16px 18px; flex-wrap: wrap; gap: 12px; }
          .avail-modal-body { padding: 16px 14px; }
          .avail-members-grid { grid-template-columns: 1fr; }
        }
      `}</style>
      <Dialog open={!!selectedDate} onOpenChange={onClose} modal={false}>
        <DialogContent
          className="  avail-modal p-0
     fixed     fixed left-[50%] top-1/2
 -translate-x-1/2 -translate-y-1/2

   max-w-[95vw]
    sm:max-w-6xl
    max-h-[90vh]
     max-h-[90vh] overflow-y-auto bg-[var(--brand-1)] border border-[color-mix(in_srgb,var(--brand-3)_40%,transparent)] shadow-xl"
        >
          <div className="avail-modal-header">
            <div>
              <p className="avail-modal-eyebrow">Daily View</p>
              <DialogTitle className="avail-modal-date">
                {selectedDate?.split(" ")[0]}{" "}
                <span>{selectedDate?.split(" ").slice(1).join(" ")}</span>
              </DialogTitle>
            </div>
            <div className="avail-modal-counts">
              <div className="avail-count-chip">
                <span className="avail-count-num green">
                  {availableMembers.length}
                </span>
                <span className="avail-count-label">Avail</span>
              </div>
              <div className="avail-count-chip">
                <span className="avail-count-num">{shifts.length}</span>
                <span className="avail-count-label">Shifts</span>
              </div>
              <div className="avail-count-chip">
                <span className="avail-count-num red">
                  {unavailableMembers.length}
                </span>
                <span className="avail-count-label">Busy</span>
              </div>
            </div>
          </div>
          <div className="avail-modal-scroll">
            <div className="avail-modal-body">
              {/* Create Shift */}
              <div className="avail-section">
                <div className="avail-section-label">
                  <span className="avail-section-num">01</span>
                  <span className="avail-section-title">Create Shift</span>
                  <div className="avail-section-line" />
                </div>
                <div className="avail-section-content"></div>
                <CreateShift
                  selectedDate={selectedDate}
                  teamId={teamId}
                  roles={roles}
                  onShiftCreated={onShiftCreated}
                />
              </div>
            </div>

            {shifts.length > 0 && (
              <div className="avail-section">
                <div className="avail-section-label">
                  <span className="avail-section-num">02</span>
                  <span className="avail-section-title">Assign Members</span>
                  <div className="avail-section-line" />
                </div>
                <div className="avail-section-content">
                  <AddMemberToRole
                    onShiftDeleted={onShiftDeleted}
                    shifts={shifts}
                    roles={roles}
                    availableMembers={availableMembers}
                    onShiftAssigned={onShiftAssigned}
                  />
                </div>
              </div>
            )}

            <div className="avail-members-grid">
              <div className="avail-members-col">
                <div className="avail-members-col-header">
                  <span className="avail-members-col-dot available" />
                  <span className="avail-members-col-title">Available</span>
                </div>
                <div className="avail-members-col-content">
                  {availableMembers.length === 0 ? (
                    <p className="avail-all-busy">All members are working</p>
                  ) : (
                    <ModalMembersSection
                      members={availableMembers}
                      title="Available"
                    />
                  )}
                </div>
              </div>

              <div className="avail-members-col">
                <div className="avail-members-col-header">
                  <span className="avail-members-col-dot unavailable" />
                  <span className="avail-members-col-title">Unavailable</span>
                </div>
                <div className="avail-members-col-content">
                  {unavailableMembers.length === 0 ? (
                    <p className="avail-all-busy">No one is unavailable</p>
                  ) : (
                    <ModalMembersSection
                      members={unavailableMembers}
                      title="Unavailable"
                      variant="unavailable"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AvailabilityModal;
