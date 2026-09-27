import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FeaturesTab from "./components/Featurestab";
import Leadership from "./components/Leadership";
import StatsAndCTA from "./components/Statsandcta";
import WhoWeAre from "./components/Whoweare";
import Services from "./components/Services";
import GWEDCPage from "./components/GWEDCpage";
import ContactPage from "./components/Contactpage";
import Footer from "./components/Footer";
import ScrollToTop from "./components/Scrolltotop";
import StartupRegistration from "./pages/Startupregistration";
import MentorRegistration from "./pages/Mentorregistration";
import InvestorRegistration from "./pages/Investorregistration";
import PartnerRegistration from "./pages/Partnerregistration";
import Privacy from "./components/Privacy";
import TermsAndConditions from "./components/Termsconditions";
import NewsEvents from "./components/Newsevents"
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// 👇 Import your Chatbot component here (adjust the path if needed)
import Chatbot from "./components/Chatbot";

function Home() {
  return (
    <>
      <Hero />
      <FeaturesTab />
      <Leadership />
      <StatsAndCTA />
    </>
  );
}

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname.toLowerCase() === "/login";

  return (
    <div className="flex flex-col min-h-screen bg-white text-[#334155] font-sans selection:bg-[#EA9F24] selection:text-white overflow-x-hidden">
      {!isLoginPage && <Navbar />}

      {!isLoginPage && <ScrollToTop />}
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/who-we-are" element={<WhoWeAre />} />
          <Route path="/Services" element={<Services />} />
          <Route path="/GWEDC" element={<GWEDCPage />} />
          <Route path="/contact-us" element={<ContactPage />} />
          <Route path="/startup-registration" element={<StartupRegistration />} />
          <Route path="/mentor-registration" element={<MentorRegistration />} />
          <Route path="/investor-registration" element={<InvestorRegistration />} />
          <Route path="/partner-registration" element={<PartnerRegistration />} />
          <Route path="/privacy-policy" element={<Privacy />} />
          <Route path="/terms-conditions" element={<TermsAndConditions />} />
          <Route path="/news-event" element={<NewsEvents />} />
          <Route path="/events" element={<NewsEvents />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>

      {/* Toast Notification Container */}
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      {/* Floating Assistant Widget */}
      {!isLoginPage && <Chatbot />}

      {/* Footer */}
      {!isLoginPage && <Footer />}
    </div>
  );
}

export default App;