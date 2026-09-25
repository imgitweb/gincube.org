import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  // useLocation hook hume current URL/path ki jankari deta hai
  const { pathname } = useLocation();

  useEffect(() => {
    // Jaise hi path change hoga, ye page ko (0, 0) yani ekdum top par scroll kar dega
    window.scrollTo(0, 0);
  }, [pathname]);

  // Ye component UI me kuch render nahi karega, sirf background me kaam karega
  return null; 
};

export default ScrollToTop;