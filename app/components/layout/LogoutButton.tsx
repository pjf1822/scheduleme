"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();

    router.push("/login");
    router.refresh();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap');

        .logout-btn {
          font-family: 'DM Mono', monospace;
          font-size: 14px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.74);
          background: transparent;
border: 1px solid rgba(255, 255, 255, 0.74);
          padding: 8px 20px;
          cursor: pointer;
          transition: color 0.15s, border-color 0.15s, background 0.15s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          width: 120px;
          justify-content:center

        }

     
        .logout-btn:hover {
          color: #f87171;
          border-color: rgba(248,113,113,0.25);
          background: rgba(248,113,113,0.04);
        }

        .logout-btn:hover::before {
          opacity: 1;
          transform: translateX(0);
        }
      `}</style>

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </>
  );
}
