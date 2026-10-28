import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { User, Mail, Phone, MapPin, Send, Building, Globe, FileText, Image as ImageIcon, Briefcase, AlertCircle } from 'lucide-react';
import API_URL from "../components/Config";
import locationData from '../data/locationdata.json';
import { usePopup } from '../context/PopupContext';

gsap.registerPlugin(ScrollTrigger);

export default function InvestorRegistration() {
  const { showError, showSuccess } = usePopup();

  const pageRef = useRef(null);
  const bannerTextRef = useRef(null);
  const formRef = useRef(null);
  const fileInputRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    companyName: '',
    investorName: '',
    email: '',
    mobile: '',
    country: '', 
    state: '',   
    city: '',    
    companyFund: '',
    investmentLimit: '',
    investorType: '',
    linkedinProfile: '',
    website: '',
    shortDescription: '',
    fullDescription: '',
    firmLogo: null,
    bot_field: '' // Honeypot
  });

  const [selectedStages, setSelectedStages] = useState([]);
  const [selectedIndustries, setSelectedIndustries] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableStages = ['Ideation', 'Validation', 'Prototype/MVP', 'Scaling'];
  const availableIndustries = ['EdTech', 'FinTech', 'HealthTech', 'AgriTech', 'E-Commerce', 'SaaS', 'Other'];

  const countriesList = locationData?.countries || [];
  const indiaStates = locationData?.indiaData ? Object.keys(locationData.indiaData) : [];
  
  const availableCities = (formData.country === 'India' && formData.state && locationData?.indiaData[formData.state]) 
      ? locationData.indiaData[formData.state] 
      : [];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(bannerTextRef.current, { y: 40, opacity: 0, duration: 1, ease: "power4.out", delay: 0.1 });
      gsap.from(formRef.current, { y: 50, opacity: 0, duration: 1, ease: "power4.out", delay: 0.3 });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'mobile') {
      const onlyNums = value.replace(/[^0-9]/g, '');
      setFormData(prev => ({ ...prev, [name]: onlyNums }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, firmLogo: e.target.files[0] }));
    }
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

  const toggleArrayItem = (item, array, setArray, errorKey) => {
    setArray(prev => {
      const updated = prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item];
      if (errorKey && errors[errorKey] && updated.length > 0) {
        setErrors(errs => ({ ...errs, [errorKey]: null }));
      }
      return updated;
    });
  };

  const validateForm = () => {
    const newErrors = {};
    const errorList = [];

    // Investor Name
    if (!formData.investorName.trim()) {
      newErrors.investorName = 'Investor / Contact Name is required';
      errorList.push('Investor Name (Contact Person) is mandatory');
    } else if (formData.investorName.trim().length < 2) {
      newErrors.investorName = 'Must be at least 2 characters';
      errorList.push('Investor Name must be at least 2 characters');
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
      errorList.push('Email Address is mandatory');
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Invalid email address';
      errorList.push('Please enter a valid Email Address');
    }

    // Mobile
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
      errorList.push('Mobile Number is mandatory');
    } else if (formData.mobile.trim().length !== 10) {
      newErrors.mobile = 'Must be a 10-digit number';
      errorList.push('Mobile Number must be exactly 10 digits');
    }

    // Investor Type
    if (!formData.investorType) {
      newErrors.investorType = 'Please select investor type';
      errorList.push('Type of Investor selection is mandatory');
    }

    // Startup stage choices (Mandatory *)
    if (selectedStages.length === 0) {
      newErrors.stages = 'Please select at least one stage';
      errorList.push('Choice of Startup Stage: Please select at least one stage');
    }

    // Preferred Industries (Mandatory *)
    if (selectedIndustries.length === 0) {
      newErrors.industries = 'Please select at least one industry';
      errorList.push('Preferred Industries: Please select at least one industry');
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

    // Optional URLs validation if provided
    if (formData.website.trim()) {
      const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i;
      if (!urlPattern.test(formData.website.trim())) {
        newErrors.website = 'Invalid website URL format';
        errorList.push('Website URL is invalid (e.g. https://yourfirm.com)');
      }
    }

    if (formData.linkedinProfile.trim()) {
      const urlPattern = /^(https?:\/\/)?(www\.)?linkedin\.com\/.*$/i;
      if (!urlPattern.test(formData.linkedinProfile.trim())) {
        newErrors.linkedinProfile = 'Invalid LinkedIn profile URL';
        errorList.push('LinkedIn URL must be a valid LinkedIn link');
      }
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
    const nodeEndpoint = API_URL ? `${API_URL}/investors/register` : 'https://incubationmasters.com/api/investors/register';

    const nodePayload = new FormData();
    nodePayload.append('incubationId', incubationId);
    if (formData.firmLogo) nodePayload.append('firmLogo', formData.firmLogo);
    nodePayload.append('investorName', formData.investorName.trim());
    nodePayload.append('firmName', formData.companyName.trim());
    nodePayload.append('investorType', formData.investorType.toLowerCase().includes('angel') ? 'angel' : 'vc');
    nodePayload.append('email', formData.email.trim());
    nodePayload.append('contactNumber', formData.mobile.trim());
    nodePayload.append('linkedinProfile', formData.linkedinProfile.trim());
    nodePayload.append('website', formData.website.trim());
    nodePayload.append('country', formData.country);
    nodePayload.append('state', formData.state);
    nodePayload.append('city', formData.city);
    nodePayload.append('locationRaw', `${formData.city}, ${formData.state}, ${formData.country}`);
    nodePayload.append('shortDescription', formData.shortDescription.trim());
    nodePayload.append('fullDescription', formData.fullDescription.trim());
    nodePayload.append('stage', JSON.stringify(selectedStages));
    nodePayload.append('industry', JSON.stringify(selectedIndustries));

    try {
      const response = await fetch(nodeEndpoint, { method: 'POST', body: nodePayload });

      if (response.ok) {
        showSuccess({
          title: "Investor Registration Successful!",
          message: "Thank you for registering as an Investor with Gincube. Our ecosystem team will review your preferences and share curated startups with you."
        });
        setFormData({
          companyName: '', investorName: '', email: '', mobile: '',
          country: '', state: '', city: '', companyFund: '',
          investmentLimit: '', investorType: '', linkedinProfile: '',
          website: '', shortDescription: '', fullDescription: '',
          firmLogo: null, bot_field: ''
        });
        setSelectedStages([]);
        setSelectedIndustries([]);
        setErrors({});
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        const errData = await response.json().catch(() => ({}));
        showError({
          title: "Registration Failed",
          message: errData.message || "Failed to register investor. Please check your inputs and try again."
        });
      }
    } catch (err) {
      console.error("API Error:", err);
      showError({
        title: "Network Error",
        message: "Could not submit form. Please check your network connection and try again."
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
            Invest in High-Impact Ventures
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-4 sm:mb-6 leading-tight">
            Investor <span className="text-[#EA9F24]">Registration</span>
          </h1>
          <p className="text-[#D0E2F2] text-base sm:text-lg font-medium max-w-2xl mx-auto leading-relaxed">
            Discover high-potential startups, co-invest with leading partners, and support emerging ventures in G.Incube.
          </p>
        </div>
      </div>

      {/* ================= FORM CONTAINER ================= */}
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 -mt-10 sm:-mt-12 relative z-20">
        <div ref={formRef} className="bg-white shadow-[0_20px_60px_rgba(21,67,107,0.08)] rounded-3xl p-5 sm:p-8 md:p-12 border border-[#E2E8F0] border-t-[6px] border-t-[#EA9F24]">
          <form onSubmit={handleSubmit} noValidate>
            
            {/* Honeypot */}
            <input type="text" name="bot_field" value={formData.bot_field} onChange={handleChange} className="hidden" />

            {/* --- 1. FIRM & CONTACT DETAILS --- */}
            <div className="mb-12">
              <h3 className={sectionHeadingStyle}>
                <div className="w-10 h-10 rounded-full bg-[#EA9F24]/10 flex items-center justify-center mr-3">
                  <User className="w-5 h-5 text-[#EA9F24]" />
                </div>
                Investor Profile
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelStyle}>Firm / Company Name <span className="text-[#64748B] font-normal ml-1">(Optional)</span></label>
                  <input type="text" name="companyName" className={inputStyle('companyName')} value={formData.companyName} onChange={handleChange} placeholder="e.g. VC Partners" />
                </div>
                <div>
                  <label className={labelStyle}>Investor Name (Contact Person) <span className="text-[#EF4444] ml-1">*</span></label>
                  <input type="text" name="investorName" className={inputStyle('investorName')} value={formData.investorName} onChange={handleChange} placeholder="Full Name" />
                  {errors.investorName && <p className={errorStyle}><AlertCircle size={13} /> {errors.investorName}</p>}
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
                  <label className={labelStyle}><Globe className="w-4 h-4 mr-1.5 text-[#15436B]" /> Website <span className="text-[#64748B] font-normal ml-1">(Optional)</span></label>
                  <input type="url" name="website" className={inputStyle('website')} value={formData.website} onChange={handleChange} placeholder="https://..." />
                  {errors.website && <p className={errorStyle}><AlertCircle size={13} /> {errors.website}</p>}
                </div>
                <div>
                  <label className={labelStyle}><ImageIcon className="w-4 h-4 mr-1.5 text-[#15436B]" /> Firm Logo <span className="text-[#64748B] font-normal ml-1">(Optional)</span></label>
                  <input ref={fileInputRef} type="file" accept="image/*" className={`${inputStyle('firmLogo')} bg-white py-[11px] cursor-pointer`} onChange={handleFileChange} />
                </div>
              </div>
            </div>

            {/* --- 2. INVESTMENT PREFERENCES --- */}
            <div className="mb-12">
              <h3 className={sectionHeadingStyle}>
                <div className="w-10 h-10 rounded-full bg-[#EA9F24]/10 flex items-center justify-center mr-3">
                  <Briefcase className="w-5 h-5 text-[#EA9F24]" />
                </div>
                Investment Preferences
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className={labelStyle}>Type Of Investor <span className="text-[#EF4444] ml-1">*</span></label>
                  <select name="investorType" className={inputStyle('investorType')} value={formData.investorType} onChange={handleChange}>
                    <option value="" disabled>Select investor type</option>
                    <option value="Angel Investor">Angel Investor</option>
                    <option value="Venture Capitalist (VC)">Venture Capitalist (VC)</option>
                    <option value="Institutional Investor">Institutional Investor</option>
                  </select>
                  {errors.investorType && <p className={errorStyle}><AlertCircle size={13} /> {errors.investorType}</p>}
                </div>
                <div>
                  <label className={labelStyle}>Investment Limit <span className="text-[#64748B] font-normal ml-1">(Optional)</span></label>
                  <select name="investmentLimit" className={inputStyle('investmentLimit')} value={formData.investmentLimit} onChange={handleChange}>
                    <option value="" disabled>Select Limit</option>
                    <option value="Upto 2 Lakh">Upto 2 Lakh</option>
                    <option value="2-5 Lakh">2-5 Lakh</option>
                    <option value="More than 5 Lakh">More than 5 Lakh</option>
                  </select>
                </div>
                <div>
                  <label className={labelStyle}>Number of Companies Funded <span className="text-[#64748B] font-normal ml-1">(Optional)</span></label>
                  <select name="companyFund" className={inputStyle('companyFund')} value={formData.companyFund} onChange={handleChange}>
                    <option value="" disabled>Select Number</option>
                    <option value="0">0</option>
                    <option value="1-5">1-5</option>
                    <option value="5+">5+</option>
                  </select>
                </div>
                <div>
                  <label className={labelStyle}><Globe className="w-4 h-4 mr-1.5 text-[#15436B]" /> LinkedIn URL <span className="text-[#64748B] font-normal ml-1">(Optional)</span></label>
                  <input type="url" name="linkedinProfile" className={inputStyle('linkedinProfile')} value={formData.linkedinProfile} onChange={handleChange} placeholder="https://linkedin.com/in/..." />
                  {errors.linkedinProfile && <p className={errorStyle}><AlertCircle size={13} /> {errors.linkedinProfile}</p>}
                </div>
              </div>

              {/* Checkboxes for Stage and Industry */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[0.95rem] font-bold text-[#0A2236] mb-3">Choice of startup stage <span className="text-[#EF4444]">*</span></label>
                  <div className={`flex flex-col gap-3 p-3 rounded-2xl border-2 ${errors.stages ? 'border-[#EF4444] bg-red-50/15' : 'border-transparent'}`}>
                    {availableStages.map((stage, i) => (
                      <label key={i} className={`flex items-center space-x-3 cursor-pointer p-3 rounded-[12px] border-2 transition-colors ${selectedStages.includes(stage) ? 'border-[#EA9F24] bg-[#EA9F24]/5' : 'bg-[#F8FAFC] border-[#E2E8F0] hover:border-[#EA9F24]/50 hover:bg-white'}`}>
                        <input type="checkbox" className="w-4 h-4 accent-[#EA9F24] cursor-pointer" checked={selectedStages.includes(stage)} onChange={() => toggleArrayItem(stage, selectedStages, setSelectedStages, 'stages')} />
                        <span className="text-[0.95rem] font-bold text-[#0A2236]">{stage}</span>
                      </label>
                    ))}
                  </div>
                  {errors.stages && <p className={errorStyle}><AlertCircle size={13} /> {errors.stages}</p>}
                </div>
                <div>
                  <label className="block text-[0.95rem] font-bold text-[#0A2236] mb-3">Preferred Industries <span className="text-[#EF4444]">*</span></label>
                  <div className={`flex flex-col gap-3 p-3 rounded-2xl border-2 ${errors.industries ? 'border-[#EF4444] bg-red-50/15' : 'border-transparent'}`}>
                    {availableIndustries.map((industry, i) => (
                      <label key={i} className={`flex items-center space-x-3 cursor-pointer p-3 rounded-[12px] border-2 transition-colors ${selectedIndustries.includes(industry) ? 'border-[#EA9F24] bg-[#EA9F24]/5' : 'bg-[#F8FAFC] border-[#E2E8F0] hover:border-[#EA9F24]/50 hover:bg-white'}`}>
                        <input type="checkbox" className="w-4 h-4 accent-[#EA9F24] cursor-pointer" checked={selectedIndustries.includes(industry)} onChange={() => toggleArrayItem(industry, selectedIndustries, setSelectedIndustries, 'industries')} />
                        <span className="text-[0.95rem] font-bold text-[#0A2236]">{industry}</span>
                      </label>
                    ))}
                  </div>
                  {errors.industries && <p className={errorStyle}><AlertCircle size={13} /> {errors.industries}</p>}
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

            {/* --- 4. ABOUT --- */}
            <div className="mb-10">
              <h3 className={sectionHeadingStyle}>
                <div className="w-10 h-10 rounded-full bg-[#EA9F24]/10 flex items-center justify-center mr-3">
                  <FileText className="w-5 h-5 text-[#EA9F24]" />
                </div>
                About the Investor / Firm
              </h3>
              <div className="space-y-6">
                <div>
                  <label className={labelStyle}>Short Description <span className="text-[#64748B] font-normal ml-1">(Optional)</span></label>
                  <textarea name="shortDescription" rows="2" className={`${inputStyle('shortDescription')} resize-none`} value={formData.shortDescription} onChange={handleChange} placeholder="Brief one-liner about your investment thesis..."></textarea>
                </div>
                <div>
                  <label className={labelStyle}>Full Description <span className="text-[#64748B] font-normal ml-1">(Optional)</span></label>
                  <textarea name="fullDescription" rows="4" className={`${inputStyle('fullDescription')} resize-none min-h-[120px]`} value={formData.fullDescription} onChange={handleChange} placeholder="Detailed description..."></textarea>
                </div>
              </div>
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
                  <><Send className="w-5 h-5 mr-2" /> Register as Investor</>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </main>
  );
}
