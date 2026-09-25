import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from 'react-router-dom';

// ─── IMAGES IMPORT ───
import logoImage from '../assets/logo.png';

/* ═══════════════════════════════════════════════════
   BRAND TOKENS (Premium Navy Blue & Golden Yellow Theme)
═══════════════════════════════════════════════════ */
const C = {
  primary: "#15436B", // Deep Navy Blue
  mid: "#1C5A8F", // Mid Blue
  light: "#287BBE", // Lighter Blue
  pale: "#E2E8F0", // Pale Slate
  lt: "#F8FAFC", // Lightest tint for borders/bg
  dark: "#0A2236", // Darkest Blue
  darkMid: "#0F172A",
  heading: "#0A2236", // Near black slate for headings
  text: "#334155", // Modern slate gray
  muted: "#64748B", // Muted text
  accent: "#EA9F24", // Golden Yellow
  accentDk: "#D68A1B", // Darker Yellow for hover/gradients
  bg: "#FFFFFF", // White background
  white: "#FFFFFF",
};

/* ═══════════════════════════════════════════════════
   SHIMMER BUTTON (Yellow Gradient Theme)
═══════════════════════════════════════════════════ */
const ShimmerBtn = ({ children, to, style = {} }) => {
  const MotionLink = motion(Link);

  return (
    <MotionLink
      to={to}
      whileHover={{ y: -3, scale: 1.03, boxShadow: `0 15px 35px rgba(234, 159, 36, 0.4)` }}
      whileTap={{ scale: 0.97 }}
      style={{
        position: "relative",
        overflow: "hidden",
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "14px 32px",
        borderRadius: 100,
        fontWeight: 800,
        fontSize: 16,
        fontFamily: "inherit",
        cursor: "pointer",
        textDecoration: "none",
        border: "none",
        background: `linear-gradient(90deg, ${C.accent} 0%, ${C.accentDk} 100%)`, // Golden Yellow Mix
        color: C.white,
        boxShadow: `0 10px 25px rgba(234, 159, 36, 0.3)`, 
        transition: "all 0.3s ease",
        ...style,
      }}
    >
      <motion.span
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.3) 50%, transparent 65%)",
          transform: "translateX(-100%)",
        }}
        animate={{ transform: ["translateX(-100%)", "translateX(200%)"] }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          repeatDelay: 1.5,
          ease: "easeInOut",
        }}
      />
      <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
    </MotionLink>
  );
};

/* ═══════════════════════════════════════════════════
   ANIMATED WAVY UNDERLINE
═══════════════════════════════════════════════════ */
const WavyUnderline = () => (
  <motion.svg
    width="100%"
    height="8"
    viewBox="0 0 320 8"
    preserveAspectRatio="none"
    style={{ position: "absolute", bottom: -4, left: 0, width: "100%" }}
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
  >
    <motion.path
      d="M0 4 Q40 0 80 4 Q120 8 160 4 Q200 0 240 4 Q280 8 320 4"
      stroke={C.accent} // Golden Yellow Stroke
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      viewport={{ once: true }}
    />
  </motion.svg>
);

/* ═══════════════════════════════════════════════════
   ANIMATION VARIANTS
═══════════════════════════════════════════════════ */
const containerAnim = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemAnim = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

/* ═══════════════════════════════════════════════════
   SUB-COMPONENTS
═══════════════════════════════════════════════════ */

const FooterLink = ({ to, children }) => {
  const MotionLink = motion(Link);
  return (
    <motion.div variants={itemAnim}>
      <MotionLink
        to={to}
        initial="rest"
        whileHover="hover"
        style={{
          display: "inline-flex",
          alignItems: "center",
          color: C.text,
          textDecoration: "none",
          fontSize: 15,
          fontWeight: 600,
          padding: "8px 0",
          cursor: "pointer",
        }}
      >
        <motion.span
          variants={{
            rest: { x: 0, color: C.text },
            hover: { x: 6, color: C.accent }, // Pops with Golden Yellow on hover
          }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {children}
        </motion.span>
      </MotionLink>
    </motion.div>
  );
};

const SocialIcon = ({ href, path }) => {
  const [isHovered, setHovered] = useState(false);
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{
        y: -4,
        backgroundColor: C.accent, // Yellow background on hover
        color: C.white,
        borderColor: C.accent,
      }}
      whileTap={{ scale: 0.95 }}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 40,
        height: 40,
        borderRadius: "50%",
        border: `1.5px solid ${C.pale}`,
        color: C.primary, // Navy Blue default icon
        backgroundColor: C.lt,
        textDecoration: "none",
        transition: "all 0.3s ease",
        boxShadow: isHovered ? `0 8px 20px rgba(234, 159, 36, 0.25)` : "none",
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d={path} />
      </svg>
    </motion.a>
  );
};

