declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

import { motion } from "framer-motion";
import { CheckCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ThankYou = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Push qualified_lead event to dataLayer for GTM
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "qualified_lead" });

    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: "linear-gradient(135deg, #0A0A0A 0%, #0d1f1a 50%, #0A0A0A 100%)" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-5xl w-full"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-6"
        >
          <div className="relative inline-block">
            <CheckCircle className="w-20 h-20 text-emerald-400" />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute -top-2 -right-2"
            >
              <Sparkles className="w-8 h-8 text-bismuth-gold" />
            </motion.div>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl md:text-4xl font-bold text-foreground mb-4"
        >
          Félicitations ! 🎉
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-muted-foreground mb-8"
        >
          Réserve un moment où tu es sûr(e) d'être disponible pour ton appel de présentation. On se rejoint là-haut ! 🚀
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="w-full mb-8 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div
            className="calendly-inline-widget"
            data-url="https://calendly.com/maths-converset57/appel-de-presentation-bizmut-1"
            style={{ minWidth: "280px", height: "700px" }}
          />
          <div
            className="calendly-inline-widget"
            data-url="https://calendly.com/frankblanchard13/new-meeting"
            style={{ minWidth: "280px", height: "700px" }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-muted-foreground hover:text-foreground"
          >
            Retour à l'accueil
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ThankYou;
