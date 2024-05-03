import { app_config } from "../../Types/components.types";
import { Button } from "../../components/Button";
import { FC, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "react-router-dom";
import { QuizStartView } from "./QuizStartView";
import Error from "../Comps/Error";

import queryString from "query-string";
import { useAuthentication } from "../../Hooks";
import { QuizQuestion } from "../Quiz/QuizQuestion";
import { QuizResult } from "../Quiz/QuizResult";
import { RetakeQuizButton } from "../../components/App/RetakeQuizButton";
import { IQuiz } from "../../Types/quiz.types";
import PageLoader from "../../components/Loaders/PageLoader";
import { QuizQueries } from "../../Functions/QuizQueries";

export const QuickQuiz: FC<{}> = () => {
  const { isAuthenticated } = useAuthentication();
  const quiz = new QuizQueries(isAuthenticated);
  const { isLoading, data, error, refetch } = useQuery<{ data: IQuiz }>({
    queryKey: ["get_quick_quiz"],
    queryFn: () => quiz.getQuickQuiz(),
    retry: 1,
    refetchInterval: 30000,
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

  if (isLoading)
    return <PageLoader size={50} text="Please wait" className="h-full" />;

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
    start: <QuizStartView data={data?.data} />,
    question: <QuizQuestion quiz={data?.data!} question_id={question_id} />,
    result: (
      <QuizResult {...data?.data}>
        <div className="flex absolute bottom-4 w-full gap-3">
          <RetakeQuizButton
            to_go={"#start"}
            quiz_id={data?.data?.id as string}
          />
          <Button asChild variant="base" className="w-full h-[3rem]">
            <Link to={app_config.more_quizzes}>Another Quiz</Link>
          </Button>
        </div>
      </QuizResult>
    ),
  };

  return (
    <div className="h-full">
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
      <div className="w-full h-full md:-mt-4 -mt-4">{views[view]}</div>
    </div>
  );
};
