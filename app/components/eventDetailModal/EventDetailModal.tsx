import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserShift } from "@/lib/types/dbexports";

type Props = {
  shift: UserShift | null;
  onClose: () => void;
};

const EventDetailModal = ({ shift, onClose }: Props) => {
  if (!shift) return null;

  const date = new Date(shift.start_time).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const dayShort = new Date(shift.start_time)
    .toLocaleDateString(undefined, { weekday: "short" })
    .toUpperCase();
  const dayNum = new Date(shift.start_time).getDate();
  const monthYear = new Date(shift.start_time)
    .toLocaleDateString(undefined, { month: "short", year: "numeric" })
    .toUpperCase();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&display=swap');

        .edm-modal {
          background: #0e0e0e !important;
          border: 1px solid rgba(255,255,255,0.08) !important;
          border-radius: 0 !important;
          box-shadow: 0 0 0 1px rgba(250,204,21,0.05), 0 24px 60px rgba(0,0,0,0.8) !important;
          padding: 0 !important;
          max-width: 380px !important;
          font-family: 'DM Mono', monospace;
          overflow: hidden !important;
        }

        .edm-header {
          padding: 20px 24px 18px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.02);
          position: relative;
        }

        .edm-eyebrow {
          font-size: 9px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #facc15;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .edm-eyebrow::before {
          content: '';
          display: block;
          width: 16px;
          height: 1px;
          background: #facc15;
        }

        .edm-team {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 36px;
          color: #f5f0e8;
          letter-spacing: 0.03em;
          line-height: 1;
        }

        .edm-role-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 10px;
        }

        .edm-role-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .edm-role-name {
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .edm-body {
          padding: 20px 24px 24px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        /* Date block */
        .edm-date-block {
          display: flex;
          align-items: stretch;
          gap: 0;
          border: 1px solid rgba(255,255,255,0.45);
          overflow: hidden;
        }

        .edm-date-cal {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 14px 18px;
          background: rgba(250,204,21,0.06);
          border-right: 1px solid rgba(255,255,255,0.06);
          min-width: 64px;
          gap: 2px;
        }

        .edm-date-day-short {
          font-size: 9px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #facc15;
        }

        .edm-date-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 36px;
          color: #f5f0e8;
          line-height: 1;
          letter-spacing: 0.02em;
        }

        .edm-date-month {
          font-size: 9px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.73);
        }

        .edm-date-label-wrap {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 14px 16px;
          gap: 4px;
        }

        .edm-date-label-tag {
          font-size: 9px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.72);
        }

        .edm-date-label-full {
          font-size: 11px;
          letter-spacing: 0.06em;
          color: rgba(255,255,255,0.5);
        }

        /* Profile block */
        .edm-profile-block {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 16px;
          border: 1px solid rgba(255,255,255,0.45);
          background: rgba(255,255,255,0.01);
          margin-top: 2px;
        }

        .edm-avatar {
          width: 36px;
          height: 36px;
          border-radius: 0;
          object-fit: cover;
          flex-shrink: 0;
          border: 1px solid rgba(255,255,255,0.08);
        }

        .edm-avatar-placeholder {
          width: 36px;
          height: 36px;
          flex-shrink: 0;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 16px;
          color: rgba(255,255,255,0.42);
          letter-spacing: 0.06em;
        }

        .edm-profile-info {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .edm-profile-tag {
          font-size: 9px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.72);
        }

        .edm-profile-name {
          font-size: 12px;
          letter-spacing: 0.06em;
          color: #f5f0e8;
        }

        .edm-unassigned {
          font-size: 10px;
          letter-spacing: 0.1em;
          color: rgba(255,255,255,0.65);
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .edm-unassigned::before {
          content: '○';
          font-size: 10px;
        }
      `}</style>

      <Dialog open={!!shift} onOpenChange={onClose}>
        <DialogTitle />
        <DialogContent className="edm-modal p-0">
          <div className="edm-header">
            <p className="edm-eyebrow">Shift Detail</p>
            <h2 className="edm-team">{shift.teams?.name}</h2>

            {shift.roles?.name && (
              <div className="edm-role-row">
                <span
                  className="edm-role-dot"
                  style={{ background: shift.roles.color ?? "#facc15" }}
                />
                <span
                  className="edm-role-name"
                  style={{
                    color: shift.roles.color ?? "rgba(255,255,255,0.4)",
                  }}
                >
                  {shift.roles.name}
                </span>
              </div>
            )}
          </div>

          <div className="edm-body">
            {/* Date */}
            <div className="edm-date-block">
              <div className="edm-date-cal">
                <span className="edm-date-day-short">{dayShort}</span>
                <span className="edm-date-num">{dayNum}</span>
                <span className="edm-date-month">{monthYear}</span>
              </div>
              <div className="edm-date-label-wrap">
                <span className="edm-date-label-tag">Shift Date</span>
                <span className="edm-date-label-full">{date}</span>
              </div>
            </div>

            {/* Assigned User */}
            <div className="edm-profile-block">
              {shift.profiles ? (
                <>
                  {shift.profiles.avatar_url ? (
                    <img
                      src={shift.profiles.avatar_url}
                      alt={shift.profiles.display_name ?? ""}
                      className="edm-avatar"
                    />
                  ) : (
                    <div className="edm-avatar-placeholder">
                      {(shift.profiles.display_name ?? "?")[0].toUpperCase()}
                    </div>
                  )}
                  <div className="edm-profile-info">
                    <span className="edm-profile-tag">Assigned</span>
                    <span className="edm-profile-name">
                      {shift.profiles.display_name}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="edm-avatar-placeholder">?</div>
                  <span className="edm-unassigned">Unassigned</span>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EventDetailModal;
