import { Button } from "../../components/Button";
import { MessageSquare, Timer, X } from "lucide-react";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import {
  localStorageKeys,
  quizResultProps,
} from "../../Types/components.types";
import React, { ReactElement } from "react";
import { cn } from "../../lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getQuizResult } from "../../Functions/APIqueries";
import { useCheckPerformance } from "../../Hooks/quizHooks";
import { Tabs } from "../../components/App/Tabs";
import EmptyState from "../../components/App/EmptyState";
import { useLocalStorage } from "@uidotdev/usehooks";
import { useText } from "../../Hooks/text";
import PageLoader from "../../components/Loaders/PageLoader";
import Error from "../Comps/Error";
import { errorMessageForToast } from "../../Functions";
import { formatDistance } from "date-fns";
import { useAuthentication } from "../../Hooks";
import { AxiosError } from "axios";
import { WaitingForMarking } from "./WaitingForMarking";
import { IQuiz } from "../../Types/quiz.types";
import { Description } from "../../components/App/Description";

const content = Object.freeze({
  completionText:
    "Thanks for participating in our quiz! Whether you excelled or faced challenges, each question was an opportunity to learn and grow.",
});

export const QuizResult: React.FC<
  Partial<IQuiz> & { children?: ReactElement; className?: string }
> = ({
  result_display_type,
  id,
  title,
  finish_message,
  children,
  className,
}) => {
  const [anonymous_id] = useLocalStorage<string>(localStorageKeys.anonymous_id);
  const { loading, isAuthenticated } = useAuthentication();
  const { isLoading, data, error, refetch } = useQuery<{
    data: quizResultProps;
  }>({
    queryKey: ["quiz_result", id, isAuthenticated, loading],
    queryFn: () =>
      getQuizResult({
        isAuthenticated,
        anonymous_id,
        quiz_id: id as string,
        ip_address: "",
      }),
  });

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

  return (
    <div className={cn("h-full w-full", className)}>
      {result_display_type === "mark_by_teacher" ? (
        <WaitingForMarking finish_message={finish_message!} />
      ) : (
        <QuizResultsSolo
          {...data?.data}
          title={title as string}
          finish_message={finish_message}
        />
      )}
      {children}
    </div>
  );
};

export const QuizResultsSolo: React.FC<
  quizResultProps & { title: string; finish_message?: string }
> = ({
  feedback,
  wrong_answers,
  end_time,
  start_time,
  xp_earn,
  corrections,
  title,
  finish_message,
  expected_xp,
}) => {
  const color = useCheckPerformance(xp_earn, expected_xp);
  const startTime = new Date(start_time || Date.now()).getTime();
  const endTime = new Date(end_time || Date.now()).getTime();
  const formattedTime = formatDistance(
    new Date(startTime).getTime(),
    new Date(endTime as number)
  );

  const { truncateWord } = useText();
  const stats = (
    <div className="flex flex-col gap-3">
      <ShadowCard className="flex bg-red-50 dark:bg-red-200 hover:shadow-md items-center gap-3">
        <Button className="rounded-full p-[2px] bg-red-400" size={"icon"}>
          <X />
        </Button>
        <div>
          <p className="text-slate-700">Wrong Questions</p>
          <Description
            className="dark:text-gray-500"
            text={`${wrong_answers as number} Wrong Answers`}
          />
        </div>
      </ShadowCard>
      <ShadowCard className="flex bg-yellow-50 dark:bg-yellow-200 hover:shadow-md items-center gap-3">
        <Button className="rounded-full p-[2px] bg-yellow-400" size={"icon"}>
          <Timer />
        </Button>
        <div>
          <p className="text-slate-700">Time Spent On This Quiz</p>
          <Description className="dark:text-gray-500" text={formattedTime} />
        </div>
      </ShadowCard>
      <ShadowCard className="flex bg-green-50 dark:bg-green-200 hover:shadow-md items-center gap-3">
        <Button className="rounded-full p-[2px] bg-green-400" size={"icon"}>
          <MessageSquare />
        </Button>
        <div>
          <p className="text-slate-700">FeedBack</p>
          <Description className="dark:text-gray-500" text={feedback} />
        </div>
      </ShadowCard>
    </div>
  );
  const correctAnswers = (
    <div className="w-full h-[16.5rem] py-3 overflow-auto">
      {!corrections?.length ? (
        <EmptyState className="" state="empty" message="Yay! No Corrections" />
      ) : (
        <div className="flex flex-col gap-2">
          {corrections?.map(({ question, correct_answer }, i) => (
            <div key={i}>
              <code className="text-gray-400">
                {" "}
                {i + 1}. Question: {question}
              </code>
              <Description text={`Answer: ${correct_answer}`} />
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full flex text-slate-600 flex-col">
      <div
        className={cn("flex flex-col gap-2 p-5 rounded-md", color?.bg_color)}
      >
        <div className="flex items-center justify-between">
          <div className="text-slate-600">
            <h1>You just completed {truncateWord(title, 35)} Quiz</h1>
            <p className="hidden md:block">
              {finish_message ?? content.completionText}
            </p>
          </div>
          <CircularProgressbarWithChildren
            value={xp_earn as number}
            maxValue={expected_xp}
            className="w-[5rem] h-[5rem] text-slate-600"
            styles={{
              path: { stroke: "#22c55e" },
              trail: { stroke: "#dcfce7" },
            }}
          >
            {xp_earn}/{expected_xp}
          </CircularProgressbarWithChildren>
        </div>
        <p className="block text-center md:hidden">
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
