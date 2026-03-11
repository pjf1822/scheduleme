"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

type Props = {
  token: string;
  teamName: string;
};

export default function AcceptInvitePrompt({ token, teamName }: Props) {
  const handleAccept = async () => {
    document.cookie = `invite_token=${token}; path=/; max-age=600; SameSite=Lax`;

    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&display=swap');

        .aip-wrap {
          font-family: 'DM Mono', monospace;
          display: flex;
          flex-direction: column;
          gap: 20px;
          align-items:center;
          height:100vh;
          justify-content:space-between;
        }

        .aip-team-row {
          display: flex;
          align-items: center;
          gap: 10px;
          width:100%;
          padding: 12px 16px;
          border: 1px solid rgba(250,204,21,0.15);
          background: rgba(250,204,21,0.03);
        }

        .aip-team-icon {
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.2);
          flex-shrink: 0;
        }

        .aip-team-sep {
          width: 1px;
          height: 16px;
          background: rgba(255,255,255,0.08);
          flex-shrink: 0;
        }

        .aip-team-name {
          font-size: 11px;
          letter-spacing: 0.1em;
          color: #facc15;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .aip-google-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.12);
          color: #f5f0e8;
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 15px 28px;
          cursor: pointer;
          width: 40%;
         
          transition: border-color 0.2s, background 0.2s, transform 0.15s;
          clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
        }

        .aip-google-btn:hover {
          border-color: #facc15;
          background: rgba(250,204,21,0.05);
          transform: translate(-2px, -2px);
        }

        .aip-google-btn:active {
          transform: translate(0, 0);
        }

        .aip-footnote {
          font-size: 10px;
          color: rgba(255,255,255,0.15);
          letter-spacing: 0.07em;
          line-height: 1.8;
          text-align: center;
        }
      `}</style>
      <div className="aip-wrap">
        <div className="aip-team-row">
          <span className="aip-team-icon">Team</span>
          <div className="aip-team-sep" />
          <span className="aip-team-name">{teamName}</span>
        </div>

        <button className="aip-google-btn" onClick={handleAccept}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            width="18"
            height="18"
            style={{ flexShrink: 0 }}
          >
            <path
              fill="#FFC107"
              d="M43.6 20.5H42V20H24v8h11.3C33.7 32.6 29.2 36 24 36c-6.6 0-12-5.4-12-12S17.4 12 24 12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c10 0 19-7.3 19-20 0-1.3-.1-2.3-.4-3.5z"
            />
            <path
              fill="#FF3D00"
              d="M6.3 14.7l6.6 4.8C14.7 16.1 18.9 12 24 12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"
            />
            <path
              fill="#4CAF50"
              d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.2C29.3 35.3 26.8 36 24 36c-5.2 0-9.7-3.4-11.3-8l-6.6 5.1C9.5 39.7 16.2 44 24 44z"
            />
            <path
              fill="#1976D2"
              d="M43.6 20.5H42V20H24v8h11.3c-1.1 3-3.4 5.3-6.1 6.6l6.3 5.2C39.5 36.7 43 31 43 24c0-1.3-.1-2.3-.4-3.5z"
            />
          </svg>
          Accept with Google
        </button>

        <p className="aip-footnote">
          You'll be added to {teamName} and signed in via Google.
          <br />
          No password needed.
        </p>
      </div>
    </>
  );
}
