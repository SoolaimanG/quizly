import { FC } from "react";
import { cn } from "../../lib/utils";
import { useSurveyWorkSpace } from "../../provider";
import { Loader2, X } from "lucide-react";
import { LottieSuccess } from "./LottieSucces";
import { Description } from "../../Pages/ExplorePage/QuickQuiz";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "../Button";
import Hint from "../Hint";
import { useWindowSize } from "@uidotdev/usehooks";

export const AutoSaveUI: FC<{
  className?: string;
  cancelRequest: () => void;
}> = ({ className, cancelRequest }) => {
  const {
    auto_save_ui_props: { is_visible, status, message },
  } = useSurveyWorkSpace();
  const { width } = useWindowSize();

  // Different varient of notifications
  const StatusIcon = {
    loading: {
      icon: Loader2,
      header: "Saving",
    },
    failed: {
      icon: X,
      header: "Failed",
    },
    success: {
      icon: LottieSuccess,
      header: "Success",
    },
  }[status];

  return (
    <AnimatePresence>
      {is_visible && (
        <motion.div
          className={cn(className, "z-[99]")}
          initial={{
            opacity: 0,
            y: Number(width) > 767 ? 100 : -100,
          }}
          exit={{
            opacity: 0,
            y: Number(width) > 767 ? 100 : -100,
          }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { damping: 0.3 },
          }}
        >
          <div
            className={cn(
              "px-4 py-2 md:w-[30%] w-[90%] shadow-md rounded-sm relative flex items-center gap-3 dark:bg-slate-950 bg-white"
            )}
          >
            <div
              className={cn("", status === "success" && "w-[3rem] h-[3rem]")}
            >
              <StatusIcon.icon
                className={cn(
                  "text-green-500",
                  status === "loading" && "animate-spin",
                  status === "failed" && "text-red-500"
                )}
                loop={false}
              />
            </div>
            <div className="w-full flex items-center justify-between">
              <div className="flex flex-col">
                <h1>{StatusIcon.header}</h1>
                <Description
                  text={
                    message || "Something went wrong please contact support."
                  }
                />
              </div>
              <Hint
                element={
                  <Button
                    onClick={cancelRequest}
                    className="w-6 h-6 p-[2px]"
                    variant="outline"
                    size="icon"
                  >
                    <X />
                  </Button>
                }
                content="Cancel your request."
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
