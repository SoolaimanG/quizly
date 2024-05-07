// import { useLocalStorage, useSessionStorage } from "@uidotdev/usehooks";
import React, { useState, useTransition } from "react";
import { errorMessageForToast, getAnonymousID } from "../../Functions";
// import { localStorageKeys } from "../../Types/components.types";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../DialogModal";
import { StudentVerification } from "./StudentVerification";
import { Button } from "../Button";
import { toast } from "../use-toaster";
import { Restricted } from "./Restricted";
import { Input } from "../Input";
import { Loader2 } from "lucide-react";
import { startQuizButtonProps } from "../../Types/quiz.types";
import { cn } from "../../lib/utils";
import { AxiosError } from "axios";
import { QuizQueries } from "../../Functions/QuizQueries";
import { useAuthentication } from "../../Hooks";
import { useZStore } from "../../provider";
import { localStorageKeys } from "../../Types/components.types";
import { useSessionStorage } from "@uidotdev/usehooks";
import queryString from "query-string";
import Image from "../../assets/undraw_reading_list_re_bk72.svg";
import { Img } from "react-image";
import { RetakeQuiz } from "../../Pages/Quiz/RetakeQuiz";

export const StartQuizButton: React.FC<startQuizButtonProps> = ({
  quiz: { id: quiz_id, access_with_key, user_status, allow_retake },
  button_text = "Start Quiz",
  className,
  onQuizStart,
}) => {
  const { isAuthenticated } = useAuthentication();
  const { user } = useZStore();
  const quiz = new QuizQueries(isAuthenticated);
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<"{'error': 'quiz-completed'}" | null>(
    null
  );
  // This is to access and set the questionsID in sessionStorage
  const [_, setQuestionUUIDs] = useSessionStorage<string[]>(
    localStorageKeys.questionUUIDs,
    []
  );

  const [access_token, setAccessToken] = useState("");
  const [open, setOpen] = useState({
    access_token_modal: false,
    student_account_verification_modal: false,
  });

  //-------------->FUNCTIONS<-----------
  const startQuizForUsers = async () => {
    try {
      if (access_with_key && !access_token) {
        // Open Modal For User To Input Access Token
        setOpen({ ...open, access_token_modal: true });
        return;
      }

      if (user?.account_type === "T") {
        setOpen({ ...open, student_account_verification_modal: true });
        return;
      }

      const anonymous_id = getAnonymousID(isAuthenticated);
      const ip_address = "";
      const res: { data: { uuids: string[] } } = await quiz.startQuiz({
        quiz_id,
        access_token,
        ip_address,
        anonymous_id,
        unanswered_questions: user_status === "continue-quiz",
      });

      // If there is are not questions to start quiz
      if (!res.data.uuids.length) {
        return toast({
          title: "Error",
          description:
            "Something went wrong: could not get questions for this quiz. This happens mostly when you have already completed the quiz.",
          variant: "destructive",
        });
      }

      setQuestionUUIDs(res.data.uuids); //Adding questions to sessionStorage.

      // If the quiz first load and the quiz was start from quickQuiz component get the first questionId and navigate to the current url with #question
      const question_id = res.data.uuids[0];

      const params = queryString.stringify({
        question_id,
        access_token,
      });

      onQuizStart ? onQuizStart() : navigate(`?${params}#question`);
    } catch (error) {
      toast({
        title: "Error",
        description: errorMessageForToast(
          error as AxiosError<{ message: string }>
        ),
        variant: "destructive",
      });
      // @ts-ignore
      setError(error?.response?.data.data as "{'error': 'quiz-completed'}");
    } finally {
      setAccessToken("");
    }
  };

  const start_quiz = async (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e?.preventDefault();

    startTransition(() => {
      startQuizForUsers();
    });
  };

  const studentAccountVerificationModal = (
    <Dialog
      open={open.student_account_verification_modal}
      onOpenChange={(e) =>
        setOpen({ ...open, student_account_verification_modal: e })
      }
    >
      <DialogContent>
        <StudentVerification
          closeFunction={() =>
            setOpen({ ...open, student_account_verification_modal: false })
          }
        />
      </DialogContent>
    </Dialog>
  );

  const accessTokenModal = (
    <Dialog
      open={open.access_token_modal}
      onOpenChange={(e) => setOpen({ ...open, access_token_modal: e })}
    >
      <DialogContent>
        <Restricted message="Access token is required for this Quiz" />
        <form onSubmit={start_quiz} className="flex flex-col gap-3" action="">
          <Input
            required
            value={access_token}
            onChange={(e) => setAccessToken(e.target.value)}
            className="h-[3rem]"
            placeholder="Access Token (Example -- Q53jL9K)"
          />
          <Button type="submit" className="h-[3rem]" variant={"destructive"}>
            Join Quiz
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );

  const quizCompleted = (
    <Dialog
      open={error === "{'error': 'quiz-completed'}"}
      onOpenChange={() => setError(null)}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-green-500">Quiz Completed</DialogTitle>
          <DialogDescription>
            {
              "Quiz completed! Want to test your knowledge again? Click 'Start Again"
            }
          </DialogDescription>
        </DialogHeader>
        <div className="w-full">
          <Img src={Image} loader={<Loader2 size={18} />} />
        </div>
        <DialogFooter className="flex flex-col gap-2">
          {allow_retake && (
            <RetakeQuiz>
              <Button variant="destructive" className="w-full">
                Retake
              </Button>
            </RetakeQuiz>
          )}
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <>
      {quizCompleted}
      {accessTokenModal}
      {studentAccountVerificationModal}
      <Button
        disabled={isPending || !quiz_id}
        onClick={start_quiz}
        variant={"base"}
        className={cn("w-full h-[3rem] flex items-center gap-1", className)}
      >
        {isPending && <Loader2 className="animate-spin" size={19} />}
        {button_text}
      </Button>
    </>
  );
};
