/* Langogo demo deck (React 18). Source: src/app.jsx, compiled to site/app.js. */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createRoot } from 'react-dom/client';

const DEMO_URL = 'https://langogo-v3.vercel.app';
const DEV_URL = 'https://github.com/daniel7long/langogo';
const SLIDES = [
  { id: 'beef', label: 'The Beef', theme: 'light', steps: 0 },
  { id: 'gap', label: 'The Gap', theme: 'dark', steps: 3 },
  { id: 'app', label: 'The App', theme: 'dark', steps: 0 },
  { id: 'accessibility', label: 'Accessibility', theme: 'light', steps: 0 },
  { id: 'cost', label: 'Cost', theme: 'light', steps: 0 },
  { id: 'limitations', label: 'Limitations', theme: 'light', steps: 0 },
  { id: 'references', label: 'References', theme: 'light', steps: 1 },
];
const reducedMotion = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- sound: synthesised with Web Audio, no audio files ---------- */
let audioCtx = null;
let liveNodes = [];
function getCtx() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    try { audioCtx = new AC(); } catch (e) { return null; }
  }
  if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
  return audioCtx;
}
function stopIgnite() {
  liveNodes.forEach((n) => { try { n.stop(); } catch (e) {} });
  liveNodes = [];
}
function playIgnite() {
  const ctx = getCtx();
  if (!ctx) return;
  stopIgnite();
  const t0 = ctx.currentTime + 0.05;
  const master = ctx.createGain();
  master.gain.value = 0.9;
  master.connect(ctx.destination);

  const noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 5, ctx.sampleRate);
  const d = noiseBuf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const noise = () => { const s = ctx.createBufferSource(); s.buffer = noiseBuf; liveNodes.push(s); return s; };

  // 1. whoosh: band-passed noise sweeping upward
  const w = noise(), wf = ctx.createBiquadFilter(), wg = ctx.createGain();
  wf.type = 'bandpass'; wf.Q.value = 1.2;
  wf.frequency.setValueAtTime(180, t0); wf.frequency.exponentialRampToValueAtTime(3200, t0 + 0.9); wf.frequency.exponentialRampToValueAtTime(500, t0 + 1.9);
  wg.gain.setValueAtTime(0.0001, t0); wg.gain.exponentialRampToValueAtTime(0.7, t0 + 0.8); wg.gain.exponentialRampToValueAtTime(0.0001, t0 + 2.0);
  w.connect(wf).connect(wg).connect(master); w.start(t0); w.stop(t0 + 2.1);

  // 2. fire bed: low rumbling noise with random crackle
  const f = noise(), ff = ctx.createBiquadFilter(), fg = ctx.createGain();
  ff.type = 'lowpass'; ff.frequency.value = 520;
  fg.gain.setValueAtTime(0.0001, t0);
  for (let i = 1; i < 44; i++) fg.gain.linearRampToValueAtTime((0.1 + Math.random() * 0.3) * Math.max(0, 1 - i / 44), t0 + i * 0.1);
  fg.gain.linearRampToValueAtTime(0.0001, t0 + 4.5);
  f.connect(ff).connect(fg).connect(master); f.start(t0); f.stop(t0 + 4.6);

  // 3. impact when the name lands
  const hit = t0 + 0.85;
  const o = ctx.createOscillator(), og = ctx.createGain();
  o.type = 'sine'; o.frequency.setValueAtTime(130, hit); o.frequency.exponentialRampToValueAtTime(38, hit + 0.7);
  og.gain.setValueAtTime(0.0001, t0); og.gain.setValueAtTime(0.9, hit); og.gain.exponentialRampToValueAtTime(0.0001, hit + 1.3);
  o.connect(og).connect(master); o.start(hit); o.stop(hit + 1.4); liveNodes.push(o);

  // 4. golden chord swell (D major) through an opening filter
  const cf = ctx.createBiquadFilter(), cg = ctx.createGain();
  cf.type = 'lowpass'; cf.frequency.setValueAtTime(300, hit); cf.frequency.exponentialRampToValueAtTime(5200, hit + 0.5); cf.frequency.exponentialRampToValueAtTime(900, hit + 3.2);
  cg.gain.setValueAtTime(0.0001, hit); cg.gain.exponentialRampToValueAtTime(0.16, hit + 0.12); cg.gain.exponentialRampToValueAtTime(0.0001, hit + 3.4);
  cf.connect(cg).connect(master);
  [146.83, 220, 293.66, 369.99, 440, 587.33].forEach((hz, i) => {
    const c = ctx.createOscillator(); c.type = 'sawtooth'; c.frequency.value = hz; c.detune.value = (i % 2 ? 7 : -7);
    c.connect(cf); c.start(hit); c.stop(hit + 3.5); liveNodes.push(c);
  });

  // 5. sparkles
  [1174.7, 1480, 1760, 2349.3].forEach((hz, i) => {
    const s = ctx.createOscillator(), sg = ctx.createGain(), at = hit + 0.25 + i * 0.16;
    s.type = 'sine'; s.frequency.value = hz;
    sg.gain.setValueAtTime(0.0001, at); sg.gain.exponentialRampToValueAtTime(0.09, at + 0.02); sg.gain.exponentialRampToValueAtTime(0.0001, at + 0.9);
    s.connect(sg).connect(master); s.start(at); s.stop(at + 1); liveNodes.push(s);
  });
}

