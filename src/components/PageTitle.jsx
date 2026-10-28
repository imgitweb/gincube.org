import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const routeTitles = {
  "/": "Gincube | Gwalior Smart City Incubation Center",
  "/who-we-are": "Who We Are | Gincube",
  "/services": "Our Services | Gincube",
  "/gwedc": "GWEDC - Women Entrepreneur Cell | Gincube",
  "/contact-us": "Contact Us | Gincube",
  "/startup-registration": "Startup Registration | Gincube",
  "/mentor-registration": "Mentor Registration | Gincube",
  "/investor-registration": "Investor Registration | Gincube",
  "/partner-registration": "Partner Registration | Gincube",
  "/news-event": "News & Events | Gincube",
  "/events": "News & Events | Gincube",
  "/login": "Sign In | Gincube",
  "/privacy-policy": "Privacy Policy | Gincube",
  "/terms-conditions": "Terms & Conditions | Gincube",
};

export default function PageTitle() {
  const location = useLocation();

  useEffect(() => {
    const pathname = location.pathname.toLowerCase();
    const title = routeTitles[pathname] || "Gincube | Gwalior Smart City Incubation Center";
    document.title = title;
  }, [location.pathname]);

  return null;
}
