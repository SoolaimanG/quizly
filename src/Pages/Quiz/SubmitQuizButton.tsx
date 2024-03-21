import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../../components/Alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/AlertModal";
import { useQuizStore } from "../../provider";
import { cn } from "../../lib/utils";
import { Button } from "../../components/Button";

export const SubmitQuizButton: React.FC<{
  children: React.ReactElement;
  className?: string;
  onSubmit: () => void;
}> = ({ children, className, onSubmit }) => {
  const { currentQuizData, questionsAnswered } = useQuizStore();
  // Warn the user if the questions are not completely answered

  const description =
    currentQuizData?.result_display_type === "on_complete"
      ? "Your quiz has been graded. Click Continue to view your results."
      : currentQuizData?.result_display_type === "on_submit"
      ? "Click Continue to submit your answers for immediate grading. Your results will be displayed upon completion."
      : "Your quiz will be graded by the instructor upon completion. You will be notified when your results are available.";

  const warning_message =
    questionsAnswered !== currentQuizData?.total_questions
      ? "Not all questions have been answered. Are you sure you want to submit?"
      : "Please review your answers carefully. Once submitted, changes cannot be made.";

  return (
    <AlertDialog>
      <AlertDialogTrigger className={cn("w-full", className)}>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to submit?</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <Alert
          variant={
            questionsAnswered !== currentQuizData?.total_questions
              ? "destructive"
              : "default"
          }
        >
          <AlertCircle />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>{warning_message}</AlertDescription>
        </Alert>
        <AlertDialogFooter>
          <AlertDialogCancel>Not Ready</AlertDialogCancel>
          <AlertDialogAction className="text-white" asChild onClick={onSubmit}>
            <Button variant={"base"}>Yes, Process</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
