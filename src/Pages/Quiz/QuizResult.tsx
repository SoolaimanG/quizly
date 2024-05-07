import { Button } from "../../components/Button";
import { MessageSquare, RotateCcwIcon, Timer, X, ZapIcon } from "lucide-react";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import React from "react";
import { cn } from "../../lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useCheckPerformance } from "../../Hooks/quizHooks";
import { Tabs } from "../../components/App/Tabs";
import EmptyState from "../../components/App/EmptyState";
import { useText } from "../../Hooks/text";
import PageLoader from "../../components/Loaders/PageLoader";
import Error from "../Comps/Error";
import { errorMessageForToast, getAnonymousID } from "../../Functions";
import { useAuthentication } from "../../Hooks";
import { AxiosError } from "axios";
import { WaitingForMarking } from "./WaitingForMarking";
import { IQuiz, quizResultProps } from "../../Types/quiz.types";
import { Description } from "../../components/App/Description";
import { QuizQueries } from "../../Functions/QuizQueries";
import { useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";
import { formatDistance } from "date-fns";
import Hint from "../../components/Hint";
import { RetakeQuiz } from "./RetakeQuiz";

const content = Object.freeze({
  completionText:
    "Thanks for participating in our quiz! Whether you excelled or faced challenges, each question was an opportunity to learn and grow.",
});

export const QuizResult: React.FC<IQuiz> = ({
  id,
  result_display_type,
  finish_message,
  title,
  allow_retake,
}) => {
  return (
    <div className={cn("h-full w-full")}>
      {result_display_type === "mark_by_teacher" ? (
        <WaitingForMarking finish_message={finish_message!} />
      ) : (
        <QuizResultsSolo
          id={id!}
          data={{ title, finish_message, allow_retake }}
        />
      )}
    </div>
  );
};

export const QuizResultsSolo: React.FC<{
  id: string;
  data: { title: string; finish_message: string; allow_retake: boolean };
}> = ({ id, data: { title, finish_message, allow_retake } }) => {
  const { isAuthenticated } = useAuthentication();
  const quiz = new QuizQueries(isAuthenticated);
  const location = useLocation();
  const navigate = useNavigate();

  const qs = queryString.parse(location.search) as { access_token: string };
  const { truncateWord } = useText();

  const { isLoading, data, error, refetch } = useQuery<{
    data: quizResultProps;
  }>({
    queryKey: ["quiz_result", id, isAuthenticated],
    queryFn: () =>
      quiz.getQuizResult(
        id,
        qs.access_token || "",
        getAnonymousID(isAuthenticated)
      ),
  });

  const closeTab = () => {
    navigate("#start");
  };

  const restartQuiz = async () => {};

  if (isLoading) return <PageLoader size={90} text="Getting Your Result" />;

  if (error)
    return (
      <Error
        errorMessage={errorMessageForToast(
          error as AxiosError<{ message: string }>
        )}
        retry_function={refetch}
      />
    );

  const color = useCheckPerformance(
    data?.data.questions_attempted,
    data?.data.total_questions
  );

  const stats = (
    <div className="flex flex-col gap-3">
      <ShadowCard className="flex bg-green-50 dark:bg-green-200 hover:shadow-md items-center gap-3">
        <Button className="rounded-full p-[2px] bg-green-500" size={"icon"}>
          <ZapIcon />
        </Button>
        <div>
          <h1 className="text-slate-700 josefin-sans-font">
            XP Earn In This Quiz
          </h1>
          <Description
            className="dark:text-gray-500"
            text={`${data?.data.expected_xp as number} XP`}
          />
        </div>
      </ShadowCard>
      <ShadowCard className="flex bg-red-50 dark:bg-red-200 hover:shadow-md items-center gap-3">
        <Button className="rounded-full p-[2px] bg-red-400" size={"icon"}>
          <X />
        </Button>
        <div>
          <h1 className="josefin-sans-font text-slate-700">Wrong Questions</h1>
          <Description
            className="dark:text-gray-500"
            text={`${data?.data.wrong_answers as number} Wrong Answers`}
          />
        </div>
      </ShadowCard>
      <ShadowCard className="flex bg-yellow-50 dark:bg-yellow-200 hover:shadow-md items-center gap-3">
        <Button className="rounded-full p-[2px] bg-yellow-400" size={"icon"}>
          <Timer />
        </Button>
        <div>
          <h1 className="josefin-sans-font text-slate-700">
            Time Spent On This Quiz
          </h1>
          <Description
            className="dark:text-gray-500"
            text={formatDistance(
              new Date(data?.data.start_time!),
              new Date(data?.data.end_time!)
            )}
          />
        </div>
      </ShadowCard>
      <ShadowCard className="flex bg-green-50 dark:bg-green-200 hover:shadow-md items-center gap-3">
        <Button className="rounded-full p-[2px] bg-green-400" size={"icon"}>
          <MessageSquare />
        </Button>
        <div>
          <h1 className="josefin-sans-font text-slate-700">FeedBack</h1>
          <Description
            className="dark:text-gray-500"
            text={data?.data.feedback}
          />
        </div>
      </ShadowCard>
      <div className="mt-2 w-full flex items-center gap-2">
        {allow_retake && (
          <RetakeQuiz>
            <Hint
              element={
                <Button className="w-[12%]" variant="secondary" size="icon">
                  <RotateCcwIcon className="text-green-500" />
                </Button>
              }
              content="Retake Quiz"
            />
          </RetakeQuiz>
        )}
        <Button onClick={closeTab} variant="destructive" className="w-full">
          Close
        </Button>
      </div>
    </div>
  );
  const correctAnswers = (
    <div className="w-full h-[16.5rem] py-3 overflow-auto">
      {!data?.data?.corrections?.length ? (
        <EmptyState className="" state="empty" message="Yay! No Corrections" />
      ) : (
        <div className="flex flex-col gap-2">
          {data?.data?.corrections?.map(({ question, explanation }, i) => (
            <div key={i}>
              <h1 className="josefin-sans-font">
                {" "}
                {i + 1}. Question: {question}
              </h1>
              <Description text={`Correct Answer: ${explanation}`} />
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full flex text-slate-600 flex-col">
      <div
        className={cn("flex flex-col gap-2 p-5 rounded-md", "color?.bg_color")}
      >
        <div className="flex items-center justify-between">
          <div className="">
            <h1 className="josefin-sans-font dark:text-white">
              You just completed {truncateWord(title, 35)}
            </h1>
            <p className="hidden md:block">
              {finish_message ?? content.completionText}
            </p>
          </div>
          <CircularProgressbarWithChildren
            value={data?.data.questions_attempted || 0}
            maxValue={data?.data.total_questions}
            className={cn("w-[5rem] h-[5rem]")}
            styles={{
              path: { stroke: color?.circular_color?.stroke },
              trail: { stroke: color?.circular_color?.path },
            }}
          >
            {data?.data.questions_attempted as number}/
            {data?.data?.total_questions as number}
          </CircularProgressbarWithChildren>
        </div>
        <p className="block text-green-500 text-center md:hidden">
          {finish_message ?? content.completionText}
        </p>
      </div>

      <Tabs
        header={["stats", "corrections"]}
        elements={[stats, correctAnswers]}
      />
    </div>
  );
};

export const ShadowCard: React.FC<{
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}> = ({ className, children, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "w-full cursor-pointer h-fit shadow-sm p-2 rounded-md",
        className
      )}
    >
      {children}
    </div>
  );
};
