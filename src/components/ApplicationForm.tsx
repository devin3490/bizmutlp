import { motion } from "framer-motion";
import { BismuthGeometry } from "./BismuthGeometry";

export const ApplicationForm = () => (
  <section id="application" className="py-24 relative">
    <BismuthGeometry />

    <div className="container mx-auto px-6 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl md:text-5xl font-black text-gold mb-4">
          Apply to Join the Bismuth Team
        </h2>
        <p className="text-foreground/80 text-lg max-w-2xl mx-auto">
          Complete the short application below to see if you qualify.
        </p>
      </motion.div>

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
