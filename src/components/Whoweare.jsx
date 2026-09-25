import { useRef, useState, useEffect } from 'react';
import { motion, useInView, useAnimation, animate } from 'framer-motion';
import { Link } from 'react-router-dom';

// ─── IMAGES IMPORT ───
import logoImage from '../assets/logo.png';
import office1Image from '../assets/Office1.png';
import office2Image from '../assets/Office2.png';

/* ─────────────────────────────────────────
   BRAND TOKENS (Premium Navy Blue & Golden Yellow Theme)
───────────────────────────────────────── */
const C = {
  primary:    '#15436B', // Deep Navy Blue
  mid:        '#1C5A8F', // Mid Blue
  light:      '#287BBE', // Lighter Blue
  pale:       '#E2E8F0', // Pale Slate
  lt:         '#F8FAFC', // Lightest slate for borders/bg
  dark:       '#0A2236', // Darkest Navy
  darkMid:    '#0F172A', // Slate Dark
  heading:    '#0A2236', // Crisp slate for headings
  text:       '#334155', // Modern slate gray
  muted:      '#64748B', // Muted text
  accent:     '#EA9F24', // Golden Yellow
  accentDk:   '#D68A1B', // Dark Yellow
  accentLight:'#F3C57B', // Light Yellow
  bg:         '#F8FAFC', // Ultra-light modern background
  white:      '#FFFFFF',
};

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const stats = [
  { value: '50+',  label: 'Startups\nSupported' },
  { value: '100+', label: 'Mentors &\nExperts' },
  { value: '5+',   label: 'Years of\nInnovation' },
];

const tags = [
  '💡 Innovation Hub',
  '🤝 Mentorship',
  '🏙️ Smart City Initiative',
  '🌍 Tech-Driven Growth',
  '🧠 Startup Ecosystem',
];

const sections = [
  {
    icon: '🌏',
    title: 'Our Foundation',
    text: `G.Incube, the Gwalior Smart City Incubation Center, operates under the Gwalior Smart City Development Corporation Limited. We are dedicated to fostering innovation and entrepreneurship within our community. Our mission is to empower aspiring entrepreneurs by providing them with the resources, mentorship, and support needed to transform their ideas into successful ventures.`,
    highlight: 'Gwalior Smart City Incubation Center',
  },
  {
    icon: '🏠',
    title: 'Our Space & Programs',
    text: `Located in the heart of Gwalior, G.Incube serves as a dynamic hub for startups, offering a collaborative environment that encourages creativity and growth. Our state-of-the-art facilities and comprehensive programs are designed to nurture knowledge-driven, technology-oriented, and socially responsible businesses.`,
    highlight: 'heart of Gwalior',
  },
  {
    icon: '🎓',
    title: 'Our Vision',
    text: `We believe that by cultivating a robust ecosystem of innovation, we can significantly contribute to the economic development of Gwalior, and beyond. At G.Incube, we are committed to building a brighter future for our entrepreneurs, our communities, and our nation. Join us as we pave the way for a new era of entrepreneurial success.`,
    highlight: 'contribute to the economic development of Gwalior',
  },
];

/* ─────────────────────────────────────────
   REUSABLE HELPERS
───────────────────────────────────────── */
const HighlightText = ({ text, highlight }) => {
  if (!highlight) return <span>{text}</span>;
  const parts = text.split(highlight);
  return (
    <>
      {parts[0]}
      <strong style={{ color: C.accent, fontWeight: 700, padding: '0 2px' }}>{highlight}</strong>
      {parts[1]}
    </>
  );
};

const Orb = ({ style, animate: anim, transition }) => (
  <motion.div
    animate={anim}
    transition={transition}
    style={{
      position: 'absolute',
      borderRadius: '50%',
      pointerEvents: 'none',
      filter: 'blur(60px)',
      ...style,
    }}
  />
);

const Reveal = ({ children, delay = 0, y = 30, className = '', style = {} }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
};

const useCounter = (target, inView, duration = 1.8) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, target, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, target, duration]);
  return value;
};

