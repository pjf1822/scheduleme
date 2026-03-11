import { TeamMember } from "@/lib/types/dbexports";
import { MemberAvatar } from "../uiPieces/MemberAvatar";

type Props = {
  teamMembers: TeamMember[];
  adminUserId: string | null;
};
const TeamMemberList = ({ teamMembers, adminUserId }: Props) => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&display=swap');

        .member-list-wrap {
          font-family: 'DM Mono', monospace;
        }

        .member-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .member-row {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 14px 18px;
          border: 1px solid rgba(255,255,255,0.05);
          background: rgba(255,255,255,0.015);
          position: relative;
          transition: background 0.15s, border-color 0.15s;
        }

        .member-row:hover {
          background: rgba(250,204,21,0.03);
          border-color: rgba(250,204,21,0.12);
        }

        .member-row::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 2px;
          background: transparent;
          transition: background 0.15s;
        }

        .member-row:hover::before {
          background: #facc15;
        }

        .member-row.is-admin::before {
          background: #facc15;
          opacity: 0.5;
        }

        .member-index {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 13px;
          color: rgba(255,255,255,0.71);
          letter-spacing: 0.06em;
          width: 24px;
          flex-shrink: 0;
          text-align: right;
        }

        .member-info {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .member-name {
          font-size: 12px;
          letter-spacing: 0.08em;
          color: #f5f0e8;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .member-role {
          font-size: 14px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.72);
        }

        .admin-badge {
          font-size: 9px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #0a0a0a;
          background: #facc15;
          padding: 2px 8px;
          flex-shrink: 0;
          clip-path: polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px));
        }

        .member-count {
          font-size: 14px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.75);
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .member-count::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.05);
        }
      `}</style>

      <div className="member-list-wrap">
        <p className="member-count">
          {teamMembers.length} member{teamMembers.length !== 1 ? "s" : ""}
        </p>

        <ul className="member-list">
          {teamMembers.map((member, i) => {
            const isAdmin = member.user_id === adminUserId;

            return (
              <li
                key={member.id}
                className={`member-row${isAdmin ? " is-admin" : ""}`}
              >
                <span className="member-index">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <MemberAvatar
                  avatarUrl={member?.profiles?.avatar_url ?? undefined}
                  name={member?.profiles?.display_name}
                  size="lg"
                />

                <div className="member-info">
                  <span className="member-name">
                    {member.profiles?.display_name ?? "Unknown"}
                    {isAdmin && <span className="admin-badge">Admin</span>}
                  </span>
                  <span className="member-role">Team Member</span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default TeamMemberList;
