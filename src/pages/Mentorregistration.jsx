import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { User, Mail, Phone, MapPin, Send, Briefcase, Globe, FileText, Image as ImageIcon, Lock } from 'lucide-react';
import ReCAPTCHA from "react-google-recaptcha";
import API_URL from "../components/Config"; // Load API URL from Config
import locationData from '../data/locationData.json'; // Load local JSON data

gsap.registerPlugin(ScrollTrigger);

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
  bg:         '#F8FAFC', // Ultra-light modern background
  white:      '#FFFFFF',
};

export default function MentorRegistration() {
  const pageRef = useRef(null);
  const bannerTextRef = useRef(null);
  const formRef = useRef(null);
  const recaptchaRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    designation: '',
    totalExp: '',
    aboutUs: '',
    higherEducation: '',
    category: 'Tech',
    gender: 'male',
    institute: '',
    country: '', 
    state: '',   
    city: '', 
    linkedin_url: '',
    specializationIn: '',
    image: null,
    bot_field: '' // Honeypot
  });

  const [selectedSkills, setSelectedSkills] = useState([]);
  const [errors, setErrors] = useState({});
  const [captchaToken, setCaptchaToken] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Derived states for location dropdowns based on JSON
  const countriesList = locationData?.countries || [];
  const indiaStates = locationData?.indiaData ? Object.keys(locationData.indiaData) : [];
  
  // Get cities list if "India" and a valid state is selected
  const availableCities = (formData.country === 'India' && formData.state && locationData?.indiaData[formData.state]) 
      ? locationData.indiaData[formData.state] 
      : [];

  // Available Skills/Sectors
  const availableSkills = [
    "Legal Expert", "Finance Expert", "Account Expert", "Marketing Expert", 
    "IT Expert", "Digital Marketing", "Business Strategy Expert", 
    "Women Entrepreneur Expert", "Startup Expert", "Communication Expert"
  ];

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(bannerTextRef.current, { y: 40, opacity: 0, duration: 1, ease: "power4.out", delay: 0.1 });
      gsap.from(formRef.current, { y: 50, opacity: 0, duration: 1, ease: "power4.out", delay: 0.3 });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'mobile' || name === 'totalExp') {
      const onlyNums = value.replace(/[^0-9]/g, '');
      setFormData({ ...formData, [name]: onlyNums });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    if (errors[name]) setErrors({ ...errors, [name]: null });
  };

  const handleFileChange = (e) => {
    if(e.target.files && e.target.files[0]) {
        setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  const handleSkillToggle = (skill) => {
    setSelectedSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const handleCountryChange = (e) => {
    const val = e.target.value;
    setFormData({ ...formData, country: val, state: '', city: '' });
    if (errors.country) setErrors({ ...errors, country: null });
  };

  const handleStateChange = (e) => {
    const val = e.target.value;
    setFormData({ ...formData, state: val, city: '' });
    if (errors.state) setErrors({ ...errors, state: null });
  };

  const handleRecaptcha = (token) => {
    setCaptchaToken(token);
  };

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;
    const requiredFields = ['name', 'email', 'mobile', 'designation', 'totalExp', 'country', 'state', 'city', 'linkedin_url', 'category', 'gender', 'institute'];
    
    requiredFields.forEach(field => {
      if (!formData[field] || String(formData[field]).trim() === '') {
        newErrors[field] = 'Required';
        isValid = false;
      }
    });

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email';
      isValid = false;
    }

    if (!formData.image) {
      newErrors.image = 'Profile image is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.bot_field !== '') return; // Honeypot block

    if (validateForm()) {
      setIsSubmitting(true);

      const incubationId = import.meta.env.VITE_INCUBATION_ID || "6ab39542497aa33526fcd95b";
      const nodeEndpoint = API_URL ? `${API_URL}/mentors/register` : 'https://incubationmasters.com/api/mentors/register';

      // --- 1. Payload for Node.js API (Mongoose Model with Multer) ---
      const nodePayload = new FormData();
      nodePayload.append('incubationId', incubationId);
      if(formData.image) nodePayload.append('image', formData.image);
      nodePayload.append('name', formData.name);
      nodePayload.append('designation', formData.designation);
      nodePayload.append('totalExp', formData.totalExp);
      nodePayload.append('skills', JSON.stringify(selectedSkills));
      nodePayload.append('languages', JSON.stringify(['English', 'Hindi'])); // Defaulting for UI
      nodePayload.append('aboutUs', formData.aboutUs || 'Mentor Profile');
      nodePayload.append('higherEducation', formData.higherEducation || 'Graduate');
      nodePayload.append('rating', 5); // Default rating
      nodePayload.append('category', formData.category);
      nodePayload.append('gender', formData.gender);
      nodePayload.append('institute', formData.institute);
      nodePayload.append('email', formData.email);
      nodePayload.append('mo_number', formData.mobile);
      nodePayload.append('country', formData.country || 'India');
      nodePayload.append('state', formData.state); 
      nodePayload.append('city', formData.city);
      nodePayload.append('linkedin', formData.linkedin_url);
      nodePayload.append('specializationIn', formData.specializationIn || 'General');

      // --- 2. Payload for Legacy API ---
      const risePayload = new FormData();
      risePayload.append('name', formData.name);
      risePayload.append('email', formData.email);
      risePayload.append('mobile', formData.mobile);
      risePayload.append('country', formData.country);
      risePayload.append('state', formData.state);
      risePayload.append('city', formData.city);
      risePayload.append('linkedin_url', formData.linkedin_url);
      risePayload.append('no_of_mentor_year', formData.totalExp);
      risePayload.append('captcha', captchaToken || ''); 
      
      if (selectedSkills.includes('IT Expert')) risePayload.append('is_it_expert', 1);
      if (selectedSkills.includes('Business Strategy Expert')) risePayload.append('is_business_strategy_expert', 1);
      if (selectedSkills.includes('Finance Expert')) risePayload.append('is_finance_expert', 1);
      if (selectedSkills.includes('Marketing Expert')) risePayload.append('is_marketing_expert', 1);

      try {
        const [nodeRes, riseRes] = await Promise.allSettled([
          fetch(nodeEndpoint, { method: 'POST', body: nodePayload }), 
          fetch('https://risejhansi.in/MentorController/saveMentor', { method: 'POST', body: risePayload })
        ]);

        if ((nodeRes.status === 'fulfilled' && nodeRes.value.ok) || (riseRes.status === 'fulfilled' && riseRes.value.ok)) {
          alert("Mentor Registration Successful!");
          window.location.reload(); 
        } else {
          alert("Failed to register on servers. Please check your inputs.");
        }
      } catch (err) {
        alert("Network error. Could not connect to servers.");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // UI HELPER CLASSES (Navy Blue & Yellow Theme)
  const inputStyle = "w-full px-[16px] py-[14px] rounded-[12px] border-2 border-[#E2E8F0] focus:border-[#EA9F24] focus:ring-4 focus:ring-[#EA9F24]/15 outline-none transition-all text-[#0A2236] bg-[#F8FAFC] focus:bg-white text-[0.95rem] font-medium";
  const labelStyle = "flex items-center text-[0.95rem] font-bold text-[#0A2236] mb-2";
  const sectionHeadingStyle = "text-[1.4rem] font-extrabold text-[#0A2236] mb-6 flex items-center border-b-2 border-[#F0F6FB] pb-3";
  const errorStyle = "text-[#EF4444] text-[0.8rem] mt-1.5 font-medium";

  return (
    <main ref={pageRef} className="flex-grow bg-[#F8FAFC] min-h-screen pt-20 pb-24 font-['Inter',sans-serif]">
      
      {/* ================= TOP BANNER (Dark Navy Theme with Yellow Glow) ================= */}
      <div className="w-full bg-gradient-to-br from-[#0A2236] via-[#15436B] to-[#1C5A8F] py-24 relative overflow-hidden shadow-inner">
        <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[60%] rounded-full bg-[#EA9F24]/20 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[60%] rounded-full bg-[#287BBE]/30 blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div ref={bannerTextRef} className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-10">
          <div className="inline-block px-[18px] py-[8px] rounded-full bg-[#EA9F24]/10 border border-[#EA9F24]/30 text-[#EA9F24] font-bold text-sm mb-6 backdrop-blur-sm shadow-sm">
            Empower Innovators
          </div>
          <h1 className="text-[2.5rem] md:text-[3.5rem] lg:text-[4.5rem] font-extrabold text-white tracking-tight mb-6 leading-tight">
            Mentor <span className="text-[#EA9F24]">Registration</span>
          </h1>
          <p className="text-[#D0E2F2] text-[1.15rem] font-medium max-w-2xl mx-auto leading-relaxed">
            Share your expertise, guide startups toward success, and become a part of the G.Incube ecosystem.
          </p>
        </div>
      </div>

      {/* ================= FORM CONTAINER ================= */}
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div ref={formRef} className="bg-white shadow-[0_20px_60px_rgba(21,67,107,0.08)] rounded-[24px] p-[30px] md:p-[50px] border border-[#E2E8F0] border-t-[6px] border-t-[#EA9F24]">
          <form onSubmit={handleSubmit} noValidate>
            
            {/* Honeypot */}
            <input type="text" name="bot_field" value={formData.bot_field} onChange={handleChange} className="hidden" />

            {/* --- 1. PERSONAL DETAILS --- */}
            <div className="mb-12">
              <h3 className={sectionHeadingStyle}>
                <div className="w-10 h-10 rounded-full bg-[#EA9F24]/10 flex items-center justify-center mr-3">
                  <User className="w-5 h-5 text-[#EA9F24]" />
                </div>
                Personal & Contact Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelStyle}>Full Name <span className="text-[#EF4444] ml-1">*</span></label>
                  <input type="text" name="name" className={`${inputStyle} ${errors.name ? 'border-[#EF4444]' : ''}`} value={formData.name} onChange={handleChange} placeholder="Enter your name" />
                  {errors.name && <p className={errorStyle}>{errors.name}</p>}
                </div>
                <div>
                  <label className={labelStyle}><Mail className="w-4 h-4 mr-1.5 text-[#15436B]"/> Email <span className="text-[#EF4444] ml-1">*</span></label>
                  <input type="email" name="email" className={`${inputStyle} ${errors.email ? 'border-[#EF4444]' : ''}`} value={formData.email} onChange={handleChange} placeholder="Email address" />
                  {errors.email && <p className={errorStyle}>{errors.email}</p>}
                </div>
                <div>
                  <label className={labelStyle}><Phone className="w-4 h-4 mr-1.5 text-[#15436B]"/> Mobile <span className="text-[#EF4444] ml-1">*</span></label>
                  <input type="tel" name="mobile" className={`${inputStyle} ${errors.mobile ? 'border-[#EF4444]' : ''}`} value={formData.mobile} onChange={handleChange} placeholder="10-digit number" maxLength="15" />
                  {errors.mobile && <p className={errorStyle}>{errors.mobile}</p>}
                </div>
                <div>
                  <label className={labelStyle}>Gender <span className="text-[#EF4444] ml-1">*</span></label>
                  <select name="gender" className={inputStyle} value={formData.gender} onChange={handleChange}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* --- 2. PROFESSIONAL DETAILS --- */}
            <div className="mb-12">
              <h3 className={sectionHeadingStyle}>
                <div className="w-10 h-10 rounded-full bg-[#EA9F24]/10 flex items-center justify-center mr-3">
                  <Briefcase className="w-5 h-5 text-[#EA9F24]" />
                </div>
                Professional Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelStyle}>Current Designation <span className="text-[#EF4444] ml-1">*</span></label>
                  <input type="text" name="designation" className={`${inputStyle} ${errors.designation ? 'border-[#EF4444]' : ''}`} value={formData.designation} onChange={handleChange} placeholder="e.g. CEO, Senior Developer" />
                  {errors.designation && <p className={errorStyle}>{errors.designation}</p>}
                </div>
                <div>
                  <label className={labelStyle}>Total Experience (Years) <span className="text-[#EF4444] ml-1">*</span></label>
                  <input type="text" name="totalExp" className={`${inputStyle} ${errors.totalExp ? 'border-[#EF4444]' : ''}`} value={formData.totalExp} onChange={handleChange} placeholder="e.g. 10" />
                  {errors.totalExp && <p className={errorStyle}>{errors.totalExp}</p>}
                </div>
                <div>
                  <label className={labelStyle}>Institute / Company <span className="text-[#EF4444] ml-1">*</span></label>
                  <input type="text" name="institute" className={`${inputStyle} ${errors.institute ? 'border-[#EF4444]' : ''}`} value={formData.institute} onChange={handleChange} placeholder="Where do you work/teach?" />
                  {errors.institute && <p className={errorStyle}>{errors.institute}</p>}
                </div>
                <div>
                  <label className={labelStyle}>Higher Education <span className="text-[#64748B] font-normal ml-1">(Optional)</span></label>
                  <input type="text" name="higherEducation" className={inputStyle} value={formData.higherEducation} onChange={handleChange} placeholder="e.g. MBA, Ph.D" />
                </div>
                <div>
                  <label className={labelStyle}>Mentor Category <span className="text-[#EF4444] ml-1">*</span></label>
                  <select name="category" className={inputStyle} value={formData.category} onChange={handleChange}>
                    <option value="Tech">Technical</option>
                    <option value="Non Technical">Non Technical</option>
                    <option value="Business Strategy">Business Strategy</option>
                    <option value="Funding">Funding & Finance</option>
                  </select>
                </div>
                <div>
                  <label className={labelStyle}><Globe className="w-4 h-4 mr-1.5 text-[#15436B]" /> LinkedIn URL <span className="text-[#EF4444] ml-1">*</span></label>
                  <input type="url" name="linkedin_url" className={`${inputStyle} ${errors.linkedin_url ? 'border-[#EF4444]' : ''}`} value={formData.linkedin_url} onChange={handleChange} placeholder="https://linkedin.com/in/..." />
                  {errors.linkedin_url && <p className={errorStyle}>{errors.linkedin_url}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className={labelStyle}><ImageIcon className="w-4 h-4 mr-1.5 text-[#15436B]" /> Profile Image <span className="text-[#EF4444] ml-1">*</span></label>
                  <input type="file" accept="image/*" className={`${inputStyle} bg-white`} onChange={handleFileChange} />
                  {errors.image && <p className={errorStyle}>{errors.image}</p>}
                </div>
              </div>
            </div>

            {/* --- 3. LOCATION --- */}
            <div className="mb-12">
              <h3 className={sectionHeadingStyle}>
                <div className="w-10 h-10 rounded-full bg-[#EA9F24]/10 flex items-center justify-center mr-3">
                  <MapPin className="w-5 h-5 text-[#EA9F24]" />
                </div>
                Location Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className={labelStyle}>Country <span className="text-[#EF4444] ml-1">*</span></label>
                  <select name="country" className={`${inputStyle} ${errors.country ? 'border-[#EF4444]' : ''}`} value={formData.country} onChange={handleCountryChange}>
                    <option value="" disabled>Select Country</option>
                    {countriesList.map((c, idx) => <option key={idx} value={c}>{c}</option>)}
                  </select>
                  {errors.country && <p className={errorStyle}>{errors.country}</p>}
                </div>

                <div>
                  <label className={labelStyle}>State <span className="text-[#EF4444] ml-1">*</span></label>
                  {formData.country === 'India' ? (
                    <select name="state" className={`${inputStyle} ${errors.state ? 'border-[#EF4444]' : ''}`} value={formData.state} onChange={handleStateChange}>
                      <option value="" disabled>Select State</option>
                      {indiaStates.map((s, idx) => <option key={idx} value={s}>{s}</option>)}
                    </select>
                  ) : (
                    <input type="text" name="state" placeholder="Enter State" value={formData.state} onChange={handleChange} className={`${inputStyle} ${errors.state ? 'border-[#EF4444]' : ''}`} disabled={!formData.country} />
                  )}
                  {errors.state && <p className={errorStyle}>{errors.state}</p>}
                </div>

                <div>
                  <label className={labelStyle}>City <span className="text-[#EF4444] ml-1">*</span></label>
                  {formData.country === 'India' && availableCities.length > 0 ? (
                    <select name="city" className={`${inputStyle} ${errors.city ? 'border-[#EF4444]' : ''}`} value={formData.city} onChange={handleChange}>
                      <option value="" disabled>Select City</option>
                      {availableCities.map((c, idx) => <option key={idx} value={c}>{c}</option>)}
                    </select>
                  ) : (
                    <input type="text" name="city" placeholder="Enter City" value={formData.city} onChange={handleChange} className={`${inputStyle} ${errors.city ? 'border-[#EF4444]' : ''}`} disabled={!formData.state} />
                  )}
                  {errors.city && <p className={errorStyle}>{errors.city}</p>}
                </div>
              </div>
            </div>

            {/* --- 4. SKILLS & EXPERTISE --- */}
            <div className="mb-10">
              <h3 className={sectionHeadingStyle}>
                <div className="w-10 h-10 rounded-full bg-[#EA9F24]/10 flex items-center justify-center mr-3">
                  <FileText className="w-5 h-5 text-[#EA9F24]" />
                </div>
                Expertise & Skills
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {availableSkills.map((skill, i) => (
                  <label key={i} className={`flex items-center space-x-3 cursor-pointer p-3 rounded-[12px] border-2 transition-colors ${selectedSkills.includes(skill) ? 'border-[#EA9F24] bg-[#EA9F24]/5' : 'bg-[#F8FAFC] border-[#E2E8F0] hover:border-[#EA9F24]/50 hover:bg-white'}`}>
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 accent-[#EA9F24] cursor-pointer" 
                      checked={selectedSkills.includes(skill)}
                      onChange={() => handleSkillToggle(skill)}
                    />
                    <span className="text-[0.95rem] font-bold text-[#0A2236]">{skill}</span>
                  </label>
                ))}
              </div>
              
              <label className={labelStyle}>About Your Experience <span className="text-[#64748B] font-normal ml-1">(Optional)</span></label>
              <textarea 
                name="aboutUs" 
                rows="4" 
                className={`${inputStyle} resize-none min-h-[120px]`} 
                value={formData.aboutUs} 
                onChange={handleChange} 
                placeholder="Brief bio about your mentoring experience..."
              ></textarea>
            </div>

            {/* --- 5. SECURITY (OPTIONAL CAPTCHA) --- */}
            <div className="mt-8 bg-[#F0F6FB] p-6 rounded-[16px] border border-[#E2E8F0] flex flex-col items-center">
              <label className="text-[0.85rem] font-bold text-[#15436B] uppercase tracking-wider mb-4">
                  Security Verification <span className="font-medium normal-case text-[#64748B]">(Optional)</span>
              </label>
              
              <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={import.meta.env.VITE_RECAPTCHA_KEY || "YOUR_FALLBACK_SITE_KEY_IF_ENV_IS_MISSING"}
                  onChange={handleRecaptcha}
              />
            </div>

            {/* --- 6. SUBMIT BUTTON --- */}
            <div className="mt-10 text-center">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="inline-flex items-center justify-center px-[50px] py-[20px] bg-gradient-to-r from-[#EA9F24] to-[#D68A1B] hover:from-[#D68A1B] hover:to-[#B47012] text-white font-extrabold rounded-[50px] text-[1.1rem] shadow-[0_10px_30px_rgba(234,159,36,0.35)] transition-all disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-1 w-full md:w-auto"
              >
                {isSubmitting ? (
                  <><span className="inline-block w-[20px] h-[20px] border-2 border-white/30 border-t-white rounded-full animate-spin mr-[10px] align-middle"></span> Processing...</>
                ) : (
                  <><Send className="w-5 h-5 mr-2" /> Register as Mentor</>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </main>
  );
}