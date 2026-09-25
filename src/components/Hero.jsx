import { motion, useMotionValue, useTransform, animate, useSpring } from 'framer-motion';
import { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';

// Ensure you have these assets in your project, including the fort silhouettes
import ruchikaImg from '../assets/gincube_ruchika.jpeg';
import abhishekImg from '../assets/gincub_abhisek.jpeg';
// import leftFortImg from '../assets/left_fort.png'; 
// import rightFortImg from '../assets/right_fort.png';

const MotionLink = motion(Link);

/* ═══════════════════════════════════════════════════
   BRAND TOKENS (Navy Blue & Golden Yellow Theme)
═══════════════════════════════════════════════════ */
const C = {
  primary:   '#15436B', // Navy Blue
  mid:       '#1C5A8F', // Mid Blue
  light:     '#287BBE', // Light Blue
  pale:      '#E2E8F0', // Pale Slate for borders
  lt:        '#F8FAFC', 
  heading:   '#0A2236', // Dark Slate for main text
  text:      '#475569', 
  muted:     '#64748B', 
  accent:    '#EA9F24', // Chatbot Golden Yellow!
  accentLight:'#F3C57B', 
  accentPale: '#FEF3C7', 
  bg:        '#FFFFFF', // White base
  bgGradient:'#F3F8FF', // Soft blue tint for radial backgrounds
  white:     '#FFFFFF',
  gradientText: 'linear-gradient(90deg, #15436B 0%, #287BBE 100%)', // Navy to Blue for dynamic text
};

/* ═══════════════════════════════════════════════════
   TYPEWRITER HOOK  
═══════════════════════════════════════════════════ */
const WORDS = ['Changemakers', 'Entrepreneurs', 'Innovators', 'Startups', 'Visionaries'];

const useTypewriter = (words = WORDS, speed = 72, pause = 2000) => {
  const [display, setDisplay] = useState('');
  const state = useRef({ wordIdx: 0, charIdx: 0, deleting: false, paused: false });

  useEffect(() => {
    let raf;
    let lastTime = 0;

    const tick = (now) => {
      const s = state.current;
      const delay = s.paused ? pause : s.deleting ? speed * 0.45 : speed;
      if (now - lastTime < delay) { raf = requestAnimationFrame(tick); return; }
      lastTime = now;

      const word = words[s.wordIdx];

      if (s.paused) {
        s.paused = false;
        s.deleting = true;
        raf = requestAnimationFrame(tick);
        return;
      }

      if (!s.deleting) {
        s.charIdx = Math.min(s.charIdx + 1, word.length);
        setDisplay(word.slice(0, s.charIdx));
        if (s.charIdx === word.length) s.paused = true;
      } else {
        s.charIdx = Math.max(s.charIdx - 1, 0);
        setDisplay(word.slice(0, s.charIdx));
        if (s.charIdx === 0) {
          s.deleting = false;
          s.wordIdx = (s.wordIdx + 1) % words.length;
        }
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [words, speed, pause]);

  return display;
};

/* ═══════════════════════════════════════════════════
   ANIMATED COUNTER
═══════════════════════════════════════════════════ */
const Counter = ({ to, suffix = '', duration = 2.2, delay = 0.8 }) => {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        setTimeout(() => {
          const c = animate(0, to, {
            duration,
            ease: [0.16, 1, 0.3, 1],
            onUpdate: v => setVal(Math.round(v)),
          });
          return () => c.stop();
        }, delay * 1000);
      }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [to, duration, delay]);

  return <span ref={ref}>{val}{suffix}</span>;
};

/* ═══════════════════════════════════════════════════
   SHIMMER BUTTON
═══════════════════════════════════════════════════ */
const ShimmerBtn = ({ children, to, href, onClick, secondary = false, style = {}, ...props }) => {
  const Tag = to ? MotionLink : (href ? motion.a : motion.button);
  
  return (
    <Tag
      to={to}
      href={href}
      onClick={onClick}
      whileHover={{ y: -3, scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      {...props} 
      style={{
        position: 'relative', overflow: 'hidden',
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '12px 28px', borderRadius: 100,
        fontWeight: 700, fontSize: 16,
        fontFamily: 'inherit', cursor: 'pointer',
        textDecoration: 'none', border: 'none',
        ...(secondary ? {
          background: C.white,
          border: `1.5px solid ${C.pale}`,
          color: C.heading,
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.05)',
        } : {
          // Yellow Gradient Button
          background: `linear-gradient(90deg, #EA9F24 0%, #D68A1B 100%)`,
          color: C.white,
          boxShadow: `0 10px 25px rgba(234, 159, 36, 0.35)`,
        }),
        ...style,
      }}
    >
      {!secondary && (
        <motion.span
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.3) 50%, transparent 65%)',
            transform: 'translateX(-100%)',
          }}
          animate={{ transform: ['translateX(-100%)', 'translateX(200%)'] }}
          transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 1.2, ease: 'easeInOut' }}
        />
      )}
      <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
        {children}
      </span>
    </Tag>
  );
};

