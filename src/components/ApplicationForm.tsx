import { motion } from "framer-motion";
import { BismuthGeometry } from "./BismuthGeometry";

export const ApplicationForm = () => (
  <section id="application" className="py-0 relative">
    <div className="container mx-auto px-6 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
        whileHover={{ boxShadow: "0 0 60px hsla(270, 60%, 55%, 0.15)" }}
        className="glass rounded-lg max-w-5xl mx-auto overflow-hidden transition-shadow duration-500"
      >
        <div className="w-full overflow-y-auto max-h-[60vh] md:max-h-none rounded-lg">
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSdtZLDpUzEACUnDTU_inRHR-gH6PXH3e1m9jsaGCaGR0zQuLQ/viewform?embedded=true"
            width="100%"
            height="1200"
            className="border-0 w-full"
            title="Bizmut Application Form"
          >
            Loading…
          </iframe>
        </div>
      </motion.div>
    </div>
  </section>
);
