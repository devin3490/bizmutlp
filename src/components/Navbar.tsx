import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import bismuthLogo from "@/assets/bismuth-logo.png";

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
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-glass">
      <div className="container mx-auto px-6 flex items-center justify-between h-16">
        <button onClick={() => scrollTo("#hero")} className="flex items-center gap-3">
          <img src={bismuthLogo} alt="Bismuth" className="h-8 w-auto" />
          <span className="text-foreground font-semibold text-lg tracking-wider uppercase">Bismuth</span>
        </button>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              className="text-muted-foreground text-sm font-medium tracking-wide uppercase hover:text-bismuth-pink transition-colors"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => scrollTo("#application")}
            className="bg-bismuth-purple text-foreground px-5 py-2 text-sm font-semibold tracking-wide hover:bg-bismuth-pink transition-colors"
          >
            Postuler
          </button>
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
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="text-muted-foreground text-sm font-medium tracking-wide uppercase hover:text-bismuth-pink transition-colors text-left"
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={() => scrollTo("#application")}
                className="bg-bismuth-purple text-foreground px-5 py-3 text-sm font-semibold tracking-wide hover:bg-bismuth-pink transition-colors mt-2"
              >
                Postuler
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
