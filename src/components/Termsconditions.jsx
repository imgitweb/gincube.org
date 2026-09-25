import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

/* ── animation helpers ── */
const fadeUp  = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0 } };
const ease    = { duration: 0.55, ease: [0.16, 1, 0.3, 1] };

const Reveal = ({ children, variants = fadeUp, delay = 0, style = {} }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div
      ref={ref} variants={variants} initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      transition={{ ...ease, delay }} style={style}
    >
      {children}
    </motion.div>
  );
};

/* ── Brand Tokens ── */
const C = {
  primary: '#15436B', mid: '#1C5A8F', light: '#287BBE',
  pale: '#D0E2F2', lt: '#F0F6FB', dark: '#0A2236', darkMid: '#0E2E4A',
  heading: '#0D1F2D', text: '#475569', muted: '#64748B',
  accent: '#EA9F24', white: '#FFFFFF',
};

/* ── Bullet list ── */
const BulletList = ({ items }) => (
  <ul style={{ margin: '10px 0 0', padding: 0, listStyle: 'none' }}>
    {items.map((item, i) => (
      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8, fontSize: 14.5, color: C.text, lineHeight: 1.65 }}>
        <span style={{ flexShrink: 0, marginTop: 7, width: 6, height: 6, borderRadius: '50%', background: `linear-gradient(135deg, ${C.primary}, ${C.accent})` }} />
        {item}
      </li>
    ))}
  </ul>
);

/* ── Sections Data ── */
const sections = [
  {
    num: '01', icon: '✅', title: 'Acceptance',
    text: 'By using this website, you accept these Terms & Conditions. If you do not agree, please discontinue using the website.',
  },
  {
    num: '02', icon: '🎂', title: 'Eligibility',
    text: 'You must be at least 18 years old to register for and use G.Incube services.',
  },
  {
    num: '03', icon: '🚀', title: 'Services',
    text: 'G.Incube provides the following services, which may change without prior notice:',
    bullets: ['Startup Incubation', 'Mentorship', 'Investor Connect', 'Training Programs', 'Workshops', 'Networking Events', 'Innovation Support', 'Business Development Assistance'],
    grid: true,
  },
  {
    num: '04', icon: '📝', title: 'Registration',
    bullets: ['Users must provide accurate and complete information.', 'You are responsible for maintaining the confidentiality of your submitted information.'],
  },
  {
    num: '05', icon: '📊', title: 'Startup Applications',
    text: 'Submission of an application does not guarantee any of the following. Applications are reviewed based on internal evaluation criteria.',
    pills: ['Selection', 'Funding', 'Incubation', 'Investment', 'Certification'],
  },
  {
    num: '06', icon: '©️', title: 'Intellectual Property',
    text: 'All website content belongs to G.Incube unless otherwise stated. Unauthorized copying or reproduction is strictly prohibited.',
    bullets: ['Logos & Graphics', 'Documents & Text', 'Images & Designs'],
  },
  {
    num: '07', icon: '⚠️', title: 'User Responsibilities',
    text: 'Users agree NOT to engage in any of the following:',
    bullets: ['Submit false information', 'Upload malicious software', 'Attempt unauthorized access', 'Misuse website resources', 'Violate applicable laws'],
    danger: true,
  },
  {
    num: '08', icon: '🌐', title: 'External Links',
    text: 'Our website may contain links to external websites. We are not responsible for their content, availability, or privacy practices.',
  },
  {
    num: '09', icon: '⚖️', title: 'Limitation of Liability',
    text: 'G.Incube shall not be liable for:',
    bullets: ['Technical interruptions or website downtime', 'Data loss or corruption', 'Third-party service failures', 'Business losses arising from website use'],
  },
  {
    num: '10', icon: '🚫', title: 'Termination',
    text: 'We reserve the right to suspend or terminate access if users:',
    bullets: ['Violate these Terms', 'Submit fraudulent information', 'Misuse the platform'],
  },
  {
    num: '11', icon: '🏛️', title: 'Governing Law',
    text: 'These Terms shall be governed by the laws of India. Any disputes shall be subject to the jurisdiction of the competent courts in Madhya Pradesh.',
  },
  {
    num: '12', icon: '🔄', title: 'Changes to Terms',
    text: 'We reserve the right to update these Terms & Conditions at any time. Continued use of the website constitutes acceptance of the revised Terms.',
  },
  {
    num: '13', icon: '📞', title: 'Contact',
    isContact: true,
  },
];

const tocItems = sections.map(s => ({ num: s.num, title: s.title }));

