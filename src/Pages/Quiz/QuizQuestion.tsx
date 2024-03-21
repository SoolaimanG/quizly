import React, {
  ForwardedRef,
  forwardRef,
  useState,
  useTransition,
} from "react";
import {
  IQuestion,
  IQuiz,
  app_config,
  localStorageKeys,
  questionUIStateProps,
  question_type,
} from "../../Types/components.types";
import { Button } from "../../components/Button";
import { QuizNavigation } from "../../components/App/QuizNavigation";
import { useQuizStore, useZStore } from "../../provider";
import { useAuthentication, useMethods } from "../../Hooks";
import { Lightbulb, Loader2, Volume2 } from "lucide-react";
import Hint from "../../components/Hint";
import {
  errorMessageForToast,
  handleScrollInView,
  readAloud,
} from "../../Functions";
import { Skeleton } from "../../components/Loaders/Skeleton";
import { ButtonSkeleton } from "../../components/App/FilterByCategory";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  markQuestion,
  get_question,
  reportQuestion,
} from "../../Functions/APIqueries";
import Error from "../Comps/Error";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/Popover";
import { Description } from "../ExplorePage/QuickQuiz";
import { AlertCircle } from "lucide-react";
import { useLocalStorage, useSessionStorage } from "@uidotdev/usehooks";
import { toast } from "../../components/use-toaster";
import { useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";
import { AxiosError } from "axios";
import { Timer } from "../../components/App/Timer";
import {
  GermanUI,
  MultipleChoiceUI,
  BooleanUI,
  ObjectiveUI,
} from "../Comps/Quiz/QuestionTypesUI";
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
import { Textarea } from "../../components/TextArea";
import { Img } from "react-image";

interface QuizQuestionProps {
  question_id: string;
  quiz: IQuiz;
  haveNavigation?: boolean;
  displayTimer?: boolean;
  index?: number;
}

const QuestionLoader = () => {
  return (
    <div className="flex mt-5 w-full flex-col gap-3">
      <Skeleton className="w-full h-[6.5rem]" />
      <div className="flex w-full flex-col gap-3">
        <ButtonSkeleton className="flex-col" width="w-full" size={4} />
      </div>
    </div>
  );
};

export const QuizQuestion = forwardRef(
  (
    {
      question_id,
      quiz,
      haveNavigation = true,
      displayTimer = true,
      index,
    }: QuizQuestionProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const { isAuthenticated } = useAuthentication();
    const { isLoading, data, error, refetch } = useQuery<{ data: IQuestion }>({
      queryKey: ["question_id", question_id],
      queryFn: () => get_question(question_id),
      retry: 2,
    });

    //--------->States<--------
    const [state, setState] = useState<questionUIStateProps>({
      is_correct: false,
      question_type: "",
      show_answer: false,
      correct_answer: "",
      editted: false,
    });
    const [animate_to, setAnimate_to] = useState<"left" | "right">("right");
    const [issue, setIssue] = useState("");

    //--------->HOOKS<----------
    const [anonymous_id] = useLocalStorage<string>(
      localStorageKeys.anonymous_id
    );
    const [questionIDs] = useSessionStorage<string[]>(
      localStorageKeys.questionUUIDs,
      []
    );
    const [isPending, startTransition] = useTransition();
    const [isReporting, startReport] = useTransition();
    const { setLoginAttempt } = useZStore();
    const { refs, currentQuizData, setQuestionsAnswered } = useQuizStore();
    const navigate = useNavigate();
    const location = useLocation();
    const { login_required } = useMethods();

    const access_token = queryString.parse(location.search).access_key as
      | string
      | undefined;
    const questionID = queryString.parse(location.search).questionid;

    //--------->Functions<------------
    const confirmUserAnswer = async (user_answer: string | string[]) => {
      try {
        const res = await markQuestion({
          isAuthenticated,
          anonymous_id,
          user_answer,
          question_id: data?.data.id || "",
        });
        setState(res.data);
        !res.data.editted && setQuestionsAnswered("increment");
        if (index) {
          index + 1 < Number(currentQuizData?.total_questions) &&
            handleScrollInView(refs[index + 1]);
        } else if (index === 0) {
          handleScrollInView(refs[index + 1]);
        }
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

    const submitAnswer = (user_answer: string | string[]) => {
      startTransition(() => {
        confirmUserAnswer(user_answer);
      });
    };

    //---------->Navigation Function<---------
    const navigatorHelper = (question_id: string) => {
      navigate(
        `?questionid=${question_id}${
          access_token ? `&access_key=${access_token}` : ""
        }#question`
      );
    };

    const getNextQuestion = async () => {
      //First get the index of the current question to help with navigation
      const currentIndex = questionIDs.indexOf(String(questionID));
      const lengthOfQuestions = questionIDs.length;

      if (currentIndex + 1 === lengthOfQuestions) {
        //
        navigate("#result");
        return;
      }

      setAnimate_to("right");
      navigatorHelper(questionIDs[currentIndex + 1] || questionIDs[0]);
    };

    const getPrevQuestion = () => {
      const currentIndex = questionIDs.indexOf(String(questionID));

      if (currentIndex === -1 || currentIndex === 0) {
        navigate("#start");
        return;
      }

      setAnimate_to("left");
      navigatorHelper(questionIDs[currentIndex - 1]);
    };

    const reportQuestionFunction = async () => {
      if (!issue)
        return toast({
          title: "Error",
          description: "Please write about the issue you encounter.",
          variant: "destructive",
        });

      login_required();

      if (!login_required()) return;

      try {
        const response: { data: {}; message: string } = await reportQuestion({
          question_id,
          quiz_id: quiz.id,
          issue,
        });
        toast({
          title: "Reported",
          description: response.message,
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

    if (isLoading) return <QuestionLoader />;

    if (error)
      return (
        <Error
          className="h-full"
          errorMessage={errorMessageForToast(
            error as AxiosError<{ message: string }>
          )}
          retry_function={() => refetch()}
        />
      );

    const questionType = {
      german: (
        <GermanUI
          disableAnswer={currentQuizData?.is_completed!}
          markQuestion={submitAnswer}
        />
      ),
      objective: (
        <ObjectiveUI
          disableAnswer={currentQuizData?.is_completed!}
          quiz={quiz as IQuiz}
          data={data?.data as IQuestion}
          markQuestion={submitAnswer}
          state={state}
        />
      ),
      multiple_choices: (
        <MultipleChoiceUI
          disableAnswer={currentQuizData?.is_completed!}
          data={data?.data!}
          markQuestion={submitAnswer}
        />
      ),
      true_or_false: (
        <BooleanUI
          disableAnswer={currentQuizData?.is_completed!}
          quiz={quiz as IQuiz}
          markQuestion={submitAnswer}
          state={state}
        />
      ),
    };

    return (
      <React.Fragment>
        <div ref={ref} className="mb-10 flex flex-col overflow-hidden gap-2">
          {isPending && (
            <Loader2
              className="animate-spin text-green-500 absolute top-2 right-2"
              size={20}
            />
          )}
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2 justify-between w-full">
              <pre className="underline">
                Question {data?.data?.question_number}
              </pre>
              {displayTimer && (
                <Timer
                  quiz_id={quiz?.id as string}
                  onTimeFinish={() => navigate("#result")}
                  initialTime={quiz?.time_limit || 0}
                />
              )}
            </div>
            {quiz?.allow_robot_read && (
              <Hint
                element={
                  <Button
                    onClick={() =>
                      readAloud({ text: data?.data?.question_body })
                    }
                    size={"icon"}
                    variant={"secondary"}
                    className="p-1 rounded-full bg-transparent"
                  >
                    <Volume2 />
                  </Button>
                }
                content="Read question"
              />
            )}
          </div>
          <div className="w-full flex text-green-600 dark:text-green-500 flex-col gap-2 rounded-sm  h-fit p-3">
            <p className="text-xl text-center">{data?.data?.question_body}</p>
            {data?.data?.question_image && (
              <Img
                loader={<Loader2 size={40} className="animate-spin" />}
                className="h-[15rem] rounded-md"
                src={data?.data?.question_image}
                alt="question_img"
              />
            )}
          </div>
          <motion.div
            key={data?.data?.id}
            initial={{ opacity: 0, x: animate_to === "right" ? 100 : -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "just", delay: 0.15 }}
            className="w-full mt-5"
          >
            {questionType[data?.data?.question_type as question_type]}
          </motion.div>
          <div className="flex items-end w-full justify-between">
            <AlertDialog>
              <AlertDialogTrigger>
                <Button
                  className="flex items-center gap-1"
                  variant={"ghost"}
                  size="sm"
                >
                  <AlertCircle size={15} />
                  Report
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Do You Want To Report This Question?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    When this question is reported we make sure your report
                    reach the tutor that set this this question to see if
                    anything is wrong with it and they will make correction
                    ASAP.
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
                  <AlertDialogAction asChild>
                    <Button
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() =>
                        startReport(() => {
                          reportQuestionFunction();
                        })
                      }
                    >
                      {isReporting ? (
                        <Loader2 className="animate-spin" size={15} />
                      ) : (
                        <AlertCircle size={15} />
                      )}
                      Report
                    </Button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            {data?.data?.hint && (
              <div className="w-full flex items-end justify-end">
                <Popover>
                  <PopoverTrigger>
                    <Hint
                      element={
                        <Button
                          size={"icon"}
                          variant={"secondary"}
                          className="py-0"
                        >
                          <Lightbulb />
                        </Button>
                      }
                      content="See Hint"
                      delay={500}
                      side="bottom"
                    />
                  </PopoverTrigger>
                  <PopoverContent>
                    <Description text={data.data.hint} />
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>
          {state.show_answer && (
            <Popover>
              <PopoverTrigger className="underline">
                See Explanation
              </PopoverTrigger>
              <PopoverContent className="flex flex-col gap-2">
                <h1 className="font-semibold">Basic Explanation</h1>
                <i className="text-lg text-center w-full">
                  {'"" ' + state.correct_answer + ' ""'}
                </i>
                {state.is_correct ? (
                  <Description
                    className="text-green-500"
                    text="You answer is correct"
                  />
                ) : (
                  <Description
                    className="text-red-500"
                    text="You choose the wrong answer"
                  />
                )}
              </PopoverContent>
            </Popover>
          )}
          {haveNavigation && (
            <div className="absolute bottom-3 w-full p-1 gap-3 flex items-center justify-between right-3">
              {!isAuthenticated && (
                <Button
                  onClick={() =>
                    setLoginAttempt({
                      attempt: true,
                      fallback: app_config.explore_page,
                    })
                  }
                  variant={"link"}
                >
                  Create Account
                </Button>
              )}

              <QuizNavigation
                prevFunction={getPrevQuestion}
                havePrev
                nextFunction={() => {
                  startTransition(() => {
                    getNextQuestion();
                  });
                }}
              />
            </div>
          )}
        </div>
      </React.Fragment>
    );
  }
);
