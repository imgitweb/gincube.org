import { useRef, useEffect, useState } from 'react';
import { motion, useInView, animate } from 'framer-motion';
import { Link } from 'react-router-dom';

/* ─────────────────────────────────────────
   BRAND TOKENS (Premium Navy Blue & Golden Yellow Theme)
───────────────────────────────────────── */
const C = {
  primary:    '#15436B', // Deep Navy Blue
  mid:        '#1C5A8F', // Mid Blue
  light:      '#287BBE', // Lighter Blue
  pale:       '#E2E8F0', // Pale Slate for borders
  lt:         '#F8FAFC', // Lightest slate for bg
  dark:       '#0A2236', // Darkest Navy
  darkMid:    '#0F172A', // Slate Dark
  heading:    '#0A2236', // Crisp slate for headings
  text:       '#334155', // Modern slate gray
  muted:      '#64748B', // Muted text
  accent:     '#EA9F24', // Golden Yellow
  accentDk:   '#D68A1B', // Dark Yellow
  bg:         '#F8FAFC', // Ultra-light modern background
  white:      '#FFFFFF',
};

/* ── Services data (Mixed Navy & Yellow Gradients) ── */
const SERVICES = [
  {
    icon: '🏢',
    title: 'Co-Working Space',
    desc: 'Collaborate, innovate, and thrive in a vibrant community. Our co-working spaces offer the perfect blend of flexibility and inspiration.',
    tags: ['Flexible Desks', 'Meeting Rooms', 'High-Speed WiFi'],
    gradient: `linear-gradient(135deg, ${C.primary}, ${C.light})`,
    shadow: 'rgba(21, 67, 107, 0.25)',
  },
  {
    icon: '🤝',
    title: 'Mentorship Support',
    desc: 'Guidance from industry experts can turn your vision into reality. Our mentors provide invaluable insights to help you navigate the startup landscape.',
    tags: ['1-on-1 Sessions', 'Industry Experts', 'Network Access'],
    gradient: `linear-gradient(135deg, ${C.accent}, ${C.accentDk})`,
    shadow: 'rgba(234, 159, 36, 0.25)',
  },
  {
    icon: '💰',
    title: 'Funding Support',
    desc: 'Access the capital you need to fuel your growth journey. Our funding support connects you with investors who believe in your vision.',
    tags: ['Investor Connect', 'Grant Access', 'Pitch Prep'],
    gradient: `linear-gradient(135deg, ${C.darkMid}, ${C.mid})`,
    shadow: 'rgba(15, 23, 42, 0.25)',
  },
  {
    icon: '⚡',
    title: 'Technology Support',
    desc: 'Leverage cutting-edge tools and resources to bring your ideas to life. Our technology support helps you stay ahead in a fast-paced digital world.',
    tags: ['Tech Stack', 'Cloud Access', 'Dev Tools'],
    gradient: `linear-gradient(135deg, ${C.primary}, ${C.dark})`,
    shadow: 'rgba(10, 34, 54, 0.25)',
  },
  {
    icon: '📣',
    title: 'Marketing Support',
    desc: 'Craft a compelling brand story that resonates with your audience. Our marketing support equips you with strategies to amplify your reach and impact.',
    tags: ['Brand Strategy', 'Digital Growth', 'Content'],
    gradient: `linear-gradient(135deg, ${C.accent}, #F5A623)`,
    shadow: 'rgba(234, 159, 36, 0.25)',
  },
  {
    icon: '⚖️',
    title: 'Legal Support',
    desc: "Navigate the complexities of startup law with confidence. Our legal support ensures you're protected, compliant, and ready to scale safely.",
    tags: ['Compliance', 'IP Protection', 'Contracts'],
    gradient: `linear-gradient(135deg, ${C.light}, ${C.primary})`,
    shadow: 'rgba(40, 123, 190, 0.25)',
  },
];

/* ── Animated counter hook ── */
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

/* ── Stat card with animated counter (Golden Yellow Text) ── */
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
      whileHover={{ y: -8, scale: 1.02, boxShadow: `0 20px 40px rgba(234, 159, 36, 0.12)` }}
      style={{
        background: C.white,
        border: `1px solid ${C.pale}`,
        borderRadius: 24,
        padding: '32px 16px',
        textAlign: 'center',
        boxShadow: '0 10px 30px rgba(10, 34, 54, 0.04)',
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
      <div style={{ fontSize: 14, color: C.primary, fontWeight: 700, lineHeight: 1.4 }}>
        {label}
      </div>
    </motion.div>
  );
};

