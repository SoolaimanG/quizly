import { SideBarProps } from "../../Types/components.types";
import { cn } from "../../lib/utils";
import { useSiderBar } from "../../provider";
import { AnimatePresence, motion } from "framer-motion";

export const SideBar: React.FC<SideBarProps> = ({
  children,
  className,
  openAndCloseButton,
}) => {
  const { isNavOpen, isCollapsed } = useSiderBar();
  // Sidebar will have a position, can collapse if allowed, responsive to mobile and have opening and closing button and will have children.
  return (
    <AnimatePresence>
      {isNavOpen && (
        <motion.nav
          transition={{ stiffness: 1 }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          initial={{ opacity: 0, x: -100 }}
          exit={{ opacity: 0, x: -100 }}
          key={String(isCollapsed)}
          className={cn(
            "fixed h-full z-20 overflow-auto pt-12 px-1 bg-slate-900",
            className,
            isCollapsed ? "md:w-fit" : "md:w-[30%]"
          )}
        >
          <div className={cn("relative w-full")}>
            {/* Open and close button */}
            {openAndCloseButton}
            {children}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};