/* ═══════════════════════════════════════════════════
   MAIN FOOTER COMPONENT
═══════════════════════════════════════════════════ */
const Footer = () => {
  return (
    <>
      <style>{`
        .footer-grid { display: grid; grid-template-columns: 1fr; gap: 48px; }
        @media (min-width: 640px) { .footer-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { .footer-grid { grid-template-columns: 2fr 1fr 1.5fr 1.2fr; gap: 64px; } }
      `}</style>

      <footer
        style={{
          position: "relative",
          background: C.white,
          overflow: "hidden",
          borderTop: `1px solid ${C.pale}`,
          fontFamily: "'Inter', -apple-system, sans-serif",
        }}
      >
        {/* Background Subtle Glows */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 200,
            pointerEvents: "none",
            background: `linear-gradient(to bottom, #F8FAFC, transparent)`,
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.03, 0.06, 0.03] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            bottom: -150,
            left: -100,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: C.primary,
            filter: "blur(120px)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 clamp(20px, 5vw, 40px)",
            position: "relative",
            zIndex: 5,
          }}
        >
          {/* ── Pre-Footer CTA ── */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            variants={containerAnim}
            style={{
              padding: "80px 0 60px",
              borderBottom: `1px solid ${C.pale}`,
              display: "flex",
              flexWrap: "wrap",
              gap: 32,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ maxWidth: 540 }}>
              <motion.h3
                variants={itemAnim}
                style={{
                  margin: "0 0 16px",
                  fontSize: "clamp(28px, 4vw, 36px)",
                  fontWeight: 900,
                  color: C.heading,
                  letterSpacing: "-0.5px",
                  lineHeight: 1.2
                }}
              >
                Ready to accelerate <br />
                <span
                  style={{
                    position: "relative",
                    color: C.accent,
                    display: "inline-block",
                  }}
                >
                  your startup?
                  <WavyUnderline />
                </span>
              </motion.h3>
              <motion.p
                variants={itemAnim}
                style={{
                  margin: 0,
                  fontSize: 16,
                  color: C.text,
                  lineHeight: 1.6,
                  fontWeight: 500
                }}
              >
                Join G.Incube and get the mentorship, workspace, and funding you
                need to scale your vision.
              </motion.p>
            </div>
            <motion.div variants={itemAnim}>
              <ShimmerBtn to="/startup-registration">
                Apply for Incubation →
              </ShimmerBtn>
            </motion.div>
          </motion.div>

          {/* ── Main Footer Grid ── */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            variants={containerAnim}
            className="footer-grid"
            style={{ padding: "72px 0 64px" }}
          >
            {/* Column 1: Brand */}
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <motion.div variants={itemAnim}>
                <img
                  src={logoImage}
                  alt="G.Incube Logo"
                  style={{
                    maxHeight: "75px",
                    width: "auto",
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              </motion.div>
              <motion.p
                variants={itemAnim}
                style={{
                  margin: 0,
                  fontSize: 15,
                  color: C.text,
                  lineHeight: 1.7,
                  fontWeight: 500
                }}
              >
                Gwalior Smart City Incubation Center, operating under Gwalior
                Smart City Development Corporation Limited. Dedicated to
                fostering innovation and entrepreneurship.
              </motion.p>

              {/* Socials */}
              <motion.div
                variants={itemAnim}
                style={{ display: "flex", gap: 16, marginTop: 8 }}
              >
                <SocialIcon
                  href="#"
                  path="M12 2.04c-5.5 0-10 4.48-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.54-4.5-10.02-10-10.02z"
                />
                <SocialIcon
                  href="#"
                  path="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                />
                <SocialIcon
                  href="#"
                  path="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.95v5.66H9.34V9h3.41v1.56h.05c.48-.9 1.63-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM3.56 20.45h3.56V9H3.56v11.45z"
                />
                <SocialIcon
                  href="#"
                  path="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.69-4.92-4.92-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.15-3.23 1.66-4.77 4.92-4.92 1.27-.06 1.64-.07 4.85-.07zm0-2.16C8.74 0 8.33.01 7.05.07 2.76.27.27 2.76.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.29 2.69 6.78 6.98 6.98 1.28.06 1.69.07 4.95.07s3.67-.01 4.95-.07c4.29-.2 6.78-2.69 6.98-6.98 .06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.2-4.29-2.69-6.78-6.98-6.98C15.67.01 15.26 0 12 0zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84zm0 10.16A4 4 0 1 1 16 12a4 4 0 0 1-4 4zm5.8-9.66a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z"
                />
              </motion.div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <motion.h4
                variants={itemAnim}
                style={{
                  margin: "0 0 24px",
                  fontSize: 18,
                  fontWeight: 800,
                  color: C.heading,
                }}
              >
                Quick Links
              </motion.h4>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <FooterLink to="/">Home</FooterLink>
                <FooterLink to="/who-we-are">Who We Are</FooterLink>
                <FooterLink to="/events">Events & Hackathons</FooterLink>
                <FooterLink to="/GWEDC">GWEDC (Women Cell)</FooterLink>
                <FooterLink to="/contact-us">Contact Us</FooterLink>
              </div>
            </div>

            {/* Column 3: Registrations */}
            <div>
              <motion.h4
                variants={itemAnim}
                style={{
                  margin: "0 0 24px",
                  fontSize: 18,
                  fontWeight: 800,
                  color: C.heading,
                }}
              >
                Registrations
              </motion.h4>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <FooterLink to="/startup-registration">
                  Startup Registration
                </FooterLink>
                <FooterLink to="/partner-registration">
                  Partner Registration
                </FooterLink>
                <FooterLink to="/hackathon-registration">
                  Hackathon Registration
                </FooterLink>
              </div>
            </div>

            {/* Column 4: Contact Info */}
            <div>
              <motion.h4
                variants={itemAnim}
                style={{
                  margin: "0 0 24px",
                  fontSize: 18,
                  fontWeight: 800,
                  color: C.heading,
                }}
              >
                Get in Touch
              </motion.h4>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 20 }}
              >
                <motion.div
                  variants={itemAnim}
                  style={{ display: "flex", gap: 14, alignItems: "flex-start" }}
                >
                  <span style={{ fontSize: 20 }}>📍</span>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 15,
                      color: C.text,
                      lineHeight: 1.6,
                      fontWeight: 500
                    }}
                  >
                    Moti Mahal, Lashkar, Gwalior,
                    <br />
                    Madhya Pradesh 474007
                  </p>
                </motion.div>
                <motion.div
                  variants={itemAnim}
                  style={{ display: "flex", gap: 14, alignItems: "center" }}
                >
                  <span style={{ fontSize: 18 }}>📞</span>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 15,
                      color: C.primary,
                      fontWeight: 700,
                    }}
                  >
                    9340994826
                  </p>
                </motion.div>
                <motion.div
                  variants={itemAnim}
                  style={{ display: "flex", gap: 14, alignItems: "center" }}
                >
                  <span style={{ fontSize: 18 }}>✉️</span>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 15,
                      color: C.primary,
                      fontWeight: 700,
                    }}
                  >
                    connect@gincube.org
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* ── Bottom Bar ── */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            style={{
              padding: "32px 0",
              borderTop: `1px solid ${C.pale}`,
              display: "flex",
              flexWrap: "wrap",
              gap: 20,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 14,
                color: C.muted,
                fontWeight: 500,
              }}
            >
              © {new Date().getFullYear()} G.Incube. All rights reserved. Made
              by{" "}
              <a
                href="https://www.incubationmasters.com/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: C.accent, // Yellow accent for brand link
                  textDecoration: "none",
                  fontWeight: 700,
                }}
              >
                Incubation Masters
              </a>
              .
            </p>
            <div style={{ display: "flex", gap: 32 }}>
              <Link
                to="/privacy-policy"
                style={{
                  color: C.text,
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms-conditions"
                style={{
                  color: C.text,
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                Terms of Service
              </Link>
            </div>
          </motion.div>
        </div>
      </footer>
    </>
  );
};

export default Footer;