import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import bizmutTextLogo from "@/assets/bizmut-text-logo.jpeg";

const navLinks = [
  { label: "Accueil", href: "#hero" },
  { label: "Candidature", href: "#application" },
  { label: "Avantages", href: "#lifestyle" },
  { label: "Contact", href: "#contact" },
];

export const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-glass"
    >
      <div className="container mx-auto px-6 flex items-center justify-between h-16">
        <motion.button
          onClick={() => scrollTo("#hero")}
          className="flex items-center gap-3"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <img src={bizmutTextLogo} alt="Bizmut" className="h-16 w-auto invert mix-blend-screen" />
        </motion.button>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link, i) => (
            <motion.button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              whileHover={{ y: -2 }}
              className="text-muted-foreground text-sm font-medium tracking-wide uppercase hover:text-bismuth-pink transition-colors"
            >
              {link.label}
            </motion.button>
          ))}
          <motion.button
            onClick={() => scrollTo("#application")}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, type: "spring" }}
            whileHover={{ scale: 1.08, boxShadow: "0 0 20px hsla(270, 60%, 55%, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            className="bg-bismuth-purple text-foreground px-5 py-2 text-sm font-semibold tracking-wide hover:bg-bismuth-pink transition-colors"
          >
            Postuler
          </motion.button>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-foreground">
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-glass overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="text-muted-foreground text-sm font-medium tracking-wide uppercase hover:text-bismuth-pink transition-colors text-left"
                >
                  {link.label}
                </motion.button>
              ))}
              <motion.button
                onClick={() => scrollTo("#application")}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 }}
                className="bg-bismuth-purple text-foreground px-5 py-3 text-sm font-semibold tracking-wide hover:bg-bismuth-pink transition-colors mt-2"
              >
                Postuler
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
