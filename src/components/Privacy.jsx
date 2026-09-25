import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

/* ── animation helpers ── */
const fadeUp   = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0 } };
const fadeLeft = { hidden: { opacity: 0, x: -24 }, visible: { opacity: 1, x: 0 } };
const ease     = { duration: 0.55, ease: [0.16, 1, 0.3, 1] };

const Reveal = ({ children, variants = fadeUp, delay = 0, style = {} }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      transition={{ ...ease, delay }}
      style={style}
    >
      {children}
    </motion.div>
  );
};

/* ── Brand Tokens ── */
const C = {
  primary:  '#15436B',
  mid:      '#1C5A8F',
  light:    '#287BBE',
  pale:     '#D0E2F2',
  lt:       '#F0F6FB',
  dark:     '#0A2236',
  darkMid:  '#0E2E4A',
  heading:  '#0D1F2D',
  text:     '#475569',
  muted:    '#64748B',
  accent:   '#EA9F24',
  white:    '#FFFFFF',
};

/* ── Policy Sections Data ── */
const sections = [
  {
    num: '01',
    icon: '📋',
    title: 'Information We Collect',
    subsections: [
      {
        label: 'Personal Information',
        items: ['Full Name', 'Email Address', 'Mobile Number', 'Organization / Startup Name', 'Designation', 'Address', 'City and State', 'Educational Background', 'Professional Experience'],
      },
      {
        label: 'Startup Information',
        items: ['Startup Name', 'Startup Stage', 'Industry / Sector', 'Business Description', 'Team Information', 'Funding Status', 'Website / Social Media Links'],
      },
      {
        label: 'Technical Information',
        items: ['IP Address', 'Browser Type', 'Device Information', 'Operating System', 'Pages Visited', 'Time Spent on Website'],
      },
    ],
  },
  {
    num: '02',
    icon: '🎯',
    title: 'How We Use Your Information',
    bullets: [
      'Process registrations and verify applicant details',
      'Communicate regarding incubation programs',
      'Respond to inquiries and improve our website',
      'Organize events and workshops',
      'Share important updates',
      'Evaluate startup applications',
      'Maintain internal records',
    ],
  },
  {
    num: '03',
    icon: '🍪',
    title: 'Cookies',
    text: 'Our website may use cookies to improve website performance, remember user preferences, analyze website traffic, and enhance user experience. You may disable cookies through your browser settings.',
  },
  {
    num: '04',
    icon: '🤝',
    title: 'Information Sharing',
    text: 'We do not sell or rent your personal information. Your information may only be shared with:',
    bullets: [
      'Government departments (where applicable)',
      'Program mentors',
      'Investors (with your consent)',
      'Technology partners',
      'Legal authorities if required by law',
    ],
  },
  {
    num: '05',
    icon: '🔒',
    title: 'Data Security',
    text: 'We implement appropriate security measures including secure servers, SSL encryption, restricted database access, password protection, and regular monitoring. Although we strive to protect your data, no online transmission is completely secure.',
  },
  {
    num: '06',
    icon: '📅',
    title: 'Data Retention',
    text: 'We retain your information only for as long as necessary to complete incubation activities, meet legal obligations, resolve disputes, and improve our services.',
  },
  {
    num: '07',
    icon: '🌐',
    title: 'Third-Party Services',
    text: 'Our website may contain links to third-party services including Google Forms, Google Drive, Social Media Platforms, and Government Websites. We are not responsible for the privacy practices of external websites.',
  },
  {
    num: '08',
    icon: '✅',
    title: 'User Rights',
    bullets: [
      'Request access to your data',
      'Request correction of incorrect information',
      'Request deletion of your information (subject to applicable laws)',
      'Withdraw consent where applicable',
    ],
  },
  {
    num: '09',
    icon: '👶',
    title: "Children's Privacy",
    text: 'Our services are intended for individuals aged 18 years or above. We do not knowingly collect information from children.',
  },
  {
    num: '10',
    icon: '🔄',
    title: 'Changes to Privacy Policy',
    text: 'We may update this Privacy Policy from time to time. The revised version will be published on this page with an updated effective date.',
  },
  {
    num: '11',
    icon: '📞',
    title: 'Contact Us',
    isContact: true,
  },
];