const StatCard = ({ num, label, delay }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const isPlus = num.endsWith('+');
  const target = parseInt(num.replace('+', ''));
  const count = useCounter(target, inView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6, scale: 1.02, boxShadow: `0 20px 40px rgba(234, 159, 36, 0.12)` }}
      style={{
        background: C.white,
        border: `1px solid ${C.pale}`,
        borderRadius: 24,
        padding: '32px 16px',
        textAlign: 'center',
        boxShadow: '0 10px 30px rgba(10, 34, 54, 0.05)',
        cursor: 'default',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
      }}
    >
      <div style={{ 
        fontSize: 'clamp(36px, 5vw, 48px)', 
        fontWeight: 900, 
        lineHeight: 1, 
        marginBottom: 12,
        background: `linear-gradient(90deg, ${C.accent} 0%, ${C.accentDk} 100%)`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        {count}{isPlus ? '+' : ''}
      </div>
      <div style={{ fontSize: 14, color: C.primary, fontWeight: 700, lineHeight: 1.4, whiteSpace: 'pre-line' }}>
        {label}
      </div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────
   ANIMATED SECTION CARD
───────────────────────────────────────── */
const SectionCard = ({ s, index }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const [hovered, setHovered] = useState(false);

  // Premium mix of Navy and Yellow gradients
  const gradients = [
    `linear-gradient(135deg, ${C.primary}, ${C.light})`, // Blue
    `linear-gradient(135deg, ${C.accent}, ${C.accentDk})`, // Yellow/Orange
    `linear-gradient(135deg, ${C.dark}, ${C.mid})` // Deep Navy
  ];
  const shadows = [
    'rgba(40, 123, 190, 0.25)', // Blue glow
    'rgba(234, 159, 36, 0.25)', // Yellow glow
    'rgba(10, 34, 54, 0.3)'     // Dark glow
  ];

  const gradient = gradients[index % gradients.length];
  const shadow = shadows[index % shadows.length];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        background: C.white,
        border: `1px solid ${hovered ? 'transparent' : C.pale}`,
        borderRadius: 24,
        padding: '40px 32px',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
        boxShadow: hovered 
          ? `0 24px 48px ${shadow}, 0 0 0 1px ${shadow}` 
          : '0 12px 32px rgba(10, 34, 54, 0.04)',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      {/* Animated Top Gradient Strip */}
      <motion.div
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: gradient, transformOrigin: 'left' }}
      />

      {/* Animated Arrow Badge */}
      <motion.div
        animate={hovered ? { opacity: 1, x: 0, y: 0, rotate: 0 } : { opacity: 0, x: 10, y: -10, rotate: -45 }}
        transition={{ duration: 0.3 }}
        style={{
          position: 'absolute', top: 24, right: 24, width: 36, height: 36, borderRadius: '50%',
          background: C.lt, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, color: C.primary, fontWeight: 800,
        }}
      >
        ↗
      </motion.div>

      {/* Animated Icon Box */}
      <motion.div
        animate={hovered ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        style={{
          width: 64, height: 64, borderRadius: 18, background: gradient,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 30, marginBottom: 24, boxShadow: `0 8px 24px ${shadow}`,
          color: C.white, flexShrink: 0
        }}
      >
        {s.icon}
      </motion.div>

      <h3 style={{ margin: '0 0 16px', fontSize: 22, fontWeight: 800, color: C.heading, lineHeight: 1.3 }}>{s.title}</h3>
      <p style={{ margin: 0, fontSize: 16, color: C.text, lineHeight: 1.7, flexGrow: 1 }}>
        <HighlightText text={s.text} highlight={s.highlight} />
      </p>
    </motion.div>
  );
};

