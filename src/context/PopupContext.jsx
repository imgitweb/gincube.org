import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle2, HelpCircle, X, AlertTriangle } from "lucide-react";

const PopupContext = createContext(null);

export function PopupProvider({ children }) {
  const [popup, setPopup] = useState({
    isOpen: false,
    type: "info", // "error" | "success" | "confirm" | "warning" | "info"
    title: "",
    message: "",
    errors: [], // Array of validation error strings
    confirmText: "OK",
    cancelText: "Cancel",
    onConfirm: null,
    onCancel: null,
  });

  const closePopup = useCallback(() => {
    setPopup((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const showError = useCallback(({ title = "Validation Error", message = "", errors = [], confirmText = "Understood", onConfirm = null } = {}) => {
    // Also accept string directly: showError("Title", "Message")
    if (typeof arguments[0] === "string") {
      setPopup({
        isOpen: true,
        type: "error",
        title: arguments[0],
        message: arguments[1] || "",
        errors: Array.isArray(arguments[2]) ? arguments[2] : [],
        confirmText: "Understood",
        cancelText: "Cancel",
        onConfirm: null,
        onCancel: null,
      });
      return;
    }

    setPopup({
      isOpen: true,
      type: "error",
      title,
      message,
      errors: Array.isArray(errors) ? errors : errors ? [String(errors)] : [],
      confirmText,
      cancelText: "Cancel",
      onConfirm,
      onCancel: null,
    });
  }, []);

  const showSuccess = useCallback(({ title = "Success!", message = "", confirmText = "Continue", onConfirm = null } = {}) => {
    if (typeof arguments[0] === "string") {
      setPopup({
        isOpen: true,
        type: "success",
        title: arguments[0],
        message: arguments[1] || "",
        errors: [],
        confirmText: "Continue",
        cancelText: "Cancel",
        onConfirm: null,
        onCancel: null,
      });
      return;
    }

    setPopup({
      isOpen: true,
      type: "success",
      title,
      message,
      errors: [],
      confirmText,
      cancelText: "Cancel",
      onConfirm,
      onCancel: null,
    });
  }, []);

  const showConfirm = useCallback(({
    title = "Please Confirm",
    message = "Are you sure you want to proceed?",
    confirmText = "Yes, Proceed",
    cancelText = "Cancel",
    onConfirm = null,
    onCancel = null,
  } = {}) => {
    setPopup({
      isOpen: true,
      type: "confirm",
      title,
      message,
      errors: [],
      confirmText,
      cancelText,
      onConfirm,
      onCancel,
    });
  }, []);

  // Keyboard handler for Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && popup.isOpen) {
        if (popup.type === "confirm" && popup.onCancel) {
          popup.onCancel();
        }
        closePopup();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [popup.isOpen, popup.type, popup.onCancel, closePopup]);

  const handleConfirmClick = () => {
    const callback = popup.onConfirm;
    closePopup();
    if (typeof callback === "function") {
      callback();
    }
  };

  const handleCancelClick = () => {
    const callback = popup.onCancel;
    closePopup();
    if (typeof callback === "function") {
      callback();
    }
  };

  return (
    <PopupContext.Provider value={{ showError, showSuccess, showConfirm, closePopup }}>
      {children}

      {/* Custom Popup Modal */}
      <AnimatePresence>
        {popup.isOpen && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => {
                if (popup.type !== "confirm") closePopup();
              }}
              className="fixed inset-0 bg-[#0A2236]/65 backdrop-blur-sm"
              aria-hidden="true"
            />

            {/* Modal Dialog */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl shadow-[#0A2236]/30 border border-slate-100 p-6 sm:p-8 overflow-hidden z-10 my-8 text-center"
            >
              {/* Top Accent Strip */}
              <div
                className={`absolute top-0 left-0 right-0 h-2 ${
                  popup.type === "error"
                    ? "bg-gradient-to-r from-rose-500 via-red-500 to-rose-600"
                    : popup.type === "success"
                    ? "bg-gradient-to-r from-[#EA9F24] via-emerald-500 to-[#15436B]"
                    : popup.type === "confirm"
                    ? "bg-gradient-to-r from-[#15436B] to-[#EA9F24]"
                    : "bg-[#EA9F24]"
                }`}
              />

              {/* Close Button */}
              <button
                type="button"
                onClick={closePopup}
                aria-label="Close dialog"
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              {/* Icon Badge */}
              <div className="flex justify-center mb-4 pt-2">
                {popup.type === "error" && (
                  <div className="w-16 h-16 rounded-full bg-rose-50 border-2 border-rose-200 flex items-center justify-center text-rose-600 shadow-sm shadow-rose-100 animate-bounce">
                    <AlertTriangle size={32} />
                  </div>
                )}
                {popup.type === "success" && (
                  <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center text-emerald-600 shadow-sm shadow-emerald-100">
                    <CheckCircle2 size={34} />
                  </div>
                )}
                {popup.type === "confirm" && (
                  <div className="w-16 h-16 rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center text-[#EA9F24] shadow-sm shadow-amber-100">
                    <HelpCircle size={34} />
                  </div>
                )}
                {(popup.type === "warning" || popup.type === "info") && (
                  <div className="w-16 h-16 rounded-full bg-sky-50 border-2 border-sky-200 flex items-center justify-center text-[#15436B] shadow-sm">
                    <AlertCircle size={34} />
                  </div>
                )}
              </div>

              {/* Title */}
              <h3
                id="modal-title"
                className="text-xl sm:text-2xl font-extrabold text-[#0A2236] tracking-tight mb-2"
              >
                {popup.title}
              </h3>

              {/* Message */}
              {popup.message && (
                <p className="text-slate-600 text-sm sm:text-base font-medium leading-relaxed mb-4">
                  {popup.message}
                </p>
              )}

              {/* Validation Errors List (if any) */}
              {popup.errors && popup.errors.length > 0 && (
                <div className="mb-6 mt-3 text-left">
                  <div className="text-xs font-bold uppercase tracking-wider text-rose-700 mb-2 px-1">
                    Please correct the following:
                  </div>
                  <div className="bg-rose-50/80 border border-rose-200/80 rounded-2xl p-4 max-h-56 overflow-y-auto space-y-2">
                    {popup.errors.map((err, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-rose-900 font-medium">
                        <AlertCircle size={16} className="text-rose-500 shrink-0 mt-0.5" />
                        <span className="leading-snug">{err}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="mt-6 flex flex-col-reverse sm:flex-row items-center justify-center gap-3">
                {popup.type === "confirm" && (
                  <button
                    type="button"
                    onClick={handleCancelClick}
                    className="w-full sm:w-auto px-6 py-3 rounded-full border-2 border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-sm sm:text-base transition-colors cursor-pointer"
                  >
                    {popup.cancelText}
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleConfirmClick}
                  className={`w-full sm:w-auto px-8 py-3 rounded-full font-extrabold text-white text-sm sm:text-base shadow-lg transition-all cursor-pointer transform active:scale-95 ${
                    popup.type === "error"
                      ? "bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 shadow-rose-500/25"
                      : popup.type === "success"
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-500/25"
                      : "bg-gradient-to-r from-[#EA9F24] to-[#D68A1B] hover:from-[#D68A1B] hover:to-[#B47012] shadow-[#EA9F24]/30"
                  }`}
                >
                  {popup.confirmText}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PopupContext.Provider>
  );
}

export function usePopup() {
  const context = useContext(PopupContext);
  if (!context) {
    throw new Error("usePopup must be used within a PopupProvider");
  }
  return context;
}

export default PopupContext;
