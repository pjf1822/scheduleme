import { TeamMember } from "@/lib/types/dbexports";
import { MemberAvatar } from "../uiPieces/MemberAvatar";

type Props = {
  members: TeamMember[];
  title: string;
  variant?: "available" | "unavailable";
};

const ModalMembersSection = ({
  members,
  title,
  variant = "available",
}: Props) => {
  const isUnavailable = variant === "unavailable";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&display=swap');

        .mms-wrap {
          font-family: 'DM Mono', monospace;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .mms-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .mms-member {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          border: 1px solid rgba(255,255,255,0.04);
          background: rgba(255,255,255,0.01);
          transition: background 0.15s, border-color 0.15s;
          position: relative;
        }

        .mms-member.available {
          border-left: 2px solid rgba(74,222,128,0.3);
        }

        .mms-member.unavailable {
          border-left: 2px solid rgba(248,113,113,0.2);
          opacity: 0.55;
        }

        .mms-member.available:hover {
          background: rgba(74,222,128,0.03);
          border-color: rgba(74,222,128,0.15);
        }

        .mms-avatar-wrap {
          flex-shrink: 0;
          position: relative;
        }

        .mms-avatar-wrap.unavailable {
          filter: grayscale(1);
        }

        .mms-status-pip {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          border: 1px solid #0e0e0e;
        }

        .mms-status-pip.available { background: #4ade80; }
        .mms-status-pip.unavailable { background: #f87171; }

        .mms-name {
          font-size: 14px;
          letter-spacing: 0.07em;
          color: rgba(255,255,255,0.55);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex: 1;
          min-width: 0;
        }

        .mms-member.available .mms-name {
          color: rgba(255,255,255,0.7);
        }
      `}</style>

      <div className="mms-wrap">
        <ul className="mms-list">
          {members.map((member) => (
            <li
              key={member.id}
              className={`mms-member ${isUnavailable ? "unavailable" : "available"}`}
            >
              <div
                className={`mms-avatar-wrap ${isUnavailable ? "unavailable" : ""}`}
              >
                <MemberAvatar member={member} size="xl" />
                <span
                  className={`mms-status-pip ${isUnavailable ? "unavailable" : "available"}`}
                />
              </div>

              <span className="mms-name">{member?.profiles?.display_name}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default ModalMembersSection;
