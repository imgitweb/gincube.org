import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Lightbulb, Users, Banknote, Rocket, ArrowRight, CheckCircle2 } from 'lucide-react';

// ─── Per-tab rich mock UI content ────────────────────────────────────────────
const MentorshipUI = () => (
  <div className="flex flex-col gap-4 h-full">
    {/* Header row */}
    <div className="flex items-center justify-between">
      <p className="text-white/80 text-xs font-semibold uppercase tracking-wider">Your Mentors</p>
      <span className="text-xs bg-white/20 text-white px-3 py-1 rounded-full font-semibold">12 Active</span>
    </div>
    {/* Mentor cards */}
    {[
      { name: 'Priya Sharma', role: 'Ex-Zomato Product Head', avatar: 'PS', color: 'from-[#EA9F24] to-[#D68A1B]' }, // Golden Yellow
      { name: 'Arjun Mehta', role: 'Founder, FinHive (YC W22)', avatar: 'AM', color: 'from-[#3B82F6] to-[#2563EB]' }, // Blue
      { name: 'Sneha Rathore', role: 'Angel Investor, 30+ exits', avatar: 'SR', color: 'from-[#4F46E5] to-[#3730A3]' }, // Indigo
    ].map((m, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.15 + i * 0.1 }}
        className="flex items-center gap-3 bg-white/15 backdrop-blur-sm rounded-xl p-3 border border-white/20"
      >
        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${m.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
          {m.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm truncate">{m.name}</p>
          <p className="text-white/60 text-xs truncate">{m.role}</p>
        </div>
        <motion.div
          whileHover={{ scale: 1.15 }}
          className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center cursor-pointer"
        >
          <ArrowRight className="w-3.5 h-3.5 text-white" />
        </motion.div>
      </motion.div>
    ))}
    {/* Session scheduled pill */}
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55 }}
      className="mt-auto flex items-center gap-2 bg-white/20 rounded-xl px-4 py-2.5 border border-white/30"
    >
      <motion.div
        className="w-2 h-2 rounded-full bg-[#EA9F24]" // Yellow dot
        animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <p className="text-white text-xs font-medium">Next session: Today 3:00 PM</p>
    </motion.div>
  </div>
);

const FundingUI = () => {
  const [bar, setBar] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setBar(72), 300);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between">
        <p className="text-white/80 text-xs font-semibold uppercase tracking-wider">Funding Progress</p>
        <span className="text-xs bg-white/20 text-white px-3 py-1 rounded-full font-semibold">Seed Round</span>
      </div>
      {/* Big number */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 180 }}
        className="text-center py-2"
      >
        <p className="text-white/70 text-sm mb-1">Total Raised</p>
        <p className="text-white text-4xl font-extrabold tracking-tight">₹72 Lakhs</p>
        <p className="text-white/60 text-xs mt-1">of ₹1 Crore target</p>
      </motion.div>
      {/* Progress bar */}
      <div className="bg-white/20 rounded-full h-3 overflow-hidden">
        <motion.div
          className="h-full bg-[#EA9F24] rounded-full" // Yellow progress
          initial={{ width: 0 }}
          animate={{ width: `${bar}%` }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      {/* Sources */}
      {[
        { label: 'Govt. Grant', amount: '₹30L', pct: '42%' },
        { label: 'Angel Round', amount: '₹28L', pct: '39%' },
        { label: 'Bootstrapped', amount: '₹14L', pct: '19%' },
      ].map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 + i * 0.1 }}
          className="flex items-center justify-between bg-white/10 rounded-lg px-3 py-2"
        >
          <p className="text-white text-xs font-medium">{s.label}</p>
          <div className="flex items-center gap-2">
            <p className="text-white/70 text-xs">{s.pct}</p>
            <p className="text-white text-xs font-bold">{s.amount}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const WorkspaceUI = () => (
  <div className="flex flex-col gap-4 h-full">
    <div className="flex items-center justify-between">
      <p className="text-white/80 text-xs font-semibold uppercase tracking-wider">Campus Overview</p>
      <span className="text-xs bg-[#15436B]/20 text-[#15436B] px-3 py-1 rounded-full font-bold bg-white">Live</span>
    </div>
    {/* Seat grid */}
    <div>
      <p className="text-white/80 text-xs mb-2 font-medium">Hot Desk Availability</p>
      <div className="grid grid-cols-8 gap-1.5">
        {Array.from({ length: 32 }).map((_, i) => {
          const occupied = [2, 5, 7, 8, 13, 14, 19, 22, 25].includes(i);
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 * i, type: 'spring', stiffness: 300 }}
              className={`w-full aspect-square rounded-md ${occupied ? 'bg-white/30' : 'bg-white shadow-sm'}`}
            />
          );
        })}
      </div>
      <div className="flex gap-4 mt-2">
        <span className="flex items-center gap-1 text-white/90 font-medium text-xs"><span className="w-2.5 h-2.5 rounded-sm bg-white inline-block" />Available</span>
        <span className="flex items-center gap-1 text-white/70 font-medium text-xs"><span className="w-2.5 h-2.5 rounded-sm bg-white/30 inline-block" />Occupied</span>
      </div>
    </div>
    {/* Facilities */}
    <div className="mt-auto grid grid-cols-2 gap-2">
      {['High-Speed WiFi', 'Meeting Rooms', 'Prototyping Lab', '24×7 Access'].map((f, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 + i * 0.08 }}
          className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-2 border border-white/10"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-white flex-shrink-0" />
          <p className="text-white text-xs font-semibold">{f}</p>
        </motion.div>
      ))}
    </div>
  </div>
);

