import React, { useEffect, useState, useTransition } from "react";
import { useText } from "../../../Hooks/text";
import {
  IQuestion,
  IQuiz,
  app_config,
  localStorageKeys,
  question_type,
} from "../../../Types/components.types";
import { Button } from "../../../components/Button";
import { QuizNavigation } from "../../../components/App/QuizNavigation";
import { useZStore } from "../../../provider";
import { useAuthentication } from "../../../Hooks";
import { Check, Lightbulb, Loader2, Volume2 } from "lucide-react";
import Hint from "../../../components/Hint";
import {
  capitalize_first_letter,
  errorMessageForToast,
  readAloud,
} from "../../../Functions";
import { Checkbox } from "../../../components/CheckBox";
import { Label } from "../../../components/Label";
import { Textarea } from "../../../components/TextArea";
import { Skeleton } from "../../../components/Loaders/Skeleton";
import { ButtonSkeleton } from "../../../components/App/FilterByCategory";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { markQuestion, get_question } from "../../../Functions/APIqueries";
import Error from "../Error";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/Popover";
import { Description } from "../../ExplorePage/QuickQuiz";
import { AlertCircle } from "lucide-react";
import { useLocalStorage, useSessionStorage } from "@uidotdev/usehooks";
import { toast } from "../../../components/use-toaster";
import { useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";
import { AxiosError } from "axios";
import { Timer } from "../../../components/App/Timer";

//Skeleton loading Component
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

const bool: ["true", "false"] = ["true", "false"];
export const Question: React.FC<{
  quiz_info: IQuiz | undefined;
  question_id: string;
  isLastQuestion: boolean;
}> = ({ quiz_info, question_id }) => {
  const { isAuthenticated } = useAuthentication();
  const { isLoading, data, error, refetch } = useQuery<{ data: IQuestion }>({
    queryKey: [`question_id_${question_id}`],
    queryFn: () => get_question(question_id || ""),
    retry: 2,
  });

  //--------->States<--------
  const [state, setState] = useState<{
    show_answer?: boolean;
    is_correct?: boolean;
    question_type: string;
    correct_answer: string;
  }>({
    is_correct: false,
    question_type: "",
    show_answer: false,
    correct_answer: "",
  });
  const [germanAnswer, setGermanAswer] = useState("");
  const [animate_to, setAnimate_to] = useState<"left" | "right">("right");
  const [buttonClicked, setButtonClicked] = useState<boolean>(false);
  const [multipleAnswers, setMultipleAnswers] = useState<string[]>([]);

  //--------->HOOKS<----------
  const [anonymous_id] = useLocalStorage<string>(localStorageKeys.anonymous_id);
  const [questionIDs] = useSessionStorage<string[]>(
    localStorageKeys.questionUUIDs,
    []
  );
  const [isPending, startTransition] = useTransition();
  const { setLoginAttempt } = useZStore();
  const { getLetter } = useText();
  const navigate = useNavigate();
  const location = useLocation();

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
      //setUserAnswer(res.data.user_answer);
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

  //------->Use Effects to tracking the change in data.data.id this is to clear previous states<---------
  useEffect(() => {
    setState({
      //Clear State
      show_answer: false,
      is_correct: false,
      question_type: "",
      correct_answer: "",
    });
    setButtonClicked(false);
    setMultipleAnswers([]);
    setGermanAswer("");
  }, [data?.data?.id]);

  if (isLoading) return <QuestionLoader />;

  if (error)
    return (
      <Error
        className="mt-3 gap-5"
        errorMessage={errorMessageForToast(
          error as AxiosError<{ message: string }>
        )}
        retry_function={() => refetch()}
      />
    );

  //----------->UIs<------------
  const objectiveUI = (
    <div className="w-full flex flex-col gap-3">
      {data?.data?.options?.map((option, i) => (
        <Button
          onClick={() => {
            setButtonClicked(true);
            submitAnswer(option.body);
          }}
          variant={
            buttonClicked && quiz_info?.result_display_type === "on_complete"
              ? state.correct_answer === option.body
                ? "base"
                : "destructive"
              : "outline"
          }
          className="w-full items-center p-1 justify-start gap-3 h-[3rem]"
          key={i}
        >
          <Button variant={"base"} size={"icon"}>
            {getLetter(i)}
          </Button>
          {option.body}
        </Button>
      ))}
    </div>
  );
  const booleanUI = (
    <div className="w-full flex flex-col gap-5">
      {bool.map((b, i) => (
        <Button
          key={i}
          onClick={() => {
            submitAnswer(b);
          }}
          variant={
            quiz_info?.result_display_type === "on_complete"
              ? state.correct_answer === b
                ? "base"
                : "destructive"
              : "outline"
          }
          className="w-full h-[3rem]"
        >
          {capitalize_first_letter(b)}
        </Button>
      ))}
    </div>
  );
  const multipleChoiceUI = (
    <div className="w-full flex flex-col gap-2">
      {data?.data?.options?.map((option, i) => (
        <Label key={i} className="flex items-center gap-3 text-lg">
          <Checkbox
            checked={multipleAnswers.includes(option.body)}
            value={option.body}
            onCheckedChange={() => {
              if (multipleAnswers.includes(option.body)) {
                setMultipleAnswers((prev) =>
                  prev.filter((a) => a !== option.body)
                );
                return;
              }
              const user_answers = [...multipleAnswers, option.body];
              setMultipleAnswers((prev) => [...prev, option.body]);
              if (user_answers.length === data.data.correct_answer_length) {
                submitAnswer(user_answers);
                return;
              }
            }}
            className="data-[state=checked]:bg-green-500 data-[state=checked]:text-white border-green-500"
          />
          {option.body}
        </Label>
      ))}
    </div>
  );
  const germanUI = (
    <div className="w-full flex flex-col gap-2">
      <Textarea
        value={germanAnswer}
        onChange={(e) => setGermanAswer(e.target.value)}
        className="resize-none"
        rows={7}
        placeholder="Type in your answer"
      />
      <Button
        onClick={() => submitAnswer(germanAnswer)}
        size={"icon"}
        className="w-full h-[3rem]"
        variant={"base"}
      >
        <Check /> Submit
      </Button>
    </div>
  );

  const questionType = {
    german: germanUI,
    objective: objectiveUI,
    multiple_choices: multipleChoiceUI,
    true_or_false: booleanUI,
  };

  return (
    <React.Fragment>
      <div className="mb-10 flex flex-col overflow-hidden gap-2">
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
            <Timer
              quiz_id={quiz_info?.id as string}
              onTimeFinish={() => navigate("#result")}
              initialTime={quiz_info?.time_limit || 0}
              isAuthenticated={isAuthenticated}
            />
          </div>
          {quiz_info?.allow_robot_read && (
            <Hint
              element={
                <Button
                  onClick={() => readAloud({ text: data?.data?.question_body })}
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
            <img
              className="h-[15rem]"
              src={data?.data?.question_image}
              alt="question_img"
            />
          )}
        </div>
        {/* If the options is Objective */}
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
          <Button
            className="flex items-center gap-1"
            variant={"ghost"}
            size="sm"
          >
            <AlertCircle size={15} />
            Report
          </Button>
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
      </div>
    </React.Fragment>
  );
};