let ackNodes = [];
function stopAck() {
  ackNodes.forEach((n) => { try { n.stop(); } catch (e) {} });
  ackNodes = [];
}
/* Pop-up sound: a soft "pop", a sparkling bell run (C major pentatonic), then a warm chord and a little shimmer. */
function playAck() {
  const ctx = getCtx();
  if (!ctx) return;
  stopAck();
  const t0 = ctx.currentTime + 0.03;
  const master = ctx.createGain();
  master.gain.value = 0.55;
  master.connect(ctx.destination);
  const keep = (n) => { ackNodes.push(n); return n; };

  // 1. pop: a quick rising sine blip
  const pop = keep(ctx.createOscillator()), pg = ctx.createGain();
  pop.type = 'sine';
  pop.frequency.setValueAtTime(260, t0); pop.frequency.exponentialRampToValueAtTime(720, t0 + 0.09);
  pg.gain.setValueAtTime(0.0001, t0); pg.gain.exponentialRampToValueAtTime(0.5, t0 + 0.015); pg.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.16);
  pop.connect(pg).connect(master); pop.start(t0); pop.stop(t0 + 0.2);

  // 2. bell run: each note is a sine plus a quiet octave-and-a-fifth overtone, with a bell-like decay
  const notes = [1046.5, 1318.5, 1568, 2093, 2637];
  notes.forEach((hz, i) => {
    const at = t0 + 0.1 + i * 0.085;
    const last = i === notes.length - 1;
    const len = last ? 1.5 : 0.7;
    [[1, 0.2], [2.76, 0.045], [5.4, 0.015]].forEach(([mult, vol]) => {
      const o = keep(ctx.createOscillator()), g = ctx.createGain();
      o.type = 'sine'; o.frequency.value = hz * mult;
      g.gain.setValueAtTime(0.0001, at);
      g.gain.exponentialRampToValueAtTime(vol * (last ? 1.25 : 1), at + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, at + len);
      o.connect(g).connect(master); o.start(at); o.stop(at + len + 0.05);
    });
  });

  // 3. warm chord underneath (C major triad) that blooms and fades
  const chordAt = t0 + 0.32;
  [523.25, 659.25, 783.99].forEach((hz) => {
    const o = keep(ctx.createOscillator()), g = ctx.createGain(), f = ctx.createBiquadFilter();
    o.type = 'triangle'; o.frequency.value = hz;
    f.type = 'lowpass'; f.frequency.value = 2200;
    g.gain.setValueAtTime(0.0001, chordAt);
    g.gain.exponentialRampToValueAtTime(0.09, chordAt + 0.18);
    g.gain.exponentialRampToValueAtTime(0.0001, chordAt + 1.6);
    o.connect(f).connect(g).connect(master); o.start(chordAt); o.stop(chordAt + 1.7);
  });

  // 4. shimmer: a few tiny high twinkles
  [3136, 3951, 3520, 4186, 3136, 4699].forEach((hz, i) => {
    const at = t0 + 0.55 + i * 0.075;
    const o = keep(ctx.createOscillator()), g = ctx.createGain();
    o.type = 'sine'; o.frequency.value = hz;
    g.gain.setValueAtTime(0.0001, at); g.gain.exponentialRampToValueAtTime(0.04, at + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, at + 0.28);
    o.connect(g).connect(master); o.start(at); o.stop(at + 0.32);
  });
}

