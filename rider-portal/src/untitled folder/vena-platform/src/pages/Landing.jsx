// src/pages/Landing.jsx
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import {
  HeartPulse, Activity, MapPin, Car, QrCode, ShieldCheck,
  Database, Server, Smartphone, Lock, ArrowRight,
  AlertTriangle, Building, Quote, TrendingUp, Globe,
  Users, Play, ChevronRight, Zap, Target, Menu, X
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   ANIMATED COUNTER HOOK
   ═══════════════════════════════════════════════════════════════ */
function useCounter(end, decimals = 0, duration = 2200) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  useEffect(() => {
    if (!isInView) return;
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(parseFloat((eased * end).toFixed(decimals)));
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, end, decimals, duration]);

  return { count, ref };
}

/* ═══════════════════════════════════════════════════════════════
   ANIMATED BAR CHART — Blood demand growth
   ═══════════════════════════════════════════════════════════════ */
const BarChart = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const bars = [
    { year: "'19", value: 62, units: '12.1M' },
    { year: "'20", value: 58, units: '11.4M' },
    { year: "'21", value: 68, units: '12.8M' },
    { year: "'22", value: 76, units: '13.5M' },
    { year: "'23", value: 84, units: '14.0M' },
    { year: "'24", value: 92, units: '14.4M' },
    { year: "'25", value: 100, units: '14.6M' },
  ];

  return (
    <div ref={ref} className="flex items-end gap-1.5 sm:gap-2 h-36 mt-4">
      {bars.map((bar, i) => (
        <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={isInView ? { height: `${bar.value}%`, opacity: 1 } : {}}
            transition={{ duration: 0.9, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="w-full rounded-t-lg relative group cursor-pointer"
            style={{
              background: i === bars.length - 1
                ? 'linear-gradient(to top, #C12026, #ff4d4d)'
                : 'linear-gradient(to top, rgba(193,32,38,0.2), rgba(193,32,38,0.45))',
            }}
          >
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {bar.units}
            </div>
          </motion.div>
          <span className="text-[10px] text-slate-400 font-bold">{bar.year}</span>
        </div>
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   ANIMATED DONUT CHART — Supply deficit visualization
   ═══════════════════════════════════════════════════════════════ */
const DonutChart = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const supplyPercent = 0.93;

  return (
    <div ref={ref} className="relative w-36 h-36 mx-auto mt-4">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        {/* Background ring */}
        <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(193,32,38,0.1)" strokeWidth="7" />
        {/* Supplied portion */}
        <motion.circle
          cx="50" cy="50" r={radius} fill="none"
          stroke="url(#donutGrad)" strokeWidth="7" strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={isInView ? { strokeDashoffset: circumference * (1 - supplyPercent) } : {}}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
        />
        {/* Deficit portion highlighted */}
        <motion.circle
          cx="50" cy="50" r={radius} fill="none"
          stroke="#C12026" strokeWidth="7" strokeLinecap="round"
          strokeDasharray={`${circumference * 0.07} ${circumference * 0.93}`}
          strokeDashoffset={-circumference * supplyPercent}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 1.5 }}
        />
        <defs>
          <linearGradient id="donutGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(193,32,38,0.3)" />
            <stop offset="100%" stopColor="rgba(193,32,38,0.5)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black text-[#C12026]">7%</span>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gap</span>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   ANIMATED AREA CHART — Surgery cancellation trend
   ═══════════════════════════════════════════════════════════════ */
const AreaChart = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const points = [
    { x: 0, y: 72 }, { x: 28, y: 65 }, { x: 56, y: 70 },
    { x: 84, y: 58 }, { x: 112, y: 62 }, { x: 140, y: 50 },
    { x: 168, y: 55 }, { x: 200, y: 45 },
  ];
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const areaPath = `${linePath} L200,100 L0,100 Z`;

  return (
    <div ref={ref} className="mt-4">
      <svg viewBox="0 0 200 100" className="w-full h-32" preserveAspectRatio="none">
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(193,32,38,0.3)" />
            <stop offset="100%" stopColor="rgba(193,32,38,0)" />
          </linearGradient>
        </defs>
        {/* Grid lines */}
        {[25, 50, 75].map((y) => (
          <line key={y} x1="0" y1={y} x2="200" y2={y} stroke="rgba(0,0,0,0.05)" strokeDasharray="4,4" />
        ))}
        {/* Area fill */}
        <motion.path
          d={areaPath} fill="url(#areaGrad)"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.3 }}
        />
        {/* Line */}
        <motion.path
          d={linePath} fill="none" stroke="#C12026" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : {}}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        />
        {/* Data points */}
        {points.map((p, i) => (
          <motion.circle
            key={i} cx={p.x} cy={p.y} r="3" fill="white" stroke="#C12026" strokeWidth="2"
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.3, delay: 0.2 * i + 0.5 }}
          />
        ))}
      </svg>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   ANIMATED ECG HEARTBEAT LINE
   ═══════════════════════════════════════════════════════════════ */
const HeartbeatLine = ({ className = '' }) => {
  const ecgSegment = "M0,50 L12,50 L16,50 L20,25 L24,75 L28,42 L32,50 L50,50 L54,44 L58,56 L62,50 L80,50";

  return (
    <div className={`overflow-hidden ${className}`}>
      <svg viewBox="0 0 800 100" className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="ecgGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="20%" stopColor="rgba(193,32,38,0.6)" />
            <stop offset="80%" stopColor="rgba(193,32,38,0.6)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        {[0, 80, 160, 240, 320, 400, 480, 560, 640, 720].map((offset) => (
          <g key={offset} transform={`translate(${offset}, 0)`}>
            <motion.path
              d={ecgSegment} fill="none" stroke="url(#ecgGrad)" strokeWidth="1.5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: [0, 1, 1, 0] }}
              transition={{ duration: 3, delay: offset * 0.004, repeat: Infinity, ease: 'linear' }}
            />
          </g>
        ))}
      </svg>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   FLOATING BLOOD CELL (Premium Version)
   ═══════════════════════════════════════════════════════════════ */