/* ── TOC items for sidebar quick nav ── */
const tocItems = sections.map(s => ({ num: s.num, title: s.title }));

/* ── Sub-chip for category labels ── */
const Chip = ({ label }) => (
  <span style={{
    display: 'inline-block',
    background: C.lt,
    color: C.primary,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    padding: '4px 10px',
    borderRadius: 6,
    marginBottom: 10,
    border: `1px solid ${C.pale}`,
  }}>
    {label}
  </span>
);

/* ── Bullet list ── */
const BulletList = ({ items }) => (
  <ul style={{ margin: '10px 0 0', padding: 0, listStyle: 'none' }}>
    {items.map((item, i) => (
      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8, fontSize: 14.5, color: C.text, lineHeight: 1.65 }}>
        <span style={{
          flexShrink: 0,
          marginTop: 6,
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${C.primary}, ${C.accent})`,
        }} />
        {item}
      </li>
    ))}
  </ul>
);

/* ── Main Section Card ── */
const SectionCard = ({ s, index }) => (
  <Reveal delay={index * 0.04} id={`sec-${s.num}`}>
    <motion.div
      whileHover={{ y: -3, boxShadow: `0 16px 40px rgba(21, 67, 107, 0.13)` }}
      transition={{ duration: 0.22 }}
      style={{
        background: C.white,
        border: `1px solid ${C.pale}`,
        borderRadius: 20,
        padding: '28px 28px 24px',
        marginBottom: 18,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 4px 14px rgba(21, 67, 107, 0.06)',
      }}
    >
      {/* top-left accent stripe */}
      <div style={{
        position: 'absolute', top: 0, left: 0, width: 4, height: '100%',
        background: `linear-gradient(180deg, ${C.primary}, ${C.accent})`,
        borderRadius: '20px 0 0 20px',
      }} />

      {/* header row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
        <div style={{
          width: 46, height: 46, borderRadius: 13,
          background: `linear-gradient(135deg, ${C.primary}, ${C.accent})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20, flexShrink: 0,
          boxShadow: `0 6px 18px rgba(21, 67, 107, 0.26)`,
        }}>
          {s.icon}
        </div>
        <div>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: C.accent, textTransform: 'uppercase' }}>
            Section {s.num}
          </p>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: C.heading, lineHeight: 1.2 }}>
            {s.title}
          </h3>
        </div>
      </div>

      {/* divider */}
      <div style={{ height: 1, background: `linear-gradient(90deg, ${C.pale}, transparent)`, marginBottom: 16 }} />

      {/* body */}
      {s.isContact ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {[
            { icon: '🏢', label: 'Organization', value: 'G.Incube' },
            { icon: '🌐', label: 'Website', value: 'gincube.org', href: 'https://gincube.org' },
            { icon: '📧', label: 'Email', value: 'connect@gincube.org', href: 'mailto:connect@gincube.org' },
          ].map((c, i) => (
            <div key={i} style={{
              flex: '1 1 160px',
              background: C.lt,
              border: `1px solid ${C.pale}`,
              borderRadius: 12,
              padding: '14px 16px',
            }}>
              <p style={{ margin: '0 0 4px', fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {c.icon} {c.label}
              </p>
              {c.href ? (
                <a href={c.href} style={{ fontSize: 14, fontWeight: 700, color: C.primary, textDecoration: 'none' }}>
                  {c.value}
                </a>
              ) : (
                <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: C.heading }}>{c.value}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <>
          {s.text && <p style={{ margin: '0 0 10px', fontSize: 14.5, color: C.text, lineHeight: 1.75 }}>{s.text}</p>}

          {s.subsections && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 8 }}>
              {s.subsections.map((sub, j) => (
                <div key={j} style={{
                  flex: '1 1 180px',
                  background: C.lt,
                  border: `1px solid ${C.pale}`,
                  borderRadius: 12,
                  padding: '14px 16px',
                }}>
                  <Chip label={sub.label} />
                  <BulletList items={sub.items} />
                </div>
              ))}
            </div>
          )}

          {s.bullets && !s.subsections && <BulletList items={s.bullets} />}
        </>
      )}
    </motion.div>
  </Reveal>
);

