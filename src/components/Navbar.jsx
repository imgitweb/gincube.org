import { useState, useRef, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { Menu, X, ChevronDown, ExternalLink, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

// ─── IMAGES IMPORT ───
import logoImage from "../assets/logo.png"; 
import popupImage from "../assets/registeration.png";

/* ─── Brand colors (Premium Navy Blue & Golden Yellow) ─── */
const C = {
  primary: "#15436B", // Deep Navy Blue
  primaryDk: "#0A2236", // Dark Navy
  primaryLt: "#F0F6FB", // Light blue tint for backgrounds
  accent: "#EA9F24", // Golden Yellow
  accentDk: "#D68A1B", // Darker Golden Yellow for hovers
  accentLight: "#F3C57B", // Light Yellow for gradients
  dark: "#0F172A", // Near-black slate
  text: "#334155", // Dark slate for strong readability
  muted: "#64748B", // Muted text
  white: "#FFFFFF",
};

const FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLScM22JOUwc3dqTS1sjy5c8YwF27xSfSx-hymm6bWvnwaJCUag/viewform";

/* YAHAN ROUTES FIX KIYE HAIN APP.JS KE HISAB SE */
const navLinks = [
  { name: "Home", to: "/" },
  {
    name: "About Us",
    dropdown: [{ name: "Who We Are", to: "/who-we-are" }],
  },
  { name: "Events", to: "/news-event" },
  { name: "Services", to: "/Services" },
  {
    name: "Join Gincube",
    dropdown: [
      { name: "Startup Registration", to: "/startup-registration" },
      { name: "Mentor Registration", to: "/mentor-registration" },
      { name: "Investor Registration", to: "/investor-registration" },
      { name: "Partner Registration", to: "/partner-registration" },
    ],
  },
  { name: "GWEDC", to: "/GWEDC" },
  {
    name: "Policy",
    dropdown: [
      {
        name: "MP Startup Policy",
        href: "https://drive.google.com/file/d/1WEm1g2Tr0L2A7PDm8eA2sFl7Y5I_V4Qv/view",
        external: true,
      },
      {
        name: "Incubation Policy",
        href: "https://www.incubationmasters.com/privacy-policy",
        external: true,
      },
    ],
  },
  { name: "Contact Us", to: "/contact-us" },
];

/* ══════════════════════════════════
   DROPDOWN PANEL
══════════════════════════════════ */
const DropdownMenu = ({ items }) => (
  <motion.div
    initial={{ opacity: 0, y: 10, scale: 0.96 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 6, scale: 0.97 }}
    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
    style={{
      position: "absolute",
      top: "calc(100% + 10px)",
      left: 0,
      minWidth: "220px",
      background: C.white,
      border: `1px solid ${C.primaryLt}`,
      borderRadius: "14px",
      boxShadow: "0 16px 40px rgba(21, 67, 107, 0.13)",
      overflow: "hidden",
      zIndex: 9999,
      pointerEvents: "auto",
      padding: "8px",
    }}
  >
    {/* Blue to Yellow accent top bar */}
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "4px",
        background: `linear-gradient(90deg, ${C.primary}, ${C.accent})`,
      }}
    />
    <div style={{ paddingTop: "6px" }}>
      {items.map((item, idx) => {
        const itemStyles = {
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "12px 16px",
          borderRadius: "10px",
          fontSize: "15px",
          color: C.text,
          textDecoration: "none",
          transition: "background 0.15s, color 0.15s",
          fontWeight: 600,
        };

        const hoverEvents = {
          onMouseEnter: (e) => {
            e.currentTarget.style.background = C.primaryLt;
            e.currentTarget.style.color = C.primary;
          },
          onMouseLeave: (e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = C.text;
          },
        };

        const dot = (
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: C.accent,
              flexShrink: 0,
            }}
          />
        );

        return item.to ? (
          <Link key={idx} to={item.to} style={itemStyles} {...hoverEvents}>
            {dot}
            {item.name}
          </Link>
        ) : (
          <a
            key={idx}
            href={item.href || "#"}
            target={item.external ? "_blank" : "_self"}
            rel={item.external ? "noopener noreferrer" : ""}
            style={itemStyles}
            {...hoverEvents}
          >
            {dot}
            {item.name}
          </a>
        );
      })}
    </div>
  </motion.div>
);