/* ---------- small shared pieces ---------- */
function Wave() {
  return (
    <svg viewBox="0 0 30 30" aria-hidden="true">
      {[[3, 11, 8], [9, 5, 20], [15, 9, 12], [21, 3, 24], [27, 12, 6]].map(([x, y, h], i) => (
        <rect key={i} x={x - 2} y={y} width="4" height={h} rx="2" fill={i % 2 ? '#F47A20' : '#5B9E4A'} />
      ))}
    </svg>
  );
}
function Flower({ id = 'f' }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <radialGradient id={id + 'p'} cx="50%" cy="30%" r="80%"><stop offset="0" stopColor="#FFC27A" /><stop offset="1" stopColor="#E8650F" /></radialGradient>
        <radialGradient id={id + 'c'} cx="40%" cy="35%" r="70%"><stop offset="0" stopColor="#FFFBE0" /><stop offset="1" stopColor="#FFC93C" /></radialGradient>
      </defs>
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <ellipse key={a} cx="50" cy="25" rx="15" ry="22" fill={`url(#${id}p)`} stroke="#C4520A" strokeWidth="1.5" transform={`rotate(${a} 50 50)`} />
      ))}
      <circle cx="50" cy="50" r="15" fill={`url(#${id}c)`} stroke="#D99A10" strokeWidth="2" />
    </svg>
  );
}

/* ---------- 1. The BEEF ---------- */
function PhoneVideo({ src, label, onWantPlay, vref }) {
  const [playing, setPlaying] = useState(false);
  const [pct, setPct] = useState(0);
  const toggle = () => {
    const v = vref.current;
    if (!v) return;
    if (v.paused) {
      onWantPlay();
      if (v.ended) v.currentTime = 0;
      v.playbackRate = 1.2;
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
    } else v.pause();
  };
  return (
    <div className="phone-wrap">
      <button className={'phone' + (playing ? ' playing' : '')} onClick={toggle} aria-label={(playing ? 'Pause ' : 'Play ') + label + ' at 1.2 times speed'}>
        <video
          ref={vref} src={src} playsInline preload="auto"
          onPlay={(e) => { e.currentTarget.playbackRate = 1.2; setPlaying(true); }}
          onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)}
          onTimeUpdate={(e) => { const v = e.currentTarget; setPct(v.duration ? (v.currentTime / v.duration) * 100 : 0); }}
        />
        <span className="veil"><span className="play-dot"><svg viewBox="0 0 24 24"><path d="M6 3.5v17a1 1 0 0 0 1.5.86l14-8.5a1 1 0 0 0 0-1.72l-14-8.5A1 1 0 0 0 6 3.5z" /></svg></span></span>
        <span className="rate">1.2×</span>
        <span className="bar"><i style={{ width: pct + '%' }} /></span>
      </button>
      <div className="phone-label">{label}</div>
    </div>
  );
}
function BeefSlide() {
  const a = useRef(null), b = useRef(null);
  return (
    <section className="slide">
      <p className="eyebrow">Part 1</p>
      <h1>The <em>BEEF</em></h1>
      <div className="phones">
        <PhoneVideo src="beef-a.mp4" label="App #1" vref={a} onWantPlay={() => b.current && b.current.pause()} />
        <span className="vs" aria-hidden="true">vs</span>
        <PhoneVideo src="beef-b.mp4" label="App #2" vref={b} onWantPlay={() => a.current && a.current.pause()} />
      </div>
    </section>
  );
}

/* ---------- 2. The GAP ---------- */
function GapSlide({ step, onAdvance }) {
  const show = (n) => (step < n ? ' wait' : '');
  return (
    <section className="slide gap" onClick={onAdvance}>
      <p className="eyebrow">Part 2 · The GAP</p>
      <div className="gap-grid">
        <div className="gap-left">
          <p className="gap-q">What's the <span className="never">GAP</span> here?</p>
          <ul className={'gap-nos' + show(1)} aria-hidden={step < 1}>
            <li><b>No</b> Scaffolding</li>
            <li><b>No</b> Motivation</li>
            <li><b>No</b> Enjoyment</li>
          </ul>
        </div>
        <div className="gap-right">
          <p className={'gap-line1' + show(2)} aria-hidden={step < 2}>We <span className="never">NEVER</span> improved our language <span className="comp">COMPETENCE</span>.</p>
          <p className={'gap-line2' + show(3)} aria-hidden={step < 3}>What kind of language learning app do we need?</p>
        </div>
      </div>
    </section>
  );
}

