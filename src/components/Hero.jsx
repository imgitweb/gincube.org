import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const MotionLink = motion(Link);

/* ═══════════════════════════════════════════════════
   BRAND TOKENS (Navy Blue & Golden Yellow Theme)
═══════════════════════════════════════════════════ */
const C = {
  primary:     '#15436B', // Navy Blue
  mid:         '#1C5A8F', // Mid Blue
  light:       '#287BBE', // Light Blue
  pale:        '#E2E8F0', // Pale Slate for borders
  lt:          '#F8FAFC', 
  heading:     '#0A2236', // Dark Slate for main text
  text:        '#475569', 
  muted:       '#64748B', 
  accent:      '#EA9F24', // Golden Yellow
  accentDk:    '#D68A1B', 
  accentPale:  '#FEF3C7', 
  bg:          '#FFFFFF', // White base
  white:       '#FFFFFF',
  gradientText:'linear-gradient(90deg, #15436B 0%, #287BBE 100%)',
};



/* ═══════════════════════════════════════════════════
   STAT ITEM
═══════════════════════════════════════════════════ */
const StatItem = ({ value, label, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
    className="text-center min-w-[120px] px-3 py-2"
  >
    <p className="text-3xl sm:text-4xl font-extrabold text-white leading-none mb-1.5 drop-shadow-sm">
      {value}
    </p>
    <p className="text-xs sm:text-sm text-slate-300 font-medium">
      {label}
    </p>
  </motion.div>
);

/* ═══════════════════════════════════════════════════
   MAIN HERO COMPONENT
═══════════════════════════════════════════════════ */
const Hero = () => {
  const heroRef = useRef(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springConfig = { stiffness: 50, damping: 20 };
  const mouseX = useSpring(rawX, springConfig);
  const mouseY = useSpring(rawY, springConfig);

  const handleMouseMove = useCallback((e) => {
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set(((e.clientX - rect.left) / rect.width - 0.5) * 20);
    rawY.set(((e.clientY - rect.top) / rect.height - 0.5) * 20);
  }, [rawX, rawY]);

  const fadeUp = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
  };

// Social Links matching reference layout
const SOCIAL_LINKS = [
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/gincube',
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    )
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/company/gincube/',
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
      </svg>
    )
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/gincubegwalior/',
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    )
  },
  {
    name: 'X',
    href: 'https://x.com/GwaliorGincube',
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    )
  }
];

  return (
    <section
      ref={heroRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[calc(100vh-80px)] flex flex-col justify-center items-center pt-24 sm:pt-28 pb-12 overflow-hidden bg-[#0A2236] font-['Inter',sans-serif]"
    >
      {/* Background Image with Deep Navy Cinematic Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80"
          alt="G.Incube Corporate Hub"
          className="w-full h-full object-cover object-center scale-105 filter brightness-[0.55] contrast-[1.05]"
        />
        {/* Deep Navy Gradient Overlay matching reference */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A2236]/90 via-[#0A2236]/80 to-[#0A2236]/95" />
        {/* Ambient radial glows */}
        <div 
          className="absolute -top-1/4 -left-1/4 w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(40, 123, 190, 0.15) 0%, transparent 65%)' }}
        />
        <div 
          className="absolute -bottom-1/4 -right-1/4 w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(234, 159, 36, 0.15) 0%, transparent 65%)' }}
        />
      </div>

      {/* Main Center Content */}
      <div className="relative z-10 w-full max-w-5xl xl:max-w-6xl mx-auto px-4 sm:px-6 text-center my-auto flex flex-col items-center justify-center">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.12 } } }}
          className="flex flex-col items-center w-full"
        >
          {/* Top Row: Social Icons & Smart City Eyebrow Badge (Matching Reference) */}
          <motion.div variants={fadeUp} className="mb-6 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map((s, idx) => (
                <a
                  key={idx}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-all hover:scale-110"
                >
                  {s.icon}
                </a>
              ))}
            </div>

            <span className="hidden sm:inline-block text-slate-500">•</span>

            {/* Eyebrow badge */}
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3.5 py-1 text-xs font-bold text-white shadow-xs backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#EA9F24]" />
              Gwalior Smart City Initiative
            </span>
          </motion.div>

          {/* Headline - "Empowering Changemakers" on one single line, fully responsive */}
          <motion.h1
            variants={fadeUp}
            className="text-[28px] sm:text-4xl md:text-5xl lg:text-[62px] xl:text-[70px] font-extrabold text-white tracking-tight leading-[1.14] mb-6 max-w-5xl mx-auto"
          >
            <span className="inline-block whitespace-normal sm:whitespace-nowrap">
              <span>Empowering </span>
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-[#EA9F24] via-[#FBBF24] to-[#F3C57B] bg-clip-text text-transparent">
                  Changemakers
                </span>
                <motion.svg
                  width="100%"
                  height="10"
                  viewBox="0 0 320 10"
                  preserveAspectRatio="none"
                  className="absolute -bottom-1.5 left-0 w-full pointer-events-none"
                  initial={{ opacity: 0, pathLength: 0 }}
                  animate={{ opacity: 1, pathLength: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <path
                    d="M0 6 Q40 1 80 6 Q120 11 160 6 Q200 1 240 6 Q280 11 320 6"
                    stroke={C.accent}
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                  />
                </motion.svg>
              </span>
            </span>
            <span className="block mt-1 sm:mt-2 text-white">
              to Build Tomorrow
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            className="text-base sm:text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-10 font-normal drop-shadow-xs"
          >
            G.Incube — the Gwalior Smart City Incubation Center — provides comprehensive infrastructure, mentorship, and funding access to turn innovative ideas into viable, scaling enterprises.
          </motion.p>

          {/* Buttons: Side-by-Side balanced buttons matching reference image */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5"
          >
            <MotionLink
              to="/startup-registration"
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#EA9F24] to-[#D68A1B] hover:from-[#D68A1B] hover:to-[#B47012] text-white font-bold text-base px-8 py-3.5 rounded-full shadow-lg shadow-[#EA9F24]/30 hover:shadow-xl hover:shadow-[#EA9F24]/40 transition-all text-decoration-none"
            >
              <span>Apply for Incubation</span>
              <ArrowRight size={17} />
            </MotionLink>

            <MotionLink
              to="/Services"
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-base px-8 py-3.5 rounded-full border-2 border-white/30 hover:border-white/50 backdrop-blur-md shadow-xs transition-all text-decoration-none"
            >
              <span>Explore Programs</span>
            </MotionLink>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Key Metrics Strip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="relative z-10 w-full max-w-4xl mx-auto px-4 mt-10 pt-6 border-t border-white/15"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center justify-center">
          <StatItem value="120+" label="Startups Incubated" delay={0.7} />
          <StatItem value="85%" label="Cohort Success Rate" delay={0.8} />
          <StatItem value="50+" label="Expert Mentors" delay={0.9} />
          <StatItem value="₹2Cr+" label="Seed Grants Raised" delay={1.0} />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;