/* ══════════════════════════════════
   POPUP MODAL
══════════════════════════════════ */
const PopupModal = ({ onClose }) => {
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
    exit: {},
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 380, damping: 28 },
    },
    exit: { opacity: 0, y: 8 },
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.28 }}
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(10, 34, 54, 0.72)",
          backdropFilter: "blur(6px)",
        }}
      />

      {/* Modal card */}
      <motion.div
        initial={{ scale: 0.82, opacity: 0, y: 32 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.88, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 320, damping: 26, mass: 0.9 }}
        style={{
          position: "relative",
          background: C.white,
          borderRadius: "20px",
          width: "100%",
          maxWidth: "420px",
          overflow: "hidden",
          zIndex: 10,
          boxShadow: `0 32px 80px rgba(21, 67, 107, 0.28), 0 8px 24px rgba(0,0,0,0.12)`,
        }}
      >
        <div
          style={{
            height: "6px",
            background: `linear-gradient(90deg, ${C.primary}, ${C.accent}, ${C.accentLight})`,
          }}
        />

        <motion.button
          whileHover={{ scale: 1.12, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute",
            top: "14px",
            right: "14px",
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.95)",
            border: `1.5px solid ${C.primaryLt}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 20,
            boxShadow: "0 2px 8px rgba(21, 67, 107, 0.15)",
          }}
        >
          <X size={18} color={C.primary} />
        </motion.button>

        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          style={{ lineHeight: 0, overflow: "hidden" }}
        >
          <motion.img
            src={popupImage} 
            alt="Little CEOs of Gwalior"
            initial={{ scale: 1.06, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ padding: "24px 28px 28px" }}
        >
          <motion.div
            variants={itemVariants}
            style={{
              marginBottom: "18px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: C.primaryLt,
                color: C.primary,
                borderRadius: "100px",
                padding: "6px 16px",
                fontSize: "13px",
                fontWeight: 700,
                letterSpacing: "0.02em",
              }}
            >
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: C.accent,
                  animation: "pulse-dot 1.5s infinite",
                }}
              />
              Registrations Open Now
            </span>
          </motion.div>

          <motion.a
            variants={itemVariants}
            href={FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.025 }}
            whileTap={{ scale: 0.975 }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              background: `linear-gradient(135deg, ${C.accent}, ${C.accentDk})`, // Golden Yellow Button
              color: "#fff",
              fontWeight: 800,
              fontSize: "16px",
              borderRadius: "12px",
              padding: "16px",
              textDecoration: "none",
              boxShadow: `0 8px 24px rgba(234, 159, 36, 0.35)`,
              letterSpacing: "0.01em",
            }}
          >
            <Sparkles size={18} />
            Register for Little CEOs
            <ExternalLink size={16} />
          </motion.a>

          <p
            style={{
              margin: "14px 0 0",
              textAlign: "center",
              fontSize: "12px",
              color: C.muted,
              fontWeight: 500
            }}
          >
            www.gincube.org
          </p>
        </motion.div>
      </motion.div>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.7); }
        }
      `}</style>
    </div>
  );
};

