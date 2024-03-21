import { useState } from "react";
import { TabsProps } from "../../Types/components.types";
import { capitalize_first_letter } from "../../Functions";
import { cn } from "../../lib/utils";
import { motion } from "framer-motion";

export const Tabs: React.FC<TabsProps> = ({
  header,
  elements,
  hideBorder = false,
  className,
}) => {
  const [active, setActive] = useState(header[0]);

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "w-full gap-3 flex items-center justify-between",
          !hideBorder && "border-b-[1.5px] border-gray-300 border-solid"
        )}
      >
        {header.map((h, i) => (
          <button
            onClick={() => setActive(h)}
            className={cn(
              "w-full h-[3rem] dark:text-gray-400 relative font-semibold"
            )}
            key={i}
          >
            {capitalize_first_letter(h)}
            {active === h && (
              <motion.div
                layoutId="underline"
                className="w-full h-[2px] bg-green-500 absolute bottom-0"
              />
            )}
          </button>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        key={active}
        className="w-full mt-3"
      >
        {elements[header.findIndex((h) => h === active)]}
      </motion.div>
    </div>
  );
};
