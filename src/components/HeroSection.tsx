import { motion } from "framer-motion";
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
              <img src={bismuthLogo} alt="Bismuth logo" className="h-10 w-auto" />
              <span className="text-foreground font-semibold text-xl tracking-wider uppercase">
                Bismuth
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] mb-6 text-gold"
            >
              Gagne 25 000 $ cet été grâce au porte-à-porte.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-lg md:text-xl text-foreground/90 mb-10 leading-relaxed max-w-2xl mx-auto"
            >
              Rejoins une équipe d'élite de personnes ambitieuses. Revenu élevé, voyages internationaux,
              réseau exclusif et développement personnel sans limites. Ton prochain chapitre commence ici.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <button
                onClick={scrollToForm}
                className="bg-bismuth-purple text-foreground px-8 py-4 text-lg font-semibold tracking-wide hover:bg-bismuth-pink transition-colors duration-300"
              >
                Postuler maintenant
              </button>
              <button
                onClick={scrollToLifestyle}
                className="border border-silver text-silver px-8 py-4 text-lg font-semibold tracking-wide hover:bg-bismuth-pink hover:text-foreground hover:border-bismuth-pink transition-colors duration-300"
              >
                En savoir plus
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
