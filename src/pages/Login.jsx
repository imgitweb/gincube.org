import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import DASHBOARD_URL from "../common/Redirect";
import { toast } from "react-toastify";
import { Eye, EyeClosed, LogIn, AlertCircle, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const Base_URL = "https://gincube.incubationmasters.com/api";

  // Check if Firebase is already loaded
  const [firebaseLoaded, setFirebaseLoaded] = useState(false);

  // Initialize Firebase when component mounts
  useEffect(() => {
    // Load Firebase SDK if not already loaded
    if (!window.firebase && !document.getElementById("firebase-script")) {
      const script = document.createElement("script");
      script.id = "firebase-script";
      script.src =
        "https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js";
      script.async = true;
      script.onload = () => {
        // Load Firebase Auth after Firebase App is loaded
        const authScript = document.createElement("script");
        authScript.src =
          "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js";
        authScript.async = true;
        authScript.onload = () => {
          initializeFirebase();
          setFirebaseLoaded(true);
        };
        document.body.appendChild(authScript);
      };
      document.body.appendChild(script);
    } else if (window.firebase) {
      setFirebaseLoaded(true);
    }
  }, []);

  // Initialize Firebase
  const initializeFirebase = () => {
    // Firebase configuration
    const firebaseConfig = {
      apiKey: "AIzaSyCEP7dpX-WKCppIoU2F38UCtNEQIdhdyx8",
      authDomain: "im-global-inc.firebaseapp.com",
      projectId: "im-global-inc",
      storageBucket: "im-global-inc.firebasestorage.app",
      messagingSenderId: "333267157203",
      appId: "1:333267157203:web:fc393889393dd7040ed426",
      measurementId: "G-LPXWW7RKY8",
    };

    // Initialize Firebase if it hasn't been initialized yet
    if (!window.firebase.apps.length) {
      window.firebase.initializeApp(firebaseConfig);
    }
  };

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    // Clear any previous errors
    setError("");

    // Ensure email and password are not empty
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      setIsLoading(true); // Start loading spinner

      // Send POST request to the authentication API
      const response = await axios.post(
        `${Base_URL}/auth/login`,
        { email: email, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );
      console.log(response);

      // Handle successful response
      if (response.status === 200) {
        toast.success("Login Successful");
        const encodedToken = encodeURIComponent(response.data.token);
        window.location.href = `${DASHBOARD_URL}/dashboard?token=${encodedToken}`;
      } else {
        toast.error(`Error: ${response.data.message || "An error occurred"}`);
      }
    } catch (err) {
      // Enhanced error handling
      if (!navigator.onLine) {
        toast.error(
          "No internet connection. Please check your network and try again.",
        );
        setError(
          "No internet connection. Please check your network and try again.",
        );
      } else if (err.response) {
        toast.error(
          `Error: ${err.response.data.message || "An error occurred"}`,
        );
        console.error("Error response:", err.response);
        setError(
          err.response.data.message || "An error occurred. Please try again.",
        );
      } else if (err.request) {
        // Request was made but no response received
        toast.error("Unable to reach the server. Please try again later.");
        setError("Unable to reach the server. Please try again later.");
      } else {
        console.error("Error:", err);
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false); // Stop loading spinner
    }
  };

  // Google login function
  const handleGoogleLogin = async () => {
    if (!firebaseLoaded) {
      setMessage(
        "Error: Authentication service is still loading. Please wait a moment.",
      );
      return;
    }

    setLoading(true);

    try {
      // Create Google Auth Provider
      const provider = new window.firebase.auth.GoogleAuthProvider();

      // Sign in with popup
      const result = await window.firebase.auth().signInWithPopup(provider);

      // Get Google user info
      const user = result.user;

      // Get the full ID token
      const googleIdToken = await user.getIdToken(true);

      console.log("Google ID Token length:", googleIdToken.length);
      console.log("Token preview:", googleIdToken.substring(0, 20) + "...");

      // Create the request body
      const requestBody = {
        token: googleIdToken,
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
      };

      console.log(
        "Request body:",
        JSON.stringify(requestBody).length,
        "characters",
      );

      // Send the token to your backend to either sign in or create a new account
      const response = await fetch(`${Base_URL}/auth/google-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log("Response from server:", data);

      if (response.ok) {
        toast.success("Login Successful");
        const encodedToken = encodeURIComponent(data.token);
        window.location.href = `${DASHBOARD_URL}/dashboard?token=${encodedToken}`;
      } else {
        setMessage(`Error: ${data.message}`);
        toast.error(`Error: ${data.message || "An error occurred"}`);
      }
    } catch (error) {
      toast.error(
        `Failed to login with Google. ${error.message || "Please try again."}`,
      );
      if (error.code === "auth/popup-closed-by-user") {
        setMessage("Login canceled: You closed the Google login window.");
      } else if (error.code === "auth/popup-blocked") {
        setMessage(
          "Error: Pop-up was blocked by your browser. Please allow pop-ups for this site.",
        );
      } else {
        setMessage(
          `Failed to login with Google. ${error.message || "Please try again."}`,
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const isFormSubmitting = loading || isLoading;

  return (
    <div
      className="min-h-screen w-full flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-['Inter',sans-serif]"
      style={{
        backgroundImage: "url('https://risejhansi.in/rise_im/assets/img/bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Soft dark overlay for crystal clear contrast & identical vibe */}
      <div className="absolute inset-0 bg-black/35 pointer-events-none" />

      {/* Top Left: Back Button */}
      <div className="absolute top-6 left-6 z-20">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-white/90 hover:text-white bg-black/35 hover:bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/25 transition-all shadow-md cursor-pointer group active:scale-95"
          aria-label="Go back"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back</span>
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[360px] sm:max-w-[390px] relative z-10 text-center"
      >
        {/* IM+ Logo (identical to screenshot) */}
        <div className="flex items-center justify-center mb-1">
          <img
            src="https://risejhansi.in/rise_im/assets/img/logo.png"
            alt="im+"
            className="h-14 sm:h-16 w-auto object-contain brightness-0 invert drop-shadow-md"
            onError={(e) => {
              // Graceful fallback to styled im+ vector markup
              e.currentTarget.style.display = "none";
              const fallback = document.getElementById("im-text-fallback");
              if (fallback) fallback.style.display = "flex";
            }}
          />
          <div
            id="im-text-fallback"
            className="hidden items-baseline text-white select-none drop-shadow-md"
          >
            <span className="text-4xl sm:text-5xl font-black tracking-tight">im</span>
            <span className="text-3xl sm:text-4xl font-light text-white/75 ml-1">+</span>
          </div>
        </div>

        {/* Subtitle */}
        <h2 className="text-white text-base sm:text-lg font-medium tracking-normal mt-2 mb-8 text-center drop-shadow-sm">
          Let's get started
        </h2>

        {/* Error / Alert Notification Box */}
        {(message || error) && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-5 p-3 rounded-xl border text-xs font-semibold leading-relaxed text-left flex items-start gap-2 backdrop-blur-md ${(message && message.includes("Error")) || error
              ? "bg-rose-950/70 border-rose-400/50 text-rose-200"
              : "bg-amber-950/70 border-amber-400/50 text-amber-200"
              }`}
          >
            <AlertCircle size={15} className="shrink-0 mt-0.5" />
            <div>{error || message}</div>
          </motion.div>
        )}

        {/* Minimalist Underline Form (Same Layout) */}
        <form onSubmit={handleLogin} id="login-form" className="w-full">
          {/* User ID/Email */}
          <div className="relative mb-5 text-left">
            <input
              id="user-email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="User ID/Email"
              className="w-full bg-transparent border-0 border-b border-white/60 focus:border-white text-white placeholder:text-white/80 py-2.5 px-0 text-sm font-normal outline-none transition-colors"
            />
          </div>

          {/* Password */}
          <div className="relative mb-4 text-left">
            <input
              id="user-password"
              type={isVisible ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
              className="w-full bg-transparent border-0 border-b border-white/60 focus:border-white text-white placeholder:text-white/80 py-2.5 pr-8 pl-0 text-sm font-normal outline-none transition-colors"
            />
            <button
              type="button"
              onClick={() => setIsVisible(!isVisible)}
              aria-label={isVisible ? "Hide password" : "Show password"}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-white/70 hover:text-white cursor-pointer transition-colors p-1"
            >
              {isVisible ? <EyeClosed size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Sign In Button (Pill Blue Button) */}
          <div className="flex justify-center mt-6 mb-3">
            <button
              type="submit"
              name="UserSubmit"
              disabled={isFormSubmitting}
              className="inline-flex items-center justify-center gap-2 px-8 py-2 rounded-full bg-[#0d6efd] hover:bg-[#0b5ed7] text-white text-sm font-medium shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed transform active:scale-95"
            >
              {isFormSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <LogIn size={15} />
                  <span>Sign in</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Support Help Text */}
        <p className="text-xs text-white/85 text-center mt-3">
          Login trouble? Contact support team{" "}
          <a
            href="mailto:contact@gincube.org"
            className="underline hover:text-white font-medium transition-colors"
          >
            Mail Us
          </a>
        </p>
      </motion.div>
    </div>
  );
}
