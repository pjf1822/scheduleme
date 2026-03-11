import Link from "next/link";
import LogoutButton from "./LogoutButton";

const Navbar = ({
  userRole,
  email,
}: {
  userRole: string | null;
  email: string;
}) => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&display=swap');

        .navbar {
          width: 100%;
          background: #0a0a0a;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          position: sticky;
          top: 0;
          z-index: 50;
          font-family: 'DM Mono', monospace;
        }

        .navbar-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 32px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .navbar-left {
          display: flex;
          align-items: center;
          gap: 28px;
        }

        .navbar-brand {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 20px;
          letter-spacing: 0.15em;
          color: #facc15;
          text-decoration: none;
          transition: opacity 0.15s;
          flex-shrink: 0;
        }

        .navbar-brand:hover { opacity: 0.75; }

        .navbar-sep {
          width: 1px;
          height: 20px;
          background: rgba(255,255,255,0.08);
          flex-shrink: 0;
        }

        .navbar-email {
          font-size: 14px;
          letter-spacing: 0.1em;
          color: rgba(255,255,255,0.75);
          white-space: nowrap;
          overflow: hidden;
          
          max-width: 220px;
        }

        .navbar-right {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }

        .admin-link {
          font-family: 'DM Mono', monospace;
          font-size: 14px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #0a0a0a;
          background: #facc15;
          text-decoration: none;
          padding: 7px 16px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: transform 0.15s, box-shadow 0.15s;
          clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px));
        }

        .admin-link:hover {
          transform: translate(-1px, -1px);
          box-shadow: 2px 2px 0 rgba(250,204,21,0.3);
        }

        .admin-link::before {
          content: '⬡';
          font-size: 8px;
        }

        @media (max-width: 500px) {
          .navbar-inner { padding: 0 16px; }
          .navbar-email { display: none; }
          .navbar-sep { display: none; }
        }
      `}</style>

      <nav className="navbar">
        <div className="navbar-inner">
          <div className="navbar-left">
            <Link href="/dashboard" className="navbar-brand">
              ScheduleMe
            </Link>
            <div className="navbar-sep" />
            <span className="navbar-email">{email}</span>
          </div>

          <div className="navbar-right">
            {userRole === "admin" && (
              <Link href="/admin" className="admin-link">
                Admin
              </Link>
            )}
            <LogoutButton />
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
