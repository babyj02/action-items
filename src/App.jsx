import React, { useEffect, useRef } from "react";
import { Routes, Route, useNavigate, Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";

/* brighter sparkle cursor (2 sparkles per move) */
function useSparkleCursor() {
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const makeStar = (x, y) => {
      const s = document.createElement("span");
      s.className = "sparkle";
      s.style.left = x + "px";
      s.style.top = y + "px";
      s.style.setProperty("--dx", (Math.random() - 0.5) * 60 + "px");
      s.style.setProperty("--dy", (Math.random() - 0.5) * 60 + "px");
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 800);
    };

    let last = 0;
    const onMove = (e) => {
      const now = performance.now();
      if (now - last < 20) return; // light throttle
      last = now;
      makeStar(e.clientX, e.clientY);
      // a second sparkle slightly offset for visibility
      makeStar(e.clientX + 6, e.clientY - 4);
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
}

/* click heart burst */
function heartBurst(x, y) {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const n = prefersReduced ? 6 : 14;
  for (let i = 0; i < n; i++) {
    const h = document.createElement("div");
    h.className = "heart";
    h.style.left = x + "px";
    h.style.top = y + "px";
    h.style.setProperty("--dx", (Math.random() - 0.5) * 240 + "px");
    h.style.setProperty("--dy", (Math.random() - 0.9) * 260 + "px");
    h.style.setProperty("--rot", Math.random() * 360 + "deg");
    h.style.setProperty("--delay", Math.random() * 0.05 + "s");
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 1200);
  }
}

/* section card */
const Card = ({ title, children, id }) => (
  <motion.section
    id={id}
    className="card"
    initial={{ y: 24, opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
  >
    <h2>{title}</h2>
    {children}
  </motion.section>
);

/* ---------- HOME PAGE ---------- */
function Home() {
  useSparkleCursor();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const nav = useNavigate();

  const onAgree = (e) => {
    heartBurst(e.clientX, e.clientY);
    nav("/love");
  };

  return (
    <div className="page">
      {/* background ribbons */}
      <motion.div className="ribbon r1" style={{ y: y1 }} />
      <motion.div className="ribbon r2" style={{ y: y2 }} />

      {/* note: removed corner gifs per your request */}

      <div className="shell">
        <motion.header
          ref={heroRef}
          className="hero"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="badge">For my Gege • from your Kitty 🐱</div>
          <h1 className="title-strong">Action Items</h1>
          <p className="subtitle">
            Goal: Align on behaviors and expectations that create a healthy, emotionally safe, and respectful relationship for both of us.
          </p>

          <div className="hero-actions">
            <button
              className="btn"
              onClick={(e) => {
                heartBurst(e.clientX, e.clientY);
                window.print();
              }}
            >
              Print / Save PDF
            </button>
            <a className="btn ghost" href="#success">Jump to Success Criteria</a>
          </div>

          <div className="kawaii-hint">scroll ↓ for cute moments</div>
        </motion.header>

        <Card title="1) My Action Items">
          <ul className="list">
            <li><span className="dot" />Improve emotional regulation: pause and communicate when I feel overwhelmed instead of shutting down.</li>
            <li><span className="dot" />Eliminate personal attacks or reactive comments. Focus on constructive communication.</li>
            <li><span className="dot" />Limit rehashing of past issues; address them once calmly, seek resolution, and move forward.</li>
          </ul>
        </Card>

        <Card title="2) Your Action Items">
          <ul className="list">
            <li><span className="dot" />Maintain emotional safety: listen and validate before defending or problem-solving.</li>
            <li><span className="dot" />Remove double standards. If you wouldn’t want me doing something, don’t do it.</li>
            <li><span className="dot" />Consider my sensitivity before engaging with others—if I saw it, would it feel respectful?</li>
            <li><span className="dot" />Avoid controlling language or restrictions; trust should define boundaries.</li>
          </ul>
        </Card>

        <Card title="3) Joint Action Items">
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Category</th><th>Action</th><th>Frequency</th><th>Owner</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Check-ins</td><td>15-minute weekly sync for emotional & physical health of relationship</td><td>Weekly</td><td>Both</td></tr>
                <tr><td>Conflict</td><td>No personal insults or withdrawal; resolve respectfully</td><td>Ongoing</td><td>Both</td></tr>
                <tr><td>Intimacy</td><td>Align expectations: approx. 1–2× weekly based on mutual comfort & consent</td><td>Weekly</td><td>Both</td></tr>
                <tr><td>Transparency</td><td>Communicate triggers or discomfort directly</td><td>Ongoing</td><td>Both</td></tr>
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="4) Success Criteria" id="success">
          <ul className="list">
            <li><span className="dot" />Mutual respect and emotional safety maintained.</li>
            <li><span className="dot" />Zero unresolved conflicts carried into next week.</li>
            <li><span className="dot" />Affection and trust outweigh tension or control.</li>
          </ul>
        </Card>

        {/* sticky agree bar */}
        <motion.div
          className="agree"
          initial={{ y: 80, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="agree-text">If you agree, tap the heart — your Kitty will feel it 💞</div>
          <button className="btn big" onClick={onAgree}>I Agree 💗</button>
        </motion.div>

        <footer className="foot">
          <span>💗 Built with love & accountability • <span className="sig">— Your Kitty</span></span>
        </footer>
      </div>
    </div>
  );
}

/* ---------- LOVE PAGE ---------- */
function Love() {
  useSparkleCursor();
  return (
    <div className="love-wrap">
      <div className="love-card">
        <h1 className="love-title">我爱你，哥哥 💗</h1>
        <p className="love-sub">
          From your Kitty: thanks for choosing growth, listening, and respect. <br />
          yyds gege — 我们一起加油，好吗？
        </p>

        {/* keep only the main gif */}
        <img
          className="love-gif"
          alt="cute love gif"
          src="https://media.giphy.com/media/MDJ9IbxxvDUQM/giphy.gif"
        />

        <Link to="/" className="btn back">返回主页 • Back to Home</Link>
      </div>
    </div>
  );
}

/* ---------- ROUTES ---------- */
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/love" element={<Love />} />
    </Routes>
  );
}
