import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const StatsAndCTA = () => {
  // Gincube Stats Data
  const stats = [
    { id: 1, value: '50+', label: 'Startups Incubated' },
    { id: 2, value: '2M+', label: 'Funding Raised' },
    { id: 3, value: '100+', label: 'Expert Mentors' },
    { id: 4, value: '10k+', label: 'Community Members' },
  ];

  return (
    <>
      {/* --- STATS SECTION (Light Mode with Yellow/Orange Highlights) --- */}
      <section className="py-20 bg-white relative border-t border-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 rounded-2xl hover:bg-[#F8FAFC] border border-transparent hover:border-[#E2E8F0] transition-all duration-300 shadow-sm hover:shadow-md"
              >
                {/* Golden Yellow gradient for numbers to mix the yellow in */}
                <h3 className="text-4xl md:text-5xl font-extrabold mb-2 bg-gradient-to-r from-[#EA9F24] to-[#D68A1B] bg-clip-text text-transparent">
                  {stat.value}
                </h3>
                <p className="text-[#15436B] font-bold">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA SECTION (Premium Navy & Golden Yellow Style) --- */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-br from-[#0A2236] via-[#15436B] to-[#1C5A8F]">
        {/* Floating background elements for CTA - Yellow & Light Blue overlays */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#EA9F24]/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#287BBE]/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
          >
            Ready to build the next <br/> 
            <span className="text-[#EA9F24]">big thing?</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-[#D0E2F2] mb-10 max-w-2xl mx-auto"
          >
            Join Gincube today and get the resources, mentorship, and funding you need to accelerate your startup journey.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
             {/* CTA Button: Yellow gradient base to match the chat bot & theme */}
             <Link 
               to="/startup-registration"
               className="inline-block bg-gradient-to-r from-[#EA9F24] to-[#D68A1B] hover:from-[#D68A1B] hover:to-[#B47012] text-white hover:shadow-[0_10px_30px_rgba(234,159,36,0.4)] px-10 py-4 rounded-full font-extrabold text-lg transition-all duration-300 transform hover:-translate-y-1"
             >
               Start Your Journey Now
             </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default StatsAndCTA;