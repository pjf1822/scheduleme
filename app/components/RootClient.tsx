"use client";

import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

export default function RootClient() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

        /* grid overlay */
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

        /* hero */
        .hero {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          padding: 80px 40px 60px;
          max-width: 900px;
          margin: 0 auto;
          width: 100%;
          gap: 0;
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
          font-size: clamp(72px, 13vw, 160px);
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
          margin-top: 40px;
          font-size: 13px;
          color: rgba(255,255,255,0.35);
          max-width: 360px;
          line-height: 1.8;
          letter-spacing: 0.02em;
        }

        .cta-row {
          margin-top: 48px;
          display: flex;
          align-items: center;
          gap: 24px;
          flex-wrap: wrap;
        }

        .btn-primary {
          background: var(--yellow);
          color: var(--ink);
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 14px 36px;
          border: none;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          position: relative;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
          clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
        }

        .btn-primary:hover {
          transform: translate(-2px, -2px);
          box-shadow: 4px 4px 0 rgba(250,204,21,0.3);
        }

        .btn-ghost {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          text-decoration: none;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          padding-bottom: 2px;
          transition: color 0.15s, border-color 0.15s;
        }

        .btn-ghost:hover {
          color: var(--paper);
          border-color: var(--paper);
        }

        /* stats strip */
        .stats {
          position: relative;
          z-index: 10;
          display: flex;
          gap: 0;
          border-top: 1px solid rgba(255,255,255,0.06);
          max-width: 900px;
          margin: 0 auto;
          width: 100%;
        }

        .stat {
          flex: 1;
          padding: 32px 40px;
          border-right: 1px solid rgba(255,255,255,0.06);
        }

        .stat:last-child { border-right: none; }

        .stat-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 42px;
          color: var(--paper);
          letter-spacing: 0.04em;
        }

        .stat-num span {
          color: var(--yellow);
        }

        .stat-label {
          font-size: 10px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.2);
          margin-top: 4px;
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

        /* big decorative number */
        .deco-num {
          position: absolute;
          right: -20px;
          bottom: 20px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(200px, 30vw, 400px);
          color: rgba(255,255,255,0.015);
          pointer-events: none;
          line-height: 1;
          user-select: none;
          z-index: 1;
        }

        @media (max-width: 600px) {
          .header { padding: 20px 24px; }
          .hero { padding: 60px 24px 40px; }
          .stats { flex-direction: column; }
          .stat { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.06); padding: 24px; }
          .footer { padding: 16px 24px; }
          .tag { display: none; }
          .deco-num { display: none; }
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
        .stats { animation: fadeUp 0.6s ease both; animation-delay: 0.7s; opacity: 0; }
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

          <div className="deco-num">01</div>

          <p className="eyebrow">Scheduling, simplified</p>

          <h1 className="headline">
            Your team.
            <span className="accent">On time.</span>
          </h1>

          <p className="sub">
            Shifts, roles, and availability — managed without the spreadsheet
            chaos. Built for teams that move fast.
          </p>

          <div className="cta-row">
            <Link href="/auth/login" className="btn-primary">
              Sign In →
            </Link>
            <a href="#" className="btn-ghost">
              Learn more
            </a>
          </div>
        </main>

        {/* Stats */}
        {/* <div className="stats">
          <div className="stat">
            <div className="stat-num">
              ∞<span>+</span>
            </div>
            <div className="stat-label">Shifts managed</div>
          </div>
          <div className="stat">
            <div className="stat-num">
              1<span>min</span>
            </div>
            <div className="stat-label">Setup time</div>
          </div>
          <div className="stat">
            <div className="stat-num">
              0<span>bs</span>
            </div>
            <div className="stat-label">Complexity</div>
          </div>
        </div> */}

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
