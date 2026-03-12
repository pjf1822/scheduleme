"use client";

import { useState } from "react";
import { completeOnboardingAction } from "../actions/onboarding";
import { useRouter } from "next/navigation";
import LogoutButton from "../components/layout/LogoutButton";
import Image from "next/image";

export default function OnboardingPage() {
  const [step, setStep] = useState<
    "choose" | "team" | "roles" | "invite" | "member"
  >("choose");
  const [teamName, setTeamName] = useState("");
  const [roles, setRoles] = useState<{ name: string; color: string }[]>([
    { name: "", color: "#3b82f6" },
  ]);
  const [inviteEmails, setInviteEmails] = useState<string[]>([""]);

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const updateEmail = (index: number, value: string) => {
    setInviteEmails((prev) => prev.map((e, i) => (i === index ? value : e)));
  };

  const addEmail = () => {
    const last = inviteEmails[inviteEmails.length - 1];
    if (!last.trim()) return;
    setInviteEmails((prev) => [...prev, ""]);
  };

  const removeEmail = (index: number) => {
    setInviteEmails((prev) => prev.filter((_, i) => i !== index));
  };

  const validEmails = inviteEmails
    .map((e) => e.trim())
    .filter((e) => e.includes("@"));
  const updateRoleName = (index: number, value: string) => {
    setRoles((prev) =>
      prev.map((r, i) => (i === index ? { ...r, name: value } : r)),
    );
  };

  const updateRoleColor = (index: number, color: string) => {
    setRoles((prev) => prev.map((r, i) => (i === index ? { ...r, color } : r)));
  };

  const addRole = () => {
    const lastRole = roles[roles.length - 1];

    if (!lastRole.name.trim()) return;

    setRoles((prev) => [...prev, { name: "", color: "#3b82f6" }]);
  };
  const removeRole = (index: number) => {
    setRoles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRoleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (roles[index].name.trim() === "") return;

      addRole();

      setTimeout(() => {
        const inputs =
          document.querySelectorAll<HTMLInputElement>("[data-role]");
        inputs[index + 1]?.focus();
      }, 0);
    }
  };
  const validRoles = roles
    .map((r) => ({ name: r.name.trim(), color: r.color }))
    .filter((r) => r.name);
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a0a; }

        .ob-page {
          min-height: 100svh;
          background: #0a0a0a;
          display: grid;
          grid-template-columns: 1fr 1fr;
          font-family: 'DM Mono', monospace;
          position: relative;
        }

        .ob-grid {
          position: fixed;
          inset: 0;
          pointer-events: none;
          background-image:
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        /* Left panel */
        .ob-left {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 40px;
          border-right: 1px solid rgba(255,255,255,0.06);
        }

        .ob-brand {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 20px;
          letter-spacing: 0.15em;
          color: #facc15;
        }

        .ob-left-main { padding-bottom: 40px; }

        .ob-eyebrow {
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #facc15;
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
        }

        .ob-eyebrow::before {
          content: '';
          display: block;
          width: 24px;
          height: 1px;
          background: #facc15;
        }

        .ob-headline {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(52px, 5.5vw, 80px);
          line-height: 0.9;
          color: #f5f0e8;
          letter-spacing: 0.01em;
        }

        .ob-headline span { color: #facc15; display: block; }

        .ob-steps {
          margin-top: 36px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .ob-step-item {
          display: flex;
          align-items: center;
          gap: 12px;
          opacity: 0.25;
          transition: opacity 0.3s;
        }

        .ob-step-item.active { opacity: 1; }
        .ob-step-item.done { opacity: 0.4; }

        .ob-step-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 13px;
          color: #facc15;
          letter-spacing: 0.1em;
          width: 24px;
          flex-shrink: 0;
        }

        .ob-step-bar {
          width: 2px;
          height: 20px;
          background: rgba(255,255,255,0.06);
          flex-shrink: 0;
          transition: background 0.3s;
        }

        .ob-step-item.active .ob-step-bar { background: #facc15; }
        .ob-step-item.done .ob-step-bar { background: rgba(250,204,21,0.3); }

        .ob-step-name {
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
        }

        .ob-step-item.active .ob-step-name { color: #f5f0e8; }

        .ob-left-footer {
          font-size: 10px;
          letter-spacing: 0.1em;
          color: rgba(255,255,255,0.12);
        }

        /* Right panel */
        .ob-right {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px;
        }

        .ob-corner-tl, .ob-corner-br {
          position: absolute;
          width: 18px;
          height: 18px;
        }
        .ob-corner-tl { top: 40px; left: 40px; border-top: 1px solid rgba(250,204,21,0.2); border-left: 1px solid rgba(250,204,21,0.2); }
        .ob-corner-br { bottom: 40px; right: 40px; border-bottom: 1px solid rgba(250,204,21,0.2); border-right: 1px solid rgba(250,204,21,0.2); }

        .ob-form {
          width: 100%;
          max-width: 360px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          align-items:center;
          animation: fadeUp 0.5s ease both;
        }

        .ob-form-header { display: flex; flex-direction: column; gap: 6px; }

        .ob-form-tag {
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.52);
        }

        .ob-form-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 44px;
          color: #f5f0e8;
          letter-spacing: 0.03em;
          line-height: 1;
        }
          .ob-form-subtext{
          font-size: 12px;
          color: #f5f0e8;
          }

        .ob-form-title span { color: #facc15; }

        .ob-divider {
          height: 1px;
          background: rgba(255,255,255,0.06);
        }

        /* Inputs */
        .ob-input {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          color: #f5f0e8;
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.06em;
          padding: 13px 16px;
          outline: none;
          transition: border-color 0.15s, background 0.15s;
        }

        .ob-input::placeholder { color: rgba(255,255,255,0.48); }
        .ob-input:focus {
          border-color: rgba(250,204,21,0.3);
          background: rgba(250,204,21,0.03);
        }

        /* Buttons */
        .ob-btn-primary {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #0a0a0a;
          background: #facc15;
          border: none;
          padding: 14px 28px;
          width: 100%;
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
          clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
        }

        .ob-btn-primary:hover:not(:disabled) {
          transform: translate(-2px, -2px);
          box-shadow: 3px 3px 0 rgba(250,204,21,0.2);
        }

        .ob-btn-primary:disabled { opacity: 0.2; cursor: not-allowed; }

        .ob-btn-ghost {
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
          justify-content: center;

        }
          

        .ob-btn-ghost:hover {
          border-color: rgba(255,255,255,0.2);
          color: rgba(255,255,255,0.5);
        }

        /* Choose cards */
        .ob-choose-cards {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .ob-choose-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 18px 16px;
          border: 1px solid rgba(255,255,255,0.74);
          background: rgba(255,255,255,0.01);
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s;
          text-align: left;
          font-family: 'DM Mono', monospace;
          position: relative;
          overflow: hidden;
        }

        .ob-choose-card::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 2px;
          background: transparent;
          transition: background 0.15s;
        }

        .ob-choose-card:hover { border-color: rgba(250,204,21,0.2); background: rgba(250,204,21,0.03); }
        .ob-choose-card:hover::before { background: #facc15; }

        .ob-choose-card-icon {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 28px;
          color: rgba(255,255,255,0.74);
          letter-spacing: 0.04em;
          flex-shrink: 0;
          width: 32px;
          text-align: center;
        }

        .ob-choose-card:hover .ob-choose-card-icon { color: #facc15; }

        .ob-choose-card-info { display: flex; flex-direction: column; gap: 3px; }

        .ob-choose-card-title {
          font-size: 14px;
          letter-spacing: 0.08em;
          color: #f5f0e8;
        }

        .ob-choose-card-sub {
          font-size: 10px;
          letter-spacing: 0.06em;
          color: rgba(255,255,255,0.5);
        }

        .ob-choose-card-arrow {
          margin-left: auto;
          color: rgba(255,255,255,0.15);
          font-size: 14px;
          transition: color 0.15s, transform 0.15s;
        }

        .ob-choose-card:hover .ob-choose-card-arrow {
          color: #facc15;
          transform: translateX(3px);
        }

        /* Roles list */
        .ob-roles-list {
          display: flex;
          flex-direction: column;
          gap: 2px;
          width:100%
        }

        .ob-role-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .ob-role-color-wrap {
          position: relative;
          width: 38px;
          height: 42px;
          flex-shrink: 0;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          cursor: pointer;
          overflow: hidden;
        }

        .ob-role-color-preview {
          position: absolute;
          inset: 6px;
          border-radius: 2px;
          pointer-events: none;
        }

        .ob-role-color-input {
          position: absolute;
          inset: 0;
          opacity: 0;
          cursor: pointer;
          width: 100%;
          height: 100%;
        }

        .ob-role-delete {
          width: 34px;
          height: 42px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: 1px solid rgba(248,113,113,0.12);
          color: rgba(248,113,113,0.35);
          font-size: 9px;
          cursor: pointer;
          transition: border-color 0.15s, color 0.15s;
        }

        .ob-role-delete:hover {
          border-color: rgba(248,113,113,0.35);
          color: #f87171;
        }

        .ob-add-role-btn {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.75);
          background: transparent;
          border: 1px dashed rgba(255,255,255,0.08);
          padding: 10px;
          width: 100%;
          cursor: pointer;
          transition: border-color 0.15s, color 0.15s;
          margin-top: 2px;
        }

        .ob-add-role-btn:hover {
          border-color: rgba(250,204,21,0.25);
          color: rgba(250,204,21,0.6);
        }

        /* Member info box */
        .ob-info-box {
          padding: 16px;
          border: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.02);
          font-size: 11px;
          letter-spacing: 0.06em;
          color: rgba(255, 255, 255, 0.74);
          line-height: 1.9;
        }

        .ob-logout-wrap {
          display: flex;
          justify-content: center;
          margin-top:10px
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 680px) {
          .ob-page { grid-template-columns: 1fr; }
          .ob-left { display: none; }
          .ob-right { min-height: 100svh; padding: 60px 28px; }
          .ob-corner-tl, .ob-corner-br { display: none; }
        }
      `}</style>

      <div className="ob-page">
        <div className="ob-grid" />
        <div className="ob-left">
          <span className="ob-brand">ScheduleMe</span>

          <div className="ob-left-main">
            <p className="ob-eyebrow">Setup</p>
            <h1 className="ob-headline">
              Let's get
              <br />
              <span>started.</span>
            </h1>

            <div className="ob-steps">
              {[
                { key: "choose", num: "01", label: "Choose Path" },
                { key: "team", num: "02", label: "Name Your Team" },
                { key: "roles", num: "03", label: "Define Roles" },
                { key: "invite", num: "04", label: "Invite Members" },
              ].map(({ key, num, label }) => {
                const order = ["choose", "team", "roles", "invite"];
                const currentIdx = order.indexOf(step);
                const thisIdx = order.indexOf(key);
                const isActive = step === key;
                const isDone = currentIdx > thisIdx;
                return (
                  <div
                    key={key}
                    className={`ob-step-item${isActive ? " active" : isDone ? " done" : ""}`}
                  >
                    <span className="ob-step-num">{num}</span>
                    <div className="ob-step-bar" />
                    <span className="ob-step-name">{label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <span className="ob-left-footer">scheduleme.live — 2026</span>
        </div>
        <div className="ob-right">
          <div className="ob-corner-tl" />
          <div className="ob-corner-br" />

          {step === "choose" && (
            <div className="ob-form" key="choose">
              <div className="ob-form-header">
                <p className="ob-form-tag">Step 01 / Path</p>
                <h2 className="ob-form-title">
                  How are
                  <br />
                  <span>you joining?</span>
                </h2>
              </div>
              <div className="ob-divider" />
              <div className="ob-choose-cards">
                <button
                  className="ob-choose-card"
                  onClick={() => setStep("team")}
                >
                  <span className="ob-choose-card-icon">01</span>
                  <div className="ob-choose-card-info">
                    <span className="ob-choose-card-title">Create a Team</span>
                    <span className="ob-choose-card-sub">
                      Set up a new team and invite members
                    </span>
                  </div>
                  <span className="ob-choose-card-arrow">→</span>
                </button>
                <button
                  className="ob-choose-card"
                  onClick={() => setStep("member")}
                >
                  <span className="ob-choose-card-icon">02</span>
                  <div className="ob-choose-card-info">
                    <span className="ob-choose-card-title">Join a Team</span>
                    <span className="ob-choose-card-sub">
                      Accept an invite from your admin
                    </span>
                  </div>
                  <span className="ob-choose-card-arrow">→</span>
                </button>
              </div>
            </div>
          )}
          {/* STEP 1 — TEAM NAME */}
          {step === "team" && (
            <div className="ob-form" key="team">
              <div className="ob-form-header">
                <p className="ob-form-tag">Step 02 / Team</p>
                <h2 className="ob-form-title">
                  Name your
                  <br />
                  <span>team.</span>
                </h2>
              </div>
              <div className="ob-divider" />
              <input
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && teamName.trim() && setStep("roles")
                }
                placeholder="e.g. Night Crew, Squad A..."
                className="ob-input"
                autoFocus
              />
              <button
                disabled={!teamName.trim()}
                onClick={() => setStep("roles")}
                className="ob-btn-primary"
              >
                Continue →
              </button>
              <div className="ob-logout-wrap">
                <button
                  onClick={() => setStep("choose")}
                  className="ob-btn-ghost"
                >
                  ← Back
                </button>
              </div>
            </div>
          )}
          {/* STEP 1 B — TEAM NAME */}
          {step === "member" && (
            <div className="ob-form" key="member">
              <div className="ob-form-header">
                <p className="ob-form-tag">Step 02 / Join</p>
                <h2 className="ob-form-title">
                  Join a<br />
                  <span>team.</span>
                </h2>
              </div>
              <div className="ob-divider" />
              <div className="ob-info-box">
                To join a team, ask your admin to send you an invite link via
                email. Once you click it, you'll be added automatically.
              </div>
              <button
                onClick={() => setStep("choose")}
                className="ob-btn-ghost"
              >
                ← Back
              </button>
            </div>
          )}
          {/* STEP 2 — ROLES */}
          {step === "roles" && (
            <div className="ob-form" key="roles">
              <div className="ob-form-header">
                <p className="ob-form-tag">Step 03 / Roles</p>
                <h2 className="ob-form-title">
                  Define
                  <br />
                  <span>roles.</span>
                  <br />
                </h2>
                <p className="ob-form-subtext">
                  Roles help organize positions at your company.
                  <br />
                  Examples: Student • Audio Engineer • Stage Hand
                </p>
              </div>
              <div className="ob-divider" />

              <div className="ob-roles-list">
                {roles.map((role, index) => (
                  <div key={index} className="ob-role-row">
                    <div className="ob-role-color-wrap">
                      <div
                        className="ob-role-color-preview"
                        style={{ background: role.color }}
                      />
                      <input
                        type="color"
                        value={role.color}
                        onChange={(e) => updateRoleColor(index, e.target.value)}
                        className="ob-role-color-input"
                      />
                    </div>
                    <input
                      data-role
                      value={role.name}
                      onChange={(e) => updateRoleName(index, e.target.value)}
                      onKeyDown={(e) => handleRoleKeyDown(e, index)}
                      placeholder={`Role ${index + 1}...`}
                      className="ob-input"
                      style={{ flex: 1 }}
                      autoFocus={index === roles.length - 1 && index > 0}
                    />
                    {roles.length > 1 && (
                      <button
                        className="ob-role-delete"
                        onClick={() => removeRole(index)}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button className="ob-add-role-btn" onClick={addRole}>
                  + Add Role
                </button>
              </div>

              <button
                disabled={!teamName.trim()}
                onClick={() => setStep("invite")}
                className="ob-btn-primary"
              >
                Continue →
              </button>
              <div className="ob-logout-wrap">
                <button
                  onClick={() => setStep("team")}
                  className="ob-btn-ghost"
                >
                  ← Back
                </button>
              </div>
            </div>
          )}
          {/* STEP 2 — INVITES */}

          {step === "invite" && (
            <div className="ob-form" key="invite">
              <div className="ob-form-header">
                <p className="ob-form-tag">Step 04 / Invite</p>
                <h2 className="ob-form-title">
                  Invite
                  <br />
                  <span>members.</span>
                </h2>
              </div>
              <div className="ob-divider" />

              <div className="ob-roles-list">
                {inviteEmails.map((email, index) => (
                  <div key={index} className="ob-role-row">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => updateEmail(index, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && email.trim()) {
                          e.preventDefault();
                          addEmail();
                          setTimeout(() => {
                            const inputs =
                              document.querySelectorAll<HTMLInputElement>(
                                "[data-email]",
                              );
                            inputs[index + 1]?.focus();
                          }, 0);
                        }
                      }}
                      data-email
                      placeholder={`member@email.com`}
                      className="ob-input"
                      style={{ flex: 1 }}
                      autoFocus={index === inviteEmails.length - 1 && index > 0}
                    />
                    {inviteEmails.length > 1 && (
                      <button
                        className="ob-role-delete"
                        onClick={() => removeEmail(index)}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button className="ob-add-role-btn" onClick={addEmail}>
                  + Add Member
                </button>
              </div>

              <button
                disabled={loading}
                onClick={async () => {
                  setLoading(true);

                  try {
                    await completeOnboardingAction({
                      teamName,
                      roles: validRoles,
                      invites: validEmails,
                    });

                    router.push("/dashboard");
                  } catch (e) {
                    console.error(e);
                    setLoading(false);
                  }
                }}
                className="ob-btn-primary"
              >
                {loading ? "Creating..." : "Create Team"}
              </button>

              <div className="ob-logout-wrap">
                <button
                  onClick={() => setStep("roles")}
                  className="ob-btn-ghost"
                >
                  ← Back
                </button>
              </div>
            </div>
          )}

          <div className="ob-logout-wrap">
            <LogoutButton />
          </div>
        </div>
      </div>
    </>
  );
}