/* ── Section Card ── */
const SectionCard = ({ s, index }) => {
  const accentColor = s.danger ? '#DC2626' : C.accent;
  const topStripe   = s.danger
    ? 'linear-gradient(180deg, #DC2626, #EA9F24)'
    : `linear-gradient(180deg, ${C.primary}, ${C.accent})`;

  return (
    <Reveal delay={index * 0.04} id={`sec-${s.num}`}>
      <motion.div
        whileHover={{ y: -3, boxShadow: `0 16px 40px rgba(21, 67, 107, 0.13)` }}
        transition={{ duration: 0.22 }}
        style={{
          background: C.white,
          border: `1px solid ${s.danger ? '#FCA5A5' : C.pale}`,
          borderRadius: 20,
          padding: '28px 28px 24px',
          marginBottom: 18,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 4px 14px rgba(21, 67, 107, 0.06)',
        }}
      >
        {/* left accent stripe */}
        <div style={{
          position: 'absolute', top: 0, left: 0, width: 4, height: '100%',
          background: topStripe, borderRadius: '20px 0 0 20px',
        }} />

        {/* header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
          <div style={{
            width: 46, height: 46, borderRadius: 13, flexShrink: 0,
            background: s.danger
              ? 'linear-gradient(135deg, #DC2626, #EA9F24)'
              : `linear-gradient(135deg, ${C.primary}, ${C.accent})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20,
            boxShadow: s.danger
              ? '0 6px 18px rgba(220,38,38,0.28)'
              : `0 6px 18px rgba(21, 67, 107, 0.26)`,
          }}>
            {s.icon}
          </div>
          <div>
            <p style={{ margin: '0 0 2px', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: accentColor, textTransform: 'uppercase' }}>
              Section {s.num}
            </p>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: C.heading, lineHeight: 1.2 }}>
              {s.title}
            </h3>
          </div>
        </div>

        {/* divider */}
        <div style={{ height: 1, background: `linear-gradient(90deg, ${s.danger ? '#FCA5A5' : C.pale}, transparent)`, marginBottom: 16 }} />

        {/* body */}
        {s.isContact ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {[
              { icon: '🏢', label: 'Organization', value: 'G.Incube' },
              { icon: '🌐', label: 'Website', value: 'gincube.org', href: 'https://gincube.org' },
              { icon: '📧', label: 'Email', value: 'connect@gincube.org', href: 'mailto:connect@gincube.org' },
            ].map((c, i) => (
              <div key={i} style={{ flex: '1 1 160px', background: C.lt, border: `1px solid ${C.pale}`, borderRadius: 12, padding: '14px 16px' }}>
                <p style={{ margin: '0 0 4px', fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {c.icon} {c.label}
                </p>
                {c.href
                  ? <a href={c.href} style={{ fontSize: 14, fontWeight: 700, color: C.primary, textDecoration: 'none' }}>{c.value}</a>
                  : <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: C.heading }}>{c.value}</p>
                }
              </div>
            ))}
          </div>
        ) : (
          <>
            {s.text && <p style={{ margin: '0 0 10px', fontSize: 14.5, color: C.text, lineHeight: 1.75 }}>{s.text}</p>}

            {/* grid services */}
            {s.grid && s.bullets && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10, marginTop: 10 }}>
                {s.bullets.map((item, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -2, boxShadow: `0 8px 22px rgba(21,67,107,0.14)` }}
                    transition={{ duration: 0.18 }}
                    style={{
                      background: C.lt, border: `1px solid ${C.pale}`,
                      borderRadius: 12, padding: '12px 14px',
                      display: 'flex', alignItems: 'center', gap: 8,
                    }}
                  >
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: `linear-gradient(135deg, ${C.primary}, ${C.accent})`, flexShrink: 0 }} />
                    <span style={{ fontSize: 13.5, fontWeight: 600, color: C.primary }}>{item}</span>
                  </motion.div>
                ))}
              </div>
            )}

            {/* "not guaranteed" pills */}
            {s.pills && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
                {s.pills.map((p, i) => (
                  <span key={i} style={{
                    background: '#FEF3C7', color: '#92400E',
                    border: '1px solid #FDE68A',
                    borderRadius: 100, padding: '5px 14px',
                    fontSize: 13, fontWeight: 700,
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                  }}>
                    ✗ {p}
                  </span>
                ))}
              </div>
            )}

            {/* plain bullets (non-grid) */}
            {s.bullets && !s.grid && <BulletList items={s.bullets} />}
          </>
        )}
      </motion.div>
    </Reveal>
  );
};

