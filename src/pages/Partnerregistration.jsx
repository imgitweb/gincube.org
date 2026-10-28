import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Building, User, Mail, Phone, MapPin, Send, Globe, FileText, Image as ImageIcon, Briefcase, AlertCircle } from 'lucide-react';
import API_URL from "../components/Config";
import locationData from '../data/locationdata.json';
import { usePopup } from '../context/PopupContext';

gsap.registerPlugin(ScrollTrigger);

export default function PartnerRegistration() {
  const { showError, showSuccess } = usePopup();

  const pageRef = useRef(null);
  const bannerTextRef = useRef(null);
  const formRef = useRef(null);
  const fileInputRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    firmName: '',
    contactName: '',
    email: '',
    mobile: '',
    designation: '',
    country: '',
    state: '',
    city: '',
    partnerType: '',
    industry: '',
    linkedinUrl: '',
    websiteUrl: '',
    description: '',
    image: null,
    bot_field: '' // Honeypot
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      setFormData(prev => ({ ...prev, image: e.target.files[0] }));
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

  const validateForm = () => {
    const newErrors = {};
    const errorList = [];

    // Firm Name
    if (!formData.firmName.trim()) {
      newErrors.firmName = 'Firm name is required';
      errorList.push('Name Of Firm / Organization is mandatory');
    } else if (formData.firmName.trim().length < 2) {
      newErrors.firmName = 'Must be at least 2 characters';
      errorList.push('Name Of Firm / Organization must have at least 2 characters');
    }

    // Contact Person Name
    if (!formData.contactName.trim()) {
      newErrors.contactName = 'Contact person name is required';
      errorList.push('Contact Person Name is mandatory');
    } else if (formData.contactName.trim().length < 2) {
      newErrors.contactName = 'Must be at least 2 characters';
      errorList.push('Contact Person Name must have at least 2 characters');
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Official email is required';
      errorList.push('Official Email Address is mandatory');
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Invalid email address';
      errorList.push('Please enter a valid Official Email Address');
    }

    // Mobile
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
      errorList.push('Mobile Number is mandatory');
    } else if (formData.mobile.trim().length !== 10) {
      newErrors.mobile = 'Must be a 10-digit number';
      errorList.push('Mobile Number must be exactly 10 digits');
    }

    // Partner Type
    if (!formData.partnerType) {
      newErrors.partnerType = 'Partner type is required';
      errorList.push('Partner Type / Category selection is mandatory');
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

    // Optional URLs validation
    if (formData.websiteUrl.trim()) {
      const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i;
      if (!urlPattern.test(formData.websiteUrl.trim())) {
        newErrors.websiteUrl = 'Invalid website URL';
        errorList.push('Website URL is invalid (e.g. https://yourorganization.com)');
      }
    }

    if (formData.linkedinUrl.trim()) {
      const urlPattern = /^(https?:\/\/)?(www\.)?linkedin\.com\/.*$/i;
      if (!urlPattern.test(formData.linkedinUrl.trim())) {
        newErrors.linkedinUrl = 'Invalid LinkedIn URL';
        errorList.push('LinkedIn URL must be a valid LinkedIn link');
      }
    }

    setErrors(newErrors);
    return { isValid: Object.keys(newErrors).length === 0, errorList };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.bot_field !== '') return; // Honeypot trap

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
    const nodeEndpoint = API_URL ? `${API_URL}/partners/register` : 'https://incubationmasters.com/api/partners/register';

    const nodePayload = new FormData();
    nodePayload.append('incubationId', incubationId);
    if (formData.image) nodePayload.append('image', formData.image);
    nodePayload.append('name', formData.contactName.trim());
    nodePayload.append('companyName', formData.firmName.trim());
    nodePayload.append('designation', formData.designation.trim());
    nodePayload.append('email', formData.email.trim());
    nodePayload.append('contactNumber', formData.mobile.trim());
    nodePayload.append('linkedinUrl', formData.linkedinUrl.trim());
    nodePayload.append('websiteUrl', formData.websiteUrl.trim());
    nodePayload.append('location', `${formData.city}, ${formData.state}, ${formData.country}`);
    nodePayload.append('industry', formData.industry.trim());
    nodePayload.append('description', formData.description.trim());
    
    const validTypes = ['Investor', 'Mentor', 'Legal'];
    const mappedNodePartnerType = validTypes.includes(formData.partnerType) ? formData.partnerType : 'Other';
    nodePayload.append('partnerType', mappedNodePartnerType);

    try {
      const response = await fetch(nodeEndpoint, { method: 'POST', body: nodePayload });

      if (response.ok) {
        showSuccess({
          title: "Partner Registration Successful!",
          message: "Thank you for registering as a Partner with Gincube. Our partnerships team will review your proposal and get in touch with you shortly."
        });
        setFormData({
          firmName: '', contactName: '', email: '', mobile: '',
          designation: '', country: '', state: '', city: '',
          partnerType: '', industry: '', linkedinUrl: '',
          websiteUrl: '', description: '', image: null, bot_field: ''
        });
        setErrors({});
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        const errData = await response.json().catch(() => ({}));
        showError({
          title: "Registration Failed",
          message: errData.message || "Failed to register partner. Please check your inputs and try again."
        });
      }
    } catch (err) {
      console.error("API Error:", err);
      showError({
        title: "Network Error",
        message: "Network error occurred while connecting to server. Please try again."
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
            Collaborate For Impact
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-4 sm:mb-6 leading-tight">
            Partner <span className="text-[#EA9F24]">Registration</span>
          </h1>
          <p className="text-[#D0E2F2] text-base sm:text-lg font-medium max-w-2xl mx-auto leading-relaxed">
            Partner with us to nurture entrepreneurship, mentor innovators, and drive ecosystem growth in G.Incube.
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
                  <Building className="w-5 h-5 text-[#EA9F24]" />
                </div>
                Firm & Contact Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelStyle}>Name Of Firm / Organization <span className="text-[#EF4444] ml-1">*</span></label>
                  <input type="text" name="firmName" className={inputStyle('firmName')} value={formData.firmName} onChange={handleChange} placeholder="Company / Institution Name" />
                  {errors.firmName && <p className={errorStyle}><AlertCircle size={13} /> {errors.firmName}</p>}
                </div>
                <div>
                  <label className={labelStyle}>Contact Person Name <span className="text-[#EF4444] ml-1">*</span></label>
                  <input type="text" name="contactName" className={inputStyle('contactName')} value={formData.contactName} onChange={handleChange} placeholder="Full Name" />
                  {errors.contactName && <p className={errorStyle}><AlertCircle size={13} /> {errors.contactName}</p>}
                </div>
                <div>
                  <label className={labelStyle}><Mail className="w-4 h-4 mr-1.5 text-[#15436B]"/> Official Email <span className="text-[#EF4444] ml-1">*</span></label>
                  <input type="email" name="email" className={inputStyle('email')} value={formData.email} onChange={handleChange} placeholder="email@organization.com" />
                  {errors.email && <p className={errorStyle}><AlertCircle size={13} /> {errors.email}</p>}
                </div>
                <div>
                  <label className={labelStyle}><Phone className="w-4 h-4 mr-1.5 text-[#15436B]"/> Mobile Number <span className="text-[#EF4444] ml-1">*</span></label>
                  <input type="tel" name="mobile" className={inputStyle('mobile')} value={formData.mobile} onChange={handleChange} placeholder="10-digit number" maxLength="10" />
                  {errors.mobile && <p className={errorStyle}><AlertCircle size={13} /> {errors.mobile}</p>}
                </div>
                <div>
                  <label className={labelStyle}>Designation <span className="text-[#64748B] font-normal ml-1">(Optional)</span></label>
                  <input type="text" name="designation" className={inputStyle('designation')} value={formData.designation} onChange={handleChange} placeholder="Your Role / Title" />
                </div>
                <div>
                  <label className={labelStyle}><ImageIcon className="w-4 h-4 mr-1.5 text-[#15436B]" /> Firm Logo / Image <span className="text-[#64748B] font-normal ml-1">(Optional)</span></label>
                  <input ref={fileInputRef} type="file" accept="image/*" className={`${inputStyle('image')} bg-white py-[11px] cursor-pointer`} onChange={handleFileChange} />
                </div>
              </div>
            </div>

            {/* --- 2. PARTNERSHIP DETAILS --- */}
            <div className="mb-12">
              <h3 className={sectionHeadingStyle}>
                <div className="w-10 h-10 rounded-full bg-[#EA9F24]/10 flex items-center justify-center mr-3">
                  <Briefcase className="w-5 h-5 text-[#EA9F24]" />
                </div>
                Partnership Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelStyle}>Partner Type / Category <span className="text-[#EF4444] ml-1">*</span></label>
                  <select name="partnerType" className={inputStyle('partnerType')} value={formData.partnerType} onChange={handleChange}>
                    <option value="" disabled>Select Type</option>
                    <option value="Corporate">Corporate / Industry</option>
                    <option value="Academic Institution">Academic Institution</option>
                    <option value="Government Body">Government Body</option>
                    <option value="NGO">NGO / Non-Profit</option>
                    <option value="Investor">Investor Network</option>
                    <option value="Legal">Legal Advisor</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.partnerType && <p className={errorStyle}><AlertCircle size={13} /> {errors.partnerType}</p>}
                </div>
                <div>
                  <label className={labelStyle}>Industry / Sector <span className="text-[#64748B] font-normal ml-1">(Optional)</span></label>
                  <input type="text" name="industry" className={inputStyle('industry')} value={formData.industry} onChange={handleChange} placeholder="e.g. EdTech, Finance, Healthcare" />
                </div>
                <div>
                  <label className={labelStyle}><Globe className="w-4 h-4 mr-1.5 text-[#15436B]" /> Website URL <span className="text-[#64748B] font-normal ml-1">(Optional)</span></label>
                  <input type="url" name="websiteUrl" className={inputStyle('websiteUrl')} value={formData.websiteUrl} onChange={handleChange} placeholder="https://..." />
                  {errors.websiteUrl && <p className={errorStyle}><AlertCircle size={13} /> {errors.websiteUrl}</p>}
                </div>
                <div>
                  <label className={labelStyle}>LinkedIn URL <span className="text-[#64748B] font-normal ml-1">(Optional)</span></label>
                  <input type="url" name="linkedinUrl" className={inputStyle('linkedinUrl')} value={formData.linkedinUrl} onChange={handleChange} placeholder="https://linkedin.com/company/..." />
                  {errors.linkedinUrl && <p className={errorStyle}><AlertCircle size={13} /> {errors.linkedinUrl}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className={labelStyle}><FileText className="w-4 h-4 mr-1.5 text-[#15436B]" /> Partnership Proposal / Description <span className="text-[#64748B] font-normal ml-1">(Optional)</span></label>
                  <textarea name="description" rows="3" className={`${inputStyle('description')} resize-none min-h-[120px]`} value={formData.description} onChange={handleChange} placeholder="How would you like to collaborate with us?"></textarea>
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

            {/* --- 4. SUBMIT BUTTON --- */}
            <div className="mt-10 text-center">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="inline-flex items-center justify-center px-10 py-4 bg-gradient-to-r from-[#EA9F24] to-[#D68A1B] hover:from-[#D68A1B] hover:to-[#B47012] text-white font-extrabold rounded-full text-base sm:text-lg shadow-lg shadow-[#EA9F24]/30 hover:shadow-xl hover:shadow-[#EA9F24]/40 transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0 w-full sm:w-auto cursor-pointer"
              >
                {isSubmitting ? (
                  <><span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2.5"></span> Processing...</>
                ) : (
                  <><Send className="w-5 h-5 mr-2" /> Register as Partner</>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </main>
  );
}
