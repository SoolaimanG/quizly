import { cva } from "class-variance-authority";
import { chipProps } from "../../Types/components.types";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

const Chip = ({ className, varient, text, type = "default" }: chipProps) => {
  const chipVariants = cva("px-2 cursor-pointer rounded-md", {
    variants: {
      type: {
        default: "bg-green-200 text-green-600",
        danger: "bg-red-100 text-red-500",
        warning: "bg-yellow-200 text-yellow-600",
      },
    },
    defaultVariants: {
      type: "default",
    },
  });

  return (
    <motion.div
      variants={varient}
      className={cn(chipVariants({ type, className }), className)}
    >
      <p>{text}</p>
    </motion.div>
  );
};

export default Chip;
