import { useRef, useEffect, useState } from 'react';
import { motion, useInView, animate } from 'framer-motion';
import { Link } from 'react-router-dom';
import API_URL from "./Config"; // Added API Config

// Create a motion-enabled Link component
const MotionLink = motion(Link);

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
  white:      '#FFFFFF',
  bg:         '#F8FAFC', // Ultra-light modern background
};

/* ─────────────────────────────────────────
   SVG ICONS
───────────────────────────────────────── */
const IconFacebook = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
  </svg>
);
const IconInstagram = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);
const IconX = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
const IconLinkedIn = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

/* ─────────────────────────────────────────
   REUSABLE HELPERS
───────────────────────────────────────── */
const Orb = ({ style, anim, dur = 11 }) => (
  <motion.div
    animate={anim}
    transition={{ duration: dur, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror' }}
    style={{ position: 'absolute', borderRadius: '50%', pointerEvents: 'none', filter: 'blur(80px)', ...style }}
  />
);

const Reveal = ({ children, delay = 0, y = 30, x = 0, style = {}, className = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y, x }}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      style={style}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ─────────────────────────────────────────
   INFO CARD (Navy & Yellow Theme)
───────────────────────────────────────── */
const InfoCard = ({ icon, title, value, link, delay }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -8 }}
      onClick={() => link && window.open(link, '_blank')}
      style={{
        background: C.white,
        border: `1px solid ${hovered ? 'transparent' : C.pale}`,
        borderRadius: 24,
        padding: '32px 24px',
        position: 'relative',
        overflow: 'hidden',
        cursor: link ? 'pointer' : 'default',
        boxShadow: hovered 
          ? `0 24px 48px rgba(21, 67, 107, 0.15), 0 0 0 1px rgba(21, 67, 107, 0.1)` 
          : '0 12px 32px rgba(10, 34, 54, 0.04)',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <motion.div
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${C.accent}, ${C.accentDk})`, transformOrigin: 'left' }}
      />

      {link && (
        <motion.div
          animate={hovered ? { opacity: 1, x: 0, y: 0, rotate: 0 } : { opacity: 0, x: 10, y: -10, rotate: -45 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'absolute', top: 24, right: 24, width: 32, height: 32, borderRadius: '50%',
            background: C.lt, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, color: C.accent, fontWeight: 800,
          }}
        >
          ↗
        </motion.div>
      )}

      <motion.div
        animate={hovered ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        style={{
          width: 56, height: 56, borderRadius: 16,
          background: `linear-gradient(135deg, ${C.primary}, ${C.mid})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 26, marginBottom: 20,
          boxShadow: '0 8px 24px rgba(21, 67, 107, 0.25)',
          color: C.white, flexShrink: 0,
        }}
      >
        {icon}
      </motion.div>

      <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 800, color: C.muted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
        {title}
      </p>
      <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: C.heading, lineHeight: 1.5 }}>
        {value}
      </p>
    </motion.div>
  );
};

/* ─────────────────────────────────────────
   SOCIAL BUTTON
───────────────────────────────────────── */
const SocialBtn = ({ icon, label, url, color, delay }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-30px' });

  return (
    <motion.a
      ref={ref} href={url} target="_blank" rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6, scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textDecoration: 'none', cursor: 'pointer' }}
    >
      <div style={{
        width: 56, height: 56, borderRadius: 18, background: color,
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.white,
        boxShadow: '0 8px 24px rgba(10, 34, 54, 0.15)', transition: 'box-shadow 0.3s',
      }}>
        {icon}
      </div>
      <span style={{ fontSize: 13, fontWeight: 700, color: C.text, letterSpacing: '0.05em' }}>
        {label}
      </span>
    </motion.a>
  );
};