/* ═══════════════════════════════════════════════════
   FLOATING BADGE CARD
═══════════════════════════════════════════════════ */
const FloatingCard = ({ icon, title, sub, side, mouseX, mouseY, delay }) => {
  const factor = side === 'left' ? -0.15 : 0.15;
  const tx = useTransform(mouseX, v => v * factor);
  const ty = useTransform(mouseY, v => v * -0.1);

  return (
    <motion.div
      initial={{ opacity: 0, x: side === 'left' ? -40 : 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'absolute',
        top: side === 'left' ? '35%' : '32%',
        [side]: 'clamp(20px, 8vw, 120px)',
        display: 'none', 
        zIndex: 20,
        x: tx, y: ty,
      }}
      className="floating-badge"
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          display: 'flex', alignItems: 'center', gap: 12,
          background: C.white,
          border: `1px solid ${C.pale}`,
          borderRadius: 16, padding: '12px 20px',
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.06)',
          whiteSpace: 'nowrap',
        }}
      >
        <div style={{
           background: C.accentPale, 
           width: 36, height: 36, 
           borderRadius: '50%', 
           display: 'flex', alignItems: 'center', justifyContent: 'center',
           fontSize: 18,
           color: C.accent
        }}>
          {icon}
        </div>
        <div>
          <p style={{ margin: 0, fontWeight: 800, fontSize: 14, color: C.heading }}>{title}</p>
          <p style={{ margin: '2px 0 0', fontSize: 12, color: C.accent, fontWeight: 600 }}>{sub}</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════
   STAT ITEM