/* ─────────────────────────────────────────
   MAIN PAGE COMPONENT
───────────────────────────────────────── */
const WhoWeAre = () => {
  const MotionLink = motion(Link);

  return (
    <section style={{ fontFamily: "'Inter', -apple-system, sans-serif", color: C.heading, overflowX: 'hidden' }}>

      {/* ── HERO ── */}
      <div style={{
        position: 'relative',
        background: `linear-gradient(135deg, ${C.dark} 0%, ${C.darkMid} 100%)`, // Deep Navy background
        padding: 'clamp(100px, 15vw, 140px) 24px clamp(140px, 18vw, 180px)',
        overflow: 'hidden', textAlign: 'center'
      }}>
        {/* Premium Ambient Orbs */}
        <Orb
          style={{ top: -100, left: '5%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(40, 123, 190, 0.25) 0%, transparent 70%)' }}
          animate={{ y: [0, 30, 0], scale: [1, 1.05, 1] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <Orb
          style={{ bottom: -150, right: '5%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(234, 159, 36, 0.15) 0%, transparent 70%)' }}
          animate={{ y: [0, -40, 0], scale: [1, 1.1, 1] }} transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 24, position: 'relative', zIndex: 2 }}
        >
          <div style={{ height: 2, width: 40, background: `linear-gradient(90deg,transparent,${C.accent})` }} />
          <span style={{ fontSize: 14, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.accent }}>About Us</span>
          <div style={{ height: 2, width: 40, background: `linear-gradient(90deg,${C.accent},transparent)` }} />
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ margin: '0 auto 20px', fontSize: 'clamp(44px, 8vw, 80px)', fontWeight: 900, color: C.white, letterSpacing: '-1.5px', lineHeight: 1.1, position: 'relative', zIndex: 2 }}
        >
          Who We Are
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ margin: '0 auto 48px', maxWidth: 640, fontSize: 'clamp(18px, 3vw, 22px)', color: C.pale, lineHeight: 1.6, position: 'relative', zIndex: 2 }}
        >
          Gwalior Smart City Incubation Center - where ideas become impactful ventures.
        </motion.p>

        {/* FIXED BADGE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.6 }}
          style={{ display: 'flex', justifyContent: 'center', position: 'relative', zIndex: 2 }}
        >
          <motion.div
            animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              background: 'rgba(255, 255, 255, 0.95)', border: `1px solid rgba(234, 159, 36, 0.4)`, borderRadius: 24,
              padding: '16px 32px', display: 'inline-flex', alignItems: 'center', gap: 20,
              backdropFilter: 'blur(16px)', boxShadow: `0 12px 40px rgba(0,0,0,0.25), 0 0 0 1px rgba(234, 159, 36, 0.15)`,
            }}
          >
            <div style={{ background: C.white, borderRadius: 14, padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(21, 67, 107, 0.1)' }}>
              <img src={logoImage} alt="Gwalior Smart City" style={{ height: 56, width: 'auto', display: 'block' }}
                onError={e => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = `<span style="font-size:24px;font-weight:900;color:#15436B;">G</span>`; }} />
            </div>
            <div style={{ width: 1, height: 56, background: `linear-gradient(180deg, transparent, ${C.pale}, transparent)` }} />
            <div style={{ textAlign: 'left' }}>
              <p style={{ margin: '0 0 4px', fontSize: 12, color: C.accent, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Under</p>
              <p style={{ margin: 0, fontSize: 15, color: C.heading, fontWeight: 800, lineHeight: 1.4 }}>
                Gwalior Smart City<br />
                <span style={{ color: C.primary, fontWeight: 700 }}>Development Corporation</span>
              </p>
            </div>
            <motion.div
              animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ width: 12, height: 12, borderRadius: '50%', background: C.accent, flexShrink: 0, boxShadow: `0 0 0 4px rgba(234, 159, 36, 0.2)` }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* ── MAIN OVERLAPPING CONTENT CONTAINER ── */}
      <div style={{ background: C.bg, padding: '0 clamp(20px, 5vw, 32px) clamp(80px, 12vw, 120px)' }}>
        
        {/* ── IMAGES GRID ── */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32,
          maxWidth: 1200, margin: '0 auto', marginTop: '-80px', position: 'relative', zIndex: 3
        }}>
          <Reveal delay={0.05} style={{ borderRadius: 28, overflow: 'hidden', height: 'clamp(280px, 30vw, 380px)', boxShadow: '0 24px 48px rgba(10, 34, 54, 0.15)', border: `4px solid ${C.white}` }}>
            <motion.img src={office1Image} alt="G.Incube facility" whileHover={{ scale: 1.05 }} transition={{ duration: 0.6 }}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              onError={e => { e.target.parentElement.style.background = `linear-gradient(135deg,${C.lt},${C.pale})`; e.target.style.display = 'none'; }} />
          </Reveal>
          <Reveal delay={0.15} style={{ borderRadius: 28, overflow: 'hidden', height: 'clamp(280px, 30vw, 380px)', boxShadow: '0 24px 48px rgba(10, 34, 54, 0.15)', border: `4px solid ${C.white}` }}>
            <motion.img src={office2Image} alt="G.Incube team" whileHover={{ scale: 1.05 }} transition={{ duration: 0.6 }}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              onError={e => { e.target.parentElement.style.background = `linear-gradient(135deg,${C.pale},${C.lt})`; e.target.style.display = 'none'; }} />
          </Reveal>
        </div>

        {/* ── TEXT SECTIONS CARDS ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32, maxWidth: 1200, margin: '80px auto' }}>
          {sections.map((s, i) => (
            <SectionCard key={i} s={s} index={i} />
          ))}
        </div>

        {/* ── STATS ROW ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24, maxWidth: 1200, margin: '0 auto 80px' }}>
          {stats.map((s, i) => (
            <StatCard key={i} num={s.value} label={s.label} delay={i * 0.1} />
          ))}
        </div>

        {/* ── TAGS ── */}
        <Reveal delay={0.2} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 16, maxWidth: 1000, margin: '0 auto 100px' }}>
          {tags.map((tag, i) => (
            <motion.span
              key={i} whileHover={{ y: -4, scale: 1.05, background: C.primary, color: C.white, borderColor: C.primary }} transition={{ duration: 0.2 }}
              style={{
                background: C.white, border: `1px solid ${C.pale}`, color: C.primary,
                padding: '12px 24px', borderRadius: 100, fontSize: 15, fontWeight: 700, 
                boxShadow: '0 4px 12px rgba(10, 34, 54, 0.04)', cursor: 'default',
                transition: 'all 0.3s ease'
              }}
            >
              {tag}
            </motion.span>
          ))}
        </Reveal>

        {/* ── BOTTOM CTA CARD (Matches StatsAndCTA styling) ── */}
        <Reveal delay={0.3} style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{
            background: `linear-gradient(135deg, ${C.dark} 0%, ${C.primary} 100%)`,
            borderRadius: 36, padding: 'clamp(64px, 8vw, 96px) clamp(32px, 6vw, 64px)', textAlign: 'center',
            position: 'relative', overflow: 'hidden', boxShadow: '0 24px 48px rgba(10, 34, 54, 0.2)'
          }}>
            {/* Glowing Yellow & Blue Orbs */}
            <div style={{ position: 'absolute', top: '-50%', left: '-10%', width: '60%', height: '150%',
              background: 'radial-gradient(circle, rgba(40, 123, 190, 0.2), transparent 60%)', pointerEvents: 'none', filter: 'blur(50px)' }} />
            <div style={{ position: 'absolute', bottom: '-50%', right: '-10%', width: '60%', height: '150%',
              background: 'radial-gradient(circle, rgba(234, 159, 36, 0.15), transparent 60%)', pointerEvents: 'none', filter: 'blur(50px)' }} />
            
            <h2 style={{ margin: '0 0 24px', fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 900, color: '#fff', lineHeight: 1.1, position: 'relative', zIndex: 2 }}>
              Ready to build the next <br className="hidden sm:block"/>
              <span style={{ color: C.accent }}>big thing?</span>
            </h2>
            
            <p style={{ margin: '0 auto 48px', fontSize: 20, color: C.pale, lineHeight: 1.6, maxWidth: 680, position: 'relative', zIndex: 2 }}>
              Join Gincube today and get the resources, mentorship, and funding you need to accelerate your startup journey.
            </p>
            
            <MotionLink
              to="/startup-registration"
              whileHover={{ y: -4, boxShadow: '0 16px 40px rgba(234, 159, 36, 0.35)' }}
              whileTap={{ scale: 0.96 }}
              style={{
                position: 'relative', zIndex: 2, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                background: `linear-gradient(90deg, ${C.accent} 0%, ${C.accentDk} 100%)`, 
                color: C.white, textDecoration: 'none', fontWeight: 800,
                fontSize: 18, padding: '18px 48px', borderRadius: 100,
                boxShadow: '0 8px 24px rgba(234, 159, 36, 0.25)', transition: 'all 0.3s ease'
              }}
            >
              Start Your Journey Now
            </MotionLink>
          </div>
        </Reveal>

      </div>
    </section>
  );
};

export default WhoWeAre;