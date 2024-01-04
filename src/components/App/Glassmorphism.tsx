import { GlassmorphismProps } from "../../Types/components.types";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

const Glassmorphism: React.FC<GlassmorphismProps> = ({
  children,
  className,
  varient,
  blur = "7px",
  color = "default",
}) => {
  const glassmorphismStyle: React.CSSProperties = {
    background:
      color === "default" ? "rgba(247,247,247,0.5)" : "rgba(187,247,208,0.45)",
    WebkitBackdropFilter: `blur(${blur})`,
    backdropFilter: `blur(${blur})`,
    border: "1px solid rgba(255,255,255,0.1)",
  };
  return (
    <motion.div
      variants={varient}
      className={cn("p-1", className)}
      style={glassmorphismStyle}
    >
      {children}
    </motion.div>
  );
};

export default Glassmorphism;
