import { IQuiz, localStorageKeys } from "../../Types/components.types";
import { Button } from "../../components/Button";
//import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Question } from "../Comps/Quiz/Question";
import { useQuery } from "@tanstack/react-query";
import {
  getTrendingQuiz,
  //nextQuestion,
  //startQuiz,
} from "../../Functions/APIqueries";
import { useLocation } from "react-router-dom";
import { QuizStartView } from "./QuizStartView";
import { QuizEndView } from "./QuizEndView";
import Error from "../Comps/Error";
//import { toast } from "../../components/use-toaster";
//import { errorMessageForToast } from "../../Functions";

import queryString from "query-string";
import { useLocalStorage } from "@uidotdev/usehooks";
import { cn } from "../../lib/utils";
import { useAuthentication } from "../../Hooks";

export const QuickQuiz = () => {
  const { isAuthenticated } = useAuthentication();
  const [anonymous_id] = useLocalStorage<string>(localStorageKeys.anonymous_id);
  const { isLoading, data, error, refetch } = useQuery<{ data: IQuiz[] }>({
    queryKey: ["get_trending_quiz"],
    queryFn: () => getTrendingQuiz(isAuthenticated, anonymous_id ?? ""),
    retry: 1,
  });

  const location = useLocation();
  const [view, setView] = useState<"question" | "result" | "start">("start");
  const [question_id, setQuestionID] = useState("");

  useEffect(() => {
    const hash = location.hash.substring(1) as typeof view;

    const notMatching =
      hash === "question" || hash === "result" || hash === "start";

    (!hash || !notMatching) && setView("start");
    hash === "question" && setView("question");
    hash === "result" && setView("result");
    hash === "start" && setView("start");

    hash === "question" &&
      setQuestionID(queryString.parse(location.search).questionid as string);
  }, [location.search, location.hash]);

  if (isLoading) return "";

  if (error)
    return (
      <Error
        className="mt-5"
        retry_function={() => refetch()}
        errorMessage="Error getting the quiz"
      />
    );

  //All the views to be render for the quick quiz Starting Page, The Questions Page and Score/Final Page
  const views = {
    start: <QuizStartView data={data?.data[0] as IQuiz} />,
    question: (
      <Question
        isLastQuestion
        question_id={question_id}
        quiz_info={data?.data[0]}
      />
    ),
    result: <QuizEndView {...data?.data[0]} />,
  };

  return (
    <>
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
    </>
  );
};

export const Description = ({
  text,
  className,
}: {
  text?: string;
  className?: string;
}) => {
  return (
    <p className={cn("text-sm text-muted-foreground", className)}>
      {text || ""}
    </p>
  );
};
