import { motion } from "framer-motion";
import { BismuthGeometry } from "./BismuthGeometry";

export const ApplicationForm = () => (
  <section id="application" className="py-0 relative">
    <div className="container mx-auto px-6 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="glass rounded-lg max-w-3xl mx-auto overflow-hidden"
      >
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLSdExample/viewform?embedded=true"
          width="100%"
          height="800"
          className="border-0 w-full"
          title="Bismuth Application Form"
        >
          Loading…
        </iframe>
      </motion.div>
    </div>
  </section>
);