═══════════════════════════════════════════════════ */
const StatItem = ({ value, suffix, label, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
    style={{ textAlign: 'center', minWidth: 100 }}
  >
    <p style={{ margin: 0, fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 800, color: C.heading, lineHeight: 1 }}>
      <Counter to={value} suffix={suffix} delay={delay} />
    </p>
    <p style={{ margin: '8px 0 0', fontSize: 13, color: C.muted, fontWeight: 500 }}>
      {label}
    </p>
  </motion.div>
);

/* ═══════════════════════════════════════════════════
   MAIN HERO COMPONENT
═══════════════════════════════════════════════════ */
const Hero = () => {
  const typed = useTypewriter(WORDS);
  const heroRef = useRef(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springConfig = { stiffness: 50, damping: 20 };
  const mouseX = useSpring(rawX, springConfig);
  const mouseY = useSpring(rawY, springConfig);

  const handleMouseMove = useCallback((e) => {
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set(((e.clientX - rect.left) / rect.width  - 0.5) * 30);
    rawY.set(((e.clientY - rect.top)  / rect.height - 0.5) * 30);
  }, [rawX, rawY]);

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <>
      <style>{`
        @media (min-width: 1024px) { .floating-badge { display: block !important; } }
        .hero-stat-divider { display: none; }
        @media (min-width: 768px) { .hero-stat-divider { display: block; } }
      `}</style>

      <section
        ref={heroRef}
        onMouseMove={handleMouseMove}
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: '80px',
          paddingBottom: '60px',
          overflow: 'hidden',
          background: C.bg,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        {/* Background Gradients & Shapes */}
        <div style={{
          position: 'absolute', top: '-10%', left: '-5%', width: '40vw', height: '40vw',
          background: 'radial-gradient(circle, rgba(21, 67, 107, 0.06) 0%, transparent 60%)',
          zIndex: 0, pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-10%', right: '-5%', width: '45vw', height: '45vw',
          background: 'radial-gradient(circle, rgba(234, 159, 36, 0.06) 0%, transparent 60%)',
          zIndex: 0, pointerEvents: 'none',
        }} />

        {/* Building Overlays (Corners) - Replace src with your actual assets */}
        <div style={{
            position: 'absolute', bottom: 0, left: 0, width: '35vw', maxWidth: '500px',
            opacity: 0.9, zIndex: 1, pointerEvents: 'none',
        }}>
            {/* <img src={leftFortImg} alt="Gwalior Fort Left" style={{ width: '100%', height: 'auto', display: 'block' }} /> */}
            <div style={{ width: '100%', height: '300px', background: 'linear-gradient(to top right, rgba(15,23,42,0.1), transparent)', borderTopRightRadius: '100%' }}></div>
        </div>

        <div style={{
            position: 'absolute', bottom: 0, right: 0, width: '35vw', maxWidth: '500px',
            opacity: 0.9, zIndex: 1, pointerEvents: 'none',
        }}>
           {/* <img src={rightFortImg} alt="Gwalior Fort Right" style={{ width: '100%', height: 'auto', display: 'block' }} /> */}
           <div style={{ width: '100%', height: '350px', background: 'linear-gradient(to top left, rgba(15,23,42,0.1), transparent)', borderTopLeftRadius: '100%' }}></div>
        </div>

        {/* Floating Badges */}
        <FloatingCard icon="🏆" title="Top Incubator" sub="MP Govt. Recognized" side="left"  mouseX={mouseX} mouseY={mouseY} delay={0.5} />
        <FloatingCard icon="💡" title="₹2Cr+ Funding" sub="Raised by our cohort" side="right" mouseX={mouseX} mouseY={mouseY} delay={0.7} />

        {/* Main Content Container */}
        <div style={{ position: 'relative', zIndex: 10, maxWidth: 900, margin: '0 auto', padding: '0 20px', textAlign: 'center' }}>
          
          <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }}>
            
            {/* Eyebrow */}
            <motion.div variants={fadeUp} style={{ marginBottom: 20 }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: C.white, border: `1px solid ${C.pale}`,
                borderRadius: 100, padding: '6px 16px',
                fontSize: 13, fontWeight: 600, color: C.primary,
                boxShadow: '0 4px 10px rgba(0,0,0,0.03)'
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.accent }} />
                Gwalior Smart City Initiative
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 variants={fadeUp} style={{
                fontSize: 'clamp(40px, 6vw, 76px)',
                fontWeight: 900, color: C.heading,
                lineHeight: 1.1, margin: '0 0 10px',
                letterSpacing: '-1px'
            }}>
              Empowering <br/>
              
              {/* Dynamic Gradient Text with Wavy Underline */}
              <span style={{ position: 'relative', display: 'inline-block' }}>
                <span style={{
                    background: C.gradientText,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                }}>
                  {typed}
                </span>
                
                <motion.svg
                  width="100%" height="16" viewBox="0 0 320 16"
                  preserveAspectRatio="none"
                  style={{ position: 'absolute', bottom: -5, left: 0, width: '100%' }}
                  initial={{ opacity: 0, pathLength: 0 }}
                  animate={{ opacity: 1, pathLength: 1 }}
                  transition={{ duration: 1, delay: 0.8, ease: 'easeOut' }}
                >
                  <path
                    d="M0 10 Q40 2 80 10 Q120 18 160 10 Q200 2 240 10 Q280 18 320 10"
                    stroke={C.accent} strokeWidth="4" fill="none" strokeLinecap="round"
                  />
                </motion.svg>
              </span>
              <br/>
              to Build Tomorrow
            </motion.h1>

            {/* Subtext */}
            <motion.p variants={fadeUp} style={{
                fontSize: 'clamp(15px, 2vw, 17px)', color: C.text,
                maxWidth: 680, margin: '24px auto 36px',
                lineHeight: 1.6, fontWeight: 400
            }}>
              G.Incube the Gwalior Smart City Incubation Center - provides resources,
              mentorship, and a launchpad to turn your boldest ideas into thriving ventures.
            </motion.p>

            {/* Buttons */}
            <motion.div variants={fadeUp} style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 60 }}>
              <ShimmerBtn to="/startup-registration">
                Apply for Incubation
                <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>→</motion.span>
              </ShimmerBtn>
              <ShimmerBtn to="/startup-registration" secondary>
                🚀 Start Your Journey Now
              </ShimmerBtn>
            </motion.div>

          </motion.div>
        </div>

        {/* Stats Section at the Bottom */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7 }}
          style={{
            position: 'relative', zIndex: 10,
            width: '100%', maxWidth: 900,
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            gap: 'clamp(24px, 5vw, 64px)', flexWrap: 'wrap',
            padding: '20px',
            borderTop: `1px solid rgba(0,0,0,0.05)`, // Subtle separation line if needed
            marginTop: 'auto'
          }}
        >
          <StatItem value={120} suffix="+" label="Startups Incubated" delay={0.9} />
          <div className="hero-stat-divider" style={{ width: 1, height: 40, background: C.pale }} />
          <StatItem value={85} suffix="%" label="Success Rate" delay={1.0} />
          <div className="hero-stat-divider" style={{ width: 1, height: 40, background: C.pale }} />
          <StatItem value={50} suffix="+" label="Expert Mentors" delay={1.1} />
          <div className="hero-stat-divider" style={{ width: 1, height: 40, background: C.pale }} />
          <StatItem value={5} suffix="+" label="Years of Impact" delay={1.2} />
        </motion.div>

      </section>
    </>
  );
};

export default Hero;