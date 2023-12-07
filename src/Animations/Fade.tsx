import React from "react";
import { motion } from "framer-motion";

const Fade: React.FC<{
  delay?: number;
  opacity?: number;
  className?: string;
  children: React.ReactNode;
}> = ({ delay = 0.75, opacity = 0, className, children }) => {
  return (
    <motion.div
      className={className}
      animate={{ opacity: 1 }}
      initial={{ opacity: opacity }}
      transition={{ delay: delay }}
    >
      {children}
    </motion.div>
  );
};

export default Fade;
