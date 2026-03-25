"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useEffect, useRef } from "react";

export default function RootClient() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const supabase = createClient();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const dots: { x: number; y: number; vx: number; vy: number; r: number }[] =
      [];
    for (let i = 0; i < 60; i++) {
      dots.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.5 + 0.5,
      });
    }

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
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (error) alert(error.message);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&display=swap');

        :root {
          --ink: #0a0a0a;
          --paper: #f5f0e8;
          --yellow: #facc15;
          --dim: #1c1c1c;
          --muted: #3a3a3a;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: var(--ink);
          font-family: 'DM Mono', monospace;
          overflow-x: hidden;
        }

        .page {
          min-height: 100svh;
          display: grid;
          grid-template-rows: auto 1fr auto;
          position: relative;
        }

        canvas.bg {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }

        .grid-overlay {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        /* header */
        .header {
          position: relative;
          z-index: 10;
          padding: 24px 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .header-logo {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 22px;
          letter-spacing: 0.12em;
          color: var(--yellow);
        }

        .header-badge {
          font-size: 10px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 4px 10px;
          border-radius: 2px;
        }

        /* hero — two column layout */
        .hero {
          position: relative;
          z-index: 10;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 60px;
          padding: 80px 40px 60px;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }

        .hero-copy {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .eyebrow {
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--yellow);
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .eyebrow::before {
          content: '';
          display: block;
          width: 32px;
          height: 1px;
          background: var(--yellow);
        }

        .headline {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(60px, 8vw, 120px);
          line-height: 0.9;
          color: var(--paper);
          letter-spacing: 0.01em;
          position: relative;
        }

        .headline .accent {
          color: var(--yellow);
          display: block;
        }

        .sub {
          margin-top: 32px;
          font-size: 13px;
          color: rgba(255,255,255,0.35);
          max-width: 360px;
          line-height: 1.8;
          letter-spacing: 0.02em;
        }

        .cta-row {
          margin-top: 40px;
          display: flex;
          align-items: center;
          gap: 24px;
          flex-wrap: wrap;
          width: 100%;
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
          color: rgba(255,255,255,0.2);
          letter-spacing: 0.05em;
          margin-top: 4px;
        }

        /* product screenshot */
        .hero-visual {
          position: relative;
          opacity: 0;
          animation: fadeUp 0.8s ease both 0.9s;
        }

        /* subtle float animation */
        @keyframes float {
          0%, 100% { transform: rotate(1.5deg) translateY(0px); }
          50% { transform: rotate(1.5deg) translateY(-10px); }
        }

        .screenshot-frame {
          position: relative;
          border-radius: 8px;
          overflow: hidden;
          transform: rotate(1.5deg);
          animation: float 6s ease-in-out infinite;
          box-shadow:
            0 0 0 1px rgba(250,204,21,0.25),
            0 0 40px rgba(250,204,21,0.08),
            0 40px 80px rgba(0,0,0,0.6);
        }

        /* fake window chrome bar */
        .screenshot-chrome {
          background: #141414;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          padding: 10px 14px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .chrome-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .chrome-dot:nth-child(1) { background: rgba(255,90,90,0.6); }
        .chrome-dot:nth-child(2) { background: rgba(255,200,60,0.6); }
        .chrome-dot:nth-child(3) { background: rgba(60,210,100,0.6); }

        .chrome-url {
          margin-left: 12px;
          font-size: 10px;
          letter-spacing: 0.05em;
          color: rgba(255,255,255,0.2);
          font-family: 'DM Mono', monospace;
        }

        .screenshot-img {
          display: block;
          width: 100%;
          height: auto;
          /* crop bottom ~30% to hide today highlight and sparse rows */
          object-fit: cover;
          object-position: top;
          max-height: 340px;
        }

        /* yellow corner accent */
        .screenshot-frame::after {
          content: '';
          position: absolute;
          bottom: -1px;
          right: -1px;
          width: 40px;
          height: 40px;
          background: var(--yellow);
          clip-path: polygon(100% 0, 100% 100%, 0 100%);
          opacity: 0.6;
        }

        /* floating label */
        .screenshot-label {
          position: absolute;
          bottom: -32px;
          left: 0;
          font-size: 9px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.2);
        }

        /* how it works */
        .hiw {
          position: relative;
          z-index: 10;
          padding: 80px 40px 100px;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }

        .hiw-eyebrow {
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.85);
          margin-bottom: 48px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .hiw-eyebrow::before {
          content: '';
          display: block;
          width: 32px;
          height: 1px;
          background: rgba(255,255,255,0.7);
        }

        .hiw-steps {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2px;
        }

        .hiw-step {
          padding: 40px 36px;
          border: 1px solid rgba(255,255,255,0.06);
          position: relative;
          transition: border-color 0.2s;
        }

        .hiw-step:hover {
          border-color: rgba(250,204,21,0.2);
        }

        .step-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 64px;
          line-height: 1;
          color: rgba(255,255,255,0.44);
          position: absolute;
          top: 20px;
          right: 24px;
          pointer-events: none;
          user-select: none;
        }

        .step-icon {
          width: 36px;
          height: 36px;
          border: 1px solid rgba(250,204,21,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 28px;
          clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px));
        }

        .step-icon svg {
          width: 16px;
          height: 16px;
          stroke: var(--yellow);
          fill: none;
          stroke-width: 1.5;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .step-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 28px;
          letter-spacing: 0.05em;
          color: var(--paper);
          margin-bottom: 12px;
        }

        .step-desc {
          font-size: 12px;
          color: rgba(255,255,255,0.7);
          line-height: 1.9;
          letter-spacing: 0.02em;
          max-width: 240px;
        }

        @media (max-width: 860px) {
          .hiw { padding: 60px 24px 80px; }
          .hiw-steps { grid-template-columns: 1fr; }
        }

        /* footer bar */
        .footer {
          position: relative;
          z-index: 10;
          padding: 20px 40px;
          border-top: 1px solid rgba(255,255,255,0.06);
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 100%;
        }

        .footer-copy {
          font-size: 10px;
          letter-spacing: 0.1em;
          color: rgba(255,255,255,0.15);
        }

        .ticker {
          overflow: hidden;
          white-space: nowrap;
          max-width: 300px;
        }

        .ticker-inner {
          display: inline-block;
          animation: ticker 18s linear infinite;
          font-size: 10px;
          letter-spacing: 0.15em;
          color: rgba(255,255,255,0.12);
          text-transform: uppercase;
        }

        @keyframes ticker {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }

        /* floating tag */
        .tag {
          position: absolute;
          top: 48px;
          right: 40px;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 6px;
          opacity: 0.4;
        }

        .tag-line {
          width: 1px;
          height: 60px;
          background: var(--yellow);
          margin-left: auto;
        }

        .tag-text {
          font-size: 9px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--yellow);
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }

        /* responsive */
        @media (max-width: 860px) {
          .hero {
            grid-template-columns: 1fr;
            padding: 60px 24px 40px;
            gap: 48px;
          }

          .screenshot-frame {
            transform: rotate(0deg);
            animation: none;
          }

          .screenshot-img {
            max-height: 260px;
          }

          .header { padding: 20px 24px; }
          .footer { padding: 16px 24px; }
          .tag { display: none; }
        }

        /* entrance animations */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .eyebrow { animation: fadeUp 0.6s ease both; animation-delay: 0.1s; opacity: 0; }
        .headline { animation: fadeUp 0.7s ease both; animation-delay: 0.25s; opacity: 0; }
        .sub { animation: fadeUp 0.6s ease both; animation-delay: 0.4s; opacity: 0; }
        .cta-row { animation: fadeUp 0.6s ease both; animation-delay: 0.55s; opacity: 0; }
      `}</style>

      <canvas ref={canvasRef} className="bg" />
      <div className="grid-overlay" />

      <div className="page">
        {/* Header */}
        <header className="header">
          <span className="header-logo">ScheduleMe</span>
          <span className="header-badge">v2.0 — Live</span>
        </header>

        {/* Hero */}
        <main className="hero">
          <div className="tag">
            <div className="tag-line" />
            <span className="tag-text">Team OS</span>
          </div>

          {/* Left: copy */}
          <div className="hero-copy">
            <p className="eyebrow">Team Scheduling Software | ScheduleMe</p>

            <h1 className="headline">
              Your team.
              <span className="accent">On time.</span>
            </h1>

            <p className="sub">
              Shifts, roles, and availability — managed without the spreadsheet
              chaos. Built for teams that move fast.
            </p>

            <div className="cta-row">
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

          {/* Right: product screenshot */}
          <div className="hero-visual">
            <div className="screenshot-frame">
              <div className="screenshot-chrome">
                <span className="chrome-dot" />
                <span className="chrome-dot" />
                <span className="chrome-dot" />
                <span className="chrome-url">app.scheduleme.io / schedule</span>
              </div>
              {/*
                Replace the src below with your actual screenshot path.
                e.g. src="/screenshots/calendar.png"
                The object-fit: cover + max-height crops out the bottom sparse rows
                and the today olive-highlight automatically.
              */}
              <img
                className="screenshot-img"
                src="/cal.png"
                alt="ScheduleMe calendar showing team shifts"
              />
            </div>
            <span className="screenshot-label">Live schedule view</span>
          </div>
        </main>
        {/* How it works */}
        <section className="hiw">
          <p className="hiw-eyebrow">How it works</p>
          <div className="hiw-steps">
            <div className="hiw-step">
              <span className="step-num">01</span>
              <div className="step-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3 className="step-title">Add your team</h3>
              <p className="step-desc">
                Invite your crew — they're in within seconds. No app download.
              </p>
            </div>

            <div className="hiw-step">
              <span className="step-num">02</span>
              <div className="step-icon">
                <svg viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                  <path d="M9 16l2 2 4-4" />
                </svg>
              </div>
              <h3 className="step-title">Block off busy days</h3>
              <p className="step-desc">
                Each member marks when they can't work. No back and forth, no
                group chat chaos.
              </p>
            </div>

            <div className="hiw-step">
              <span className="step-num">03</span>
              <div className="step-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M1 6l11 7L23 6" />
                  <rect x="1" y="4" width="22" height="16" rx="2" />
                </svg>
              </div>
              <h3 className="step-title">Schedule with confidence</h3>
              <p className="step-desc">
                See everyone's availability in one view. Build the schedule in
                minutes, not hours.
              </p>
            </div>
          </div>
        </section>
        {/* Footer */}
        <footer className="footer">
          <span className="footer-copy">© 2026 ScheduleMe</span>
          <div className="ticker">
            <span className="ticker-inner">
              Shifts · Roles · Availability · Teams · Scheduling · Simple · Fast
              · Reliable · Shifts · Roles · Availability ·
            </span>
          </div>
        </footer>
      </div>
    </>
  );
}
