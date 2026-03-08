import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export const ExitIntentPopup = () => {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !dismissed) {
        setShow(true);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [dismissed]);

  const handleClose = () => {
    setShow(false);
    setDismissed(true);
  };

  const handleApply = () => {
    handleClose();
    document.getElementById("application")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          style={{ backgroundColor: "hsla(0, 0%, 0%, 0.8)" }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass rounded-lg p-10 max-w-lg w-full text-center relative"
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={24} />
            </button>

            <h3 className="text-3xl font-black text-gold mb-4">
              Avant de partir —
            </h3>
            <p className="text-foreground text-lg mb-8">
              Tu veux construire la vie dont la plupart des gens ne font que rêver ?
            </p>
            <button
              onClick={handleApply}
              className="bg-bismuth-purple text-foreground px-8 py-4 text-lg font-semibold tracking-wide hover:bg-bismuth-pink transition-colors duration-300"
            >
              Commencer la candidature
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
