import { QuizNavigation } from "../../components/App/QuizNavigation";
import {
  IQuestion,
  IQuiz,
  IUser,
  app_config,
  localStorageQuestions,
} from "../../Types/components.types";
import { useMethods } from "../../Hooks";
import { Button } from "../../components/Button";
import { Loader2 } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { useZStore } from "../../provider";
import { useLocalStorage } from "@uidotdev/usehooks";
import { Question } from "../Comps/Quiz/Question";
import { useQuery } from "@tanstack/react-query";
import { getQuickQuiz } from "../../Functions/APIqueries";
import { Link, useSearchParams } from "react-router-dom";
import { useQuizHook } from "../../Hooks/quizHooks";
import { RotateCcw } from "lucide-react";
import { useText } from "../../Hooks/text";
import Rating from "../../components/App/Rating";

export const QuickQuiz: React.FC<{ user: IUser | null }> = ({ user }) => {
  const { isLoading, data, error } = useQuery<
    string,
    any,
    { data: { data: IQuestion[]; quiz: IQuiz } }
  >({
    queryKey: ["quick_quiz"],
    queryFn: () => getQuickQuiz(false),
    retry: 1,
  });
  const [view, setView] = useLocalStorage<"start" | "question" | "end">(
    "quickQuizView",
    "start"
  );
  const [q, setQ] = useLocalStorage<localStorageQuestions>("questions", {
    score: 0,
    answered_question: [],
  });

  const [questionNumber, setQuestionNumber] = useSearchParams();

  const navigate_through_question = (navigate: "prev" | "next") => {
    if (!questionNumber.has("question-number"))
      return setQuestionNumber("question-number=0");

    const questionNum = Number(questionNumber.get("question-number"));

    if (typeof questionNum === "undefined") return;

    if (navigate === "prev") {
      if (questionNum <= 0) return setView("start");

      setQuestionNumber("question-number=" + (questionNum - 1 + ""));
    } else {
      if (
        questionNum >= (data?.data.data.length as number) - 1 &&
        q.answered_question.length === data?.data.data.length
      )
        return setView("end");

      if (questionNum >= (data?.data.data.length as number) - 1)
        return setQuestionNumber("question-number=0");
      setQuestionNumber("question-number=" + (questionNum + 1 + ""));
    }
  };

  const [states, __] = useState({
    error: false,
    has_started_quiz: false,
  });
  const [isPending, ___] = useTransition();

  useEffect(() => {
    view === "question" &&
      !questionNumber.has("question-number") &&
      setQuestionNumber(`question-number=0`);
  }, [view]);

  const start_quiz = async () => {
    if (view === "start") {
      setView("question");
      return;
    }

    //
  };

  const go_to_prev = async () => {
    setView("start");
  };

  const views = {
    start: (
      <QuizStartPage
        view={view}
        start_quiz={start_quiz}
        go_to_prev={go_to_prev}
        states={states}
        data={data?.data.quiz as IQuiz}
      />
    ),
    question: (
      <Question
        state={isLoading ? "loading" : error ? "error" : "success"}
        questionData={
          data?.data.data[
            Number(questionNumber.get("question-number")) || 0
          ] as IQuestion
        }
        teacher_rules={{ allow_robot_read: false }}
        navigationFunc={navigate_through_question}
      />
    ),
    end: (
      <QuizEnd
        data={data?.data.data as IQuestion[]}
        restartFunc={() => {
          setQ({
            score: 0,
            answered_question: [],
          });
          setView("start");
          setQuestionNumber("question-number=0");
        }}
        user_score={q.score}
      />
    ),
  };

  return (
    <div className="h-full p-2 pt-0 pb-6 flex flex-col gap-3 relative bg-gray-50 dark:bg-slate-700 rounded-md md:w-1/2 w-full">
      {/*<div>*/}
      {isPending && (
        <Loader2
          size={15}
          className="absolute top-2 right-2 animate-spin text-green-500 "
        />
      )}
      {/*</div>*/}
      <div className="w-full flex items-center justify-center">
        <Button
          variant={"base"}
          size={"lg"}
          className="text-xl rounded-none rounded-b-md"
        >
          Quick Quiz
        </Button>
      </div>
      {views[view]}
    </div>
  );
};

export const QuizStartPage = ({
  data,
  states,
  start_quiz,
  go_to_prev,
  view,
}: {
  data: IQuiz;
  states: { error: boolean; has_started_quiz: boolean };
  start_quiz: () => void;
  go_to_prev: () => void;
  view: "start" | "question" | "end";
}) => {
  const { isAuthenticated } = useMethods();
  const { setLoginAttempt } = useZStore();
  const { truncateWord } = useText();

  return (
    <div className="w-full pb-8">
      <h1 className="text-center text-2xl text-green-500">{data?.title}</h1>
      <p className="text-base text-center underline">{data.title}</p>
      <div className="flex flex-col gap-2 mt-4">
        <div className="flex gap-2">
          <h1 className="text-lg">Instructions-</h1>
          <span className="text-[1rem]">{data.instructions}</span>
        </div>
        <div className="flex gap-2">
          <h1 className="text-lg">Description-</h1>
          <span className="text-[1rem]">
            {truncateWord(data.instructions as string, 100)}
          </span>
        </div>
        <div className="flex gap-2">
          <h1 className="text-lg">Requirements-</h1>
          <span className="text-[1rem]">{data.requirements}</span>
        </div>
        <div className="flex gap-2">
          <h1 className="text-lg">Requirements-</h1>
          <Rating rating={data.rating as number} />
        </div>
        <div className="flex gap-2">
          <h1 className="text-lg">Posted By-</h1>
          <Button variant={"link"} className="p-0" asChild>
            <Link
              to={app_config.user + data?.host.username}
              className="text-[1rem]"
            >
              {data.host.username}{" "}
            </Link>
          </Button>
        </div>
      </div>
      <div className="absolute  bottom-3 w-full p-1 gap-3 flex items-center justify-between right-3">
        {!isAuthenticated() && (
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
        {!states.has_started_quiz ? (
          <QuizNavigation
            prevFunction={go_to_prev}
            havePrev={view != "start"}
            nextFunction={start_quiz}
          />
        ) : (
          <div className="w-full gap-3 flex items-center justify-end">
            <Button onClick={() => {}} variant={"base"}>
              Continue
            </Button>
            <Button onClick={() => {}} variant={"destructive"}>
              Random Quiz
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export const QuizEnd: React.FC<{
  data: IQuestion[];
  restartFunc?: () => void;
  user_score: number;
}> = ({ data, restartFunc, user_score }) => {
  const { scoreRating } = useQuizHook();
  const { login_required } = useMethods();

  const totalScore = data.reduce((acc, curr) => {
    return acc + curr.question_point;
  }, 0);
  const { UI } = scoreRating(totalScore as number, user_score);

  const [isPending, startTransition] = useTransition();

  const getAnotherQuiz = () => {
    login_required();

    startTransition(() => {
      //
    });
  };

  return (
    <div className="w-full flex items-center justify-center flex-col gap-3">
      {UI}
      <div className="flex w-full flex-col gap-2 mt-3">
        <Button
          onClick={restartFunc}
          variant={"destructive"}
          className="w-full flex items-center gap-2 h-[3rem]"
        >
          <RotateCcw />
          Restart
        </Button>
        <Button
          onClick={getAnotherQuiz}
          disabled={isPending}
          variant={"base"}
          className="w-full h-[3rem]"
        >
          Another Quiz
        </Button>
      </div>
    </div>
  );
};
