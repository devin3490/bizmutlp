import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";

export const FloatingChat = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="glass rounded-lg p-6 mb-4 w-80"
          >
            <h4 className="text-foreground font-bold text-lg mb-2">Chat with us</h4>
            <p className="text-muted-foreground text-sm mb-4">
              Have questions about joining Bismuth? We're here to help.
            </p>
            <input
              type="text"
              placeholder="Type your message..."
              className="w-full bg-muted border border-glass rounded px-4 py-3 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-bismuth-purple"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="bg-bismuth-purple w-14 h-14 rounded-full flex items-center justify-center text-foreground shadow-lg hover:bg-bismuth-pink transition-colors"
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>
    </div>
  );
};
