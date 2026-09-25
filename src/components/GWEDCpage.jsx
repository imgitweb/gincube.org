import { useRef, useEffect, useState } from 'react';
import { motion, useInView, animate } from 'framer-motion';
import { Link } from 'react-router-dom';
import API_URL from "./Config"; // Load API URL from Config

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
  accentLight:'#F3C57B', // Light Yellow
  bg:         '#F8FAFC', // Ultra-light modern background
  white:      '#FFFFFF',
};

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const OFFERINGS = [
  {
    icon: '🏢',
    title: 'Incubation Center',
    desc: 'Our Startup Incubation Center offers resources, mentorship, and a collaborative space to turn visionary ideas into successful ventures.',
    tags: ['Co-Working Space', 'Resources', 'Mentorship'],
    gradient: `linear-gradient(135deg, ${C.primary}, ${C.light})`,
    shadow: 'rgba(21, 67, 107, 0.25)',
  },
  {
    icon: '🤝',
    title: 'Mentorship & Investor Connect',
    desc: 'Our program links startups with experienced mentors and potential investors, driving growth and strategic direction.',
    tags: ['Expert Mentors', 'Investor Access', 'Growth Strategy'],
    gradient: `linear-gradient(135deg, ${C.accent}, ${C.accentDk})`,
    shadow: 'rgba(234, 159, 36, 0.25)',
  },
  {
    icon: '📱',
    title: 'Digital Marketing Training',
    desc: 'Equips entrepreneurs with the latest tools and strategies to enhance online visibility and drive exponential business growth.',
    tags: ['SEO & SEM', 'Social Media', 'Content Strategy'],
    gradient: `linear-gradient(135deg, ${C.darkMid}, ${C.mid})`,
    shadow: 'rgba(15, 23, 42, 0.25)',
  },
  {
    icon: '🛒',
    title: 'Online Selling Platform',
    desc: 'Empowers businesses to showcase and easily sell their products to a global audience through a streamlined digital storefront.',
    tags: ['Global Reach', 'Easy Listing', 'Revenue Growth'],
    gradient: `linear-gradient(135deg, ${C.primary}, ${C.dark})`,
    shadow: 'rgba(10, 34, 54, 0.25)',
  },
  {
    icon: '🌸',
    title: 'Self-help Group Support',
    desc: 'Fosters collaboration by providing essential resources and guidance for collective growth and lasting financial independence.',
    tags: ['Collaboration', 'Independence', 'Group Resources'],
    gradient: `linear-gradient(135deg, ${C.accent}, #F5A623)`,
    shadow: 'rgba(234, 159, 36, 0.25)',
  },
  {
    icon: '📋',
    title: 'Policy Awareness',
    desc: 'Keeps entrepreneurs updated on the latest regulations, ensuring strict compliance and informed, data-driven decision-making.',
    tags: ['Govt. Schemes', 'Compliance', 'Regulatory Updates'],
    gradient: `linear-gradient(135deg, ${C.light}, ${C.primary})`,
    shadow: 'rgba(40, 123, 190, 0.25)',
  },
];

const STATS = [
  { num: '6',   suffix: '',  label: 'Programs\nOffered' },
  { num: '200', suffix: '+', label: 'Women\nEmpowered' },
  { num: '50',  suffix: '+', label: 'Expert\nMentors' },
  { num: '10',  suffix: '+', label: 'Strategic\nPartners' },
];

/* ─────────────────────────────────────────
   REUSABLE HELPERS
───────────────────────────────────────── */
const Orb = ({ style, anim, dur = 11 }) => (
  <motion.div
    animate={anim}
    transition={{ duration: dur, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror' }}
    style={{ position: 'absolute', borderRadius: '50%', pointerEvents: 'none', filter: 'blur(70px)', ...style }}
  />
);

const Reveal = ({ children, delay = 0, y = 30, style = {}, className = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      style={style}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const useCounter = (target, inView, duration = 2) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, target, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: v => setVal(Math.round(v)),
    });
    return () => c.stop();
  }, [inView, target, duration]);
  return val;
};

