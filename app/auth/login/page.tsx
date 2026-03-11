"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useRef } from "react";

export default function LoginPage() {
  const supabase = createClient();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (error) alert(error.message);
  };
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const dots = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.5,
    }));

    let frame: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dots.forEach((d) => {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0 || d.x > canvas.width) d.vx *= -1;
        if (d.y < 0 || d.y > canvas.height) d.vy *= -1;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(250,204,21,0.5)";
        ctx.fill();
      });
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.strokeStyle = `rgba(250,204,21,${0.12 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      frame = requestAnimationFrame(draw);
    };
    draw();

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a0a; font-family: 'DM Mono', monospace; overflow: hidden; }

        canvas.bg {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
        }

        .grid-overlay {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        .page {
          min-height: 100svh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          position: relative;
          z-index: 10;
        }

        /* LEFT PANEL */
        .left-panel {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 40px;
          border-right: 1px solid rgba(255,255,255,0.06);
          animation: fadeLeft 0.8s ease both;
        }

        .brand {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 20px;
          letter-spacing: 0.15em;
          color: #facc15;
        }

        .left-content {
          padding: 0 0 40px;
        }

        .left-eyebrow {
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #facc15;
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
          opacity: 0;
          animation: fadeUp 0.6s ease both 0.3s;
        }

        .left-eyebrow::before {
          content: '';
          display: block;
          width: 28px;
          height: 1px;
          background: #facc15;
        }

        .left-headline {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(60px, 7vw, 110px);
          line-height: 0.9;
          color: #f5f0e8;
          letter-spacing: 0.01em;
          opacity: 0;
          animation: fadeUp 0.7s ease both 0.45s;
        }

        .left-headline .accent { color: #facc15; display: block; }

        .left-sub {
          margin-top: 28px;
          font-size: 11px;
          color: rgba(255,255,255,0.25);
          line-height: 1.9;
          letter-spacing: 0.04em;
          max-width: 320px;
          opacity: 0;
          animation: fadeUp 0.6s ease both 0.6s;
        }

        .left-footer {
          font-size: 10px;
          letter-spacing: 0.1em;
          color: rgba(255,255,255,0.12);
        }

        /* RIGHT PANEL */
        .right-panel {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px;
          gap: 0;
          position: relative;
        }

        .right-inner {
          width: 100%;
          max-width: 360px;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .login-header {
          opacity: 0;
          animation: fadeUp 0.6s ease both 0.5s;
        }

        .login-tag {
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.2);
          margin-bottom: 12px;
        }

        .login-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 48px;
          color: #f5f0e8;
          letter-spacing: 0.03em;
          line-height: 1;
        }

        .login-title span { color: #facc15; }

        .divider {
          height: 1px;
          background: rgba(255,255,255,0.08);
          opacity: 0;
          animation: fadeUp 0.5s ease both 0.65s;
        }

        .google-btn {
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
          padding: 16px 28px;
          cursor: pointer;
          width: 100%;
          position: relative;
          transition: border-color 0.2s, background 0.2s, transform 0.15s;
          clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
          opacity: 0;
          animation: fadeUp 0.6s ease both 0.75s;
        }

        .google-btn:hover {
          border-color: #facc15;
          background: rgba(250,204,21,0.05);
          transform: translate(-2px, -2px);
        }

        .google-btn:active { transform: translate(0, 0); }

        .google-icon { flex-shrink: 0; }

        .footnote {
          font-size: 10px;
          color: rgba(255,255,255,0.15);
          letter-spacing: 0.08em;
          line-height: 1.8;
          text-align: center;
          opacity: 0;
          animation: fadeUp 0.5s ease both 0.9s;
        }

        .footnote a {
          color: rgba(255,255,255,0.3);
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        /* deco elements */
        .corner-tl, .corner-br {
          position: absolute;
          width: 20px;
          height: 20px;
          pointer-events: none;
        }
        .corner-tl { top: 40px; left: 40px; border-top: 1px solid rgba(250,204,21,0.3); border-left: 1px solid rgba(250,204,21,0.3); }
        .corner-br { bottom: 40px; right: 40px; border-bottom: 1px solid rgba(250,204,21,0.3); border-right: 1px solid rgba(250,204,21,0.3); }

        .step-indicator {
          position: absolute;
          bottom: 40px;
          left: 40px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .step {
          width: 2px;
          height: 20px;
          background: rgba(255,255,255,0.08);
        }

        .step.active { background: #facc15; height: 32px; }

        /* ticker */
        .ticker-wrap {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 20;
          overflow: hidden;
          border-top: 1px solid rgba(255,255,255,0.04);
          padding: 8px 0;
          background: rgba(10,10,10,0.8);
        }

        .ticker-inner {
          display: inline-block;
          white-space: nowrap;
          animation: ticker 22s linear infinite;
          font-size: 9px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.1);
        }

        @keyframes ticker {
          from { transform: translateX(100vw); }
          to { transform: translateX(-100%); }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }

        /* mobile */
        @media (max-width: 700px) {
          body { overflow: auto; }
          .page { grid-template-columns: 1fr; }
          .left-panel { display: none; }
          .right-panel { min-height: 100svh; padding: 60px 28px; }
        }
      `}</style>

      <canvas ref={canvasRef} className="bg" />
      <div className="grid-overlay" />

      <div className="page">
        {/* LEFT */}
        <div className="left-panel">
          <span className="brand">ScheduleMe</span>

          <div className="left-content">
            <p className="left-eyebrow">Team scheduling</p>
            <h1 className="left-headline">
              Run your
              <br />
              <span className="accent">shifts.</span>
              <span className="accent">Not chaos.</span>
            </h1>
            <p className="left-sub">
              Manage your team's availability, roles, and weekly schedule —
              without the back-and-forth.
            </p>
          </div>

          <span className="left-footer">scheduleme.live — 2026</span>
        </div>

        {/* RIGHT */}
        <div className="right-panel">
          <div className="corner-tl" />
          <div className="corner-br" />

          <div className="step-indicator">
            <div className="step active" />
            <div className="step" />
            <div className="step" />
          </div>

          <div className="right-inner">
            <div className="login-header">
              <p className="login-tag">Step 01 / Access</p>
              <h2 className="login-title">
                Sign
                <br />
                <span>in.</span>
              </h2>
            </div>

            <div className="divider" />

            <button className="google-btn" onClick={handleGoogleLogin}>
              <svg
                className="google-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                width="18"
                height="18"
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
              Continue with Google
            </button>

            <p className="footnote">
              By signing in you agree to our terms of service.
            </p>
          </div>
        </div>
      </div>

      <div className="ticker-wrap">
        <span className="ticker-inner">
          Sign in · Google Auth · Secure · Fast · No passwords · Team scheduling
          · Shifts · Roles · Availability · Sign in · Google Auth · Secure ·
          Fast ·
        </span>
      </div>
    </>
  );
}
