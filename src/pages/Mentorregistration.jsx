import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { User, Mail, Phone, MapPin, Send, Briefcase, Globe, FileText, Image as ImageIcon, AlertCircle } from 'lucide-react';
import API_URL from "../components/Config";
import locationData from '../data/locationdata.json';
import { usePopup } from '../context/PopupContext';

gsap.registerPlugin(ScrollTrigger);

export default function MentorRegistration() {
  const { showError, showSuccess } = usePopup();

  const pageRef = useRef(null);
  const bannerTextRef = useRef(null);
  const formRef = useRef(null);
  const fileInputRef = useRef(null);

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Derived states for location dropdowns based on JSON
  const countriesList = locationData?.countries || [];
  const indiaStates = locationData?.indiaData ? Object.keys(locationData.indiaData) : [];
  
  const availableCities = (formData.country === 'India' && formData.state && locationData?.indiaData[formData.state]) 
      ? locationData.indiaData[formData.state] 
      : [];

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'mobile' || name === 'totalExp') {
      const onlyNums = value.replace(/[^0-9]/g, '');
      setFormData(prev => ({ ...prev, [name]: onlyNums }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, image: e.target.files[0] }));
      if (errors.image) setErrors(prev => ({ ...prev, image: null }));
    }
  };

  const handleSkillToggle = (skill) => {
    setSelectedSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const handleCountryChange = (e) => {
    const val = e.target.value;
    setFormData(prev => ({ ...prev, country: val, state: '', city: '' }));
    if (errors.country) setErrors(prev => ({ ...prev, country: null }));
  };

  const handleStateChange = (e) => {
    const val = e.target.value;
    setFormData(prev => ({ ...prev, state: val, city: '' }));
    if (errors.state) setErrors(prev => ({ ...prev, state: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    const errorList = [];

    // Full Name
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
      errorList.push('Full Name is mandatory');
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Must be at least 2 characters';
      errorList.push('Full Name must be at least 2 characters');
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      errorList.push('Email Address is mandatory');
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Invalid email address';
      errorList.push('Please provide a valid Email Address');
    }

    // Mobile
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
      errorList.push('Mobile Number is mandatory');
    } else if (formData.mobile.trim().length !== 10) {
      newErrors.mobile = 'Must be exactly 10 digits';
      errorList.push('Mobile Number must be a valid 10-digit number');
    }

    // Gender
    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
      errorList.push('Gender selection is mandatory');
    }

    // Designation
    if (!formData.designation.trim()) {
      newErrors.designation = 'Current designation is required';
      errorList.push('Current Designation is mandatory');
    }

    // Total Experience
    if (!formData.totalExp.trim()) {
      newErrors.totalExp = 'Total experience is required';
      errorList.push('Total Experience (Years) is mandatory');
    }

    // Institute
    if (!formData.institute.trim()) {
      newErrors.institute = 'Institute or company name is required';
      errorList.push('Institute / Company is mandatory');
    }

    // Mentor Category
    if (!formData.category) {
      newErrors.category = 'Category is required';
      errorList.push('Mentor Category is mandatory');
    }

    // LinkedIn URL
    if (!formData.linkedin_url.trim()) {
      newErrors.linkedin_url = 'LinkedIn URL is required';
      errorList.push('LinkedIn URL is mandatory');
    } else {
      const urlPattern = /^(https?:\/\/)?(www\.)?linkedin\.com\/.*$/i;
      if (!urlPattern.test(formData.linkedin_url.trim())) {
        newErrors.linkedin_url = 'Please enter a valid LinkedIn profile URL';
        errorList.push('LinkedIn URL must be a valid LinkedIn profile link');
      }
    }

    // Profile Image
    if (!formData.image) {
      newErrors.image = 'Profile image is required';
      errorList.push('Profile Image upload is mandatory');
    }

    // Location
    if (!formData.country) {
      newErrors.country = 'Country is required';
      errorList.push('Country is mandatory');
    }
    if (!formData.state) {
      newErrors.state = 'State is required';
      errorList.push('State is mandatory');
    }
    if (!formData.city) {
      newErrors.city = 'City is required';
      errorList.push('City is mandatory');
    }

    setErrors(newErrors);
    return { isValid: Object.keys(newErrors).length === 0, errorList };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.bot_field !== '') return; // Honeypot block

    const { isValid, errorList } = validateForm();
    if (!isValid) {
      showError({
        title: "Validation Error",
        message: "Please correct the following mandatory field(s):",
        errors: errorList
      });
      window.scrollTo({ top: 140, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    const incubationId = import.meta.env.VITE_INCUBATION_ID || "6ab39542497aa33526fcd95b";
    const nodeEndpoint = API_URL ? `${API_URL}/mentors/register` : 'https://incubationmasters.com/api/mentors/register';

    const nodePayload = new FormData();
    nodePayload.append('incubationId', incubationId);
    if (formData.image) nodePayload.append('image', formData.image);
    nodePayload.append('name', formData.name.trim());
    nodePayload.append('designation', formData.designation.trim());
    nodePayload.append('totalExp', formData.totalExp.trim());
    nodePayload.append('skills', JSON.stringify(selectedSkills));
    nodePayload.append('languages', JSON.stringify(['English', 'Hindi']));
    nodePayload.append('aboutUs', formData.aboutUs.trim() || 'Mentor Profile');
    nodePayload.append('higherEducation', formData.higherEducation.trim() || 'Graduate');
    nodePayload.append('rating', 5);
    nodePayload.append('category', formData.category);
    nodePayload.append('gender', formData.gender);
    nodePayload.append('institute', formData.institute.trim());
    nodePayload.append('email', formData.email.trim());
    nodePayload.append('mo_number', formData.mobile.trim());
    nodePayload.append('country', formData.country || 'India');
    nodePayload.append('state', formData.state); 
    nodePayload.append('city', formData.city);
    nodePayload.append('linkedin', formData.linkedin_url.trim());
    nodePayload.append('specializationIn', formData.specializationIn.trim() || 'General');

    try {
      const response = await fetch(nodeEndpoint, { method: 'POST', body: nodePayload });

      if (response.ok) {
        showSuccess({
          title: "Mentor Registration Successful!",
          message: "Thank you for registering as a mentor with Gincube. Our team will review your profile and connect with you shortly."
        });
        setFormData({
          name: '', email: '', mobile: '', designation: '', totalExp: '',
          aboutUs: '', higherEducation: '', category: 'Tech', gender: 'male',
          institute: '', country: '', state: '', city: '', linkedin_url: '',
          specializationIn: '', image: null, bot_field: ''
        });
        setSelectedSkills([]);
        setErrors({});
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        const errData = await response.json().catch(() => ({}));
        showError({
          title: "Registration Failed",
          message: errData.message || "Failed to register mentor. Please check your inputs and try again."
        });
      }
    } catch (err) {
      console.error("API Error:", err);
      showError({
        title: "Network Error",
        message: "Could not connect to servers. Please check your internet connection and try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // UI HELPER CLASSES
  const inputStyle = (fieldName) => `w-full px-[16px] py-[14px] rounded-[12px] border-2 ${errors[fieldName] ? 'border-[#EF4444] bg-red-50/20 focus:border-[#EF4444]' : 'border-[#E2E8F0] bg-[#F8FAFC] focus:bg-white focus:border-[#EA9F24]'} focus:ring-4 focus:ring-[#EA9F24]/15 outline-none transition-all text-[#0A2236] text-[0.95rem] font-medium`;
  const labelStyle = "flex items-center text-[0.95rem] font-bold text-[#0A2236] mb-2";
  const sectionHeadingStyle = "text-[1.4rem] font-extrabold text-[#0A2236] mb-6 flex items-center border-b-2 border-[#F0F6FB] pb-3";
  const errorStyle = "text-[#EF4444] text-xs font-semibold mt-1.5 flex items-center gap-1";

  return (
    <main ref={pageRef} className="flex-grow bg-[#F8FAFC] min-h-screen pt-20 pb-24 font-['Inter',sans-serif]">
      
      {/* ================= TOP BANNER ================= */}
      <div className="w-full bg-gradient-to-br from-[#0A2236] via-[#15436B] to-[#1C5A8F] pt-28 pb-20 sm:pt-32 sm:pb-24 relative overflow-hidden shadow-inner">
        <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[60%] rounded-full bg-[#EA9F24]/20 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[60%] rounded-full bg-[#287BBE]/30 blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div ref={bannerTextRef} className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-block px-4 py-1.5 rounded-full bg-[#EA9F24]/10 border border-[#EA9F24]/30 text-[#EA9F24] font-bold text-xs sm:text-sm mb-4 sm:mb-6 backdrop-blur-sm shadow-sm">
            Empower Innovators
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-4 sm:mb-6 leading-tight">
            Mentor <span className="text-[#EA9F24]">Registration</span>
          </h1>
          <p className="text-[#D0E2F2] text-base sm:text-lg font-medium max-w-2xl mx-auto leading-relaxed">
            Share your expertise, guide startups toward success, and become a part of the G.Incube ecosystem.
          </p>
        </div>
      </div>

      {/* ================= FORM CONTAINER ================= */}
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 -mt-10 sm:-mt-12 relative z-20">
        <div ref={formRef} className="bg-white shadow-[0_20px_60px_rgba(21,67,107,0.08)] rounded-3xl p-5 sm:p-8 md:p-12 border border-[#E2E8F0] border-t-[6px] border-t-[#EA9F24]">
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
                  <input type="text" name="name" className={inputStyle('name')} value={formData.name} onChange={handleChange} placeholder="Enter your full name" />
                  {errors.name && <p className={errorStyle}><AlertCircle size={13} /> {errors.name}</p>}
                </div>
                <div>
                  <label className={labelStyle}><Mail className="w-4 h-4 mr-1.5 text-[#15436B]"/> Email <span className="text-[#EF4444] ml-1">*</span></label>
                  <input type="email" name="email" className={inputStyle('email')} value={formData.email} onChange={handleChange} placeholder="Email address" />
                  {errors.email && <p className={errorStyle}><AlertCircle size={13} /> {errors.email}</p>}
                </div>
                <div>
                  <label className={labelStyle}><Phone className="w-4 h-4 mr-1.5 text-[#15436B]"/> Mobile <span className="text-[#EF4444] ml-1">*</span></label>
                  <input type="tel" name="mobile" className={inputStyle('mobile')} value={formData.mobile} onChange={handleChange} placeholder="10-digit number" maxLength="10" />
                  {errors.mobile && <p className={errorStyle}><AlertCircle size={13} /> {errors.mobile}</p>}
                </div>
                <div>
                  <label className={labelStyle}>Gender <span className="text-[#EF4444] ml-1">*</span></label>
                  <select name="gender" className={inputStyle('gender')} value={formData.gender} onChange={handleChange}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && <p className={errorStyle}><AlertCircle size={13} /> {errors.gender}</p>}
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
                  <input type="text" name="designation" className={inputStyle('designation')} value={formData.designation} onChange={handleChange} placeholder="e.g. CEO, Senior Architect" />
                  {errors.designation && <p className={errorStyle}><AlertCircle size={13} /> {errors.designation}</p>}
                </div>
                <div>
                  <label className={labelStyle}>Total Experience (Years) <span className="text-[#EF4444] ml-1">*</span></label>
                  <input type="text" name="totalExp" className={inputStyle('totalExp')} value={formData.totalExp} onChange={handleChange} placeholder="e.g. 10" />
                  {errors.totalExp && <p className={errorStyle}><AlertCircle size={13} /> {errors.totalExp}</p>}
                </div>
                <div>
                  <label className={labelStyle}>Institute / Company <span className="text-[#EF4444] ml-1">*</span></label>
                  <input type="text" name="institute" className={inputStyle('institute')} value={formData.institute} onChange={handleChange} placeholder="Where do you work/consult?" />
                  {errors.institute && <p className={errorStyle}><AlertCircle size={13} /> {errors.institute}</p>}
                </div>
                <div>
                  <label className={labelStyle}>Higher Education <span className="text-[#64748B] font-normal ml-1">(Optional)</span></label>
                  <input type="text" name="higherEducation" className={inputStyle('higherEducation')} value={formData.higherEducation} onChange={handleChange} placeholder="e.g. MBA, Ph.D, B.Tech" />
                </div>
                <div>
                  <label className={labelStyle}>Mentor Category <span className="text-[#EF4444] ml-1">*</span></label>
                  <select name="category" className={inputStyle('category')} value={formData.category} onChange={handleChange}>
                    <option value="Tech">Technical</option>
                    <option value="Non Technical">Non Technical</option>
                    <option value="Business Strategy">Business Strategy</option>
                    <option value="Funding">Funding & Finance</option>
                  </select>
                  {errors.category && <p className={errorStyle}><AlertCircle size={13} /> {errors.category}</p>}
                </div>
                <div>
                  <label className={labelStyle}><Globe className="w-4 h-4 mr-1.5 text-[#15436B]" /> LinkedIn URL <span className="text-[#EF4444] ml-1">*</span></label>
                  <input type="url" name="linkedin_url" className={inputStyle('linkedin_url')} value={formData.linkedin_url} onChange={handleChange} placeholder="https://linkedin.com/in/..." />
                  {errors.linkedin_url && <p className={errorStyle}><AlertCircle size={13} /> {errors.linkedin_url}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className={labelStyle}><ImageIcon className="w-4 h-4 mr-1.5 text-[#15436B]" /> Profile Image <span className="text-[#EF4444] ml-1">*</span></label>
                  <input ref={fileInputRef} type="file" accept="image/*" className={`${inputStyle('image')} bg-white cursor-pointer`} onChange={handleFileChange} />
                  {errors.image && <p className={errorStyle}><AlertCircle size={13} /> {errors.image}</p>}
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
                  <select name="country" className={inputStyle('country')} value={formData.country} onChange={handleCountryChange}>
                    <option value="" disabled>Select Country</option>
                    {countriesList.map((c, idx) => <option key={idx} value={c}>{c}</option>)}
                  </select>
                  {errors.country && <p className={errorStyle}><AlertCircle size={13} /> {errors.country}</p>}
                </div>

                <div>
                  <label className={labelStyle}>State <span className="text-[#EF4444] ml-1">*</span></label>
                  {formData.country === 'India' ? (
                    <select name="state" className={inputStyle('state')} value={formData.state} onChange={handleStateChange}>
                      <option value="" disabled>Select State</option>
                      {indiaStates.map((s, idx) => <option key={idx} value={s}>{s}</option>)}
                    </select>
                  ) : (
                    <input type="text" name="state" placeholder="Enter State" value={formData.state} onChange={handleChange} className={inputStyle('state')} disabled={!formData.country} />
                  )}
                  {errors.state && <p className={errorStyle}><AlertCircle size={13} /> {errors.state}</p>}
                </div>

                <div>
                  <label className={labelStyle}>City <span className="text-[#EF4444] ml-1">*</span></label>
                  {formData.country === 'India' && availableCities.length > 0 ? (
                    <select name="city" className={inputStyle('city')} value={formData.city} onChange={handleChange}>
                      <option value="" disabled>Select City</option>
                      {availableCities.map((c, idx) => <option key={idx} value={c}>{c}</option>)}
                    </select>
                  ) : (
                    <input type="text" name="city" placeholder="Enter City" value={formData.city} onChange={handleChange} className={inputStyle('city')} disabled={!formData.state} />
                  )}
                  {errors.city && <p className={errorStyle}><AlertCircle size={13} /> {errors.city}</p>}
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
                className={`${inputStyle('aboutUs')} resize-none min-h-[120px]`} 
                value={formData.aboutUs} 
                onChange={handleChange} 
                placeholder="Brief bio about your mentoring experience..."
              ></textarea>
            </div>

            {/* --- 5. SUBMIT BUTTON --- */}
            <div className="mt-10 text-center">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="inline-flex items-center justify-center px-10 py-4 bg-gradient-to-r from-[#EA9F24] to-[#D68A1B] hover:from-[#D68A1B] hover:to-[#B47012] text-white font-extrabold rounded-full text-base sm:text-lg shadow-lg shadow-[#EA9F24]/30 hover:shadow-xl hover:shadow-[#EA9F24]/40 transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0 w-full sm:w-auto cursor-pointer"
              >
                {isSubmitting ? (
                  <><span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2.5"></span> Processing...</>
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
