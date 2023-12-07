import { GlassmorphismProps } from "../../Types/components.types";
import { motion } from "framer-motion";

const Glassmorphism: React.FC<GlassmorphismProps> = ({
  children,
  className,
  varient,
  blur = 7,
}) => {
  const glassmorphismStyle: React.CSSProperties = {
    background: "rgba(247,247,247,0.5)",
    WebkitBackdropFilter: `blur(${blur})`,
    backdropFilter: `blur(${blur})`,
    border: "1px solid rgba(255,255,255,0.1)",
  };
  return (
    <motion.div
      variants={varient}
      className={className + " " + "p-1"}
      style={glassmorphismStyle}
    >
      {children}
    </motion.div>
  );
};

export default Glassmorphism;
