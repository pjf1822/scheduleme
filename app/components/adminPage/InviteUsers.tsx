"use client";

import { createInvite } from "@/app/actions/invites";
import { useState } from "react";

type Props = {
  teamId: string;
  teamName: string;
};

const InviteUsers = ({ teamId, teamName }: Props) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleInvite = async () => {
    if (!email) return;
    setStatus("loading");
    setErrorMsg("");

    try {
      await createInvite(teamId, email, teamName);
      setStatus("success");
      setEmail("");
    } catch (e: any) {
      setStatus("error");
      setErrorMsg(e.message ?? "Something went wrong");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&display=swap');

        .invite-wrap {
          font-family: 'DM Mono', monospace;
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-width: 480px;
        }

        .invite-input-row {
          display: flex;
          gap: 0;
          position: relative;
        }

        .invite-input {
          flex: 1;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-right: none;
          color: #f5f0e8;
          font-family: 'DM Mono', monospace;
          font-size: 14px;
          letter-spacing: 0.06em;
          padding: 13px 16px;
          outline: none;
          transition: border-color 0.15s, background 0.15s;
          clip-path: polygon(0 0, calc(100% ) 0, 100% 0px, 100% 100%, 0px 100%, 0 calc(100% - 0px));
        }

        .invite-input::placeholder {
          color: rgba(255,255,255,0.48);
          letter-spacing: 0.08em;
        }

        .invite-input:focus {
          border-color: rgba(250,204,21,0.3);
          background: rgba(250,204,21,0.03);
        }

        .invite-btn {
          font-family: 'DM Mono', monospace;
          font-size: 14px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #0a0a0a;
          background: #facc15;
          border: none;
          padding: 13px 22px;
          cursor: pointer;
          white-space: nowrap;
          transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
          clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%);
          flex-shrink: 0;
        }

        .invite-btn:hover:not(:disabled) {
          transform: translate(-1px, -1px);
          box-shadow: 2px 2px 0 rgba(250,204,21,0.25);
        }

        .invite-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .invite-btn.loading {
          background: rgba(250,204,21,0.4);
        }

        .invite-feedback {
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          border: 1px solid;
          animation: fadeUp 0.3s ease both;
        }

        .invite-feedback.success {
          color: #4ade80;
          border-color: rgba(74,222,128,0.2);
          background: rgba(74,222,128,0.04);
        }

        .invite-feedback.error {
          color: #f87171;
          border-color: rgba(248,113,113,0.2);
          background: rgba(248,113,113,0.04);
        }

        .invite-feedback::before {
          font-size: 12px;
        }

        .invite-feedback.success::before { content: '✓'; }
        .invite-feedback.error::before { content: '✕'; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* loading dots */
        .dot-anim::after {
          content: '';
          animation: dots 1.2s steps(3, end) infinite;
        }

        @keyframes dots {
          0%   { content: ''; }
          33%  { content: '.'; }
          66%  { content: '..'; }
          100% { content: '...'; }
        }
      `}</style>
      <div className="invite-wrap">
        <div className="invite-input-row">
          <input
            type="email"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setStatus("idle");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleInvite()}
            className="invite-input"
          />
          <button
            onClick={handleInvite}
            disabled={status === "loading" || !email}
            className={`invite-btn${status === "loading" ? " loading" : ""}`}
          >
            {status === "loading" ? (
              <span className="dot-anim">Sending</span>
            ) : (
              "Send Invite →"
            )}{" "}
          </button>
        </div>

        {status === "success" && (
          <div className="invite-feedback success">
            Invite sent to {email || "user"}
          </div>
        )}
        {status === "error" && (
          <div className="invite-feedback error">{errorMsg}</div>
        )}
      </div>
    </>
  );
};

export default InviteUsers;