/* ══════════════ MAIN COMPONENT ══════════════ */
const TermsAndConditions = () => (
  <section style={{
    fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
    color: C.heading, overflow: 'hidden', background: '#F8FAFC',
  }}>

    {/* ── HERO ── */}
    <div style={{ position: 'relative', background: C.dark, padding: '72px 32px 80px', overflow: 'hidden', textAlign: 'center' }}>
      {/* ambient orbs */}
      <motion.div
        animate={{ x: [0, 20, -10, 0], y: [0, -16, 14, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'absolute', top: -80, left: -100, width: 360, height: 360,
          background: `radial-gradient(circle, rgba(21,67,107,0.4) 0%, transparent 70%)`, pointerEvents: 'none' }}
      />
      <motion.div
        animate={{ x: [0, -16, 12, 0], y: [0, 18, -12, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'absolute', bottom: -100, right: -70, width: 400, height: 400,
          background: `radial-gradient(circle, rgba(234,159,36,0.22) 0%, transparent 70%)`, pointerEvents: 'none' }}
      />

      {/* icon */}
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
            fontSize: 28, boxShadow: `0 8px 28px rgba(21,67,107,0.4)`,
          }}
        >
          📜
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

      <motion.h1
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.14, ...ease }}
        style={{ margin: '0 0 8px', fontSize: 'clamp(28px,5vw,44px)', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px', lineHeight: 1.1 }}
      >
        Terms &amp; Conditions
      </motion.h1>

      <motion.div
        initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: 0.34, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ height: 4, width: 60, background: `linear-gradient(90deg, ${C.primary}, ${C.accent})`,
          borderRadius: 100, margin: '0 auto 16px', transformOrigin: 'left' }}
      />

      <motion.p
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, ...ease }}
        style={{ margin: '0 auto 24px', maxWidth: 480, fontSize: 15, color: '#94A3B8', lineHeight: 1.75 }}
      >
        Please read these terms carefully before using G.Incube's website or services.
      </motion.p>

      {/* meta badges */}
      <motion.div
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28, ...ease }}
        style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}
      >
        {[
          { icon: '📅', label: 'Effective Date', value: 'June 27, 2026' },
          { icon: '📝', label: 'Sections', value: '13 Sections' },
          { icon: '🏛️', label: 'Jurisdiction', value: 'Madhya Pradesh, India' },
        ].map((b, i) => (
          <motion.div key={i}
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3 + i * 0.6, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
            style={{
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(234,159,36,0.25)',
              borderRadius: 12, padding: '10px 18px',
              backdropFilter: 'blur(8px)', textAlign: 'center',
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
      <div style={{ background: C.white, borderBottom: `1px solid ${C.pale}`, padding: '18px 24px', overflowX: 'auto' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', minWidth: 'max-content', maxWidth: 940, margin: '0 auto' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: '0.1em', textTransform: 'uppercase', marginRight: 8, flexShrink: 0 }}>
            Contents
          </span>
          {tocItems.map(t => (
            <a key={t.num} href={`#sec-${t.num}`}
              style={{ fontSize: 12, fontWeight: 600, color: C.primary, textDecoration: 'none',
                background: C.lt, border: `1px solid ${C.pale}`, borderRadius: 8,
                padding: '5px 12px', whiteSpace: 'nowrap', flexShrink: 0 }}
              onMouseEnter={e => { e.target.style.background = C.pale; }}
              onMouseLeave={e => { e.target.style.background = C.lt; }}
            >
              {t.num}. {t.title}
            </a>
          ))}
        </div>
      </div>
    </Reveal> */}

    {/* ── ACCEPTANCE NOTE ── */}
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 24px 0' }}>
      <Reveal delay={0.06}>
        <div style={{
          background: `linear-gradient(135deg, ${C.lt}, ${C.white})`,
          border: `1px solid ${C.pale}`,
          borderLeft: `4px solid ${C.accent}`,
          borderRadius: '0 14px 14px 0',
          padding: '16px 20px', marginBottom: 24,
        }}>
          <p style={{ margin: 0, fontSize: 14, color: C.text, lineHeight: 1.75 }}>
            <strong style={{ color: C.primary }}>Welcome to G.Incube.</strong>{' '}
            By accessing this website, you agree to comply with these Terms &amp; Conditions. These terms form a legally binding agreement between you and G.Incube under the laws of India.
          </p>
        </div>
      </Reveal>
    </div>

    {/* ── SECTION CARDS ── */}
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px 60px' }}>
      {sections.map((s, i) => (
        <SectionCard key={s.num} s={s} index={i} />
      ))}

      {/* ── FOOTER CTA ── */}
      <Reveal delay={0.1}>
        <div style={{
          background: `linear-gradient(135deg, ${C.dark} 0%, ${C.darkMid} 60%, #061420 100%)`,
          borderRadius: 22, padding: '36px 28px', textAlign: 'center',
          position: 'relative', overflow: 'hidden', marginTop: 8,
        }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200,
            background: 'radial-gradient(circle, rgba(234,159,36,0.18), transparent 70%)', pointerEvents: 'none' }} />
          <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.accent }}>
            Have questions?
          </p>
          <h3 style={{ margin: '0 0 10px', fontSize: 22, fontWeight: 900, color: '#fff' }}>
            We're here to help
          </h3>
          <p style={{ margin: '0 0 22px', fontSize: 14, color: '#94A3B8', lineHeight: 1.7 }}>
            For any queries related to these Terms &amp; Conditions,<br />reach out to us directly.
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

export default TermsAndConditions;