/* ─────────────────────────────────────────
   COMPONENTS
───────────────────────────────────────── */
const StatCard = ({ num, suffix, label, delay }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const count = useCounter(parseInt(num), inView);
  
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
        transition: 'all 0.3s ease'
      }}
    >
      {/* Golden Yellow Numbers */}
      <div style={{ 
        fontSize: 'clamp(36px, 5vw, 48px)', 
        fontWeight: 900, 
        lineHeight: 1, 
        marginBottom: 12,
        background: `linear-gradient(90deg, ${C.accent} 0%, ${C.accentDk} 100%)`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        {count}{suffix}
      </div>
      <div style={{ fontSize: 14, color: C.primary, fontWeight: 700, lineHeight: 1.4, whiteSpace: 'pre-line' }}>
        {label}
      </div>
    </motion.div>
  );
};

const OfferingCard = ({ item, index }) => {
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
        boxShadow: hovered ? `0 24px 48px ${item.shadow}, 0 0 0 1px ${item.shadow}` : '0 12px 32px rgba(10, 34, 54, 0.04)',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <motion.div
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 5, background: item.gradient, transformOrigin: 'left' }}
      />

      <motion.div
        animate={{ opacity: hovered ? 0.05 : 0 }}
        transition={{ duration: 0.4 }}
        style={{ position: 'absolute', inset: 0, background: item.gradient, zIndex: 0 }}
      />

      <motion.div
        animate={hovered ? { opacity: 1, x: 0, y: 0, rotate: 0 } : { opacity: 0, x: -10, y: 10, rotate: -45 }}
        transition={{ duration: 0.3 }}
        style={{
          position: 'absolute', top: 24, right: 24, width: 36, height: 36, borderRadius: '50%',
          background: C.lt, display: 'flex', alignItems: 'center', justifyContent: 'center', 
          fontSize: 16, color: C.accent, fontWeight: 800, zIndex: 2
        }}
      >
        ↗
      </motion.div>

      <motion.div
        animate={hovered ? { scale: 1.15, rotate: 8 } : { scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        style={{
          width: 68, height: 68, borderRadius: 20, background: item.gradient,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 32, marginBottom: 28, boxShadow: `0 8px 24px ${item.shadow}`,
          color: C.white, zIndex: 2
        }}
      >
        {item.icon}
      </motion.div>

      <h3 style={{ margin: '0 0 16px', fontSize: 22, fontWeight: 800, color: C.heading, lineHeight: 1.3, zIndex: 2 }}>
        {item.title}
      </h3>
      <p style={{ margin: '0 0 28px', fontSize: 16, color: C.text, lineHeight: 1.7, flexGrow: 1, zIndex: 2, fontWeight: 500 }}>
        {item.desc}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 'auto', zIndex: 2 }}>
        {item.tags.map((tag, i) => (
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

/* ─────────────────────────────────────────
   FORM INTEGRATED WITH APIS
───────────────────────────────────────── */
const JoinForm = () => {
  const [form, setForm] = useState({ name: '', email: '', mobile: '', location: '', idea: '', bot_field: '' });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focused, setFocused] = useState(null);
  
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  const inputStyle = (field) => ({
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'mobile') {
      const onlyNums = value.replace(/[^0-9]/g, '');
      setForm(p => ({ ...p, [name]: onlyNums }));
    } else {
      setForm(p => ({ ...p, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.bot_field !== '') return; // Honeypot trap

    setIsSubmitting(true);

    const incubationId = import.meta.env.VITE_INCUBATION_ID || "6ab39542497aa33526fcd95b";
    const nodeEndpoint = API_URL ? `${API_URL}/womencell/apply` : 'https://incubationmasters.com/api/womencell/apply';

    const nodePayload = {
      incubationId: incubationId,
      applicantName: form.name,
      email: form.email,
      mobile: form.mobile,
      location: form.location,
      startupIdea: form.idea
    };

    const risePayload = new FormData();
    risePayload.append('applicant_name', form.name);
    risePayload.append('email_id', form.email);
    risePayload.append('mobile_no', form.mobile);
    risePayload.append('location', form.location);
    risePayload.append('startupidea', form.idea);

    try {
      const [nodeRes, riseRes] = await Promise.allSettled([
        fetch(nodeEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(nodePayload)
        }),
        fetch('https://risejhansi.in/Manikarnika/joinProgram', {
          method: 'POST',
          body: risePayload
        })
      ]);

      const isNodeSuccess = nodeRes.status === 'fulfilled' && nodeRes.value.ok;
      const isRiseSuccess = riseRes.status === 'fulfilled' && riseRes.value.ok;

      if (isNodeSuccess || isRiseSuccess) {
        setSubmitted(true);
      } else {
        alert("Failed to submit application. Please try again.");
      }
    } catch (err) {
      console.error("API Error:", err);
      alert("Network Error occurred while submitting.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: C.white, borderRadius: 32,
        padding: 'clamp(40px, 6vw, 64px) clamp(24px, 5vw, 48px)',
        boxShadow: '0 32px 80px rgba(10, 34, 54, 0.2)',
        maxWidth: 760, margin: '0 auto', position: 'relative', overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute', top: -100, right: -100, width: 300, height: 300, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(234, 159, 36, 0.1) 0%, transparent 70%)', pointerEvents: 'none',
      }} />

      {submitted ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '48px 0' }}>
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{ width: 88, height: 88, borderRadius: '50%', background: `linear-gradient(135deg, ${C.accent}, ${C.accentDk})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, color: C.white, margin: '0 auto 24px',
              boxShadow: '0 16px 40px rgba(234, 159, 36, 0.3)',
            }}
          >
            ✓
          </motion.div>
          <h3 style={{ fontSize: 32, fontWeight: 900, color: C.heading, marginBottom: 16 }}>Application Submitted!</h3>
          <p style={{ color: C.text, fontSize: 18, lineHeight: 1.7, maxWidth: 440, margin: '0 auto', fontWeight: 500 }}>
            Thank you for joining Yashashwani. Our team will reach out to you within 2–3 business days.
          </p>
        </motion.div>
      ) : (
        <>
          <h3 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 900, color: C.heading, marginBottom: 12, letterSpacing: '-1px' }}>
            Join <span style={{ color: C.accent }}>GWEDC</span>
          </h3>
          <p style={{ color: C.muted, fontSize: 18, marginBottom: 40, lineHeight: 1.6, fontWeight: 500 }}>
            Take the first step towards your entrepreneurial journey.
          </p>
          <form onSubmit={handleSubmit} style={{ width: '100%', position: 'relative', zIndex: 2 }}>
            
            <input type="text" name="bot_field" value={form.bot_field} onChange={handleChange} style={{ display: 'none' }} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, marginBottom: 24 }}>
              <div>
                <label style={labelStyle('name')}>Your Name *</label>
                <input required name="name" value={form.name} onChange={handleChange}
                  placeholder="Priya Sharma" style={inputStyle('name')} onFocus={() => setFocused('name')} onBlur={() => setFocused(null)} />
              </div>
              <div>
                <label style={labelStyle('email')}>Email ID *</label>
                <input required type="email" name="email" value={form.email} onChange={handleChange}
                  placeholder="priya@example.com" style={inputStyle('email')} onFocus={() => setFocused('email')} onBlur={() => setFocused(null)} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, marginBottom: 24 }}>
              <div>
                <label style={labelStyle('mobile')}>Mobile No. *</label>
                <input required type="tel" name="mobile" value={form.mobile} onChange={handleChange}
                  placeholder="9876543210" style={inputStyle('mobile')} onFocus={() => setFocused('mobile')} onBlur={() => setFocused(null)} maxLength="15" />
              </div>
              <div>
                <label style={labelStyle('location')}>Location *</label>
                <input required name="location" value={form.location} onChange={handleChange}
                  placeholder="Gwalior, MP" style={inputStyle('location')} onFocus={() => setFocused('location')} onBlur={() => setFocused(null)} />
              </div>
            </div>

            <div style={{ marginBottom: 40 }}>
              <label style={labelStyle('idea')}>Describe your startup idea *</label>
              <textarea required rows={4} name="idea" value={form.idea} onChange={handleChange}
                placeholder="Tell us about your business idea, the problem it solves..."
                style={{ ...inputStyle('idea'), resize: 'vertical', minHeight: 140 }} onFocus={() => setFocused('idea')} onBlur={() => setFocused(null)} />
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ y: isSubmitting ? 0 : -4, boxShadow: isSubmitting ? 'none' : '0 20px 40px rgba(234, 159, 36, 0.4)' }}
              whileTap={{ scale: isSubmitting ? 1 : 0.96 }}
              style={{
                width: '100%', padding: '20px 32px', borderRadius: 100, border: 'none',
                background: `linear-gradient(90deg, ${C.accent} 0%, ${C.accentDk} 100%)`, 
                color: C.white, fontWeight: 900, fontSize: 18,
                fontFamily: 'inherit', cursor: isSubmitting ? 'not-allowed' : 'pointer',
                boxShadow: '0 12px 32px rgba(234, 159, 36, 0.3)', transition: 'all 0.3s ease',
                opacity: isSubmitting ? 0.7 : 1
              }}
            >
              {isSubmitting ? 'Processing Application...' : 'Submit Application ↗'}
            </motion.button>
          </form>
        </>
      )}
    </motion.div>
  );
};

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
const GWEDCPage = () => (
  <section style={{ fontFamily: "'Inter', -apple-system, sans-serif", color: C.heading, overflowX: 'hidden' }}>
    
    {/* ══ HERO ══ */}
    <div style={{
      position: 'relative',
      background: `linear-gradient(135deg, ${C.dark} 0%, ${C.primary} 100%)`,
      padding: 'clamp(100px, 15vw, 140px) 24px clamp(120px, 15vw, 160px)',
      overflow: 'hidden', textAlign: 'center',
    }}>
      {/* Golden Yellow Glows mixed with Blue */}
      <Orb style={{ top: -100, left: '10%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(234, 159, 36, 0.25) 0%, transparent 70%)' }} anim={{ y: [0, 30, 0], scale: [1, 1.05, 1] }} dur={12} />
      <Orb style={{ bottom: -150, right: '5%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(40, 123, 190, 0.3) 0%, transparent 70%)' }} anim={{ y: [0, -40, 0], scale: [1, 1.1, 1] }} dur={15} />

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 24, position: 'relative', zIndex: 2 }}
      >
        <div style={{ height: 2, width: 40, background: `linear-gradient(90deg, transparent, ${C.accent})` }} />
        <span style={{ fontSize: 14, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.accent }}>GWEDC</span>
        <div style={{ height: 2, width: 40, background: `linear-gradient(90deg, ${C.accent}, transparent)` }} />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{ margin: '0 auto 20px', fontSize: 'clamp(44px, 8vw, 80px)', fontWeight: 900, color: C.white, letterSpacing: '-1.5px', lineHeight: 1.1, position: 'relative', zIndex: 2, maxWidth: 900 }}
      >
        <span style={{ background: `linear-gradient(90deg, ${C.accent} 0%, ${C.accentLight} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Yashashwani
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{ margin: '0 auto 48px', fontSize: 'clamp(18px, 3vw, 22px)', color: C.pale, fontWeight: 400, position: 'relative', zIndex: 2, maxWidth: 700, lineHeight: 1.6 }}
      >
        Women Entrepreneur Cell at Gwalior Incubation Center. Inspiring, empowering, and providing the tools needed to excel as business leaders.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.6 }}
        style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center', position: 'relative', zIndex: 2 }}
      >
        {['🌸 Women-First', '🚀 Startup Ready', '🏛️ Govt. Backed'].map((b, i) => (
          <span key={i} style={{
            display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 100, padding: '12px 24px', fontSize: 15, fontWeight: 700, color: C.white,
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
          }}>
            {b}
          </span>
        ))}
      </motion.div>
    </div>

    {/* ══ ABOUT SECTION ══ */}
    <div style={{ background: C.bg, padding: 'clamp(64px, 10vw, 96px) clamp(20px, 5vw, 32px)', marginTop: '-60px', position: 'relative', zIndex: 3 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>
        <Reveal delay={0}>
          <motion.div 
            whileHover={{ y: -8, boxShadow: '0 24px 48px rgba(10, 34, 54, 0.1)' }}
            style={{ background: C.white, borderRadius: 32, padding: 'clamp(40px, 5vw, 56px)', border: `1px solid ${C.pale}`, boxShadow: '0 20px 40px rgba(10, 34, 54, 0.05)', height: '100%', boxSizing: 'border-box', transition: 'all 0.4s ease' }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: C.lt, color: C.primary, borderRadius: 100, padding: '8px 20px', marginBottom: 24, fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', border: `1px solid ${C.pale}` }}>
              🌟 About Yashashwani
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 900, color: C.heading, marginBottom: 20, lineHeight: 1.2, letterSpacing: '-0.5px' }}>
              A Beacon of Opportunity
            </h2>
            <p style={{ fontSize: 17, color: C.text, lineHeight: 1.8, margin: 0, fontWeight: 500 }}>
              Established to inspire, empower, and support women entrepreneurs. We foster a nurturing environment where women can access the resources, guidance, and cutting-edge training needed to develop and rapidly scale their business ideas.
            </p>
          </motion.div>
        </Reveal>

        <Reveal delay={0.1}>
          <motion.div 
            whileHover={{ y: -8, boxShadow: '0 24px 48px rgba(234, 159, 36, 0.2)' }}
            style={{ background: `linear-gradient(135deg, ${C.primary} 0%, ${C.mid} 100%)`, borderRadius: 32, padding: 'clamp(40px, 5vw, 56px)', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 40px rgba(21, 67, 107, 0.25)', height: '100%', boxSizing: 'border-box', transition: 'all 0.4s ease' }}
          >
            <div style={{ position: 'absolute', top: -50, right: -50, width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(234, 159, 36, 0.25) 0%, transparent 70%)' }} />
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(234, 159, 36, 0.15)', color: C.accent, borderRadius: 100, padding: '8px 20px', marginBottom: 24, fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', border: `1px solid rgba(234, 159, 36, 0.2)` }}>
              🎯 Our Mission
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 900, color: C.white, marginBottom: 20, lineHeight: 1.2, letterSpacing: '-0.5px', position: 'relative', zIndex: 1 }}>
              Removing Barriers
            </h2>
            <p style={{ fontSize: 17, color: '#E2EEF8', lineHeight: 1.8, margin: 0, position: 'relative', zIndex: 1, fontWeight: 500 }}>
              We aim to eliminate obstacles women face in entrepreneurship, enabling them to control their economic futures. By providing essential tools, skills, and confidence, we help women excel as business leaders and shape a stronger local economy.
            </p>
          </motion.div>
        </Reveal>
      </div>
    </div>

    {/* ══ STATS ══ */}
    <div style={{ background: C.white, padding: 'clamp(48px, 5vw, 80px) clamp(20px, 5vw, 32px)', borderTop: `1px solid ${C.pale}`, borderBottom: `1px solid ${C.pale}` }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24, maxWidth: 1200, margin: '0 auto' }}>
        {STATS.map((s, i) => <StatCard key={i} {...s} delay={i * 0.1} />)}
      </div>
    </div>

    {/* ══ WHAT WE OFFER ══ */}
    <div style={{ background: C.bg, padding: 'clamp(80px, 12vw, 120px) clamp(20px, 5vw, 32px)' }}>
      <Reveal style={{ textAlign: 'center', marginBottom: 64, maxWidth: 720, margin: '0 auto 80px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ height: 2, width: 40, background: `linear-gradient(90deg, transparent, ${C.accent})` }} />
          <span style={{ fontSize: 14, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.accent }}>Services</span>
          <div style={{ height: 2, width: 40, background: `linear-gradient(90deg, ${C.accent}, transparent)` }} />
        </div>
        <h2 style={{ fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 900, color: C.heading, letterSpacing: '-1px', lineHeight: 1.1, margin: '0 0 24px' }}>
          Programs to Power Your Journey
        </h2>
        <p style={{ fontSize: 20, color: C.text, lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
          Comprehensive, world-class support tailored specifically for women entrepreneurs at every stage of their business.
        </p>
      </Reveal>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32, maxWidth: 1200, margin: '0 auto' }}>
        {OFFERINGS.map((item, i) => <OfferingCard key={i} item={item} index={i} />)}
      </div>
    </div>

    {/* ══ JOIN FORM SECTION ══ */}
    <div id="join" style={{
      background: `linear-gradient(135deg, ${C.dark} 0%, ${C.primary} 100%)`,
      padding: 'clamp(100px, 12vw, 140px) clamp(20px, 5vw, 32px)',
      position: 'relative', overflow: 'hidden',
    }}>
      <Orb style={{ top: -100, left: -50, width: 500, height: 500, background: 'radial-gradient(circle, rgba(40, 123, 190, 0.3) 0%, transparent 70%)' }} anim={{ x: [0, 30, 0] }} dur={10} />
      <Orb style={{ bottom: -100, right: -50, width: 500, height: 500, background: 'radial-gradient(circle, rgba(234, 159, 36, 0.2) 0%, transparent 70%)' }} anim={{ y: [0, -30, 0] }} dur={14} />

      <div style={{ textAlign: 'center', marginBottom: 64, position: 'relative', zIndex: 2 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <p style={{ fontSize: 14, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.accent, margin: '0 0 16px' }}>
            Join the Movement
          </p>
          <h2 style={{ fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 900, color: C.white, letterSpacing: '-1px', margin: '0 0 20px', lineHeight: 1.1 }}>
            Start Your Journey
          </h2>
          <p style={{ color: '#E2EEF8', fontSize: 20, maxWidth: 600, margin: '0 auto', lineHeight: 1.6 }}>
            Fill in your details below and our expert team will connect with you to guide your next big steps.
          </p>
        </motion.div>
      </div>

      <div style={{ position: 'relative', zIndex: 2 }}>
        <JoinForm />
      </div>
    </div>

    {/* ══ BOTTOM CTA ══ */}
    <div style={{ background: C.white, padding: 'clamp(80px, 10vw, 120px) clamp(20px, 5vw, 32px)' }}>
      <Reveal style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div style={{
          background: C.bg, border: `1px solid ${C.pale}`, borderRadius: 36,
          padding: 'clamp(56px, 8vw, 96px) clamp(32px, 6vw, 64px)', textAlign: 'center',
          boxShadow: '0 24px 48px rgba(10, 34, 54, 0.05)',
        }}>
          <h2 style={{ margin: '0 0 24px', fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 900, color: C.heading, letterSpacing: '-1px', lineHeight: 1.1 }}>
            Be the Change You Wish to See
          </h2>
          <p style={{ margin: '0 auto 48px', maxWidth: 640, fontSize: 20, color: C.text, lineHeight: 1.7, fontWeight: 500 }}>
            Yashashwani is more than a program — it's a movement. Join thousands of visionary women building a brighter, stronger tomorrow.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'center' }}>
            <motion.a href="#join" whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(234, 159, 36, 0.3)' }} whileTap={{ scale: 0.96 }}
              style={{ display: 'inline-flex', alignItems: 'center', background: `linear-gradient(90deg, ${C.accent} 0%, ${C.accentDk} 100%)`, color: C.white, textDecoration: 'none', fontWeight: 800, fontSize: 18, padding: '18px 48px', borderRadius: 100, transition: 'all 0.3s' }}>
              Apply Now ↗
            </motion.a>
            <motion.a href="/" whileHover={{ y: -4, background: C.lt, boxShadow: '0 12px 24px rgba(0,0,0,0.05)' }} whileTap={{ scale: 0.96 }}
              style={{ display: 'inline-flex', alignItems: 'center', background: C.white, border: `2px solid ${C.pale}`, color: C.heading, textDecoration: 'none', fontWeight: 800, fontSize: 18, padding: '16px 48px', borderRadius: 100, transition: 'all 0.3s' }}>
              Learn More
            </motion.a>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

export default GWEDCPage;