const BloodCell = ({ style, delay = 0, size = 'md', dark = false }) => {
  const sizes = { sm: 'w-6 h-10', md: 'w-10 h-16', lg: 'w-14 h-24', xl: 'w-18 h-32' };
  return (
    <motion.div
      className={`absolute ${sizes[size]} pointer-events-none z-0`}
      style={{ ...style, filter: 'blur(1px)' }}
      animate={{
        y: [0, -40, 0],
        rotate: [-15, 10, -15],
        opacity: [0.4, 0.8, 0.4],
      }}
      transition={{ duration: 8 + delay, delay, repeat: Infinity, ease: 'easeInOut' }}
    >
      <div className="w-full h-full rounded-full" style={{
        background: dark
          ? 'radial-gradient(ellipse at 30% 25%, #ff6b6b, #C12026 50%, #6b0000)'
          : 'radial-gradient(ellipse at 30% 25%, #ff9999, #DC3545 50%, #8B0000)',
        boxShadow: '0 8px 32px rgba(193,32,38,0.3)',
      }} />
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   GLASS CARD COMPONENT
   ═══════════════════════════════════════════════════════════════ */
const GlassCard = ({ children, className = '', dark = false, ...props }) => (
  <motion.div
    className={`${dark
      ? 'bg-white/[0.06] border-white/[0.08] shadow-2xl shadow-black/20'
      : 'bg-white/70 border-white/60 shadow-xl shadow-red-100/15'
    } backdrop-blur-2xl border rounded-[1.5rem] ${className}`}
    {...props}
  >
    {children}
  </motion.div>
);


/* ═══════════════════════════════════════════════════════════════
   MAIN LANDING COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();

  const stat1 = useCounter(14.6, 1);
  const stat2 = useCounter(1, 0);
  const stat3 = useCounter(7.8, 1);

  // Framer Motion Variants
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
  };
  const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
  };

  return (
    <div className="min-h-screen font-sans text-slate-900 overflow-x-hidden selection:bg-[#C12026] selection:text-white">

      {/* ══════ Film Grain Overlay (subtle) ══════ */}
      <svg className="fixed inset-0 w-full h-full pointer-events-none z-[100]" style={{ opacity: 0.025 }}>
        <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" /></filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>

      {/* ══════ Scroll Progress Bar ══════ */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#C12026] to-[#ff4d4d] z-[60] origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      {/* ══════════════════════════════════════════════
           NAVBAR — Floating Glassmorphism
           ══════════════════════════════════════════════ */}
      <div className="fixed top-3 left-0 right-0 z-50 px-4">
        <nav className="max-w-6xl mx-auto bg-white/80 backdrop-blur-2xl border border-white/50 shadow-lg shadow-slate-200/15 rounded-full px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="bg-gradient-to-br from-[#C12026] to-[#E8434A] p-2 rounded-xl shadow-md shadow-red-500/20">
              <HeartPulse size={20} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-black tracking-tight bg-gradient-to-r from-[#C12026] to-[#E8434A] bg-clip-text text-transparent">VENA</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-[13px] font-bold text-slate-500">
            {['About', 'Workflow', 'Impact', 'Business'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-[#C12026] transition-colors duration-300 relative group">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#C12026] rounded-full group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login" className="bg-gradient-to-r from-[#C12026] to-[#E8434A] text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg shadow-red-500/20 flex items-center gap-2 group hover:shadow-xl transition-all">
              Enter Portal <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-[#C12026]">
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="md:hidden max-w-6xl mx-auto mt-2 bg-white/95 backdrop-blur-2xl border border-white/60 shadow-xl rounded-3xl p-6 flex flex-col gap-3">
              {['About', 'Workflow', 'Impact', 'Business'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)} className="text-sm font-bold text-slate-600 hover:text-[#C12026] py-2">{item}</a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ══════════════════════════════════════════════
           HERO — Cinematic Dark Section
           ══════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
        
        {/* Background Red Glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[700px] h-[700px] bg-[#C12026] rounded-full blur-[200px] opacity-[0.12]" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#C12026] rounded-full blur-[180px] opacity-[0.08]" />
          <div className="absolute top-[40%] left-[60%] w-[300px] h-[300px] bg-red-900 rounded-full blur-[120px] opacity-[0.06]" />
        </div>

        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        {/* Floating Blood Cells */}
        <BloodCell style={{ top: '10%', left: '5%' }} size="lg" delay={0} dark />
        <BloodCell style={{ top: '15%', right: '8%' }} size="xl" delay={2} dark />
        <BloodCell style={{ bottom: '20%', left: '3%' }} size="md" delay={1} dark />
        <BloodCell style={{ bottom: '15%', right: '5%' }} size="lg" delay={3} dark />
        <BloodCell style={{ top: '50%', left: '15%' }} size="sm" delay={4} dark />

        {/* ECG Line */}
        <HeartbeatLine className="absolute bottom-0 left-0 right-0 h-24 opacity-30" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="text-center">

            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.06] backdrop-blur-md border border-white/[0.08] text-red-400 text-xs font-bold uppercase tracking-[0.25em] mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C12026] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C12026]" />
              </span>
              Team Astranova &middot; 2026
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-black text-white tracking-tight leading-[1.05] mb-8">
              Right Donor.
              <br />
              <span className="bg-gradient-to-r from-[#C12026] via-[#ff4d4d] to-[#C12026] bg-clip-text text-transparent bg-[length:200%_100%] animate-gradient">
                Right Place. Right Time.
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
              A zero-inventory logistics solution for emergency blood supply.
              We predict hospital shortages before they happen and dispatch frictionless, free rides for donors.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link to="/login" className="w-full sm:w-auto bg-gradient-to-r from-[#C12026] to-[#E8434A] text-white px-8 py-4 rounded-full text-base font-bold shadow-2xl shadow-red-900/40 flex items-center justify-center gap-2 hover:scale-[1.03] active:scale-[0.97] transition-all group">
                Launch Hospital Portal <Activity size={18} className="group-hover:animate-pulse" />
              </Link>
              <a href="#story" className="w-full sm:w-auto bg-white/[0.06] backdrop-blur-sm border border-white/[0.1] text-white px-8 py-4 rounded-full text-base font-bold flex items-center justify-center hover:bg-white/[0.1] transition-all hover:scale-[1.03] active:scale-[0.97]">
                The Origin Story
              </a>
            </motion.div>

            {/* Floating Glass Stat Pills */}
            <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-4">
              {[
                { label: 'Hospitals Onboarded', value: '12+', icon: Building },
                { label: 'Lives Impacted', value: '2,400+', icon: HeartPulse },
                { label: 'Avg Response Time', value: '< 45 min', icon: Zap },
              ].map((stat, i) => (
                <GlassCard key={i} dark className="px-5 py-3 flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#C12026]/20 rounded-xl flex items-center justify-center">
                    <stat.icon size={16} className="text-[#C12026]" />
                  </div>
                  <div>
                    <p className="text-white font-black text-sm">{stat.value}</p>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">{stat.label}</p>
                  </div>
                </GlassCard>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex items-start justify-center pt-2">
            <div className="w-1 h-2.5 bg-[#C12026] rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════
           SCROLLING MARQUEE TICKER
           ══════════════════════════════════════════════ */}
      <div className="bg-[#C12026] py-4 overflow-hidden relative">
        <motion.div
          className="flex gap-12 whitespace-nowrap text-white/90 text-sm font-bold uppercase tracking-[0.2em]"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        >
          {[...Array(2)].map((_, setIdx) => (
            <React.Fragment key={setIdx}>
              {[
                '14.6M Units Required Annually',
                '✦',
                '1M+ Unit Deficit Every Year',
                '✦',
                '7.8% Surgeries Cancelled',
                '✦',
                'Zero-Inventory Logistics',
                '✦',
                'Free Uber/Ola Rides for Donors',
                '✦',
                '3 km Geohash Matching',
                '✦',
              ].map((text, i) => (
                <span key={`${setIdx}-${i}`} className="mx-6">{text}</span>
              ))}
            </React.Fragment>
          ))}
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════════
           WHAT IS VENA — Premium Glass Section
           ══════════════════════════════════════════════ */}
      <section id="about" className="py-24 sm:py-32 px-4 bg-gradient-to-b from-[#FAFAFA] to-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-red-50 rounded-full blur-[120px] opacity-50" />
        <BloodCell style={{ top: '10%', right: '5%' }} size="lg" delay={1} />
        <BloodCell style={{ bottom: '15%', left: '3%' }} size="md" delay={2} />

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger}>
            
            <motion.div variants={fadeUp} className="text-center mb-16">
              <span className="inline-block text-[#C12026] text-xs font-black uppercase tracking-[0.3em] mb-4">About the Platform</span>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight">
                What is <span className="text-[#C12026]">VENA</span>?
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <motion.div variants={fadeUp}>
                <p className="text-lg sm:text-xl text-slate-600 leading-relaxed font-medium mb-6">
                  Vena is an <strong className="text-slate-900">emergency blood logistics platform</strong> built exclusively for hospitals.
                  It monitors blood stock in real time and, when a blood group is expected to fall below a{' '}
                  <span className="text-[#C12026] font-black bg-red-50 px-2 py-0.5 rounded-md">24-HOUR SAFE BUFFER</span>,
                  it finds nearby registered donors before the hospital reaches zero.
                </p>
                <p className="text-base text-slate-500 leading-relaxed font-medium mb-8">
                  Donor transport is automatically arranged through a free ride via Uber or Ola.
                  A dynamic QR code completes the verification loop at the hospital desk — preventing misuse
                  and ensuring every donation is tracked end-to-end.
                </p>
                <div className="flex flex-wrap gap-3">
                  {['Real-Time Monitoring', 'Predictive Alerts', 'Free Transport', 'QR Verification'].map((tag) => (
                    <span key={tag} className="bg-red-50 text-[#C12026] text-xs font-bold px-4 py-2 rounded-full border border-red-100">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Right side: Feature cards with glassmorphism */}
              <motion.div variants={stagger} className="grid grid-cols-2 gap-4">
                {[
                  { icon: Target, title: 'Predictive Matching', desc: 'Real-time donor matching based on blood type, location & eligibility' },
                  { icon: Zap, title: 'Zero Inventory', desc: 'No costly blood storage dependency — donors are the inventory' },
                  { icon: Car, title: 'Free Transport', desc: 'Frictionless Uber/Ola rides for donors at zero cost to them' },
                  { icon: ShieldCheck, title: 'Verified Loop', desc: 'End-to-end QR verification prevents any misuse or fraud' },
                ].map((f, i) => (
                  <motion.div
                    key={i} variants={fadeUp}
                    whileHover={{ y: -6, scale: 1.02 }}
                    className="bg-white border border-slate-100 rounded-2xl p-5 shadow-md shadow-slate-100/50 hover:shadow-xl hover:border-red-100 transition-all duration-300 group"
                  >
                    <div className="w-11 h-11 bg-red-50 group-hover:bg-[#C12026] rounded-xl flex items-center justify-center mb-3 transition-all duration-300">
                      <f.icon size={20} className="text-[#C12026] group-hover:text-white transition-colors" />
                    </div>
                    <h4 className="font-black text-slate-900 text-sm mb-1">{f.title}</h4>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">{f.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
           THE CRISIS — Animated Charts & Graphs
           ══════════════════════════════════════════════ */}
      <section id="impact" className="py-24 sm:py-32 px-4 bg-gradient-to-b from-white via-[#FFF8F8] to-white relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-50 rounded-full blur-[120px] opacity-40" />

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger}>

            <motion.div variants={fadeUp} className="text-center mb-16">
              <span className="inline-block text-[#C12026] text-xs font-black uppercase tracking-[0.3em] mb-4">The Blood Crisis</span>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight mb-4">
                India's Silent <span className="text-[#C12026]">Emergency</span>
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto font-medium">
                The numbers behind the crisis that inspired VENA.
              </p>
            </motion.div>

            {/* Three Chart Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Chart 1: Bar Chart */}
              <motion.div variants={fadeUp} whileHover={{ y: -6 }}
                className="bg-white border border-slate-100 rounded-[2rem] p-7 shadow-lg shadow-slate-100/50 hover:shadow-xl transition-all">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-1">Annual Demand</p>
                    <div ref={stat1.ref} className="text-4xl sm:text-5xl font-black text-[#C12026] tracking-tight">
                      {stat1.count}M
                    </div>
                  </div>
                  <div className="bg-red-50 p-2 rounded-xl">
                    <TrendingUp size={18} className="text-[#C12026]" />
                  </div>
                </div>
                <p className="text-xs text-slate-400 font-medium mb-2">blood units required annually in India</p>
                <BarChart />
                <p className="text-[10px] text-slate-300 font-bold mt-3 uppercase tracking-wider">Demand Growth 2019–2025</p>
              </motion.div>

              {/* Chart 2: Donut Chart */}
              <motion.div variants={fadeUp} whileHover={{ y: -6 }}
                className="bg-white border border-slate-100 rounded-[2rem] p-7 shadow-lg shadow-slate-100/50 hover:shadow-xl transition-all">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-1">Supply Deficit</p>
                    <div ref={stat2.ref} className="text-4xl sm:text-5xl font-black text-[#C12026] tracking-tight">
                      {stat2.count}M<span className="text-3xl">+</span>
                    </div>
                  </div>
                  <div className="bg-red-50 p-2 rounded-xl">
                    <AlertTriangle size={18} className="text-[#C12026]" />
                  </div>
                </div>
                <p className="text-xs text-slate-400 font-medium mb-0">unit deficit every year across hospitals</p>
                <DonutChart />
                <p className="text-[10px] text-slate-300 font-bold mt-3 uppercase tracking-wider text-center">Supply vs Demand Gap</p>
              </motion.div>

              {/* Chart 3: Area Chart */}
              <motion.div variants={fadeUp} whileHover={{ y: -6 }}
                className="bg-white border border-slate-100 rounded-[2rem] p-7 shadow-lg shadow-slate-100/50 hover:shadow-xl transition-all">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-1">Surgeries Cancelled</p>
                    <div ref={stat3.ref} className="text-4xl sm:text-5xl font-black text-[#C12026] tracking-tight">
                      {stat3.count}%
                    </div>
                  </div>
                  <div className="bg-red-50 p-2 rounded-xl">
                    <Activity size={18} className="text-[#C12026]" />
                  </div>
                </div>
                <p className="text-xs text-slate-400 font-medium mb-0">5.3% directly due to unavailability of blood</p>
                <AreaChart />
                <p className="text-[10px] text-slate-300 font-bold mt-3 uppercase tracking-wider">Cancellation Trend by Quarter</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
           HOW VENA WORKS — 4 Steps
           ══════════════════════════════════════════════ */}
      <section id="workflow" className="py-24 sm:py-32 px-4 bg-[#0a0a0a] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[20%] left-[-5%] w-[400px] h-[400px] bg-[#C12026] rounded-full blur-[180px] opacity-[0.08]" />
          <div className="absolute bottom-[10%] right-[-5%] w-[350px] h-[350px] bg-red-800 rounded-full blur-[160px] opacity-[0.06]" />
        </div>
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger}>

            <motion.div variants={fadeUp} className="text-center mb-16">
              <span className="inline-block text-red-400 text-xs font-black uppercase tracking-[0.3em] mb-4">The Workflow</span>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight">
                How VENA <span className="text-[#C12026]">Works</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
              
              {/* Connecting Line (lg only) */}
              <div className="hidden lg:block absolute top-[4.5rem] left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-[#C12026]/30 to-transparent z-0" />

              {[
                { icon: AlertTriangle, step: '01', title: 'DETECT', desc: 'Monitors hospital blood stock in real time. Triggers a predictive alert before the 24-hour safe buffer is breached.' },
                { icon: MapPin, step: '02', title: 'MATCH', desc: 'Executes geohash indexing to instantly find compatible registered donors within a 3 km radius of the hospital.' },
                { icon: Car, step: '03', title: 'DISPATCH', desc: 'Secures donor consent and automatically books a free cab via Uber/Ola using their live GPS coordinates.' },
                { icon: QrCode, step: '04', title: 'COMPLETE', desc: 'Donor arrives and verifies the donation at the hospital desk through a secure, dynamic QR code scan.' },
              ].map((s, i) => (
                <motion.div key={i} variants={fadeUp} whileHover={{ y: -10 }}
                  className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.06] rounded-[1.5rem] p-7 relative z-10 group hover:bg-white/[0.08] transition-all duration-500">
                  <div className="w-14 h-14 bg-[#C12026]/10 group-hover:bg-[#C12026] rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 shadow-lg shadow-red-900/10 group-hover:shadow-red-900/30">
                    <s.icon size={24} className="text-[#C12026] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <p className="text-[#C12026] text-xs font-black tracking-[0.3em] mb-2">STEP {s.step}</p>
                  <h3 className="text-xl font-black text-white mb-3">{s.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed font-medium">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
           VIDEO SECTION — Cinematic
           ══════════════════════════════════════════════ */}
      <section className="py-24 sm:py-32 px-4 bg-gradient-to-b from-[#0a0a0a] to-[#111] relative overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger}>

            <motion.div variants={fadeUp} className="text-center mb-12">
              <span className="inline-block text-red-400 text-xs font-black uppercase tracking-[0.3em] mb-4">See it in Action</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
                The VENA <span className="text-[#C12026]">Experience</span>
              </h2>
            </motion.div>

            {/* Video Player */}
            <motion.div variants={fadeUp}
              className="relative rounded-[2rem] overflow-hidden border border-white/[0.06] shadow-2xl shadow-black/40 group cursor-pointer"
              style={{ aspectRatio: '16/9' }}
            >
              {/* Gradient Placeholder (replace with actual video/thumbnail) */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a0a0a] via-[#2a0808] to-[#0a0a0a]">
                {/* Heartbeat line across video */}
                <HeartbeatLine className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-20 opacity-40" />
                {/* Subtle red glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#C12026] rounded-full blur-[120px] opacity-[0.15]" />
              </div>

              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-20 h-20 sm:w-24 sm:h-24 bg-[#C12026] rounded-full flex items-center justify-center shadow-2xl shadow-red-900/50 group-hover:shadow-red-800/60 transition-all"
                >
                  <Play size={32} className="text-white ml-1" fill="white" />
                </motion.div>
              </div>

              {/* Glass overlay info */}
              <div className="absolute bottom-6 left-6 right-6 z-10 flex items-center justify-between">
                <GlassCard dark className="px-4 py-2.5 flex items-center gap-3">
                  <HeartPulse size={16} className="text-[#C12026]" />
                  <span className="text-white text-xs font-bold">VENA Platform Demo</span>
                </GlassCard>
                <GlassCard dark className="px-4 py-2.5">
                  <span className="text-white/60 text-xs font-bold">2:47</span>
                </GlassCard>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
           BUSINESS MODEL & PILOT STRATEGY
           ══════════════════════════════════════════════ */}
      <section id="business" className="py-24 sm:py-32 px-4 bg-gradient-to-b from-[#FAFAFA] to-white relative overflow-hidden">
        <BloodCell style={{ top: '5%', right: '4%' }} size="lg" delay={0.5} />
        <BloodCell style={{ bottom: '10%', left: '5%' }} size="md" delay={2.5} />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            {/* Business Model */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
              <motion.div variants={fadeUp}>
                <span className="text-[#C12026] text-xs font-black uppercase tracking-[0.3em]">Revenue Streams</span>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2 mb-8">Business Model</h2>
              </motion.div>

              {[
                { icon: Database, title: 'B2B SaaS', tag: 'Hospitals · Monthly Subscription', desc: 'Tiered monthly subscriptions based on hospital size and bed count to secure predictive blood inventory management.' },
                { icon: ShieldCheck, title: 'CSR Management', tag: 'Corporates · 10–15% Platform Fee', desc: 'Tech giants sponsor emergency rides, gaining instant, measurable, geo-tagged CSR impact reports.' },
                { icon: Activity, title: 'Pay-Per-Match', tag: 'Clinics · ₹500 – ₹1,000 / Match', desc: 'Flat fee charged to local clinics only when a verified donor successfully arrives and donates.' },
              ].map((item, i) => (
                <motion.div key={i} variants={fadeUp} whileHover={{ x: 6 }}
                  className="bg-white border border-slate-100 rounded-2xl p-6 shadow-md shadow-slate-100/50 hover:shadow-xl hover:border-red-100 flex items-start gap-4 mb-4 transition-all duration-300 group">
                  <div className="w-12 h-12 bg-red-50 group-hover:bg-[#C12026] rounded-xl flex items-center justify-center shrink-0 transition-all duration-300">
                    <item.icon size={22} className="text-[#C12026] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h4 className="font-black text-lg text-slate-900 mb-0.5">{item.title}</h4>
                    <p className="text-[10px] font-black text-[#C12026] tracking-[0.15em] uppercase mb-2">{item.tag}</p>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Pilot Strategy */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
              <motion.div variants={fadeUp}>
                <span className="text-[#C12026] text-xs font-black uppercase tracking-[0.3em]">Go-To-Market</span>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2 mb-8">Pilot Strategy</h2>
              </motion.div>

              {[
                { icon: MapPin, num: '01', text: 'Start with one high-volume private hospital in a metro city.' },
                { icon: Building, num: '02', text: 'Partner with one corporate tech sponsor for the first 500 rides.' },
                { icon: Users, num: '03', text: 'Acquire donors from nearby tech parks & university campuses (within 3 km).' },
                { icon: Globe, num: '04', text: 'Build local density before expanding outward to adjacent hospitals.' },
              ].map((item, i) => (
                <motion.div key={i} variants={fadeUp} whileHover={{ x: 6 }}
                  className="flex items-start gap-4 bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:border-red-100 mb-4 transition-all duration-300">
                  <div className="w-10 h-10 bg-[#C12026] rounded-xl flex items-center justify-center shrink-0 shadow-md shadow-red-500/20">
                    <span className="text-white text-xs font-black">{item.num}</span>
                  </div>
                  <div className="flex items-center gap-3 pt-1.5">
                    <item.icon size={16} className="text-[#C12026] shrink-0" />
                    <p className="text-slate-700 font-semibold text-sm leading-relaxed">{item.text}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
           ORIGIN STORY — Cinematic Quote
           ══════════════════════════════════════════════ */}
      <section id="story" className="py-24 sm:py-32 px-4 bg-[#0a0a0a] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[30%] left-[50%] -translate-x-1/2 w-[500px] h-[500px] bg-[#C12026] rounded-full blur-[200px] opacity-[0.08]" />
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={stagger}>

            <motion.div variants={fadeUp}
              className="bg-white/[0.04] backdrop-blur-2xl border border-white/[0.06] rounded-[2.5rem] p-8 sm:p-12 relative overflow-hidden shadow-2xl">

              {/* Red accent bar */}
              <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[#C12026] to-[#ff4d4d]" />
              <Quote size={120} className="text-white/[0.02] absolute top-4 right-4 rotate-12" />

              <div className="flex flex-col lg:flex-row gap-10">
                <div className="flex-1">
                  <p className="text-[#C12026] text-xs font-black uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
                    <span className="w-8 h-px bg-[#C12026]" /> A Real Incident, 2024
                  </p>

                  <p className="text-xl sm:text-2xl text-white/90 leading-relaxed font-medium italic mb-5">
                    "In 2024, my uncle was rushed to the ICU requiring an immediate transfusion of O-Negative blood
                    for a critical, life-saving surgery. The hospital's blood bank was completely empty."
                  </p>
                  <p className="text-base sm:text-lg text-white/50 leading-relaxed font-medium italic mb-5">
                    "As my family scrambled for blood, frantically making calls and posting desperate WhatsApp statuses,
                    a harsh realization hit me: just three blocks away, there were likely dozens of healthy, O-Negative individuals
                    sitting in cafes or offices who would have gladly donated."
                  </p>
                  <p className="text-base sm:text-lg text-white/50 leading-relaxed font-medium italic mb-10">
                    "Because they had no idea my uncle existed, his surgery was dangerously delayed.
                    We lost precious hours not to a lack of human empathy, but to a{' '}
                    <span className="text-[#C12026] font-bold not-italic">catastrophic failure in logistics.</span>"
                  </p>

                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#C12026] to-[#E8434A] rounded-full flex items-center justify-center text-white font-black text-lg shadow-lg shadow-red-900/30">
                      KP
                    </div>
                    <div>
                      <p className="font-black text-white text-lg">Krishnayan Kashyap Pathak</p>
                      <p className="text-sm text-[#C12026] font-bold tracking-wide">Innovator, VENA</p>
                    </div>
                  </div>
                </div>

                {/* Tagline Card */}
                <div className="lg:w-60 shrink-0">
                  <div className="bg-gradient-to-br from-[#C12026] to-[#7a0f13] rounded-[2rem] p-8 text-center shadow-2xl shadow-red-900/30 h-full flex flex-col items-center justify-center min-h-[240px]">
                    <h3 className="text-white text-2xl sm:text-3xl font-black leading-tight mb-5 tracking-tight">
                      RIGHT<br />DONOR.<br />RIGHT<br />PLACE.<br />RIGHT<br />TIME.
                    </h3>
                    <div className="flex items-center gap-2">
                      <div className="bg-white/20 p-1.5 rounded-full">
                        <HeartPulse size={18} className="text-white" />
                      </div>
                      <span className="text-white text-lg font-black">VENA</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
           TECH STACK — Glass Cards
           ══════════════════════════════════════════════ */}
      <section className="py-24 sm:py-32 px-4 bg-gradient-to-b from-white to-[#FAFAFA] relative overflow-hidden">
        <BloodCell style={{ top: '8%', left: '4%' }} size="md" delay={1} />
        <BloodCell style={{ bottom: '12%', right: '6%' }} size="lg" delay={3} />

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger}>

            <motion.div variants={fadeUp} className="text-center mb-14">
              <span className="inline-block text-[#C12026] text-xs font-black uppercase tracking-[0.3em] mb-4">Infrastructure</span>
              <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                Tech <span className="text-[#C12026]">Stack</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { icon: Smartphone, title: 'Frontend', items: ['React.js & Tailwind CSS', 'Framer Motion Animations'] },
                { icon: Database, title: 'Backend', items: ['Firebase Cloud Functions', 'Node.js & Webhooks'] },
                { icon: MapPin, title: 'Database', items: ['Firebase Firestore', 'Geohash 3km Indexing'] },
                { icon: Car, title: 'Mobility', items: ['Uber Direct / Ola APIs', 'e-RaktKosh / HL7 FHIR'] },
                { icon: Lock, title: 'Security', items: ['Razorpay UPI Pre-Auth', 'Dynamic QR Engine'] },
              ].map((tech, i) => (
                <motion.div key={i} variants={fadeUp} whileHover={{ y: -6 }}
                  className="bg-white border border-slate-100 rounded-2xl p-5 shadow-md shadow-slate-100/50 hover:shadow-xl hover:border-red-100 transition-all duration-300 group">
                  <div className="w-10 h-10 bg-red-50 group-hover:bg-[#C12026] rounded-xl flex items-center justify-center mb-4 transition-all duration-300">
                    <tech.icon size={18} className="text-[#C12026] group-hover:text-white transition-colors" />
                  </div>
                  <h4 className="font-black text-slate-900 text-sm mb-2">{tech.title}</h4>
                  {tech.items.map((item, j) => (
                    <p key={j} className="text-[11px] text-slate-400 font-medium leading-relaxed">{item}</p>
                  ))}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
           FOOTER CTA — Dramatic Dark
           ══════════════════════════════════════════════ */}
      <footer className="bg-[#0a0a0a] pt-28 pb-12 text-center text-white relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#C12026] rounded-full blur-[250px] opacity-[0.1] pointer-events-none" />
        <HeartbeatLine className="absolute top-[40%] left-0 right-0 h-16 opacity-20" />

        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>

            <motion.div variants={fadeUp} className="mb-8">
              <div className="inline-flex items-center gap-2.5 bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] rounded-full p-2 pr-5">
                <div className="bg-gradient-to-br from-[#C12026] to-[#E8434A] p-2.5 rounded-full shadow-lg shadow-red-900/30">
                  <HeartPulse size={22} className="text-white" strokeWidth={2.5} />
                </div>
                <span className="text-white text-lg font-black">VENA</span>
              </div>
            </motion.div>

            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-8 leading-tight tracking-tight">
              Someone's tomorrow depends on
              <br className="hidden sm:block" /> a{' '}
              <span className="bg-gradient-to-r from-[#C12026] to-[#ff4d4d] bg-clip-text text-transparent">
                20-minute ride
              </span>{' '}
              today.
            </motion.h2>

            <motion.div variants={fadeUp}>
              <Link to="/login"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#C12026] to-[#E8434A] text-white px-10 py-5 rounded-full text-lg font-bold shadow-2xl shadow-red-900/40 mb-20 hover:scale-105 active:scale-95 transition-all group">
                Launch Command Center <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="border-t border-white/[0.06] pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-600">
              <p>Vena Logistics © 2026</p>
              <p className="text-slate-500 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#C12026] rounded-full" />
                Connecting People. Saving Lives.
                <span className="w-1.5 h-1.5 bg-[#C12026] rounded-full" />
              </p>
              <p>Team Astranova</p>
            </motion.div>
          </motion.div>
        </div>
      </footer>

      {/* ══════ Gradient Text Animation Keyframe (injected via style tag) ══════ */}
      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          animation: gradient 4s ease infinite;
        }
      `}</style>
    </div>
  );
}
