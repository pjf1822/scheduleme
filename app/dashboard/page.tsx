import { getCurrentUserBusyBlocks } from "@/lib/services/busyBlocks";
import CalendarComp from "../components/calendarComps/CalendarComp";
import { createClient } from "@/lib/supabase/server";
import { getAdminTeamData } from "@/lib/services/admin";
import TeamScheduleCalendarComp from "../components/calendarComps/TeamScheduleCalendarComp";
import { getTeamRoles } from "@/lib/services/teamRoles";
import { getCurrentUserShifts } from "@/lib/services/shifts";

const page = async () => {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();
  const userRole = data?.claims?.user_role;

  if (userRole === "admin") {
    const { busyBlocks, teamMembers, teamId, shifts } =
      await getAdminTeamData();

    const roles = await getTeamRoles(teamId);

    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&display=swap');

          .dash-page {
            min-height: 100svh;
            background: #0a0a0a;
            font-family: 'DM Mono', monospace;
            position: relative;
          }

          .dash-grid-overlay {
            position: fixed;
            inset: 0;
            z-index: 0;
            pointer-events: none;
            background-image:
              linear-gradient(rgba(255,255,255,0.01) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.01) 1px, transparent 1px);
            background-size: 60px 60px;
          }

          .dash-inner {
            position: relative;
            z-index: 1;
            max-width: 1280px;
            margin: 0 auto;
            padding: 40px 32px 80px;
            display: flex;
            flex-direction: column;
            gap: 28px;
          }

          .dash-header {
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            gap: 20px;
            padding-bottom: 28px;
            border-bottom: 1px solid rgba(255,255,255,0.06);
            animation: fadeUp 0.6s ease both 0.1s;
            opacity: 0;
          }

          .dash-eyebrow {
            font-size: 10px;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            color: #facc15;
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 10px;
          }

          .dash-eyebrow::before {
            content: '';
            display: block;
            width: 24px;
            height: 1px;
            background: #facc15;
          }

          .dash-title {
            font-family: 'Bebas Neue', sans-serif;
            font-size: clamp(40px, 5vw, 68px);
            line-height: 0.9;
            color: #f5f0e8;
            letter-spacing: 0.02em;
          }

          .dash-title span { color: #facc15; }

          .dash-stats {
            display: flex;
            gap: 1px;
            flex-shrink: 0;
          }

          .dash-stat {
            padding: 10px 20px;
            border: 1px solid rgba(255,255,255,0.06);
            background: rgba(255,255,255,0.015);
            display: flex;
            flex-direction: column;
            gap: 3px;
            min-width: 80px;
          }

          .dash-stat-num {
            font-family: 'Bebas Neue', sans-serif;
            font-size: 28px;
            color: #f5f0e8;
            letter-spacing: 0.04em;
            line-height: 1;
          }

          .dash-stat-num span { color: #facc15; }

          .dash-stat-label {
            font-size: 9px;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            color: rgba(255,255,255,0.2);
          }

          .dash-calendar-wrap {
            border: 1px solid rgba(255,255,255,0.96);
            background: rgba(255,255,255,0.01);
            overflow: hidden;
            animation: fadeUp 0.6s ease both 0.3s;
            opacity: 0;
          }

          .dash-calendar-label {
            padding: 12px 20px;
            border-bottom: 1px solid rgba(255,255,255,0.04);
            background: rgba(255,255,255,0.02);
            display: flex;
            align-items: center;
            gap: 14px;
          }

          .dash-calendar-num {
            font-family: 'Bebas Neue', sans-serif;
            font-size: 13px;
            color: #facc15;
            letter-spacing: 0.1em;
            opacity: 0.6;
          }

          .dash-calendar-title {
            font-size: 10px;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            color: rgba(255,255,255,0.74);
          }

          .dash-calendar-line {
            flex: 1;
            height: 1px;
            background: rgba(255,255,255,0.04);
          }

          .dash-calendar-content {
            padding: 24px 20px;
          }
       
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(16px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @media (max-width: 600px) {
            .dash-inner { padding: 24px 16px 60px; }
            .dash-header { flex-direction: column; align-items: flex-start; }
            .dash-stats { flex-wrap: wrap; }
            .dash-calendar-content {
            padding: 24px 0px;
          }
            
          }
        `}</style>
        <div className="dash-page">
          <div className="dash-grid-overlay" />
          <div className="dash-inner">
            <div className="dash-header">
              <div>
                <p className="dash-eyebrow">Admin View</p>
                <h1 className="dash-title">
                  Team
                  <br />
                  <span>Schedule.</span>
                </h1>
              </div>
            </div>

            <div className="dash-calendar-wrap">
              <div className="dash-calendar-label">
                <span className="dash-calendar-num">01</span>
                <span className="dash-calendar-title">Schedule Overview</span>
                <div className="dash-calendar-line" />
              </div>
              <div className="dash-calendar-content">
                <TeamScheduleCalendarComp
                  busyBlocks={busyBlocks}
                  teamMembers={teamMembers}
                  teamId={teamId}
                  shifts={shifts}
                  roles={roles}
                />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  const busyBlocks = await getCurrentUserBusyBlocks();
  const shifts = await getCurrentUserShifts();
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&display=swap');

        .dash-page {
          min-height: 100svh;
          background: #0a0a0a;
          font-family: 'DM Mono', monospace;
          position: relative;
        }

        .dash-grid-overlay {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background-image:
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        .dash-inner {
          position: relative;
          z-index: 1;
          max-width: 1280px;
          margin: 0 auto;
          padding: 40px 32px 80px;
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .dash-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          padding-bottom: 28px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          animation: fadeUp 0.6s ease both 0.1s;
          opacity: 0;
        }

        .dash-eyebrow {
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #facc15;
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }

        .dash-eyebrow::before {
          content: '';
          display: block;
          width: 24px;
          height: 1px;
          background: #facc15;
        }

        .dash-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(40px, 5vw, 68px);
          line-height: 0.9;
          color: #f5f0e8;
          letter-spacing: 0.02em;
        }

        .dash-title span { color: #facc15; }

        .dash-stats {
          display: flex;
          gap: 1px;
          flex-shrink: 0;
        }

        .dash-stat {
          padding: 10px 20px;
          border: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.015);
          display: flex;
          flex-direction: column;
          gap: 3px;
          min-width: 80px;
        }

        .dash-stat-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 28px;
          color: #f5f0e8;
          letter-spacing: 0.04em;
          line-height: 1;
        }

        .dash-stat-num span { color: #facc15; }

        .dash-stat-label {
          font-size: 9px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.2);
        }

        .dash-calendar-wrap {
          border: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.01);
          overflow: hidden;
          animation: fadeUp 0.6s ease both 0.3s;
          opacity: 0;
        }

        .dash-calendar-label {
          padding: 12px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          background: rgba(255,255,255,0.02);
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .dash-calendar-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 13px;
          color: #facc15;
          letter-spacing: 0.1em;
          opacity: 0.6;
        }

        .dash-calendar-title {
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
        }

        .dash-calendar-line {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.04);
        }

        .dash-calendar-content {
          padding: 24px 20px;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 600px) {
          .dash-inner { padding: 24px 16px 60px; }
          .dash-header { flex-direction: column; align-items: flex-start; }
          .dash-stats { flex-wrap: wrap; }
           .dash-calendar-content {
    padding: 24px 0;
  }
    .dash-inner {
    padding: 10px 10px
  }
        }
      `}</style>
      <div className="dash-page">
        <div className="dash-grid-overlay" />
        <div className="dash-inner">
          <div className="dash-header">
            <div>
              <p className="dash-eyebrow">My Schedule</p>
              <h1 className="dash-title">
                Your
                <br />
                <span>Week.</span>
              </h1>
            </div>
          </div>

          <div className="dash-calendar-wrap">
            <div className="dash-calendar-label">
              <span className="dash-calendar-num">01</span>
              <span className="dash-calendar-title">Your Calendar</span>
              <div className="dash-calendar-line" />
            </div>
            <div className="dash-calendar-content">
              <CalendarComp busyBlocks={busyBlocks} shifts={shifts} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