/* ---------- 3. The APP ---------- */
function Flames({ run }) {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv || reducedMotion()) return;
    const g = cv.getContext('2d');
    const parts = [];
    let raf = 0, last = performance.now();
    const start = last;
    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      const t = (now - start) / 1000;
      // strong blaze while the name expands, then a steady low fire
      const power = t < 0.4 ? t / 0.4 : t < 2.4 ? 1 : Math.max(0.22, 1 - (t - 2.4) * 0.9);
      const spread = Math.min(1, 0.25 + t * 0.5);
      const n = Math.round(power * 9);
      for (let i = 0; i < n; i++) {
        parts.push({
          x: 800 + (Math.random() - 0.5) * 1150 * spread, y: 500 + Math.random() * 50,
          vx: (Math.random() - 0.5) * 50, vy: -(110 + Math.random() * 260) * (0.6 + power * 0.6),
          r: 22 + Math.random() * 46, life: 0, max: 0.6 + Math.random() * 0.9,
        });
      }
      g.clearRect(0, 0, 1600, 900);
      g.globalCompositeOperation = 'lighter';
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.life += dt;
        if (p.life >= p.max) { parts.splice(i, 1); continue; }
        p.x += p.vx * dt + Math.sin((p.life + i) * 7) * 0.7; p.y += p.vy * dt;
        const k = p.life / p.max, r = p.r * (1 - k * 0.65);
        const grad = g.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
        const a = (1 - k) * 0.34;
        grad.addColorStop(0, `rgba(255, ${Math.round(225 - k * 110)}, ${Math.round(130 - k * 120)}, ${a})`);
        grad.addColorStop(0.5, `rgba(255, ${Math.round(120 - k * 70)}, 10, ${a * 0.55})`);
        grad.addColorStop(1, 'rgba(160, 20, 0, 0)');
        g.fillStyle = grad;
        g.beginPath(); g.arc(p.x, p.y, r, 0, Math.PI * 2); g.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run]);
  return <canvas ref={ref} width="1600" height="900" aria-hidden="true" />;
}
function AppSlide() {
  const [run, setRun] = useState(0);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(false);
    playIgnite();
    const t = setTimeout(() => setReady(true), reducedMotion() ? 200 : 2500);
    return () => { clearTimeout(t); stopIgnite(); };
  }, [run]);
  return (
    <section className="slide appslide">
      <Flames run={run} />
      <button className="icon-btn replay" onClick={() => setRun((r) => r + 1)}>Replay intro</button>
      <div className="app-center" key={run}>
        <span className="ring" />
        <a className={'logo-link' + (ready ? ' ready' : '')} href={DEMO_URL} target="_blank" rel="noopener noreferrer" tabIndex={ready ? 0 : -1} aria-label="LANGOGO, open the live demo in a new tab">LANGOGO</a>
        <p className={'slogan' + (ready ? ' shown' : '')}>Speak a language freely and confidently.</p>
      </div>
    </section>
  );
}

/* ---------- 4. Accessibility ---------- */
const Check = () => <svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>;
const Bang = () => <svg viewBox="0 0 24 24"><path d="M12 5v9M12 18.5v.5" /></svg>;
function AccessibilitySlide() {
  return (
    <section className="slide">
      <p className="eyebrow">Part 4</p>
      <h1>Accessibility</h1>
      <div className="cols two">
        <div className="col good">
          <h2><span className="tag"><Check /></span>Works well</h2>
          <ul>
            <li><b>Open access:</b> free, runs in a browser, no install, phone or laptop.</li>
            <li><b>16 languages;</b> sign in with Google or email.</li>
            <li><b>Low-anxiety design:</b> private practice, one-tap retry, no failing grade, opt-in leaderboard.</li>
            <li><b>Two channels:</b> every model line is shown as text and played as audio.</li>
          </ul>
        </div>
        <div className="col bad">
          <h2><span className="tag"><Bang /></span>Barriers</h2>
          <ul>
            <li><b>Speech is the only path.</b> Learners with speech or hearing disabilities have no equivalent route through a lesson.</li>
            <li><b>Scoring assumes typical speech.</b> Strong accents, stutters or atypical speech can be scored unfairly.</li>
            <li><b>Needs</b> a stable connection, a microphone and a quiet place.</li>
          </ul>
        </div>
      </div>
      <p className="note">Based on Langogo's specification and feature set. A formal WCAG audit has not been done.</p>
    </section>
  );
}

