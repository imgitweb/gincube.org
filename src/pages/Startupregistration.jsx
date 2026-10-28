import React, { useState } from 'react';
import { User, Mail, Phone, Building, MapPin, Target, Send, Globe, AlertCircle } from 'lucide-react';
import API_URL from '../components/Config';
import locationData from '../data/locationdata.json'; 
import { usePopup } from '../context/PopupContext';

export default function StartupRegistration() {
    const { showError, showSuccess } = usePopup();

    const [formData, setFormData] = useState({
        // Founder Details
        firstName: '',
        lastName: '',
        email: '',
        mobile: '',
        
        // Startup Details
        startupName: '',
        website: '',
        dpiit: '',
        stage: '',
        sectors: '',
        revenueStarted: 'false',
        
        // Location 
        country: '',
        state: '',
        city: '',
        
        // Pitches
        summary: '', // Elevator Pitch
        problemStatement: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Dynamic lists from JSON
    const countriesList = locationData?.countries || [];
    const indiaStates = locationData?.indiaData ? Object.keys(locationData.indiaData) : [];
    const availableCities = (formData.country === 'India' && formData.state && locationData?.indiaData[formData.state]) 
        ? locationData.indiaData[formData.state] 
        : [];

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'mobile') {
            const onlyNums = value.replace(/[^0-9]/g, '');
            setFormData({ ...formData, [name]: onlyNums });
        } else {
            setFormData({ ...formData, [name]: value });
        }
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleCountryChange = (e) => {
        const value = e.target.value;
        setFormData({ ...formData, country: value, state: '', city: '' });
        if (errors.country) setErrors(prev => ({ ...prev, country: null }));
    };

    const handleStateChange = (e) => {
        const value = e.target.value;
        setFormData({ ...formData, state: value, city: '' });
        if (errors.state) setErrors(prev => ({ ...prev, state: null }));
    };

    const validateForm = () => {
        const newErrors = {};
        const errorList = [];

        // 1. Founder Details
        if (!formData.firstName.trim()) {
            newErrors.firstName = "First name is required";
            errorList.push("Founder First Name is required");
        } else if (formData.firstName.trim().length < 2) {
            newErrors.firstName = "Must be at least 2 characters";
            errorList.push("Founder First Name must have at least 2 characters");
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = "Last name is required";
            errorList.push("Founder Last Name is required");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
            errorList.push("Founder Email Address is required");
        } else if (!emailRegex.test(formData.email.trim())) {
            newErrors.email = "Invalid email address";
            errorList.push("Please enter a valid Email Address");
        }

        if (!formData.mobile.trim()) {
            newErrors.mobile = "Mobile number is required";
            errorList.push("Mobile Number is required");
        } else if (formData.mobile.trim().length !== 10) {
            newErrors.mobile = "Must be a valid 10-digit number";
            errorList.push("Mobile Number must be exactly 10 digits");
        }

        // 2. Startup Details
        if (!formData.startupName.trim()) {
            newErrors.startupName = "Startup name is required";
            errorList.push("Startup Name is required");
        }

        if (formData.website.trim()) {
            const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
            if (!urlPattern.test(formData.website.trim())) {
                newErrors.website = "Invalid website URL format";
                errorList.push("Website URL format is invalid (e.g., https://yourstartup.com)");
            }
        }

        if (!formData.stage) {
            newErrors.stage = "Please select startup stage";
            errorList.push("Startup Stage selection is mandatory");
        }

        if (!formData.sectors) {
            newErrors.sectors = "Please select industry / sector";
            errorList.push("Industry / Sector selection is mandatory");
        }

        if (!formData.revenueStarted) {
            newErrors.revenueStarted = "Please select revenue status";
            errorList.push("Revenue Status selection is mandatory");
        }

        // 3. Location
        if (!formData.country) {
            newErrors.country = "Country is required";
            errorList.push("Country selection is mandatory");
        }

        if (!formData.state) {
            newErrors.state = "State is required";
            errorList.push("State is mandatory");
        }

        if (!formData.city) {
            newErrors.city = "City is required";
            errorList.push("City is mandatory");
        }

        // 4. Pitches
        if (!formData.problemStatement.trim()) {
            newErrors.problemStatement = "Problem statement is required";
            errorList.push("Problem Statement is mandatory");
        } else if (formData.problemStatement.trim().length < 10) {
            newErrors.problemStatement = "Must be at least 10 characters";
            errorList.push("Problem Statement must contain at least 10 characters");
        }

        if (!formData.summary.trim()) {
            newErrors.summary = "Elevator pitch / summary is required";
            errorList.push("Product / Service (Elevator Pitch) is mandatory");
        } else if (formData.summary.trim().length < 10) {
            newErrors.summary = "Must be at least 10 characters";
            errorList.push("Elevator Pitch must contain at least 10 characters");
        }

        setErrors(newErrors);
        return { isValid: Object.keys(newErrors).length === 0, errorList };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { isValid, errorList } = validateForm();
        if (!isValid) {
            showError({
                title: "Validation Error",
                message: "Please correct the following mandatory field(s):",
                errors: errorList
            });
            window.scrollTo({ top: 120, behavior: "smooth" });
            return;
        }

        setIsSubmitting(true);

        const payload = {
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            email: formData.email.trim(),
            password: formData.mobile.trim(),
            startupName: formData.startupName.trim(),
            selectedPlan: "sigma", // Default
            country: formData.country,
            state: formData.state,
            city: formData.city,
            industry: formData.sectors,
            startupStage: formData.stage,
            dpiitNo: formData.dpiit.trim(),
            website: formData.website.trim(),
            contactNumber: formData.mobile.trim(),
            elevatorPitch: formData.summary.trim(),
            problemStatement: formData.problemStatement.trim(),
            revenueStarted: formData.revenueStarted === 'true',
            incubationId: "6ab39542497aa33526fcd95b",
            currency: "INR",
            language: "English",
        };

        try {
            const baseApi = API_URL ? API_URL.replace(/\/incubation\/?$/, '') : 'http://localhost:5000/api';
            const response = await fetch(`${baseApi}/startups`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                showSuccess({
                    title: "Startup Registered Successfully!",
                    message: "Congratulations! Your startup profile has been submitted to Gincube. Our incubation team will review your application and contact you soon."
                });
                setFormData({
                    firstName: '', lastName: '', email: '', mobile: '',
                    startupName: '', website: '', dpiit: '', stage: '', sectors: '', revenueStarted: 'false',
                    country: '', state: '', city: '', problemStatement: '', summary: ''
                });
                setErrors({});
            } else {
                const errorData = await response.json().catch(() => ({}));
                showError({
                    title: "Registration Failed",
                    message: errorData.message || "Failed to submit startup details. Please review your inputs and try again."
                });
            }
        } catch (error) {
            console.error("API Error:", error);
            showError({
                title: "Network Error",
                message: "Unable to connect to the server. Please verify your internet connection and try again."
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // UI HELPER CLASSES (Navy Blue & Yellow Theme)
    const inputStyle = (fieldName) => `w-full px-[16px] py-[14px] rounded-[12px] border-2 ${errors[fieldName] ? 'border-[#EF4444] bg-red-50/20 focus:border-[#EF4444]' : 'border-[#E2E8F0] bg-[#F8FAFC] focus:bg-white focus:border-[#EA9F24]'} focus:ring-4 focus:ring-[#EA9F24]/15 outline-none transition-all text-[#0A2236] text-[0.95rem] font-medium`;
    const labelStyle = "flex items-center text-[0.95rem] font-bold text-[#0A2236] mb-2";
    const sectionHeadingStyle = "text-[1.4rem] font-extrabold text-[#0A2236] mb-6 flex items-center border-b-2 border-[#F0F6FB] pb-3";
    const errorTextStyle = "text-[#EF4444] text-xs font-semibold mt-1.5 flex items-center gap-1";

    return (
        <main className="min-h-screen bg-[#F8FAFC] font-['Inter',sans-serif] pb-24">
            
            {/* ================= TOP BANNER ================= */}
            <div className="w-full bg-gradient-to-br from-[#0A2236] via-[#15436B] to-[#1C5A8F] pt-28 pb-20 sm:pt-32 sm:pb-24 relative overflow-hidden shadow-inner">
                <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[60%] rounded-full bg-[#EA9F24]/20 blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[60%] rounded-full bg-[#287BBE]/30 blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
                
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-[#EA9F24]/10 border border-[#EA9F24]/30 text-[#EA9F24] font-bold text-xs sm:text-sm mb-4 sm:mb-6 backdrop-blur-sm shadow-sm">
                        Join G.Incube Ecosystem
                    </div>
                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-4 sm:mb-6 leading-tight">
                        Startup <span className="text-[#EA9F24]">Registration</span>
                    </h1>
                    <p className="text-[#D0E2F2] text-base sm:text-lg font-medium max-w-2xl mx-auto leading-relaxed">
                        Turn your vision into reality! Get access to mentorship, funding, and a thriving startup ecosystem.
                    </p>
                </div>
            </div>

            {/* ================= FORM CONTAINER ================= */}
            <div className="max-w-[1000px] mx-auto px-4 sm:px-6 -mt-10 sm:-mt-12 relative z-20">
                <div className="bg-white shadow-[0_20px_60px_rgba(21,67,107,0.08)] rounded-3xl p-5 sm:p-8 md:p-12 border border-[#E2E8F0] border-t-[6px] border-t-[#EA9F24]">
                    <form onSubmit={handleSubmit} noValidate>
                        
                        {/* --- 1. FOUNDER DETAILS --- */}
                        <div className="mb-12">
                            <h3 className={sectionHeadingStyle}>
                                <div className="w-10 h-10 rounded-full bg-[#EA9F24]/10 flex items-center justify-center mr-3">
                                    <User className="w-5 h-5 text-[#EA9F24]" />
                                </div>
                                Founder Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className={labelStyle}>First Name <span className="text-[#EF4444] ml-1">*</span></label>
                                    <input type="text" className={inputStyle('firstName')} placeholder="First Name" name="firstName" value={formData.firstName} onChange={handleChange} />
                                    {errors.firstName && <p className={errorTextStyle}><AlertCircle size={13} /> {errors.firstName}</p>}
                                </div>
                                <div>
                                    <label className={labelStyle}>Last Name <span className="text-[#EF4444] ml-1">*</span></label>
                                    <input type="text" className={inputStyle('lastName')} placeholder="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
                                    {errors.lastName && <p className={errorTextStyle}><AlertCircle size={13} /> {errors.lastName}</p>}
                                </div>
                                <div>
                                    <label className={labelStyle}><Mail className="w-4 h-4 mr-1.5 text-[#15436B]" /> Email Address <span className="text-[#EF4444] ml-1">*</span></label>
                                    <input type="email" className={inputStyle('email')} placeholder="Founder Email" name="email" value={formData.email} onChange={handleChange} />
                                    {errors.email && <p className={errorTextStyle}><AlertCircle size={13} /> {errors.email}</p>}
                                </div>
                                <div>
                                    <label className={labelStyle}><Phone className="w-4 h-4 mr-1.5 text-[#15436B]" /> Mobile Number <span className="text-[#EF4444] ml-1">*</span></label>
                                    <input type="tel" className={inputStyle('mobile')} placeholder="10-digit Mobile" name="mobile" value={formData.mobile} onChange={handleChange} maxLength="10" />
                                    {errors.mobile && <p className={errorTextStyle}><AlertCircle size={13} /> {errors.mobile}</p>}
                                </div>
                            </div>
                        </div>

                        {/* --- 2. STARTUP DETAILS --- */}
                        <div className="mb-12">
                            <h3 className={sectionHeadingStyle}>
                                <div className="w-10 h-10 rounded-full bg-[#EA9F24]/10 flex items-center justify-center mr-3">
                                    <Building className="w-5 h-5 text-[#EA9F24]" />
                                </div>
                                Startup Profile
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className={labelStyle}>Startup Name <span className="text-[#EF4444] ml-1">*</span></label>
                                    <input type="text" className={inputStyle('startupName')} placeholder="Your Startup Name" name="startupName" value={formData.startupName} onChange={handleChange} />
                                    {errors.startupName && <p className={errorTextStyle}><AlertCircle size={13} /> {errors.startupName}</p>}
                                </div>
                                <div>
                                    <label className={labelStyle}><Globe className="w-4 h-4 mr-1.5 text-[#15436B]" /> Website URL <span className="text-[#64748B] font-normal ml-1">(Optional)</span></label>
                                    <input type="url" className={inputStyle('website')} placeholder="https://yourstartup.com" name="website" value={formData.website} onChange={handleChange} />
                                    {errors.website && <p className={errorTextStyle}><AlertCircle size={13} /> {errors.website}</p>}
                                </div>
                                <div>
                                    <label className={labelStyle}>Startup Stage <span className="text-[#EF4444] ml-1">*</span></label>
                                    <select name="stage" className={inputStyle('stage')} value={formData.stage} onChange={handleChange}>
                                        <option value="" disabled>Select Stage</option>
                                        <option value="Ideation">Ideation</option>
                                        <option value="Validation">Validation</option>
                                        <option value="First Traction">First Traction</option>
                                        <option value="Early Traction">Early Traction</option>
                                        <option value="Product-Market Fit">Product-Market Fit</option>
                                        <option value="Growth">Growth</option>
                                    </select>
                                    {errors.stage && <p className={errorTextStyle}><AlertCircle size={13} /> {errors.stage}</p>}
                                </div>
                                <div>
                                    <label className={labelStyle}>Industry / Sector <span className="text-[#EF4444] ml-1">*</span></label>
                                    <select name="sectors" className={inputStyle('sectors')} value={formData.sectors} onChange={handleChange}>
                                        <option value="" disabled>Select Industry</option>
                                        <option value="EdTech">EdTech</option>
                                        <option value="Healthcare">Healthcare</option>
                                        <option value="Agriculture">Agriculture</option>
                                        <option value="Information Technology">Information Technology</option>
                                        <option value="E-Commerce">E-Commerce</option>
                                        <option value="FinTech">FinTech</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    {errors.sectors && <p className={errorTextStyle}><AlertCircle size={13} /> {errors.sectors}</p>}
                                </div>
                                <div>
                                    <label className={labelStyle}>DPIIT Number <span className="text-[#64748B] font-normal ml-1">(Optional)</span></label>
                                    <input type="text" className={inputStyle('dpiit')} placeholder="DPIIT Registration No." name="dpiit" value={formData.dpiit} onChange={handleChange} />
                                </div>
                                <div>
                                    <label className={labelStyle}>Revenue Started? <span className="text-[#EF4444] ml-1">*</span></label>
                                    <select name="revenueStarted" className={inputStyle('revenueStarted')} value={formData.revenueStarted} onChange={handleChange}>
                                        <option value="false">No, pre-revenue</option>
                                        <option value="true">Yes, generating revenue</option>
                                    </select>
                                    {errors.revenueStarted && <p className={errorTextStyle}><AlertCircle size={13} /> {errors.revenueStarted}</p>}
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
                                        {countriesList.map((c, idx) => (
                                            <option key={idx} value={c}>{c}</option>
                                        ))}
                                    </select>
                                    {errors.country && <p className={errorTextStyle}><AlertCircle size={13} /> {errors.country}</p>}
                                </div>
                                <div>
                                    <label className={labelStyle}>State <span className="text-[#EF4444] ml-1">*</span></label>
                                    {formData.country === 'India' ? (
                                        <select name="state" className={inputStyle('state')} value={formData.state} onChange={handleStateChange}>
                                            <option value="" disabled>Select State</option>
                                            {indiaStates.map((s, idx) => (
                                                <option key={idx} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input type="text" name="state" placeholder="Enter State" value={formData.state} onChange={handleChange} className={inputStyle('state')} disabled={!formData.country} />
                                    )}
                                    {errors.state && <p className={errorTextStyle}><AlertCircle size={13} /> {errors.state}</p>}
                                </div>
                                <div>
                                    <label className={labelStyle}>City <span className="text-[#EF4444] ml-1">*</span></label>
                                    {formData.country === 'India' && availableCities.length > 0 ? (
                                        <select name="city" className={inputStyle('city')} value={formData.city} onChange={handleChange}>
                                            <option value="" disabled>Select City</option>
                                            {availableCities.map((c, idx) => (
                                                <option key={idx} value={c}>{c}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input type="text" name="city" placeholder="Enter City" value={formData.city} onChange={handleChange} className={inputStyle('city')} disabled={!formData.state} />
                                    )}
                                    {errors.city && <p className={errorTextStyle}><AlertCircle size={13} /> {errors.city}</p>}
                                </div>
                            </div>
                        </div>

                        {/* --- 4. BUSINESS PROPOSAL --- */}
                        <div className="mb-10">
                            <h3 className={sectionHeadingStyle}>
                                <div className="w-10 h-10 rounded-full bg-[#EA9F24]/10 flex items-center justify-center mr-3">
                                    <Target className="w-5 h-5 text-[#EA9F24]" />
                                </div>
                                Business Proposal
                            </h3>
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className={labelStyle}>Problem Statement <span className="text-[#EF4444] ml-1">*</span></label>
                                    <textarea rows="3" className={`${inputStyle('problemStatement')} resize-none`} name="problemStatement" placeholder="What specific problem does your startup solve?" value={formData.problemStatement} onChange={handleChange}></textarea>
                                    {errors.problemStatement && <p className={errorTextStyle}><AlertCircle size={13} /> {errors.problemStatement}</p>}
                                </div>
                                <div>
                                    <label className={labelStyle}>Product / Service (Elevator Pitch) <span className="text-[#EF4444] ml-1">*</span></label>
                                    <textarea rows="4" className={`${inputStyle('summary')} resize-none`} name="summary" placeholder="Describe your product/service and how it solves the problem..." value={formData.summary} onChange={handleChange}></textarea>
                                    {errors.summary && <p className={errorTextStyle}><AlertCircle size={13} /> {errors.summary}</p>}
                                </div>
                            </div>
                        </div>

                        {/* --- 5. SUBMIT --- */}
                        <div className="mt-10 text-center">
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="inline-flex items-center justify-center px-10 py-4 bg-gradient-to-r from-[#EA9F24] to-[#D68A1B] hover:from-[#D68A1B] hover:to-[#B47012] text-white font-extrabold rounded-full text-base sm:text-lg shadow-lg shadow-[#EA9F24]/30 hover:shadow-xl hover:shadow-[#EA9F24]/40 transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0 w-full sm:w-auto cursor-pointer"
                            >
                                {isSubmitting ? (
                                    <><span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2.5"></span> Processing...</>
                                ) : (
                                    <><Send className="w-5 h-5 mr-2" /> Submit Registration</>
                                )}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </main>
    );
}
