import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { BismuthGeometry } from "./BismuthGeometry";
import bizmutTextLogo from "@/assets/bizmut-text-logo.png";

const letterVariants = {
  hidden: { opacity: 0, y: 50, rotateX: -90 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { delay: 0.5 + i * 0.04, duration: 0.5, ease: "easeOut" as const },
  }),
};

const AnimatedText = ({ text, className }: { text: string; className?: string }) => (
  <span className={className}>
    {text.split("").map((char, i) => (
      <motion.span
        key={i}
        custom={i}
        variants={letterVariants}
        initial="hidden"
        animate="visible"
        style={{ display: "inline-block", whiteSpace: char === " " ? "pre" : undefined }}
      >
        {char}
      </motion.span>
    ))}
  </span>
);

export const HeroSection = () => {
  const scrollToForm = () => {
    document.getElementById("application")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      <BismuthGeometry />

      {/* Animated glow orbs */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, hsla(270, 60%, 55%, 0.15), transparent 70%)",
          left: "20%",
          top: "10%",
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full"
        style={{
          background: "radial-gradient(circle, hsla(174, 60%, 45%, 0.12), transparent 70%)",
          right: "15%",
          bottom: "20%",
        }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="flex items-center justify-center gap-3 mb-8"
            >
              <motion.img
                src={bizmutTextLogo}
                alt="Bizmut logo"
                className="h-28 md:h-36 w-auto invert mix-blend-screen"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>


            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.95] mb-6 tracking-tight"
            >
              <AnimatedText text="Gagne " className="text-foreground" />
              <motion.span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: "linear-gradient(135deg, hsl(var(--bismuth-gold)), hsl(var(--bismuth-pink)), hsl(var(--bismuth-purple)))",
                  backgroundSize: "200% 200%",
                  animation: "gradient-shift 4s ease infinite",
                }}
              >
                20 000 $
              </motion.span>
              <br />
              <AnimatedText text="cet été grâce au" className="text-foreground" />
              <br />
              <AnimatedText text="porte-à-porte." className="text-bismuth-teal italic" />
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="flex flex-col items-center gap-3 mt-4"
            >
              <p className="text-muted-foreground text-lg md:text-xl font-medium">
                Remplis le formulaire ci-dessous pour appliquer
              </p>
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <motion.div
                  whileHover={{ scale: 1.3 }}
                  className="cursor-pointer"
                  onClick={() => document.getElementById("application")?.scrollIntoView({ behavior: "smooth" })}
                >
                  <ArrowDown className="text-bismuth-gold" size={44} />
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
