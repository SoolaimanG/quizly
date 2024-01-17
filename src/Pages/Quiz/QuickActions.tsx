import { MessageCircle } from "lucide-react";
import { QuickActionProps } from "../../Types/components.types";
import { Rate } from "../../components/App/Rate";
import { cn } from "../../lib/utils";
import Hint from "../../components/Hint";
import { Button } from "../../components/Button";
import { QuizDetails } from "./QuizDetails";
import { AlertCircleIcon } from "lucide-react";
import { SaveQuiz } from "./SaveQuiz";
import { useWindowSize } from "@uidotdev/usehooks";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "../../components/DialogModal";
import { useQuizStore } from "../../provider";
import { Sheet, SheetContent, SheetTrigger } from "../../components/Sheet";
import { Comments } from "../../components/App/Comments";

export const QuickActions: React.FC<QuickActionProps> = ({ className }) => {
  const { width } = useWindowSize();
  const { currentQuizData, openComment, setOpenComment } = useQuizStore();

  return (
    <div className={cn(className, "gap-3")}>
      <Rate id={currentQuizData?.id!} rate="quiz" />
      {Number(width) > 767 ? (
        <Hint
          element={
            <Button
              onClick={() => setOpenComment(!openComment)}
              variant={"secondary"}
              className="rounded-full relative"
              size={"icon"}
            >
              <span className=" absolute top-0 left-0 -ml-2 bg-green-400 rounded-full w-5 h-5">
                {currentQuizData?.comments_count}
              </span>
              <MessageCircle />
            </Button>
          }
          content="Feedbacks"
          side={Number(width) > 800 ? "left" : "top"}
        />
      ) : (
        <Sheet
          open={openComment}
          onOpenChange={() => setOpenComment(!openComment)}
        >
          <SheetTrigger>
            <Hint
              element={
                <Button
                  variant={"secondary"}
                  className="rounded-full relative"
                  size={"icon"}
                >
                  <span className=" absolute top-0 left-0 -ml-2 bg-green-400 rounded-full w-5 h-5">
                    {currentQuizData?.comments_count}
                  </span>
                  <MessageCircle />
                </Button>
              }
              content="Feedbacks"
              side={Number(width) > 800 ? "left" : "top"}
            />
          </SheetTrigger>
          <SheetContent>
            <Comments quiz_id={currentQuizData?.id!} type="textarea" />
          </SheetContent>
        </Sheet>
      )}

      <Dialog>
        <DialogTrigger>
          <Hint
            element={
              <Button
                variant={"secondary"}
                className="rounded-full"
                size={"icon"}
              >
                <AlertCircleIcon />
              </Button>
            }
            content="Quiz Details"
            side={Number(width) > 800 ? "left" : "top"}
          />
        </DialogTrigger>
        <DialogContent>
          <QuizDetails />
          <DialogFooter>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <SaveQuiz quiz_id={currentQuizData?.id!} />
    </div>
  );
};
