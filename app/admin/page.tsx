import { getTeamContextForUser } from "@/lib/db/teamMembers";
import { createClient } from "@/lib/supabase/server";
import TeamRolesManager from "../components/adminPage/TeamRolesManager";
import { fetchTeamRoles } from "@/lib/db/teamRoles";
import TeamMemberList from "../components/adminPage/TeamMemberList";
import InviteUsers from "../components/adminPage/InviteUsers";

const AdminPage = async () => {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();

  const userId = data?.claims.sub;
  if (!userId) throw new Error("No user id");

  const { adminMember, teamMembers, teamName } =
    await getTeamContextForUser(userId);

  const roles = await fetchTeamRoles(adminMember.team_id);
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&display=swap');

        .admin-page {
          min-height: 100svh;
          background: #0a0a0a;
          font-family: 'DM Mono', monospace;
          position: relative;
        }

        .admin-grid-overlay {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background-image:
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        .admin-inner {
          position: relative;
          z-index: 1;
          max-width: 1100px;
          margin: 0 auto;
          padding: 48px 32px 80px;
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        /* Page header */
        .admin-header {
          padding-bottom: 40px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          margin-bottom: 48px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          animation: fadeUp 0.6s ease both 0.1s;
          opacity: 0;
        }

        .admin-eyebrow {
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #facc15;
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }

        .admin-eyebrow::before {
          content: '';
          display: block;
          width: 24px;
          height: 1px;
          background: #facc15;
        }

        .admin-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(48px, 6vw, 80px);
          line-height: 0.9;
          color: #f5f0e8;
          letter-spacing: 0.02em;
        }

        .admin-title span { color: #facc15; }

        .admin-meta {
          text-align: right;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 6px;
        }

        .admin-team-name {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 28px;
          color: rgba(255,255,255,0.75);
          letter-spacing: 0.06em;
        }

        .admin-badge {
          font-size: 9px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #0a0a0a;
          background: #facc15;
          padding: 3px 10px;
          clip-path: polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px));
        }

        /* Sections */
        .admin-sections {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .admin-section {
          border: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.01);
          overflow: hidden;
          animation: fadeUp 0.6s ease both;
          opacity: 0;
        }

        .admin-section:nth-child(1) { animation-delay: 0.25s; }
        .admin-section:nth-child(2) { animation-delay: 0.38s; }
        .admin-section:nth-child(3) { animation-delay: 0.51s; }

        .section-label {
          padding: 14px 24px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          background: rgba(255,255,255,0.02);
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .section-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 16px;
          color: #facc15;
          letter-spacing: 0.1em;
          opacity: 0.6;
        }

        .section-title {
          font-size: 14px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.73);
        }

        .section-line {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.04);
        }

        .section-content {
          padding: 28px 24px;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 600px) {
          .admin-inner { padding: 32px 16px 60px; }
          .admin-header { flex-direction: column; align-items: flex-start; }
          .admin-meta { align-items: flex-start; text-align: left; }
        }
      `}</style>

      <div className="admin-page">
        <div className="admin-grid-overlay" />

        <div className="admin-inner">
          {/* Header */}
          <div className="admin-header">
            <div>
              <p className="admin-eyebrow">Control Panel</p>
              <h1 className="admin-title">
                Admin
                <br />
                <span>Console.</span>
              </h1>
            </div>
            <div className="admin-meta">
              <span className="admin-team-name">{teamName}</span>
              <span className="admin-badge">Admin Access</span>
            </div>
          </div>
          <div className="admin-sections">
            <div className="admin-section">
              <div className="section-label">
                <span className="section-num">01</span>
                <span className="section-title">Team Members</span>
                <div className="section-line" />
              </div>
              <div className="section-content">
                <TeamMemberList
                  teamMembers={teamMembers}
                  adminUserId={adminMember.user_id}
                />
              </div>
            </div>

            <div className="admin-section">
              <div className="section-label">
                <span className="section-num">02</span>
                <span className="section-title">Invite Users</span>
                <div className="section-line" />
              </div>
              <div className="section-content">
                <InviteUsers teamId={adminMember.team_id} teamName={teamName} />
              </div>
            </div>
            <div className="admin-section">
              <div className="section-label">
                <span className="section-num">03</span>
                <span className="section-title">Roles & Permissions</span>
                <div className="section-line" />
              </div>
              <div className="section-content">
                <TeamRolesManager roles={roles} teamId={adminMember.team_id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPage;
