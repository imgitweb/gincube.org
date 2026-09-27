import { useState, useRef, useEffect } from "react";
import {
  motion,
  AnimatePresence,
} from "framer-motion";
import { Menu, X, ChevronDown, ExternalLink, Search } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

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

const searchableItems = [
  { title: "Home", to: "/" },
  { title: "Who We Are", to: "/who-we-are" },
  { title: "Services & Incubation", to: "/Services" },
  { title: "Events & News", to: "/news-event" },
  { title: "GWEDC Women Center", to: "/GWEDC" },
  { title: "Startup Registration", to: "/startup-registration" },
  { title: "Mentor Registration", to: "/mentor-registration" },
  { title: "Investor Registration", to: "/investor-registration" },
  { title: "Partner Registration", to: "/partner-registration" },
  { title: "Contact Us", to: "/contact-us" },
  { title: "Privacy Policy", to: "/privacy-policy" },
  { title: "Terms & Conditions", to: "/terms-conditions" },
];

/* ══════════════════════════════════
   DROPDOWN PANEL (Desktop)
══════════════════════════════════ */
const DropdownMenu = ({ items, onItemClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 8, scale: 0.98 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 6, scale: 0.98 }}
    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
    className="absolute top-[calc(100%+8px)] left-0 min-w-[230px] bg-white border border-[#E2E8F0] rounded-2xl shadow-xl shadow-[#15436B]/10 overflow-hidden z-50 p-2"
  >
    {/* Blue to Yellow accent top bar */}
    <div
      className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#15436B] to-[#EA9F24]"
    />
    <div className="pt-1.5 flex flex-col gap-0.5">
      {items.map((item, idx) => {
        const itemClass = "flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-[#334155] hover:text-[#15436B] hover:bg-[#F0F6FB] transition-all";
        const dot = (
          <span className="w-1.5 h-1.5 rounded-full bg-[#EA9F24] flex-shrink-0" />
        );

        return item.to ? (
          <Link key={idx} to={item.to} className={itemClass} onClick={onItemClick}>
            {dot}
            <span>{item.name}</span>
          </Link>
        ) : (
          <a
            key={idx}
            href={item.href || "#"}
            target={item.external ? "_blank" : "_self"}
            rel={item.external ? "noopener noreferrer" : ""}
            className={itemClass}
            onClick={onItemClick}
          >
            {dot}
            <span>{item.name}</span>
            {item.external && <ExternalLink size={13} className="ml-auto text-slate-400" />}
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
  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        className="fixed inset-0 bg-[#0A2236]/75 backdrop-blur-sm"
      />

      {/* Modal Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 15 }}
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
        className="relative bg-white rounded-3xl w-full max-w-[420px] max-h-[90vh] overflow-y-auto z-10 shadow-2xl border border-slate-100"
      >
        <div className="h-1.5 bg-gradient-to-r from-[#15436B] via-[#EA9F24] to-[#F3C57B]" />

        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-white/90 hover:bg-slate-100 border border-slate-200 flex items-center justify-center cursor-pointer z-20 transition-all text-[#15436B] shadow-sm hover:scale-105 active:scale-95"
        >
          <X size={18} />
        </button>

        <div className="overflow-hidden">
          <img
            src={popupImage} 
            alt="Little CEOs of Gwalior"
            className="w-full h-auto block object-cover"
          />
        </div>

        <div className="p-6 sm:p-7 text-center">
          <div className="mb-4 inline-flex items-center gap-2 bg-[#F0F6FB] text-[#15436B] rounded-full px-4 py-1.5 text-xs font-bold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-[#EA9F24] animate-pulse" />
            Registrations Open Now
          </div>

          <a
            href={FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#EA9F24] to-[#D68A1B] hover:from-[#D68A1B] hover:to-[#B47012] text-white font-bold text-base rounded-xl py-3.5 px-6 shadow-lg shadow-[#EA9F24]/30 hover:shadow-xl hover:shadow-[#EA9F24]/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Register for Little CEOs</span>
            <ArrowRight size={16} />
          </a>

          <p className="mt-3 text-xs text-slate-400 font-medium">
            www.gincube.org
          </p>
        </div>
      </motion.div>
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
  const [openMobileDropdown, setOpenMobileDropdown] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const leaveTimer = useRef(null);
  const searchInputRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile drawer and search on route change
  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
    setOpenMobileDropdown(null);
    setIsSearchOpen(false);
    setSearchQuery("");
  }, [location.pathname]);

  const openDropdown = (i) => {
    clearTimeout(leaveTimer.current);
    setActiveDropdown(i);
  };
  const startClose = () => {
    leaveTimer.current = setTimeout(() => setActiveDropdown(null), 120);
  };
  const cancelClose = (i) => {
    clearTimeout(leaveTimer.current);
    setActiveDropdown(i);
  };

  const toggleMobileDropdown = (i) => {
    setOpenMobileDropdown(prev => (prev === i ? null : i));
  };

  const isLinkActive = (link) => {
    if (link.to && location.pathname === link.to) return true;
    if (link.dropdown && link.dropdown.some(d => d.to === location.pathname)) return true;
    return false;
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm"
            : "bg-white/90 backdrop-blur-sm border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center flex-shrink-0" aria-label="Gincube Home">
              <img
                src={logoImage} 
                alt="Gincube - Gwalior Incubation Center"
                className="h-11 sm:h-12 w-auto object-contain transition-transform hover:scale-105"
              />
            </Link>

            {/* Desktop Navigation (Centered) */}
            <nav className="hidden lg:flex items-center justify-center gap-1 xl:gap-2">
              {navLinks.map((link, i) => {
                const active = isLinkActive(link);
                return (
                  <div
                    key={i}
                    className="relative"
                    onMouseEnter={() => link.dropdown && openDropdown(i)}
                    onMouseLeave={() => link.dropdown && startClose()}
                  >
                    {link.to ? (
                      <Link
                        to={link.to}
                        className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[15px] font-semibold transition-colors ${
                          active
                            ? "text-[#15436B] bg-[#F0F6FB]"
                            : "text-[#334155] hover:text-[#15436B] hover:bg-[#F0F6FB]"
                        }`}
                      >
                        {link.name}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setActiveDropdown(activeDropdown === i ? null : i)}
                        className={`inline-flex items-center gap-1 px-3 py-2 rounded-lg text-[15px] font-semibold cursor-pointer border-none bg-transparent transition-colors ${
                          active
                            ? "text-[#15436B] bg-[#F0F6FB]"
                            : "text-[#334155] hover:text-[#15436B] hover:bg-[#F0F6FB]"
                        }`}
                      >
                        <span>{link.name}</span>
                        {link.dropdown && (
                          <ChevronDown
                            size={15}
                            className={`transition-transform duration-200 text-slate-400 ${
                              activeDropdown === i ? "rotate-180 text-[#15436B]" : ""
                            }`}
                          />
                        )}
                      </button>
                    )}

                    <AnimatePresence>
                      {link.dropdown && activeDropdown === i && (
                        <div
                          onMouseEnter={() => cancelClose(i)}
                          onMouseLeave={startClose}
                        >
                          <DropdownMenu
                            items={link.dropdown}
                            onItemClick={() => setActiveDropdown(null)}
                          />
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </nav>

            {/* Desktop Actions: Search & Blue User Profile (Right) */}
            <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
              {/* Search Button */}
              <button
                type="button"
                onClick={() => {
                  setIsSearchOpen(prev => !prev);
                  setTimeout(() => searchInputRef.current?.focus(), 120);
                }}
                aria-label="Search"
                title="Search"
                className="w-10 h-10 flex items-center justify-center rounded-full text-[#334155] hover:text-[#15436B] hover:bg-[#F0F6FB] transition-colors cursor-pointer"
              >
                <Search size={20} strokeWidth={2.2} />
              </button>

              {/* Blue Profile Icon (Navigates to Login) */}
              <Link
                to="/login"
                aria-label="Login / Member Portal"
                title="Member Login"
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-blue-50 transition-all cursor-pointer transform hover:scale-105 active:scale-95"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 fill-[#1877F2]"
                  aria-hidden="true"
                >
                  <path d="M12 12c2.485 0 4.5-2.015 4.5-4.5S14.485 3 12 3 7.5 5.015 7.5 7.5 9.515 12 12 12zm0 2.25c-3.006 0-9 1.512-9 4.5v1.5c0 .414.336.75.75.75h16.5c.414 0 .75-.336.75-.75v-1.5c0-2.988-5.994-4.5-9-4.5z" />
                </svg>
              </Link>
            </div>

            {/* Mobile Actions: Search, Blue Profile & Menu Toggle */}
            <div className="flex items-center gap-1 lg:hidden">
              {/* Mobile Search Button */}
              <button
                type="button"
                onClick={() => {
                  setIsSearchOpen(prev => !prev);
                  setTimeout(() => searchInputRef.current?.focus(), 120);
                }}
                aria-label="Search"
                title="Search"
                className="w-9 h-9 flex items-center justify-center rounded-full text-[#334155] hover:text-[#15436B] hover:bg-[#F0F6FB] transition-colors cursor-pointer"
              >
                <Search size={19} strokeWidth={2.2} />
              </button>

              {/* Mobile Blue Profile Icon (Navigates to Login) */}
              <Link
                to="/login"
                aria-label="Login / Member Portal"
                title="Member Login"
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-blue-50 transition-transform active:scale-95 cursor-pointer"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 fill-[#1877F2]"
                  aria-hidden="true"
                >
                  <path d="M12 12c2.485 0 4.5-2.015 4.5-4.5S14.485 3 12 3 7.5 5.015 7.5 7.5 9.515 12 12 12zm0 2.25c-3.006 0-9 1.512-9 4.5v1.5c0 .414.336.75.75.75h16.5c.414 0 .75-.336.75-.75v-1.5c0-2.988-5.994-4.5-9-4.5z" />
                </svg>
              </Link>

              {/* Mobile Drawer Menu Toggle */}
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? "Close menu" : "Open menu"}
                className="p-2 ml-1 rounded-xl text-[#15436B] hover:bg-[#F0F6FB] border border-slate-200 transition-colors cursor-pointer"
              >
                {isOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Interactive Search Bar Dropdown */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="border-t border-slate-100 bg-white/95 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3 shadow-md overflow-hidden"
            >
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-3 bg-[#F0F6FB] border border-[#E2EEF8] rounded-xl px-3.5 py-2">
                  <Search size={18} className="text-[#15436B] shrink-0" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search programs, events, services, registrations..."
                    className="flex-1 bg-transparent border-none outline-none text-sm text-[#0A2236] placeholder:text-slate-400 font-medium"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="text-xs text-slate-400 hover:text-slate-600 px-1 cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery("");
                    }}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded-md cursor-pointer"
                    aria-label="Close search"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Quick Results / Suggestions */}
                {searchQuery.trim().length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap gap-2">
                    {searchableItems
                      .filter((item) =>
                        item.title.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .slice(0, 6)
                      .map((item, idx) => (
                        <Link
                          key={idx}
                          to={item.to}
                          onClick={() => {
                            setIsSearchOpen(false);
                            setSearchQuery("");
                          }}
                          className="text-xs px-3 py-1.5 rounded-full bg-white border border-slate-200 text-[#15436B] hover:bg-[#F0F6FB] hover:border-[#15436B]/30 font-semibold transition-all shadow-xs"
                        >
                          {item.title}
                        </Link>
                      ))}
                    {searchableItems.filter((item) =>
                      item.title.toLowerCase().includes(searchQuery.toLowerCase())
                    ).length === 0 && (
                      <p className="text-xs text-slate-400 py-1">No matching pages found.</p>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="lg:hidden bg-white border-t border-slate-100 shadow-xl overflow-hidden max-h-[calc(100vh-80px)] overflow-y-auto"
            >
              <div className="px-4 py-5 flex flex-col gap-1">
                {navLinks.map((link, i) => {
                  const active = isLinkActive(link);
                  const isDropdownExpanded = openMobileDropdown === i;

                  if (link.to) {
                    return (
                      <Link
                        key={i}
                        to={link.to}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold transition-colors ${
                          active
                            ? "bg-[#F0F6FB] text-[#15436B]"
                            : "text-[#334155] hover:bg-slate-50"
                        }`}
                      >
                        <span>{link.name}</span>
                        {active && <span className="w-2 h-2 rounded-full bg-[#EA9F24]" />}
                      </Link>
                    );
                  }

                  return (
                    <div key={i} className="flex flex-col">
                      <button
                        type="button"
                        onClick={() => toggleMobileDropdown(i)}
                        className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-base font-semibold text-left transition-colors cursor-pointer ${
                          active || isDropdownExpanded
                            ? "bg-[#F0F6FB] text-[#15436B]"
                            : "text-[#334155] hover:bg-slate-50"
                        }`}
                      >
                        <span>{link.name}</span>
                        <ChevronDown
                          size={18}
                          className={`transition-transform duration-200 text-slate-400 ${
                            isDropdownExpanded ? "rotate-180 text-[#15436B]" : ""
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {isDropdownExpanded && link.dropdown && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="pl-4 pr-2 py-1.5 flex flex-col gap-1 overflow-hidden"
                          >
                            {link.dropdown.map((item, idx) => {
                              const isSubActive = location.pathname === item.to;
                              const subClass = `flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                                isSubActive
                                  ? "text-[#15436B] bg-[#E2EEF8]"
                                  : "text-slate-600 hover:text-[#15436B] hover:bg-slate-50"
                              }`;

                              return item.to ? (
                                <Link
                                  key={idx}
                                  to={item.to}
                                  onClick={() => setIsOpen(false)}
                                  className={subClass}
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#EA9F24]" />
                                  <span>{item.name}</span>
                                </Link>
                              ) : (
                                <a
                                  key={idx}
                                  href={item.href || "#"}
                                  target={item.external ? "_blank" : "_self"}
                                  rel={item.external ? "noopener noreferrer" : ""}
                                  onClick={() => setIsOpen(false)}
                                  className={subClass}
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#EA9F24]" />
                                  <span>{item.name}</span>
                                  {item.external && <ExternalLink size={13} className="ml-auto text-slate-400" />}
                                </a>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}

                {/* Mobile Drawer CTA */}
                <div className="pt-4 pb-2">
                  <a
                    href={FORM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#EA9F24] to-[#D68A1B] text-white font-bold py-3.5 px-4 rounded-xl shadow-md text-sm"
                  >
                    <span>Register for Little CEOs</span>
                    <ExternalLink size={15} />
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Popup Modal */}
      <AnimatePresence>
        {isPopupOpen && <PopupModal onClose={() => setIsPopupOpen(false)} />}
      </AnimatePresence>
    </>
  );
};

export default Navbar;