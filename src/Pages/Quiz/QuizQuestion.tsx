import React, {
  FC,
  ForwardedRef,
  forwardRef,
  useEffect,
  useState,
  useTransition,
} from "react";
import { app_config, localStorageKeys } from "../../Types/components.types";
import { Button } from "../../components/Button";
import { QuizNavigation } from "../../components/App/QuizNavigation";
import { useQuizStore, useZStore } from "../../provider";
import { useAuthentication } from "../../Hooks";
import { Lightbulb, Loader2, Volume2 } from "lucide-react";
import Hint from "../../components/Hint";
import {
  errorMessageForToast,
  getAnonymousID,
  handleScrollInView,
  readAloud,
} from "../../Functions";
import { Skeleton } from "../../components/Loaders/Skeleton";
import { ButtonSkeleton } from "../../components/App/FilterByCategory";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import Error from "../Comps/Error";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/Popover";
import { useSessionStorage } from "@uidotdev/usehooks";
import { toast } from "../../components/use-toaster";
import { useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";
import { AxiosError } from "axios";
import {
  MultipleChoiceUI,
  BooleanUI,
  ObjectiveUI,
  OpenEndedUI,
} from "../Comps/Quiz/QuestionTypesUI";
import { Img } from "react-image";
import { Description } from "../../components/App/Description";
import {
  quizQuestionCompProps,
  userResponseProps,
} from "../../Types/quiz.types";
import { IQuiz, IQuestion, question_type } from "../../Types/quiz.types";
import { QuizQueries } from "../../Functions/QuizQueries";
import { QuestionExplanationPopOver } from "./QuestionExplanation";
import { ReportQuestion } from "./ReportQuestion";

const QuestionLoader: FC<{}> = () => {
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
      quiz,
      haveNavigation = true,
      index,
      questionID: qID,
    }: quizQuestionCompProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const { isAuthenticated } = useAuthentication();
    const quizApi = new QuizQueries(isAuthenticated);
    const { isLoading, data, error, refetch } = useQuery<{ data: IQuestion }>({
      queryKey: ["question_id", qID],
      queryFn: () => quizApi.getQuestion(qID, getAnonymousID(isAuthenticated)),
      retry: 2,
    });

    const [animate_to, setAnimate_to] = useState<"left" | "right">("right");

    //--------->HOOKS<----------
    const [questionIDs] = useSessionStorage<string[]>(
      localStorageKeys.questionUUIDs,
      []
    );

    const [isPending, startTransition] = useTransition();
    const { setLoginAttempt } = useZStore();
    const { refs, currentQuizData } = useQuizStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [questionResponse, setQuestionResponse] = useState<userResponseProps>(
      {
        is_correct: false,
        question_explanation: "",
        correct_answer: [],
        open_ended_response: undefined,
        show_answer: false,
        user_answer: [],
      }
    );

    const qs = queryString.parse(location.search) as {
      access_token: string;
      question_id: string;
    };

    //--------->Functions<------------
    const confirmUserAnswer = async (user_answer: (string | boolean)[]) => {
      try {
        const res: {
          data: userResponseProps;
        } = await quizApi.checkUserAnswer({
          questionID: qs.question_id,
          user_answer,
          access_token: qs.access_token,
          anonymous_id: getAnonymousID(isAuthenticated),
        });

        setQuestionResponse({ ...res.data, show_answer: true });

        // !res.data.editted && setQuestionsAnswered("increment");
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

    const submitAnswer = (user_answer: (string | boolean)[]) => {
      startTransition(() => {
        confirmUserAnswer(user_answer);
      });
    };

    //This function helps to navigate from question to question without having to use the navigate funtion
    const navigatorHelper = (question_id: string) => {
      const params = queryString.stringify({
        question_id,
        access_token: qs.access_token,
      });
      navigate(`?${params}#question`);
    };

    // This two function helps with navigating the questions.
    const getNextQuestion = async () => {
      const currentIndex = questionIDs.indexOf(qs.question_id);
      const lengthOfQuestions = questionIDs.length;

      if (currentIndex + 1 === lengthOfQuestions) {
        try {
          await quizApi.submitQuiz(
            quiz.id,
            qs.access_token,
            getAnonymousID(isAuthenticated)
          );
          navigate("#result");
        } catch (error) {
          toast({
            title: "Error",
            description: errorMessageForToast(
              error as AxiosError<{ message: string }>
            ),
            variant: "destructive",
          });
        }
        return;
      }

      setAnimate_to("right");
      navigatorHelper(questionIDs[currentIndex + 1] || questionIDs[0]);
    };
    const getPrevQuestion = () => {
      const currentIndex = questionIDs.indexOf(qs.question_id);

      if (currentIndex === -1 || currentIndex === 0) {
        navigate("#start");
        return;
      }

      setAnimate_to("left");
      navigatorHelper(questionIDs[currentIndex - 1]);
    };

    useEffect(() => {
      const response = data?.data.user_previous_response as userResponseProps;

      setQuestionResponse({ ...response });
    }, [data?.data, qID]);

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

    const questionType: Record<question_type, any> = {
      open_ended: (
        <OpenEndedUI
          state={questionResponse}
          disableAnswer={currentQuizData?.user_status === "is-completed"}
          markQuestion={submitAnswer}
        />
      ),
      objective: (
        <ObjectiveUI
          disableAnswer={currentQuizData?.user_status === "is-completed"}
          quiz={quiz as IQuiz}
          data={data?.data as IQuestion}
          markQuestion={submitAnswer}
          state={questionResponse}
        />
      ),
      multiple_choices: (
        <MultipleChoiceUI
          state={questionResponse}
          disableAnswer={currentQuizData?.user_status === "is-completed"}
          data={data?.data!}
          markQuestion={submitAnswer}
        />
      ),
      true_or_false: (
        <BooleanUI
          disableAnswer={currentQuizData?.user_status === "is-completed"}
          quiz={quiz as IQuiz}
          markQuestion={submitAnswer}
          state={questionResponse}
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
              {/* {Boolean(quiz.time_limit) && (
                <Timer
                  quiz_id={quiz?.id as string}
                  onTimeFinish={() => navigate("#result")}
                  initialTime={quiz?.time_limit || 0}
                />
              )} */}
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
                    className="w-10 h-10 rounded-full bg-transparent"
                  >
                    <Volume2 className="text-green-500" />
                  </Button>
                }
                content="Read question"
              />
            )}
          </div>
          <div className="w-full flex text-green-600 dark:text-green-500 flex-col gap-2 rounded-sm  h-fit p-3">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key={animate_to}
              className="text-2xl text-center josefin-sans-font"
            >
              {data?.data?.question_body}
            </motion.h1>
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
            {questionType[data?.data?.question_type || "objective"]}
          </motion.div>
          <div className="flex items-end w-full justify-between">
            <ReportQuestion question_id={qID} />
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
          {quiz.result_display_type === "on_complete" &&
            questionResponse.show_answer && (
              <QuestionExplanationPopOver {...questionResponse} />
            )}
          {haveNavigation && (
            <div className="absolute bottom-3 w-[95%] gap-3 flex items-center justify-between right-3">
              {!isAuthenticated && (
                <Button
                  onClick={() =>
                    setLoginAttempt({
                      attempt: true,
                      fallback: app_config.explore_page,
                    })
                  }
                  variant={"ghost"}
                >
                  Create Account
                </Button>
              )}

              <QuizNavigation
                prevFunction={getPrevQuestion}
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