/* ── Scroll-reveal wrapper ── */
const Reveal = ({ children, delay = 0, y = 32, x = 0, style = {} }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y, x }}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      style={style}
    >
      {children}
    </motion.div>
  );
};

/* ── Animated ambient orb ── */
const Orb = ({ style, animate: anim, transition }) => (
  <motion.div
    animate={anim}
    transition={transition}
    style={{
      position: 'absolute',
      borderRadius: '50%',
      pointerEvents: 'none',
      filter: 'blur(80px)',
      ...style,
    }}
  />
);

/* ── Single service card ── */
const ServiceCard = ({ service, index }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -10 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        background: C.white,
        border: `1px solid ${hovered ? 'transparent' : C.pale}`,
        borderRadius: 24,
        padding: '36px 32px',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
        boxShadow: hovered 
          ? `0 24px 48px ${service.shadow}, 0 0 0 1px ${service.shadow}` 
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
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 5, background: service.gradient, transformOrigin: 'left' }}
      />

      {/* Subtle Background Glow on Hover */}
      <motion.div
        animate={{ opacity: hovered ? 0.05 : 0 }}
        transition={{ duration: 0.4 }}
        style={{ position: 'absolute', inset: 0, background: service.gradient, zIndex: 0 }}
      />

      {/* Animated Arrow Badge */}
      <motion.div
        animate={hovered ? { opacity: 1, x: 0, y: 0, rotate: 0 } : { opacity: 0, x: -10, y: 10, rotate: -45 }}
        transition={{ duration: 0.3 }}
        style={{
          position: 'absolute', top: 24, right: 24, width: 36, height: 36, borderRadius: '50%',
          background: C.lt, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, color: C.primary, fontWeight: 800, zIndex: 2
        }}
      >
        ↗
      </motion.div>

      {/* Animated Icon Box */}
      <motion.div
        animate={hovered ? { scale: 1.15, rotate: 8 } : { scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        style={{
          width: 68, height: 68, borderRadius: 20, background: service.gradient,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 32, marginBottom: 28, boxShadow: `0 8px 24px ${service.shadow}`,
          color: C.white, zIndex: 2
        }}
      >
        {service.icon}
      </motion.div>

      <h3 style={{ margin: '0 0 16px', fontSize: 22, fontWeight: 900, color: C.heading, lineHeight: 1.3, zIndex: 2 }}>
        {service.title}
      </h3>
      <p style={{ margin: '0 0 28px', fontSize: 16, color: C.text, lineHeight: 1.7, flexGrow: 1, zIndex: 2, fontWeight: 500 }}>
        {service.desc}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 'auto', zIndex: 2 }}>
        {service.tags.map((tag, i) => (
          <span
            key={i}
            style={{
              background: C.white, color: C.primary, border: `1px solid ${C.pale}`,
              borderRadius: 100, padding: '6px 16px', fontSize: 13, fontWeight: 700,
              boxShadow: '0 2px 8px rgba(10, 34, 54, 0.03)'
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

/* ══════════════════════════════
   MAIN PAGE
══════════════════════════════ */
const ServicesPage = () => {
  const MotionLink = motion(Link);

  return (
    <section style={{ fontFamily: "'Inter', -apple-system, sans-serif", color: C.heading, overflowX: 'hidden' }}>
      
      {/* ── HERO ── */}
      <div style={{
        position: 'relative',
        background: `linear-gradient(135deg, ${C.dark} 0%, ${C.primary} 100%)`, // Deep Navy background
        padding: 'clamp(100px, 15vw, 140px) 24px clamp(120px, 15vw, 160px)',
        overflow: 'hidden', textAlign: 'center',
      }}>
        {/* Premium Ambient Orbs - Navy & Yellow Glow */}
        <Orb
          style={{ top: -100, left: '10%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(234, 159, 36, 0.25) 0%, transparent 70%)' }}
          animate={{ y: [0, 30, 0], scale: [1, 1.05, 1] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <Orb
          style={{ bottom: -150, right: '5%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(40, 123, 190, 0.3) 0%, transparent 70%)' }}
          animate={{ y: [0, -40, 0], scale: [1, 1.1, 1] }} transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 24, position: 'relative', zIndex: 2 }}
        >
          <div style={{ height: 2, width: 40, background: `linear-gradient(90deg, transparent, ${C.accent})` }} />
          <span style={{ fontSize: 14, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.accent }}>What We Offer</span>
          <div style={{ height: 2, width: 40, background: `linear-gradient(90deg, ${C.accent}, transparent)` }} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ margin: '0 auto 20px', fontSize: 'clamp(44px, 8vw, 80px)', fontWeight: 900, color: C.white, letterSpacing: '-1.5px', lineHeight: 1.1, position: 'relative', zIndex: 2, maxWidth: 900 }}
        >
          Our <span style={{ color: C.accent }}>Services</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ margin: '0 auto 40px', fontSize: 'clamp(18px, 3vw, 22px)', color: C.pale, fontWeight: 400, position: 'relative', zIndex: 2, maxWidth: 700, lineHeight: 1.6 }}
        >
          We bring real solutions to each client's problems through a deep understanding of their market, product, and ultimate vision.
        </motion.p>
      </div>

      {/* ── MAIN CONTENT BLOCK (Overlaps Hero) ── */}
      <div style={{ background: C.bg, padding: '0 clamp(20px, 5vw, 32px) clamp(80px, 12vw, 120px)' }}>
        
        {/* CARDS GRID */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32,
          maxWidth: 1200, margin: '0 auto', marginTop: '-80px', position: 'relative', zIndex: 3
        }}>
          {SERVICES.map((service, i) => (
            <ServiceCard key={i} service={service} index={i} />
          ))}
        </div>

        {/* STATS ROW */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24,
          maxWidth: 1200, margin: '80px auto 0',
        }}>
          {[
            { num: '6',    label: 'Core Services',  delay: 0.0 },
            { num: '50+',  label: 'Startups Helped', delay: 0.1 },
            { num: '100+', label: 'Expert Mentors',  delay: 0.2 },
            { num: '5+',   label: 'Years Active',    delay: 0.3 },
          ].map((s, i) => (
            <StatCard key={i} num={s.num} label={s.label} delay={s.delay} />
          ))}
        </div>

        {/* BOTTOM CTA */}
        <Reveal delay={0.15} style={{ maxWidth: 1000, margin: '100px auto 0' }}>
          <div style={{
            background: `linear-gradient(135deg, ${C.dark} 0%, ${C.primary} 100%)`,
            borderRadius: 36, padding: 'clamp(56px, 8vw, 88px) clamp(32px, 6vw, 64px)',
            textAlign: 'center', position: 'relative', overflow: 'hidden',
            boxShadow: '0 24px 48px rgba(10, 34, 54, 0.2)',
          }}>
            <Orb
              style={{ top: -100, left: -50, width: 400, height: 400, background: 'radial-gradient(circle, rgba(40, 123, 190, 0.3) 0%, transparent 70%)' }}
              animate={{ x: [0, 30, 0], y: [0, -20, 0] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            />
            <Orb
              style={{ bottom: -100, right: -50, width: 300, height: 300, background: 'radial-gradient(circle, rgba(234, 159, 36, 0.2) 0%, transparent 70%)' }}
              animate={{ x: [0, -20, 0], y: [0, 20, 0] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            />

            <p style={{ margin: '0 0 16px', position: 'relative', zIndex: 2, fontSize: 14, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.accent }}>
              Start your journey
            </p>

            <h2 style={{ margin: '0 0 24px', position: 'relative', zIndex: 2, fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 900, color: C.white, letterSpacing: '-1px', lineHeight: 1.1 }}>
              Ready to Build Something <span style={{ color: C.accent }}>Great?</span>
            </h2>

            <p style={{ margin: '0 auto 48px', maxWidth: 600, fontSize: 18, color: '#E2EEF8', lineHeight: 1.6, position: 'relative', zIndex: 2 }}>
              Join G.Incube and get access to all the services and mentorship designed specifically to take your startup from a simple idea to a massive scale.
            </p>

            <MotionLink
              to="/startup-registration"
              whileHover={{ y: -4, boxShadow: '0 16px 40px rgba(234, 159, 36, 0.35)' }}
              whileTap={{ scale: 0.96 }}
              style={{
                position: 'relative', zIndex: 2, display: 'inline-flex', alignItems: 'center',
                background: `linear-gradient(90deg, ${C.accent} 0%, ${C.accentDk} 100%)`, 
                color: C.white, textDecoration: 'none',
                fontWeight: 800, fontSize: 18, padding: '18px 48px', borderRadius: 100,
                boxShadow: `0 8px 24px rgba(234, 159, 36, 0.25)`, transition: 'all 0.3s'
              }}
            >
              Apply for Incubation ↗
            </MotionLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default ServicesPage;