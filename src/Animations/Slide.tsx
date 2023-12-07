import React from "react";
import { Variant, motion } from "framer-motion";

const Slide: React.FC<{
  side: "left" | "right" | "top" | "down";
  d?: number;
  delay?: number;
  className?: string;
  children: React.ReactNode;
}> = ({ side, d = 20, delay = 0.5, className, children }) => {
  const animationVariants: {
    left: {
      animate: Variant;
      initial: Variant;
    };
    right: {
      animate: Variant;
      initial: Variant;
    };
    top: {
      animate: Variant;
      initial: Variant;
    };
    down: {
      animate: Variant;
      initial: Variant;
    };
  } = {
    left: {
      animate: {
        x: 0,
      },
      initial: {
        x: -d,
      },
    },
    right: {
      animate: {
        x: 0,
      },
      initial: {
        x: d,
      },
    },
    top: {
      animate: {
        y: 0,
      },
      initial: {
        y: -d,
      },
    },
    down: {
      animate: {
        y: 0,
      },
      initial: {
        y: d,
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={animationVariants[side]}
      initial="initial"
      animate="animate"
      transition={{ delay, type: "just" }}
    >
      {children}
    </motion.div>
  );
};

export default Slide;
