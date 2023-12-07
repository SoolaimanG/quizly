import React from "react";
import { Variants, motion } from "framer-motion";

const Stagger: React.FC<{
  containerVariant?: Variants;
  stagger?: number;
  variant: "scale" | "slideIn" | "enter" | "below" | "opacity";
  children: React.ReactNode;
  delay?: number;
  className?: string;
}> = ({
  containerVariant,
  variant,
  stagger = 0.3,
  children,
  delay = 0.3,
  className,
}) => {
  const variantType = {
    scale: {
      visible: 1,
      hidden: 0,
    },
    slideIn: {
      visible: 0,
      hidden: 100,
    },
    enter: {
      visible: 0,
      hidden: 100,
    },
    below: {
      visible: 0,
      hidden: -100,
    },
    opacity: {
      visible: 1,
      hidden: 0,
    },
  };

  const container: Variants = {
    hidden: {
      opacity: variant === "scale" ? variantType[variant].hidden : undefined,
      scale: variant === "scale" ? variantType[variant].hidden : undefined,
      x: variant === "slideIn" ? variantType[variant].hidden : undefined,
      y:
        variant === "enter"
          ? variantType[variant].hidden
          : variant === "below"
          ? -variantType[variant].hidden
          : undefined,
    },
    visible: {
      opacity: variant === "scale" ? variantType[variant].visible : undefined,
      scale: variant === "scale" ? variantType[variant].visible : undefined,
      x: variant === "slideIn" ? variantType[variant].visible : undefined,
      y:
        variant === "enter"
          ? variantType[variant].visible
          : variant === "below"
          ? variantType[variant].visible
          : undefined,
      transition: {
        delayChildren: delay,
        staggerChildren: stagger,
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={containerVariant || container}
      animate="visible"
      initial="hidden"
    >
      {children}
    </motion.div>
  );
};

export default Stagger;
