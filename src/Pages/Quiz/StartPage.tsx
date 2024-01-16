import { Img } from "react-image";
import { QuickActions } from "./QuickActions";
import Illustration from "../../assets/undraw_reading_list_re_bk72.svg";
import { Loader2 } from "lucide-react";
import { Description } from "../ExplorePage/QuickQuiz";
import { IQuiz } from "../../Types/components.types";
import { StartQuizButton } from "../../components/App/StartQuizButton";
import { AnimatePresence, motion } from "framer-motion";
import { useQuizStore } from "../../provider";
import { useWindowSize } from "@uidotdev/usehooks";
import { cn } from "../../lib/utils";

export const StartPage: React.FC<{ data: IQuiz }> = ({
  data: { instructions, id },
}) => {
  const { openComment } = useQuizStore();
  const { width } = useWindowSize();
  return (
    <AnimatePresence mode="wait">
      <motion.div className="w-full flex gap-3">
        <motion.div
          animate={{
            width: openComment && Number(width) > 767 ? "70%" : "100%",
          }}
          className="h-full pt-10 px-3 pb-1 flex flex-col gap-3 relative"
        >
          {/* Start Quiz Content */}
          <div className="md:max-w-4xl md:m-auto flex items-center justify-center flex-col gap-4">
            <Img
              className="w-1/2 h-1/2"
              src={Illustration}
              loader={<Loader2 className="animate-spin" />}
            />
            <h1 className="text-2xl">Your Quiz Is Ready</h1>
            <Description className="text-center w-full" text={instructions} />
            <StartQuizButton
              id={id}
              onQuizStart={() => {}}
              button_text="Let's Go"
              isAuthenticated
            />
          </div>
          <QuickActions
            className={cn(
              "items-center flex justify-center md:justify-normal md:absolute md:top-36 md:right-5 md:flex-col flex-row",
              openComment && "md:hidden"
            )}
          />
        </motion.div>
        {openComment && Number(width) > 767 && (
          <motion.div animate={{ width: "30%" }} className="pt-14">
            <QuickActions className="w-full flex items-center justify-center" />
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