const MarketUI = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const heights = [30, 45, 38, 60, 55, 80];
  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between">
        <p className="text-white/80 text-xs font-semibold uppercase tracking-wider">Growth Metrics</p>
        <span className="text-xs bg-white/20 text-white px-3 py-1 rounded-full font-semibold">↑ 2.4× MoM</span>
      </div>
      {/* Bar chart */}
      <div className="flex items-end gap-2 flex-1">
        {months.map((m, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <motion.div
              className="w-full rounded-t-lg bg-[#EA9F24]" // Yellow Bars on Navy bg
              initial={{ height: 0 }}
              animate={{ height: `${heights[i]}%` }}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{ minHeight: 8 }}
            />
            <p className="text-white/60 text-[10px]">{m}</p>
          </div>
        ))}
      </div>
      {/* KPIs */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Partners', val: '48+' },
          { label: 'Users', val: '12K' },
          { label: 'Revenue', val: '₹8L' },
        ].map((k, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            className="bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-center"
          >
            <p className="text-[#EA9F24] font-bold text-sm">{k.val}</p>
            <p className="text-white/60 text-[10px] mt-0.5">{k.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const FeaturesTab = () => {
  const [activeTab, setActiveTab] = useState(0);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  const features = [
    {
      id: 0,
      title: 'Mentorship Program',
      description: 'Get guided by industry experts and experienced founders who have built successful scalable businesses.',
      icon: <Users className="w-5 h-5" />,
      imageBg: 'from-[#15436B] to-[#287BBE]', // Navy to Light Blue Gradient
      tag: 'Expert Guidance',
      ui: <MentorshipUI />,
      highlights: ['1-on-1 Weekly Sessions', 'Domain Experts', 'Peer Network'],
    },
    {
      id: 1,
      title: 'Funding & Grants',
      description: 'Access seed funding, government grants, and a network of angel investors and VC firms.',
      icon: <Banknote className="w-5 h-5" />,
      imageBg: 'from-[#1E1B4B] to-[#3730A3]', // Deep Indigo Gradient
      tag: 'Seed Capital',
      ui: <FundingUI />,
      highlights: ['Govt. Schemes', 'Angel Connect', 'Pitch Events'],
    },
    {
      id: 2,
      title: 'Workspace & Infrastructure',
      description: 'State-of-the-art co-working space with high-speed internet, meeting rooms, and prototyping labs.',
      icon: <Lightbulb className="w-5 h-5" />,
      imageBg: 'from-[#EA9F24] to-[#D68A1B]', // Strong Yellow/Amber Gradient!
      tag: 'Smart Campus',
      ui: <WorkspaceUI />,
      highlights: ['24×7 Access', 'Prototyping Lab', 'Dedicated Desks'],
    },
    {
      id: 3,
      title: 'Market Access',
      description: 'Strategic partnerships to help you test your product, acquire early adopters, and scale faster.',
      icon: <Rocket className="w-5 h-5" />,
      imageBg: 'from-[#0F172A] to-[#1E293B]', // Dark Slate Gradient
      tag: 'Growth',
      ui: <MarketUI />,
      highlights: ['Partner Network', 'GTM Strategy', 'B2G Connect'],
    },
  ];

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section ref={sectionRef} className="py-24 bg-[#F8FAFC] relative overflow-hidden">
      {/* Top border line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#E2E8F0] to-transparent" />

      {/* Subtle background blobs */}
      <motion.div
        className="absolute top-20 -right-32 w-96 h-96 rounded-full bg-[#15436B]/5 blur-3xl pointer-events-none"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-10 -left-24 w-80 h-80 rounded-full bg-[#EA9F24]/10 blur-3xl pointer-events-none"
        animate={{ scale: [1, 1.12, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section heading */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial="hidden"
          animate={isInView ? 'show' : 'hidden'}
          variants={containerVariants}
        >
          <motion.span variants={itemVariants} className="inline-flex items-center gap-2 text-[#EA9F24] font-bold tracking-wider uppercase text-sm">
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-[#EA9F24] inline-block"
              animate={{ scale: [1, 1.6, 1], opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            Our Ecosystem
          </motion.span>
          <motion.h2
            variants={itemVariants}
            className="mt-3 text-3xl md:text-5xl font-extrabold text-[#0A2236] leading-tight"
          >
            Everything you need to{' '}
            <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-[#15436B] to-[#287BBE] bg-clip-text text-transparent">scale your startup.</span>
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="mt-4 text-[#475569] text-lg"
          >
            From idea to IPO — G. Incube backs you at every stage.
          </motion.p>
        </motion.div>

        {/* Main layout */}
        <motion.div
          className="flex flex-col lg:flex-row gap-10 items-stretch"
          initial="hidden"
          animate={isInView ? 'show' : 'hidden'}
          variants={containerVariants}
        >
          {/* ── Left: Tab list ─────────────────────────────── */}
          <motion.div variants={itemVariants} className="w-full lg:w-5/12 flex flex-col gap-3">
            {features.map((feature, index) => {
              const isActive = activeTab === index;
              return (
                <motion.button
                  key={feature.id}
                  onClick={() => setActiveTab(index)}
                  whileHover={{ x: isActive ? 0 : 4 }}
                  transition={{ duration: 0.2 }}
                  className={`relative p-5 rounded-2xl text-left transition-all duration-300 border group ${
                    isActive
                      ? 'bg-white border-[#E2E8F0] shadow-xl shadow-[#15436B]/5'
                      : 'bg-transparent border-transparent hover:bg-white/60 hover:border-[#E2E8F0]'
                  }`}
                >
                  {/* Active left bar (Yellow Mix) */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        layoutId="activeTabIndicator"
                        className="absolute left-0 top-1/4 bottom-1/4 w-1.5 bg-[#EA9F24] rounded-r-full"
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        exit={{ scaleY: 0 }}
                        transition={{ duration: 0.25 }}
                      />
                    )}
                  </AnimatePresence>

                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <motion.div
                      animate={{
                        scale: isActive ? 1.05 : 1,
                        backgroundColor: isActive ? '#15436B' : 'rgb(241 245 249)', // Navy vs Slate
                        color: isActive ? '#fff' : '#64748B', 
                      }}
                      transition={{ duration: 0.3 }}
                      className="p-3 rounded-xl flex-shrink-0"
                      style={{
                        boxShadow: isActive ? '0 6px 20px rgba(21, 67, 107, 0.25)' : 'none',
                      }}
                    >
                      {feature.icon}
                    </motion.div>

                    <div className="flex-1 min-w-0">
                      <h3
                        className={`text-lg font-bold mb-1 transition-colors duration-300 ${
                          isActive ? 'text-[#0A2236]' : 'text-[#64748B]'
                        }`}
                      >
                        {feature.title}
                      </h3>

                      {/* Description & highlights — animate open/close */}
                      <AnimatePresence initial={false}>
                        {isActive && (
                          <motion.div
                            key="content"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden"
                          >
                            <p className="text-[#475569] text-sm leading-relaxed mb-3 mt-1">
                              {feature.description}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {feature.highlights.map((h, i) => (
                                <motion.span
                                  key={i}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: 0.05 * i }}
                                  className="inline-flex items-center gap-1 text-xs font-semibold bg-[#EA9F24]/10 text-[#D68A1B] px-3 py-1 rounded-full border border-[#EA9F24]/20"
                                >
                                  <CheckCircle2 className="w-3 h-3" />
                                  {h}
                                </motion.span>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>

          {/* ── Right: Mock UI window ──────────────────────── */}
          <motion.div variants={itemVariants} className="w-full lg:w-7/12">
            <div className="relative w-full aspect-[4/3] md:aspect-video rounded-3xl overflow-hidden bg-white border border-[#E2E8F0] shadow-2xl shadow-[#15436B]/10">

              {/* Browser chrome */}
              <div className="absolute top-0 left-0 w-full h-11 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center px-4 gap-3 z-10">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-1 bg-[#E2E8F0]/50 rounded-md h-5 flex items-center px-3"
                >
                  <p className="text-[#64748B] text-[10px] font-medium truncate">gincube.in / {features[activeTab].tag.toLowerCase().replace(' ', '-')}</p>
                </motion.div>
              </div>

              {/* Content area */}
              <div className="w-full h-full pt-11 relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, scale: 0.96, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 1.02, filter: 'blur(6px)', y: -8 }}
                    transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                    className={`w-full h-full bg-gradient-to-br ${features[activeTab].imageBg} p-6 relative overflow-hidden`}
                  >
                    {/* Subtle mesh overlay */}
                    <div
                      className="absolute inset-0 opacity-10 pointer-events-none"
                      style={{
                        backgroundImage:
                          'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.4) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.3) 0%, transparent 40%)',
                      }}
                    />
                    {/* Tag badge */}
                    <motion.span
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold mb-4 border border-white/30"
                    >
                      {features[activeTab].tag}
                    </motion.span>

                    {/* Rich UI content */}
                    <div className="h-[calc(100%-2.5rem)] relative z-10">
                      {features[activeTab].ui}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Below window: navigation dots (Yellow active, Slate inactive) */}
            <div className="flex items-center justify-center gap-2 mt-5">
              {features.map((_, i) => (
                <motion.button
                  key={i}
                  onClick={() => setActiveTab(i)}
                  animate={{ width: activeTab === i ? 24 : 8, opacity: activeTab === i ? 1 : 0.35 }}
                  transition={{ duration: 0.3 }}
                  className={`h-2 rounded-full ${activeTab === i ? 'bg-[#EA9F24]' : 'bg-[#64748B]'}`}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesTab;