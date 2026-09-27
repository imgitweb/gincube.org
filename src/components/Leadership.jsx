import { useState } from "react";
import { motion } from "framer-motion";
import { RotateCw, CheckCircle2, Award, Building2, UserCheck } from "lucide-react";
import leadershipList from "../data/leadershipData.json";

// Local image imports for Vite bundling
import ruchikaImg from "../assets/gincube_ruchika.jpeg";
import abhisek2Img from "../assets/2.png";
import prateek3Img from "../assets/3.png";

const localAssetMap = {
  "/src/assets/gincube_ruchika.jpeg": ruchikaImg,
  "/src/assets/2.png": abhisek2Img,
  "/src/assets/3.png": prateek3Img,
  "/src/assets/gincub_abhisek.jpeg": abhisek2Img,
  "/src/assets/gincube_abhisek.jpeg": abhisek2Img,
  "2.png": abhisek2Img,
  "3.png": prateek3Img,
  "gincube_ruchika.jpeg": ruchikaImg,
  "gincub_abhisek.jpeg": abhisek2Img,
  "gincube_abhisek.jpeg": abhisek2Img,
};

const iconMap = {
  collector: <Award size={16} className="text-[#15436B]" />,
  "executive-director": <Building2 size={16} className="text-[#EA9F24]" />,
  commissioner: <Building2 size={16} className="text-[#0A2236]" />,
  ceo: <UserCheck size={16} className="text-[#15436B]" />,
};

/* ═══════════════════════════════════════════════════
   LEADERSHIP FLIP CARD COMPONENT
═══════════════════════════════════════════════════ */
const LeadershipCard = ({ leader }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const resolveImage = () => {
    if (localAssetMap[leader.image]) return localAssetMap[leader.image];
    const nameLower = (leader.name || "").toLowerCase();
    if (nameLower.includes("ruchika") || leader.id === "collector") return ruchikaImg;
    if (nameLower.includes("abhishek") || leader.id === "executive-director" || leader.id === "commissioner") return abhisek2Img;
    if (nameLower.includes("prateek") || leader.id === "ceo") return prateek3Img;
    return leader.image;
  };

  const imageSrc = resolveImage();

  // Toggle on click/tap (works on mobile, tablet & desktop)
  const handleToggle = () => {
    setIsFlipped((prev) => !prev);
  };

  return (
    <div
      className="group w-full h-[470px] sm:h-[490px] cursor-pointer"
      style={{ perspective: "1200px" }}
      onClick={handleToggle}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleToggle();
        }
      }}
      aria-label={`Profile card for ${leader.name}, ${leader.designation}`}
    >
      <div
        className="relative w-full h-full duration-700 transition-transform"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          transition: "transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* ── FRONT FACE ── */}
        <div
          className="absolute inset-0 w-full h-full bg-white rounded-3xl border border-slate-200/90 shadow-md hover:shadow-xl transition-shadow flex flex-col p-4 sm:p-5 overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          {/* Top Bar with Designation Tag */}
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F0F6FB] text-[#15436B] border border-blue-100">
              {iconMap[leader.id] || <Award size={15} />}
              <span>{leader.roleCategory}</span>
            </span>

            <span
              className="text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full text-white shadow-2xs"
              style={{ backgroundColor: leader.badgeColor || "#15436B" }}
            >
              {leader.tag}
            </span>
          </div>

          {/* Officer Portrait - Fully Covered */}
          <div className="relative w-full h-60 sm:h-64 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 flex-shrink-0">
            <img
              src={imageSrc}
              alt={leader.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              style={{
                objectPosition: leader.objectPosition || "center 18%",
              }}
              loading="lazy"
              onError={(e) => {
                const fallbacks = [
                  "https://i.ytimg.com/vi/kY0w6P_nL-4/hqdefault.jpg",
                  "https://i.ytimg.com/vi/6PzJ_cT7yG4/hqdefault.jpg",
                  "https://i.ytimg.com/vi/b4wS9W1Y52o/hqdefault.jpg",
                ];
                const next = fallbacks.find((url) => url !== e.currentTarget.src);
                if (next) {
                  e.currentTarget.src = next;
                }
              }}
            />

            {/* Subtle Gradient Vignette at Bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A2236]/30 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Info Block */}
          <div className="mt-3 flex-grow flex flex-col justify-between">
            <div>
              <h3 className="text-lg sm:text-xl font-black text-[#0A2236] leading-snug tracking-tight">
                {leader.name}
              </h3>
              <p className="text-xs sm:text-sm font-bold text-[#15436B] mt-0.5">
                {leader.designation}
              </p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {leader.organization}
              </p>
            </div>

            {/* Bottom Flip Hint Button */}
            <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500 group-hover:text-[#15436B] transition-colors">
              <span className="flex items-center gap-1.5">
                <RotateCw size={13} className="text-[#EA9F24] group-hover:rotate-180 transition-transform duration-500" />
                <span>Hover or tap to view bio</span>
              </span>
              <span className="text-[#EA9F24] font-bold">Details →</span>
            </div>
          </div>
        </div>

        {/* ── BACK FACE ── */}
        <div
          className="absolute inset-0 w-full h-full bg-white rounded-3xl border border-slate-200/90 shadow-xl flex flex-col p-5 overflow-hidden text-left"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {/* Top Navy/Gold Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#15436B] via-[#287BBE] to-[#EA9F24]" />

          {/* Header */}
          <div className="flex items-center justify-between gap-2 pt-1 pb-2.5 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-extrabold tracking-wider uppercase text-[#EA9F24]">
                {leader.tag}
              </span>
              <h4 className="text-base sm:text-lg font-black text-[#0A2236] leading-tight">
                {leader.name}
              </h4>
              <p className="text-xs font-bold text-[#15436B]">
                {leader.designation}
              </p>
            </div>

            <span className="w-8 h-8 rounded-full bg-[#F0F6FB] flex items-center justify-center flex-shrink-0 text-[#15436B] shadow-2xs">
              {iconMap[leader.id] || <Award size={16} />}
            </span>
          </div>

          {/* Bio Paragraph */}
          <div className="mt-2.5 flex-grow overflow-y-auto pr-1">
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              {leader.bio}
            </p>

            {/* Key Responsibilities */}
            {/* <div className="mt-2.5">
              <h5 className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
                Key Responsibilities & Focus
              </h5>
              <ul className="space-y-1">
                {leader.responsibilities?.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-1.5 text-[11px] sm:text-xs text-slate-700 leading-normal"
                  >
                    <CheckCircle2
                      size={13}
                      className="text-[#EA9F24] shrink-0 mt-0.5"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div> */}

            {/* Quote / Vision Block */}
            {leader.quote && (
              <div className="mt-3 bg-[#F0F6FB] border-l-3 border-[#EA9F24] p-2 rounded-r-xl">
                <p className="text-[11px] text-[#0A2236] italic font-medium leading-snug">
                  "{leader.quote}"
                </p>
              </div>
            )}
          </div>

          {/* Back Flip Footer */}
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-400">
            <span className="flex items-center gap-1.5 text-slate-500">
              <RotateCw size={13} className="text-[#15436B]" />
              <span>Tap to flip back</span>
            </span>
            <span className="text-[#15436B] font-bold">↺ Return</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   OUR LEADERSHIP SECTION
═══════════════════════════════════════════════════ */
const Leadership = () => {
  return (
    <section className="relative py-20 sm:py-28 bg-[#F8FAFC] border-t border-slate-100 overflow-hidden font-['Inter',sans-serif]">
      {/* Subtle Background Glows matching design system */}
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none opacity-40"
        style={{
          background:
            "radial-gradient(circle, rgba(21, 67, 107, 0.08) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none opacity-40"
        style={{
          background:
            "radial-gradient(circle, rgba(234, 159, 36, 0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header (Consistent with Our Ecosystem) */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 text-[#EA9F24] font-bold tracking-wider uppercase text-sm mb-3"
          >
            <motion.span
              className="w-2 h-2 rounded-full bg-[#EA9F24] inline-block"
              animate={{ scale: [1, 1.6, 1], opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            Our Leadership
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0A2236] leading-tight tracking-tight"
          >
            Visionary Guidance,{" "}
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-[#15436B] via-[#1C5A8F] to-[#287BBE] bg-clip-text text-transparent">
              Institutional Strength.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed"
          >
            Guided by district and smart city administration to build Gwalior's
            premier incubator for high-impact innovation, mentorship, and economic growth.
          </motion.p>
        </div>

        {/* 3 Leadership Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch justify-center max-w-6xl mx-auto">
          {leadershipList.map((leader) => (
            <motion.div
              key={leader.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6 }}
              className="flex justify-center"
            >
              <LeadershipCard leader={leader} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Leadership;
