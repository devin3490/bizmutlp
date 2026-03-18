import { motion } from "framer-motion";
import bizmutTextLogo from "@/assets/bizmut-text-logo.jpeg";

export const Footer = () => (
  <footer className="py-12 border-t border-border">
    <div className="container mx-auto px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-center gap-3 mb-4"
      >
        <motion.img
          src={bismuthLogo}
          alt="Bizmut logo"
          className="h-8 w-auto"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
        />
        <span className="text-foreground font-semibold tracking-wider uppercase">Bizmut</span>
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-muted-foreground text-sm"
      >
        © {new Date().getFullYear()} Bizmut. Tous droits réservés.
      </motion.p>
    </div>
  </footer>
);