/* ---------- 5. Cost ---------- */
function CostTag({ id, n }) {
  return <span className="cost-tag"><Flower id={id} />{n ? n + ' flowers' : 'flowers'}</span>;
}
function CostSlide() {
  return (
    <section className="slide cost">
      <div className="free">
        <p className="eyebrow">Part 5 · Cost</p>
        <div className="big">Free</div>
        <span className="price">$0 to learn</span>
        <p>You pay nothing. The only currency in Langogo is the flowers you earn by speaking.</p>
      </div>
      <div className="eco">
        <h2>Flowers are the <span>currency</span> of the Langogo ecosystem</h2>
        <div className="eco-flow">
          <div className="earn">
            <div className="coin-scene">
              <div className="coin">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((z) => <i key={z} style={{ transform: `translateZ(${z - 1}px)` }} />)}
                <div className="face"><Flower id="coin" /></div>
              </div>
            </div>
            <div className="coin-shadow" />
            <b>Earn flowers</b>
            <span>by practising speaking</span>
          </div>
          <div className="arrow" aria-hidden="true">
            <svg viewBox="0 0 60 40"><path d="M4 20h44M36 8l14 12-14 12" fill="none" stroke="#D95F0E" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <div className="spend">
            <div className="tile">
              <div className="art">
                <svg viewBox="0 0 92 82" aria-hidden="true">
                  <ellipse cx="46" cy="74" rx="26" ry="5" fill="#C98A12" opacity=".35" />
                  <path d="M42 48h8v24h-8z" fill="#8A5A2B" /><path d="M46 48h4v24h-4z" fill="#6B4320" />
                  <circle cx="46" cy="30" r="24" fill="#5B9E4A" /><circle cx="30" cy="40" r="14" fill="#4C8A3D" /><circle cx="62" cy="40" r="14" fill="#3F7A30" />
                  <circle cx="40" cy="22" r="9" fill="#7DBE6B" opacity=".8" />
                </svg>
              </div>
              <div><b>Plant a tree</b><span>With Ecologi</span></div>
              <CostTag id="t1" n="100" />
            </div>
            <div className="tile">
              <div className="art">
                <svg viewBox="0 0 92 82" aria-hidden="true">
                  <ellipse cx="46" cy="72" rx="28" ry="5" fill="#2F6A22" opacity=".3" />
                  <path d="M34 22c-4-5 4-7 0-13M46 22c-4-5 4-7 0-13M58 22c-4-5 4-7 0-13" fill="none" stroke="#3F7A30" strokeWidth="3.5" strokeLinecap="round" />
                  <ellipse cx="46" cy="36" rx="30" ry="9" fill="#FFD768" />
                  <path d="M12 36h68c0 20-14 34-34 34S12 56 12 36z" fill="#F47A20" /><path d="M46 36h34c0 20-14 34-34 34z" fill="#D95F0E" />
                  <rect x="32" y="68" width="28" height="6" rx="3" fill="#B24E08" />
                </svg>
              </div>
              <div><b>Donate a meal</b><span>With ShareTheMeal</span></div>
              <CostTag id="t2" n="100" />
            </div>
            <div className="tile">
              <div className="art">
                <svg viewBox="0 0 92 82" aria-hidden="true">
                  <rect x="46" y="10" width="38" height="46" rx="6" fill="#FFF8E1" stroke="#C98A12" strokeWidth="5" />
                  <path d="M51 50l10-14 8 9 5-6 6 11z" fill="#5B9E4A" /><circle cx="74" cy="24" r="5" fill="#F47A20" />
                  <path d="M22 26l-14 10 7 11 7-4v29h30V43l7 4 7-11-14-10c-2 7-8 9-15 9s-13-2-15-9z" fill="#F47A20" stroke="#B24E08" strokeWidth="2.5" strokeLinejoin="round" />
                  <path d="M30 27c2 5 12 5 14 0" fill="none" stroke="#FFD768" strokeWidth="3.5" strokeLinecap="round" />
                </svg>
              </div>
              <div><b>Outfits, frames, wallpapers</b><span>For your profile</span></div>
              <CostTag id="t3" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- 6. Limitations ---------- */
const LIMITS = [
  ['Simulated interaction', 'Scripted dialogues and an AI partner are not the co-constructed, socially situated talk that builds interactional competence (Young, 2011).'],
  ['Scores form, not communication', 'Feedback rates pronunciation, fluency and completeness. Pragmatics, turn-taking and negotiating meaning go unmeasured.'],
  ['Speech recognition errors', 'Automatic scoring is less accurate for learner accents and mistakes, so some feedback might be inaccurate.'],
  ['No evidence yet', 'Whether practice transfers to real conversation is untested. No relevant research has been conducted.'],
];
function LimitationsSlide() {
  return (
    <section className="slide">
      <p className="eyebrow">Part 6</p>
      <h1>Limitations</h1>
      <div className="limits">
        {LIMITS.map(([h, p], i) => (
          <div className="limit" key={h}><span className="n">0{i + 1}</span><h2>{h}</h2><p>{p}</p></div>
        ))}
      </div>
    </section>
  );
}

/* ---------- 7. References (APA 7) ---------- */
const Doi = ({ url }) => <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>;
function ReferencesSlide({ step, onClose }) {
  useEffect(() => {
    if (step >= 1) playAck();
    return () => stopAck();
  }, [step >= 1]);
  return (
    <section className="slide">
      <p className="eyebrow">Part 7</p>
      <h1>References</h1>
      <ul className="refs">
        <li>Andrade, M. S. (2017). Online English language learning: Theory-based course design and pedagogy. <i>Journal of Education and Training Studies, 5</i>(3), 1–10. <Doi url="https://doi.org/10.11114/jets.v5i3.2058" /></li>
        <li>Chun, D., Kern, R., &amp; Smith, B. (2016). Technology in language use, language teaching, and language learning. <i>The Modern Language Journal, 100</i>(S1), 64–80. <Doi url="https://doi.org/10.1111/modl.12302" /></li>
        <li>Douglas Fir Group. (2016). A transdisciplinary framework for SLA in a multilingual world. <i>The Modern Language Journal, 100</i>(S1), 19–47. <Doi url="https://doi.org/10.1111/modl.12301" /></li>
        <li>Gacs, A., Goertler, S., &amp; Spasova, S. (2020). Planned online language education versus crisis-prompted online language teaching: Lessons for the future. <i>Foreign Language Annals, 53</i>(2), 380–392. <Doi url="https://doi.org/10.1111/flan.12460" /></li>
        <li>Sundqvist, P. (2019). Commercial-off-the-shelf games in the digital wild and L2 learner vocabulary. <i>Language Learning &amp; Technology, 23</i>(1), 87–113. <Doi url="https://doi.org/10125/44674" /></li>
        <li>Young, R. F. (2011). Interactional competence in language learning, teaching, and testing. In E. Hinkel (Ed.), <i>Handbook of research in second language teaching and learning</i> (Vol. 2, pp. 426–443). Routledge.</li>
      </ul>
      {step >= 1 && (
        <div className="ack-layer">
          <div className="ack-backdrop" onClick={onClose} />
          <div className="ack" role="dialog" aria-modal="true" aria-labelledby="ack-title">
            <button className="ack-close" onClick={onClose} aria-label="Close">×</button>
            <div className="ack-flower"><Flower id="ack" /></div>
            <p className="eyebrow" id="ack-title">Special Acknowledgement</p>
            <p className="ack-names">Claude Sonnet 5.5 <span>&amp;</span> Fable 5.2</p>
          </div>
          <p className="dev">Developer: <a href={DEV_URL} target="_blank" rel="noopener noreferrer">Daniel Long</a></p>
        </div>
      )}
    </section>
  );
}

/* ---------- shell ---------- */
function useStageScale() {
  const [box, setBox] = useState({ s: 1, w: 1600, h: 900 });
  useEffect(() => {
    const fit = () => setBox({ s: Math.min(window.innerWidth / 1600, window.innerHeight / 900), w: window.innerWidth, h: window.innerHeight });
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);
  return box;
}
const indexFromHash = () => Math.max(0, SLIDES.findIndex((s) => '#' + s.id === window.location.hash));

function App() {
  const [idx, setIdx] = useState(indexFromHash);
  const [step, setStep] = useState(0);
  const [full, setFull] = useState(false);
  const { s } = useStageScale();
  const pos = useRef({ idx, step });
  pos.current = { idx, step };

  const go = useCallback((i, st = 0) => {
    const n = Math.max(0, Math.min(SLIDES.length - 1, i));
    setIdx(n); setStep(st);
    try { if (window.location.hash !== '#' + SLIDES[n].id) window.location.hash = SLIDES[n].id; } catch (e) {}
  }, []);
  const next = useCallback(() => {
    const p = pos.current;
    if (p.step < SLIDES[p.idx].steps) setStep(p.step + 1);
    else if (p.idx < SLIDES.length - 1) go(p.idx + 1);
  }, [go]);
  const prev = useCallback(() => {
    const p = pos.current;
    if (p.step > 0) setStep(p.step - 1);
    else if (p.idx > 0) go(p.idx - 1, SLIDES[p.idx - 1].steps);
  }, [go]);
  const toggleFull = useCallback(() => {
    try {
      if (document.fullscreenElement) document.exitFullscreen();
      else { const r = document.documentElement.requestFullscreen(); if (r && r.catch) r.catch(() => {}); }
    } catch (e) {}
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = e.target && e.target.tagName;
      const onControl = tag === 'BUTTON' || tag === 'A';
      getCtx();
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === 'ArrowDown') { e.preventDefault(); next(); }
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp' || e.key === 'ArrowUp') { e.preventDefault(); prev(); }
      else if ((e.key === ' ' || e.key === 'Enter') && !onControl) { e.preventDefault(); next(); }
      else if (e.key === 'Home') go(0);
      else if (e.key === 'End') go(SLIDES.length - 1);
      else if (e.key === 'f' || e.key === 'F') toggleFull();
    };
    const onHash = () => { const i = indexFromHash(); if (i !== pos.current.idx) { setIdx(i); setStep(0); } };
    const onFull = () => setFull(!!document.fullscreenElement);
    const unlock = () => getCtx();
    window.addEventListener('keydown', onKey);
    window.addEventListener('hashchange', onHash);
    window.addEventListener('pointerdown', unlock);
    document.addEventListener('fullscreenchange', onFull);
    return () => {
      window.removeEventListener('keydown', onKey); window.removeEventListener('hashchange', onHash);
      window.removeEventListener('pointerdown', unlock); document.removeEventListener('fullscreenchange', onFull);
    };
  }, [next, prev, go, toggleFull]);

  const slide = SLIDES[idx];
  const atEnd = idx === SLIDES.length - 1 && step >= slide.steps;
  let body;
  if (slide.id === 'beef') body = <BeefSlide key="beef" />;
  else if (slide.id === 'gap') body = <GapSlide key="gap" step={step} onAdvance={next} />;
  else if (slide.id === 'app') body = <AppSlide key="app" />;
  else if (slide.id === 'accessibility') body = <AccessibilitySlide key="acc" />;
  else if (slide.id === 'cost') body = <CostSlide key="cost" />;
  else if (slide.id === 'limitations') body = <LimitationsSlide key="lim" />;
  else body = <ReferencesSlide key="ref" step={step} onClose={() => setStep(0)} />;

  return (
    <div className={'viewport ' + slide.theme}>
      <div className="stage" style={{ transform: `scale(${s}) translate(-50%, -50%)` }}>
        {body}
        <header className="topbar">
          <div className="brand"><Wave />Langogo</div>
          <div className="top-right">
            <span className="count">{String(idx + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}</span>
            <button className="icon-btn" onClick={toggleFull} aria-label={full ? 'Exit full screen' : 'Enter full screen'}>
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {full ? <path d="M6 1v5H1M10 1v5h5M6 15v-5H1M10 15v-5h5" /> : <path d="M1 6V1h5M15 6V1h-5M1 10v5h5M15 10v5h-5" />}
              </svg>
              {full ? 'Exit' : 'Full screen'}
            </button>
          </div>
        </header>
        <nav className="bottombar" aria-label="Demo sections">
          <button className="nav-btn" onClick={prev} disabled={idx === 0 && step === 0} aria-label="Previous">
            <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 3L5 9l6 6" /></svg>
          </button>
          <div className="steps">
            {SLIDES.map((sl, i) => (
              <button key={sl.id} className={'step' + (i === idx ? ' now' : i < idx ? ' done' : '')} onClick={() => go(i)} aria-current={i === idx ? 'step' : undefined}>
                {i + 1}. {sl.label}
              </button>
            ))}
          </div>
          <button className="nav-btn" onClick={next} disabled={atEnd} aria-label="Next">
            <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 3l6 6-6 6" /></svg>
          </button>
        </nav>
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
