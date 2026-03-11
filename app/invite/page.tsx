import { createClient } from "@/lib/supabase/server";
import { acceptInvite } from "@/app/actions/invites";
import { redirect } from "next/navigation";
import AcceptInvitePrompt from "../components/adminPage/AcceptInvitePrompt";
import { getInviteByToken } from "@/lib/db/invites";
import Image from "next/image";

type Props = {
  searchParams: Promise<{ token?: string }>;
};

export default async function InvitePage({ searchParams }: Props) {
  const { token } = await searchParams;

  if (!token) redirect("/login");

  const supabase = await createClient();

  const invite = await getInviteByToken(token);

  if (!invite) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&display=swap');

          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { background: #0a0a0a; height:100vh}

          .invite-error-page {
            min-height: 100svh;
            background: #0a0a0a;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'DM Mono', monospace;
            position: relative;
          }

          .invite-grid-overlay {
            position: fixed;
            inset: 0;
            pointer-events: none;
            background-image:
              linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
            background-size: 60px 60px;
          }

          .invite-error-box {
            position: relative;
            z-index: 1;
            text-align: center;
            padding: 60px 48px;
            border: 1px solid rgba(255,255,255,0.07);
            background: rgba(255,255,255,0.01);
            max-width: 420px;
            width: 90vw;
          }

          .invite-error-code {
            font-family: 'Bebas Neue', sans-serif;
            font-size: 100px;
            line-height: 0.85;
            color: rgba(255,255,255,0.04);
            letter-spacing: 0.04em;
            user-select: none;
          }

          .invite-error-icon {
            font-size: 14px;
            color: #f87171;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            margin: 20px 0 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
          }

          .invite-error-icon::before,
          .invite-error-icon::after {
            content: '';
            display: block;
            width: 24px;
            height: 1px;
            background: #f87171;
            opacity: 0.4;
          }

          .invite-error-title {
            font-family: 'Bebas Neue', sans-serif;
            font-size: 48px;
            color: #f5f0e8;
            letter-spacing: 0.03em;
            line-height: 1;
          }

          .invite-error-sub {
            font-size: 11px;
            letter-spacing: 0.08em;
            color: rgba(255,255,255,0.25);
            margin-top: 12px;
            line-height: 1.8;
          }

          .invite-error-link {
            display: inline-block;
            margin-top: 32px;
            font-size: 10px;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            color: #0a0a0a;
            background: #facc15;
            padding: 10px 24px;
            text-decoration: none;
            clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
            transition: transform 0.15s, box-shadow 0.15s;
          }

          .invite-error-link:hover {
            transform: translate(-2px, -2px);
            box-shadow: 3px 3px 0 rgba(250,204,21,0.2);
          }

          .invite-corner-tl, .invite-corner-br {
            position: absolute;
            width: 16px;
            height: 16px;
          }
          .invite-corner-tl { top: -1px; left: -1px; border-top: 1px solid rgba(248,113,113,0.3); border-left: 1px solid rgba(248,113,113,0.3); }
          .invite-corner-br { bottom: -1px; right: -1px; border-bottom: 1px solid rgba(248,113,113,0.3); border-right: 1px solid rgba(248,113,113,0.3); }
        `}</style>

        <div className="invite-error-page">
          <div className="invite-grid-overlay" />
          <div className="invite-error-box">
            <div className="invite-corner-tl" />
            <div className="invite-corner-br" />
            <div className="invite-error-code">404</div>
            <p className="invite-error-icon">Invalid</p>
            <h1 className="invite-error-title">
              Bad
              <br />
              Invite.
            </h1>
            <p className="invite-error-sub">
              This invite link is invalid or has already expired.
              <br />
              Ask your team admin to send a new one.
            </p>
            <a href="/login" className="invite-error-link">
              Back to Login →
            </a>
          </div>
        </div>
      </>
    );
  }

  // Already logged in — accept immediately
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    await acceptInvite(token, user.id);
    redirect("/dashboard");
  }

  return <AcceptInvitePrompt token={token} teamName={invite.team_name} />;
}
