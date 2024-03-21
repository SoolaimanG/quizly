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
import { Comments } from "../../components/App/Comments";
import { useNavigate } from "react-router-dom";
import { useAuthentication } from "../../Hooks";

export const StartPage: React.FC<{ data: IQuiz }> = ({
  data: { instructions, id, is_completed, has_user_started_quiz },
}) => {
  const { openComment } = useQuizStore();
  const { isAuthenticated } = useAuthentication();
  const { width } = useWindowSize();
  const navigate = useNavigate();
  return (
    <motion.div className="w-full mt-3 overflow-hidden flex gap-3">
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
            onQuizStart={() => navigate("#questions")}
            button_text={
              is_completed
                ? "You completed this quiz"
                : has_user_started_quiz
                ? "Continue Quiz"
                : "Let's Go"
            }
            isAuthenticated={isAuthenticated}
            haveExternalFunction
          />
        </div>
        <QuickActions
          className={cn(
            "items-center flex justify-center md:justify-normal md:absolute md:top-36 md:right-5 md:flex-col flex-row",
            openComment && "md:hidden"
          )}
        />
      </motion.div>
      <AnimatePresence>
        {openComment && Number(width) > 767 && (
          <motion.div
            animate={{
              opacity: 1,
              transition: { delay: 0.25 },
            }}
            initial={{ opacity: 0 }}
            className="pt-14 w-[30%] overflow-auto p-2"
          >
            <QuickActions className="w-full flex items-center justify-center" />
            <Comments quiz_id={id} type="textarea" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
