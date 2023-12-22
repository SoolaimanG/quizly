import React from "react";
import { motion } from "framer-motion";

export const ScaleButton = React.forwardRef<
  HTMLButtonElement,
  {
    children: React.ReactElement;
    scale?: number;
  }
>(({ children, scale = 0.9 }, ref) => {
  return (
    <motion.button ref={ref} whileTap={{ scale }}>
      {children}
    </motion.button>
  );
});
