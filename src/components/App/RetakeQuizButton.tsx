import React, { useTransition } from "react";
import {
  localStorageKeys,
  retakeQuizBtnProps,
} from "../../Types/components.types";
import { Button } from "../Button";
import { AlertCircle, RotateCcw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "../DialogModal";
import { Alert, AlertDescription, AlertTitle } from "../Alert";
import { retakeAQuiz } from "../../Functions/APIqueries";
import { useAuthentication } from "../../Hooks";
import { useLocalStorage } from "@uidotdev/usehooks";
import { useNavigate } from "react-router-dom";

export const RetakeQuizButton: React.FC<retakeQuizBtnProps> = ({
  quiz_id,
  to_go,
}) => {
  const [isPending, startTransition] = useTransition();
  const { isAuthenticated } = useAuthentication();
  const [anonymous_id] = useLocalStorage<string>(localStorageKeys.anonymous_id);
  const navigate = useNavigate();

  const retakeQuiz = async () => {
    try {
      await retakeAQuiz({
        isAuthenticated,
        quiz_id,
        anonymous_id,
      });
      to_go && navigate(to_go);
    } catch (error) {
      //Error
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild className="w-full">
        <Button
          disabled={isPending}
          variant="destructive"
          className="flex gap-2 h-[3rem]"
        >
          <RotateCcw size={15} />
          Retake Quiz
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Are you sure you want to retake this quiz?</DialogTitle>
        <DialogDescription>
          All your existing data of this quiz will be reset.
        </DialogDescription>
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>Disclaimer</AlertTitle>
          <AlertDescription>This Action cannot be undone.</AlertDescription>
        </Alert>
        <DialogFooter>
          <Button
            disabled={isPending}
            onClick={() =>
              startTransition(() => {
                retakeQuiz();
              })
            }
            variant={"destructive"}
            size={"lg"}
          >
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
