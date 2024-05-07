import { FC, useState, useTransition } from "react";
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
import { Button } from "../../components/Button";
import { AlertCircleIcon } from "lucide-react";
import { Textarea } from "../../components/TextArea";
import { toast } from "../../components/use-toaster";
import { useMethods } from "../../Hooks";
import { AxiosError } from "axios";
import { errorMessageForToast } from "../../Functions";
import { Loader2Icon } from "lucide-react";
import { QuizQueries } from "../../Functions/QuizQueries";
import { app_config } from "../../Types/components.types";
import { useLocation } from "react-router-dom";
import queryString from "query-string";

export const ReportQuestion: FC<{ question_id: string }> = ({
  question_id,
}) => {
  const quiz = new QuizQueries();
  const [isReporting, startReport] = useTransition();
  const { login_required } = useMethods();
  const [issue, setIssue] = useState("");
  const location = useLocation();

  const qs = queryString.parse(location.search) as { access_token: string };

  const reportQuestionFunction = async () => {
    if (!issue) {
      return toast({
        title: "Error",
        description: "Please write about the issue you encounter.",
        variant: "destructive",
      });
    }

    login_required();

    if (!login_required()) {
      return;
    }

    try {
      await quiz.reportQuestion(question_id, issue, qs.access_token);
      toast({
        title: "Question Reported",
        description: `Thank you for making ${app_config.AppName} a better place! We will notify this quiz host immediately.`,
      });
      setIssue("");
    } catch (error) {
      toast({
        title: "Error",
        description: errorMessageForToast(
          error as AxiosError<{ message: string }>
        ),
        variant: "destructive",
      });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button className="flex items-center gap-1" variant={"ghost"} size="sm">
          <AlertCircleIcon size={15} />
          Report
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-green-500">
            Do You Want To Report This Question?
          </AlertDialogTitle>
          <AlertDialogDescription>
            When this question is reported we make sure your report reach the
            tutor that set this this question to see if anything is wrong with
            it and they will make correction ASAP.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Textarea
          rows={10}
          value={issue}
          onChange={(e) => setIssue(e.target.value)}
          placeholder="Write about what you notice with the question"
          className="resize-none"
        />
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <Button
            asChild
            variant="destructive"
            size="sm"
            className="flex items-center text-white gap-1"
            onClick={() =>
              startReport(() => {
                reportQuestionFunction();
              })
            }
          >
            <AlertDialogAction>
              {isReporting ? (
                <Loader2Icon className="animate-spin" size={15} />
              ) : (
                <AlertCircleIcon size={15} />
              )}
              Report
            </AlertDialogAction>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