/* ══════════════ MAIN COMPONENT ══════════════ */
const PrivacyPolicy = () => (
  <section style={{
    fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
    color: C.heading,
    overflow: 'hidden',
    background: '#F8FAFC',
  }}>

    {/* ── HERO ── */}
    <div style={{
      position: 'relative',
      background: C.dark,
      padding: '72px 32px 80px',
      overflow: 'hidden',
      textAlign: 'center',
    }}>
      {/* ambient orbs */}
      <motion.div
        animate={{ x: [0, 20, -10, 0], y: [0, -16, 14, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', top: -80, left: -100, width: 360, height: 360,
          background: `radial-gradient(circle, rgba(21,67,107,0.4) 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />
      <motion.div
        animate={{ x: [0, -16, 12, 0], y: [0, 18, -12, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', bottom: -100, right: -70, width: 400, height: 400,
          background: `radial-gradient(circle, rgba(234,159,36,0.22) 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      {/* lock icon pulse */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.05, type: 'spring', stiffness: 280, damping: 20 }}
        style={{ marginBottom: 18, display: 'flex', justifyContent: 'center' }}
      >
        <motion.div
          animate={{ boxShadow: [`0 0 0 0px rgba(234,159,36,0.35)`, `0 0 0 14px rgba(234,159,36,0)`, `0 0 0 0px rgba(234,159,36,0)`] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
          style={{
            width: 64, height: 64, borderRadius: 18,
            background: `linear-gradient(135deg, ${C.primary}, ${C.accent})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28,
            boxShadow: `0 8px 28px rgba(21,67,107,0.4)`,
          }}
        >
          🔐
        </motion.div>
      </motion.div>

      {/* eyebrow */}
      <motion.div
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, ...ease }}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 14 }}
      >
        <div style={{ height: 1, width: 36, background: `linear-gradient(90deg, transparent, ${C.accent})` }} />
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.accent }}>Legal</span>
        <div style={{ height: 1, width: 36, background: `linear-gradient(90deg, ${C.accent}, transparent)` }} />
      </motion.div>

      {/* heading */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.14, ...ease }}
        style={{ margin: '0 0 8px', fontSize: 'clamp(28px,5vw,44px)', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px', lineHeight: 1.1 }}
      >
        Privacy Policy
      </motion.h1>

      {/* underline */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: 0.34, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{
          height: 4, width: 60,
          background: `linear-gradient(90deg, ${C.primary}, ${C.accent})`,
          borderRadius: 100, margin: '0 auto 16px', transformOrigin: 'left',
        }}
      />

      <motion.p
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, ...ease }}
        style={{ margin: '0 auto 24px', maxWidth: 480, fontSize: 15, color: '#94A3B8', lineHeight: 1.75 }}
      >
        Your privacy matters to us. Read how G.Incube collects, uses, and protects your personal data.
      </motion.p>

      {/* Effective Date badge */}
      <motion.div
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28, ...ease }}
        style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}
      >
        {[
          { icon: '📅', label: 'Effective Date', value: 'June 27, 2026' },
          { icon: '📝', label: 'Sections', value: '11 Sections' },
          { icon: '🔒', label: 'Standard', value: 'GDPR Aligned' },
        ].map((b, i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3 + i * 0.6, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
            style={{
              background: 'rgba(255,255,255,0.07)',
              border: `1px solid rgba(234,159,36,0.25)`,
              borderRadius: 12, padding: '10px 18px',
              backdropFilter: 'blur(8px)',
              textAlign: 'center',
            }}
          >
            <p style={{ margin: '0 0 2px', fontSize: 10, color: C.accent, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              {b.icon} {b.label}
            </p>
            <p style={{ margin: 0, fontSize: 13, color: '#fff', fontWeight: 700 }}>{b.value}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>

    {/* ── TOC STRIP ── */}
    {/* <Reveal delay={0.05}>
      <div style={{
        background: C.white,
        borderBottom: `1px solid ${C.pale}`,
        padding: '18px 24px',
        overflowX: 'auto',
      }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', minWidth: 'max-content', maxWidth: 900, margin: '0 auto' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: '0.1em', textTransform: 'uppercase', marginRight: 8, flexShrink: 0 }}>
            Contents
          </span>
          {tocItems.map((t) => (
            <a
              key={t.num}
              href={`#sec-${t.num}`}
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: C.primary,
                textDecoration: 'none',
                background: C.lt,
                border: `1px solid ${C.pale}`,
                borderRadius: 8,
                padding: '5px 12px',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                transition: 'background 0.18s',
              }}
              onMouseEnter={e => { e.target.style.background = C.pale; }}
              onMouseLeave={e => { e.target.style.background = C.lt; }}
            >
              {t.num}. {t.title}
            </a>
          ))}
        </div>
      </div>
    </Reveal> */}

    {/* ── INTRO NOTE ── */}
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 24px 0' }}>
      <Reveal delay={0.06}>
        <div style={{
          background: `linear-gradient(135deg, ${C.lt}, ${C.white})`,
          border: `1px solid ${C.pale}`,
          borderLeft: `4px solid ${C.accent}`,
          borderRadius: '0 14px 14px 0',
          padding: '16px 20px',
          marginBottom: 24,
        }}>
          <p style={{ margin: 0, fontSize: 14, color: C.text, lineHeight: 1.75 }}>
            <strong style={{ color: C.primary }}>Welcome to G.Incube</strong> — we value your privacy and are committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, store, and protect your information when you visit{' '}
            <a href="https://gincube.org" style={{ color: C.accent, fontWeight: 700, textDecoration: 'none' }}>gincube.org</a>{' '}
            or use any of our services.
          </p>
        </div>
      </Reveal>
    </div>

    {/* ── SECTIONS ── */}
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px 60px' }}>
      {sections.map((s, i) => (
        <SectionCard key={s.num} s={s} index={i} />
      ))}

      {/* ── FOOTER NOTE ── */}
      <Reveal delay={0.1}>
        <div style={{
          background: `linear-gradient(135deg, ${C.dark} 0%, ${C.darkMid} 60%, #061420 100%)`,
          borderRadius: 22,
          padding: '36px 28px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          marginTop: 8,
        }}>
          <div style={{
            position: 'absolute', top: -40, right: -40, width: 200, height: 200,
            background: 'radial-gradient(circle, rgba(234,159,36,0.18), transparent 70%)',
            pointerEvents: 'none',
          }} />
          <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.accent }}>
            Questions about your data?
          </p>
          <h3 style={{ margin: '0 0 10px', fontSize: 22, fontWeight: 900, color: '#fff' }}>
            We're here to help
          </h3>
          <p style={{ margin: '0 0 22px', fontSize: 14, color: '#94A3B8', lineHeight: 1.7 }}>
            Reach out to us at any time for privacy-related queries.<br />
            We respond within 2–3 working days.
          </p>
          <motion.a
            href="mailto:connect@gincube.org"
            whileHover={{ y: -3, boxShadow: '0 16px 36px rgba(21, 67, 107, 0.55)' }}
            whileTap={{ scale: 0.96 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: `linear-gradient(135deg, ${C.primary}, ${C.light})`,
              color: '#fff', textDecoration: 'none', fontWeight: 700,
              fontSize: 14, padding: '14px 30px', borderRadius: 100,
              boxShadow: '0 8px 24px rgba(21, 67, 107, 0.4)',
            }}
          >
            📧 connect@gincube.org
          </motion.a>
        </div>
      </Reveal>
    </div>
  </section>
);

export default PrivacyPolicy;