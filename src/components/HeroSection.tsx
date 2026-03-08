import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { BismuthGeometry } from "./BismuthGeometry";
import bismuthLogo from "@/assets/bismuth-logo.png";

export const HeroSection = () => {
  const scrollToForm = () => {
    document.getElementById("application")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToLifestyle = () => {
    document.getElementById("lifestyle")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      <BismuthGeometry />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center gap-3 mb-8"
            >
              <img src={bismuthLogo} alt="Bizmut logo" className="h-10 w-auto" />
              <span className="text-foreground font-semibold text-xl tracking-wider uppercase">
Bizmut
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="inline-block mb-6 px-5 py-2 rounded-full border border-bismuth-gold/30 bg-bismuth-gold/10 text-bismuth-gold text-sm md:text-base font-medium tracking-wide uppercase"
            >
              Tu es un vendeur ou une vendeuse
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.95] mb-6 tracking-tight"
            >
              <span className="text-foreground">Gagne </span>
              <span className="bg-gradient-to-r from-bismuth-gold via-bismuth-pink to-bismuth-purple bg-clip-text text-transparent">
                25 000 $
              </span>
              <br />
              <span className="text-foreground">cet été grâce au</span>
              <br />
              <span className="text-bismuth-teal italic">porte-à-porte.</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex flex-col items-center gap-3 mt-4"
            >
              <p className="text-muted-foreground text-lg md:text-xl font-medium">
                Remplis le formulaire ci-dessous pour appliquer
              </p>
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <ArrowDown className="text-bismuth-gold" size={32} />
              </motion.div>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </section>
  );
};
