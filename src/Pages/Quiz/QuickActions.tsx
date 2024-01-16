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

export const QuickActions: React.FC<QuickActionProps> = ({ className }) => {
  const { width } = useWindowSize();
  return (
    <div className={cn(className, "flex gap-3")}>
      <Rate rate="quiz" />
      <Hint
        element={
          <Button variant={"secondary"} className="rounded-full" size={"icon"}>
            <MessageCircle />
          </Button>
        }
        content="Feedbacks"
        side={Number(width) > 800 ? "left" : "top"}
      />

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
      <SaveQuiz />
    </div>
  );
};