/* ─────────────────────────────────────────
   CONTACT FORM WITH INTEGRATED API
───────────────────────────────────────── */
const ContactForm = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', bot_field: '' });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focused, setFocused] = useState(null);

  const fieldStyle = (field) => ({
    width: '100%', padding: '16px 20px', boxSizing: 'border-box',
    borderRadius: 14, border: `2px solid ${focused === field ? C.accent : C.pale}`,
    fontSize: 16, color: C.heading, background: focused === field ? C.white : '#F8FAFC',
    outline: 'none', fontFamily: 'inherit',
    boxShadow: focused === field ? `0 0 0 4px rgba(234, 159, 36, 0.15)` : 'none',
    transition: 'all 0.3s ease', fontWeight: 500
  });

  const labelStyle = (field) => ({
    fontSize: 14, fontWeight: 800, color: focused === field ? C.accent : C.heading,
    display: 'block', marginBottom: 8, transition: 'color 0.3s',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.bot_field !== '') return; // Honeypot trap

    setIsSubmitting(true);

    const incubationId = import.meta.env.VITE_INCUBATION_ID || "6ab39542497aa33526fcd95b";
    const endpoint = API_URL ? `${API_URL}/contact/submit` : 'https://incubationmasters.com/api/contact/submit';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          incubationId: incubationId,
          name: form.name,
          email: form.email,
          contactNumber: form.phone,
          subject: "Website Contact Form Inquiry", 
          message: form.message
        })
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        const errData = await response.json();
        alert(`Failed to send message: ${errData.message || 'Please try again.'}`);
      }
    } catch (error) {
      console.error("API Error:", error);
      alert("Network Error! Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} style={{ textAlign: 'center', padding: '64px 24px' }}>
        <motion.div
          initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          style={{ width: 88, height: 88, borderRadius: '50%', background: `linear-gradient(135deg, ${C.accent}, ${C.accentDk})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, color: C.white, margin: '0 auto 24px',
            boxShadow: '0 12px 32px rgba(234, 159, 36, 0.3)',
          }}
        >
          ✓
        </motion.div>
        <h3 style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 900, color: C.heading, marginBottom: 12 }}>Message Sent!</h3>
        <p style={{ color: C.text, fontSize: 16, lineHeight: 1.7, maxWidth: 380, margin: '0 auto 32px', fontWeight: 500 }}>
          Thank you for reaching out. Our team will get back to you as soon as possible at <span style={{ color: C.primary, fontWeight: 800 }}>{form.email}</span>.
        </p>
        <motion.button
          whileHover={{ y: -3, boxShadow: '0 12px 28px rgba(234, 159, 36, 0.3)' }} whileTap={{ scale: 0.96 }}
          onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', message: '', bot_field: '' }); }}
          style={{ padding: '16px 32px', borderRadius: 100, border: 'none', background: `linear-gradient(90deg, ${C.accent} 0%, ${C.accentDk} 100%)`, color: C.white, fontWeight: 800, fontSize: 16, fontFamily: 'inherit', cursor: 'pointer', boxShadow: '0 8px 20px rgba(234, 159, 36, 0.2)' }}
        >
          Send Another Message
        </motion.button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      
      {/* Honeypot Input */}
      <input type="text" name="bot_field" value={form.bot_field} onChange={e => setForm(p => ({ ...p, bot_field: e.target.value }))} style={{ display: 'none' }} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 20 }}>
        <div>
          <label style={labelStyle('name')}>Your Name *</label>
          <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            placeholder="Aarav Singh" style={fieldStyle('name')} onFocus={() => setFocused('name')} onBlur={() => setFocused(null)} />
        </div>
        <div>
          <label style={labelStyle('email')}>Email Address *</label>
          <input required type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
            placeholder="you@example.com" style={fieldStyle('email')} onFocus={() => setFocused('email')} onBlur={() => setFocused(null)} />
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle('phone')}>Phone Number</label>
        <input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value.replace(/[^0-9]/g, '') }))}
          placeholder="9876543210" style={fieldStyle('phone')} onFocus={() => setFocused('phone')} onBlur={() => setFocused(null)} maxLength="15" />
      </div>

      <div style={{ marginBottom: 32 }}>
        <label style={labelStyle('message')}>Message *</label>
        <textarea required rows={5} value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
          placeholder="Tell us how we can help you..." style={{ ...fieldStyle('message'), resize: 'vertical', minHeight: 140 }}
          onFocus={() => setFocused('message')} onBlur={() => setFocused(null)} />
      </div>

      <motion.button
        type="submit"
        disabled={isSubmitting}
        whileHover={{ y: isSubmitting ? 0 : -4, boxShadow: isSubmitting ? 'none' : '0 16px 40px rgba(234, 159, 36, 0.4)' }} 
        whileTap={{ scale: isSubmitting ? 1 : 0.97 }}
        style={{
          width: '100%', padding: '20px 32px', borderRadius: 100, border: 'none',
          background: `linear-gradient(90deg, ${C.accent} 0%, ${C.accentDk} 100%)`, color: C.white, fontWeight: 900, fontSize: 18,
          fontFamily: 'inherit', cursor: isSubmitting ? 'not-allowed' : 'pointer', boxShadow: '0 8px 24px rgba(234, 159, 36, 0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, transition: 'all 0.3s ease',
          opacity: isSubmitting ? 0.7 : 1
        }}
      >
        <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
        {!isSubmitting && (
          <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
            →
          </motion.span>
        )}
      </motion.button>
    </form>
  );
};

/* ─────────────────────────────────────────
   TYPING ANIMATION
───────────────────────────────────────── */
const PHRASES = ["We're here to help.", "Let's build together.", "Reach out anytime."];

const TypingText = () => {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [charIdx, setCharIdx] = useState(0);

  useEffect(() => {
    const phrase = PHRASES[phraseIdx];
    let timeout;
    if (!deleting && charIdx <= phrase.length) {
      timeout = setTimeout(() => { setDisplayed(phrase.slice(0, charIdx)); setCharIdx(c => c + 1); }, charIdx === phrase.length ? 1600 : 55);
    } else if (!deleting && charIdx > phrase.length) {
      timeout = setTimeout(() => setDeleting(true), 400);
    } else if (deleting && charIdx >= 0) {
      timeout = setTimeout(() => { setDisplayed(phrase.slice(0, charIdx)); setCharIdx(c => c - 1); }, 28);
    } else {
      setDeleting(false); setPhraseIdx(i => (i + 1) % PHRASES.length); setCharIdx(0);
    }
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, phraseIdx]);

  return (
    <span>
      {displayed}
      <motion.span
        animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
        style={{ display: 'inline-block', width: 3, height: '1.1em', background: C.accent, marginLeft: 4, verticalAlign: 'text-bottom', borderRadius: 2 }}
      />
    </span>
  );
};

/* ─────────────────────────────────────────
   MAP EMBED
───────────────────────────────────────── */
const MapSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      style={{ borderRadius: 28, overflow: 'hidden', border: `1px solid ${C.pale}`, boxShadow: '0 24px 48px rgba(10, 34, 54, 0.1)', position: 'relative' }}
    >
      <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10, background: C.dark, borderRadius: 14, padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
        <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ width: 10, height: 10, borderRadius: '50%', background: C.accent }} />
        <span style={{ fontSize: 13, fontWeight: 800, color: C.white, letterSpacing: '0.05em' }}>G.Incube, Gwalior</span>
      </div>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3579.6365312587413!2d78.17017591525237!3d26.20849944057399!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3976c57c887b9f7d%3A0x42c0aa91f24cba00!2sG.Incube!5e0!3m2!1sen!2sin!4v1729491414425!5m2!1sen!2sin"
        width="100%" height="420" style={{ border: 0, display: 'block' }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="G.Incube Location"
      />
    </motion.div>
  );
};

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
const ContactPage = () => (
  <section style={{ fontFamily: "'Inter', -apple-system, sans-serif", color: C.heading, overflowX: 'hidden' }}>
    
    {/* ══ HERO ══ */}
    <div style={{
      position: 'relative',
      background: `linear-gradient(135deg, ${C.dark} 0%, ${C.primary} 100%)`, // Deep Navy background matching other pages
      padding: 'clamp(100px, 12vw, 140px) 24px clamp(140px, 15vw, 180px)',
      overflow: 'hidden', textAlign: 'center',
    }}>
      {/* Glow Orbs - Navy & Yellow mix */}
      <Orb style={{ top: -100, left: '10%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(234, 159, 36, 0.25) 0%, transparent 70%)' }} anim={{ y: [0, 30, 0], scale: [1, 1.05, 1] }} dur={12} />
      <Orb style={{ bottom: -150, right: '5%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(40, 123, 190, 0.3) 0%, transparent 70%)' }} anim={{ y: [0, -40, 0], scale: [1, 1.1, 1] }} dur={15} />

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 20, position: 'relative', zIndex: 2 }}
      >
        <div style={{ height: 2, width: 40, background: `linear-gradient(90deg, transparent, ${C.accent})` }} />
        <span style={{ fontSize: 14, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.accent }}>Get In Touch</span>
        <div style={{ height: 2, width: 40, background: `linear-gradient(90deg, ${C.accent}, transparent)` }} />
      </motion.div>

      <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{ margin: '0 auto 16px', fontSize: 'clamp(44px, 8vw, 80px)', fontWeight: 900, color: C.white, letterSpacing: '-1.5px', lineHeight: 1.1, position: 'relative', zIndex: 2 }}
      >
        Contact <span style={{ color: C.accent }}>Us</span>
      </motion.h1>

      <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{ maxWidth: 540, margin: '0 auto 40px', fontSize: 'clamp(18px, 4vw, 22px)', color: C.pale, lineHeight: 1.6, fontWeight: 400, position: 'relative', zIndex: 2, minHeight: '1.6em' }}
      >
        <TypingText />
      </motion.p>
    </div>

    {/* ══ MAIN OVERLAPPING CONTENT CONTAINER ══ */}
    <div style={{ background: C.bg, padding: '0 clamp(20px, 5vw, 32px) clamp(80px, 12vw, 120px)' }}>
      
      {/* ── INFO CARDS GRID ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24, maxWidth: 1200, margin: '0 auto', marginTop: '-80px', position: 'relative', zIndex: 3 }}>
        <InfoCard icon="📍" title="Address" value="Moti Mahal, Lashkar, Gwalior, MP 474007" link="https://maps.google.com/?q=G.Incube+Gwalior" delay={0.05} />
        <InfoCard icon="📞" title="Phone" value="+91 93409 94826" link="tel:+919340994826" delay={0.15} />
        <InfoCard icon="✉️" title="Email" value="connect@gincube.org" link="mailto:connect@gincube.org" delay={0.25} />
        <InfoCard icon="🕐" title="Working Hours" value="Mon – Sat, 10 AM – 6 PM" delay={0.35} />
      </div>

      {/* ── FORM & MAP SECTION ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 40, maxWidth: 1200, margin: '80px auto', alignItems: 'start' }}>
        
        {/* Left Side: Contact Form */}
        <Reveal delay={0.1}>
          <div style={{ background: C.white, borderRadius: 32, border: `1px solid ${C.pale}`, padding: 'clamp(40px, 5vw, 56px) clamp(24px, 5vw, 48px)', boxShadow: '0 24px 64px rgba(10, 34, 54, 0.05)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -100, right: -100, width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(234, 159, 36, 0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
            
            <div style={{ marginBottom: 40 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(234, 159, 36, 0.1)', borderRadius: 100, padding: '8px 20px', marginBottom: 20 }}>
                <span style={{ fontSize: 16 }}>💬</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: C.accent, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Send a Message</span>
              </div>
              <h2 style={{ fontSize: 'clamp(32px, 4vw, 40px)', fontWeight: 900, color: C.heading, margin: '0 0 16px', lineHeight: 1.2, letterSpacing: '-1px' }}>
                Drop Us a Line
              </h2>
              <p style={{ fontSize: 18, color: C.text, margin: 0, lineHeight: 1.6, fontWeight: 500 }}>
                Have a question, an idea, or want to collaborate? We're all ears.
              </p>
            </div>
            <ContactForm />
          </div>
        </Reveal>

        {/* Right Side: Map & Socials */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          <Reveal delay={0.2}>
            <MapSection />
          </Reveal>

          <Reveal delay={0.3}>
            <div style={{ background: C.white, borderRadius: 32, padding: '40px 32px', border: `1px solid ${C.pale}`, boxShadow: '0 12px 40px rgba(10, 34, 54, 0.05)' }}>
              <p style={{ fontSize: 14, fontWeight: 800, color: C.primary, letterSpacing: '0.15em', textTransform: 'uppercase', margin: '0 0 24px' }}>
                Follow Our Journey
              </p>
              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                <SocialBtn icon={<IconFacebook />} label="Facebook" url="https://www.facebook.com/gincube" color={`linear-gradient(135deg, #1877F2, #42A5F5)`} delay={0.05} />
                <SocialBtn icon={<IconInstagram />} label="Instagram" url="https://www.instagram.com/gincube_gwalior/" color={`linear-gradient(135deg, #F77737, #C13584, #833AB4)`} delay={0.15} />
                <SocialBtn icon={<IconX />} label="Twitter / X" url="https://x.com/gincube" color={`linear-gradient(135deg, #111, #333)`} delay={0.25} />
                <SocialBtn icon={<IconLinkedIn />} label="LinkedIn" url="https://www.linkedin.com/company/gincube/" color={`linear-gradient(135deg, #0077B5, #00A0DC)`} delay={0.35} />
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* ── BOTTOM CTA ── */}
      <Reveal delay={0.2} style={{ maxWidth: 1000, margin: '80px auto 0' }}>
        <div style={{
          background: `linear-gradient(135deg, ${C.dark} 0%, ${C.primary} 100%)`, borderRadius: 36,
          padding: 'clamp(56px, 8vw, 88px) clamp(32px, 6vw, 64px)', textAlign: 'center',
          position: 'relative', overflow: 'hidden', boxShadow: '0 24px 48px rgba(10, 34, 54, 0.2)',
        }}>
          <Orb style={{ top: -100, left: -50, width: 400, height: 400, background: 'radial-gradient(circle, rgba(40, 123, 190, 0.3) 0%, transparent 70%)' }} anim={{ x: [0, 30, 0], y: [0, -20, 0] }} dur={10} />
          <Orb style={{ bottom: -100, right: -50, width: 300, height: 300, background: 'radial-gradient(circle, rgba(234, 159, 36, 0.2) 0%, transparent 70%)' }} anim={{ x: [0, -20, 0], y: [0, 20, 0] }} dur={12} />

          <p style={{ margin: '0 0 16px', position: 'relative', zIndex: 2, fontSize: 14, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.accent }}>
            Ready to start?
          </p>
          <h2 style={{ margin: '0 0 24px', position: 'relative', zIndex: 2, fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 900, color: C.white, letterSpacing: '-1px', lineHeight: 1.1 }}>
            Let's Build Something <span style={{ color: C.accent }}>Amazing</span>
          </h2>
          <p style={{ margin: '0 auto 48px', maxWidth: 600, fontSize: 18, color: '#E2EEF8', lineHeight: 1.6, position: 'relative', zIndex: 2 }}>
            G.Incube is Gwalior's premier startup incubation center. Whether you have an idea, a question, or a vision — we're here for you.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'center', position: 'relative', zIndex: 2 }}>
            <MotionLink 
              to="/startup-registration" 
              whileHover={{ y: -4, boxShadow: '0 16px 40px rgba(234, 159, 36, 0.35)' }} 
              whileTap={{ scale: 0.96 }}
              style={{ display: 'inline-flex', alignItems: 'center', background: `linear-gradient(90deg, ${C.accent} 0%, ${C.accentDk} 100%)`, color: C.white, textDecoration: 'none', fontWeight: 800, fontSize: 18, padding: '18px 48px', borderRadius: 100, boxShadow: '0 8px 24px rgba(234, 159, 36, 0.25)', transition: 'all 0.3s' }}>
              Apply for Incubation ↗
            </MotionLink>
            <motion.a href="mailto:connect@gincube.org" whileHover={{ y: -4, background: 'rgba(255,255,255,0.1)' }} whileTap={{ scale: 0.96 }}
              style={{ display: 'inline-flex', alignItems: 'center', background: 'transparent', border: `2px solid rgba(234, 159, 36, 0.5)`, color: C.white, textDecoration: 'none', fontWeight: 800, fontSize: 18, padding: '16px 48px', borderRadius: 100, transition: 'all 0.3s' }}>
              Email Us
            </motion.a>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

export default ContactPage;