/* ══════════════════════════════════
   MAIN NAVBAR
══════════════════════════════════ */
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const leaveTimer = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openDropdown = (i) => {
    clearTimeout(leaveTimer.current);
    setActiveDropdown(i);
  };
  const startClose = () => {
    leaveTimer.current = setTimeout(() => setActiveDropdown(null), 90);
  };
  const cancelClose = (i) => {
    clearTimeout(leaveTimer.current);
    setActiveDropdown(i);
  };

  const linkStyles = {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "10px 16px",
    borderRadius: "10px",
    fontSize: "16px", // Increased Text Size
    fontWeight: 600, // Stronger weight
    color: C.text,
    textDecoration: "none",
    transition: "background 0.15s, color 0.15s",
  };

  const linkHoverEvents = {
    onMouseEnter: (e) => {
      e.currentTarget.style.background = C.primaryLt;
      e.currentTarget.style.color = C.primary;
    },
    onMouseLeave: (e) => {
      e.currentTarget.style.background = "transparent";
      e.currentTarget.style.color = C.text;
    },
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 40,
          background: scrolled
            ? "rgba(255,255,255,0.96)"
            : "rgba(255,255,255,0.92)",
          backdropFilter: "blur(14px)",
          borderBottom: scrolled
            ? `1px solid ${C.primaryLt}`
            : "1px solid transparent",
          boxShadow: scrolled ? `0 4px 24px rgba(21, 67, 107, 0.08)` : "none",
          transition: "box-shadow 0.3s, border-color 0.3s, background 0.3s",
        }}
      >
        <div
          style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: "80px", // Increased height to accommodate larger logo
            }}
          >
            <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", flexShrink: 0 }}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
                aria-label="Go to Home"
              >
                <img
                  src={logoImage} 
                  alt="Gincube"
                  style={{ height: "52px", width: "auto" }} // Increased Logo Size
                />
              </motion.div>
            </Link>

            {/* Desktop nav */}
            <div
              style={{ display: "none", alignItems: "center", gap: "6px" }}
              className="desktop-nav"
            >
              {navLinks.map((link, i) => (
                <div
                  key={i}
                  style={{ position: "relative" }}
                  onMouseEnter={() => link.dropdown && openDropdown(i)}
                  onMouseLeave={() => link.dropdown && startClose()}
                >
                  {link.isPopupTrigger ? (
                    <motion.button
                      whileHover={{ color: C.primary }}
                      onClick={() => setIsPopupOpen(true)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "10px 16px",
                        borderRadius: "10px",
                        fontSize: "16px",
                        fontWeight: 600,
                        color: C.text,
                        transition: "background 0.15s, color 0.15s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = C.primaryLt)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      {link.name}
                    </motion.button>
                  ) : link.to ? (
                    <Link to={link.to} style={linkStyles} {...linkHoverEvents}>
                      {link.name}
                    </Link>
                  ) : (
                    <a
                      href={link.href || "#"}
                      style={linkStyles}
                      {...linkHoverEvents}
                    >
                      {link.name}
                      {link.dropdown && (
                        <motion.span
                          animate={{ rotate: activeDropdown === i ? 180 : 0 }}
                          transition={{ duration: 0.22 }}
                          style={{ display: "inline-flex", color: C.muted }}
                        >
                          <ChevronDown size={16} />
                        </motion.span>
                      )}
                    </a>
                  )}

                  <AnimatePresence>
                    {link.dropdown && activeDropdown === i && (
                      <div
                        onMouseEnter={() => cancelClose(i)}
                        onMouseLeave={startClose}
                      >
                        <DropdownMenu items={link.dropdown} />
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              {/* CTA pill */}
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsPopupOpen(true)}
                style={{
                  marginLeft: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: `linear-gradient(135deg, ${C.accent}, ${C.accentDk})`, // Golden Yellow Button
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  padding: "10px 22px",
                  borderRadius: "100px",
                  fontSize: "15px",
                  fontWeight: 800,
                  boxShadow: `0 4px 16px rgba(234, 159, 36, 0.35)`,
                  transition: "box-shadow 0.2s",
                }}
              >
                <Sparkles size={16} />
                Register
              </motion.button>
            </div>

            {/* Hamburger */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              className="mobile-menu-btn"
              aria-label="Toggle menu"
              style={{
                background: "none",
                border: `2px solid ${C.primaryLt}`,
                borderRadius: "12px",
                padding: "8px",
                cursor: "pointer",
                color: C.primary,
                display: "flex",
                alignItems: "center",
              }}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isOpen ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <X size={26} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="open"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <Menu size={26} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              style={{
                background: "#fff",
                borderTop: `1px solid ${C.primaryLt}`,
                overflow: "hidden",
              }}
            >
              <div style={{ padding: "16px 20px 32px" }}>
                {navLinks.map((link, i) => (
                  <div key={i}>
                    {link.isPopupTrigger ? (
                      <button
                        onClick={() => {
                          setIsPopupOpen(true);
                          setIsOpen(false);
                        }}
                        style={{
                          width: "100%",
                          textAlign: "left",
                          background: "none",
                          border: "none",
                          padding: "16px",
                          borderRadius: "12px",
                          fontSize: "18px", // Larger Text Mobile
                          fontWeight: 600,
                          color: C.text,
                          cursor: "pointer",
                        }}
                      >
                        {link.name}
                      </button>
                    ) : (
                      <>
                        {link.to ? (
                          <Link
                            to={link.to}
                            onClick={() => setIsOpen(false)}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              padding: "16px",
                              borderRadius: "12px",
                              fontSize: "18px", // Larger Text Mobile
                              fontWeight: 600,
                              color: C.text,
                              textDecoration: "none",
                            }}
                          >
                            {link.name}
                          </Link>
                        ) : (
                          <a
                            href={link.href || "#"}
                            onClick={() => !link.dropdown && setIsOpen(false)}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              padding: "16px",
                              borderRadius: "12px",
                              fontSize: "18px", // Larger Text Mobile
                              fontWeight: 600,
                              color: C.text,
                              textDecoration: "none",
                            }}
                          >
                            {link.name}
                            {link.dropdown && (
                              <ChevronDown size={18} color={C.muted} />
                            )}
                          </a>
                        )}

                        {link.dropdown && (
                          <div
                            style={{ paddingLeft: "24px", marginBottom: "8px" }}
                          >
                            {link.dropdown.map((item, idx) => {
                              const dropdownItemStyle = {
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                padding: "12px 16px",
                                borderRadius: "10px",
                                fontSize: "15px",
                                fontWeight: 600,
                                color: C.muted,
                                textDecoration: "none",
                              };

                              const dot = (
                                <span
                                  style={{
                                    width: "6px",
                                    height: "6px",
                                    borderRadius: "50%",
                                    background: C.accent,
                                  }}
                                />
                              );

                              return item.to ? (
                                <Link
                                  key={idx}
                                  to={item.to}
                                  onClick={() => setIsOpen(false)}
                                  style={dropdownItemStyle}
                                >
                                  {dot}
                                  {item.name}
                                </Link>
                              ) : (
                                <a
                                  key={idx}
                                  href={item.href || "#"}
                                  target={item.external ? "_blank" : "_self"}
                                  rel={
                                    item.external ? "noopener noreferrer" : ""
                                  }
                                  onClick={() => setIsOpen(false)}
                                  style={dropdownItemStyle}
                                >
                                  {dot}
                                  {item.name}
                                </a>
                              );
                            })}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}

                {/* Mobile register CTA */}
                <div style={{ marginTop: "16px", padding: "0 8px" }}>
                  <a
                    href={FORM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                      background: `linear-gradient(135deg, ${C.accent}, ${C.accentDk})`, // Golden Yellow Button
                      color: "#fff",
                      textDecoration: "none",
                      borderRadius: "14px",
                      padding: "16px",
                      fontSize: "16px",
                      fontWeight: 800,
                      boxShadow: `0 8px 24px rgba(234, 159, 36, 0.35)`,
                    }}
                  >
                    <Sparkles size={18} />
                    Register for Little CEOs
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Popup */}
      <AnimatePresence>
        {isPopupOpen && <PopupModal onClose={() => setIsPopupOpen(false)} />}
      </AnimatePresence>

      {/* Responsive CSS */}
      <style>{`
        @media (min-width: 1024px) {
          .desktop-nav { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </>
  );
};

export default Navbar;