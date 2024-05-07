import { localStorageKeys } from "../../Types/components.types";
import { Button } from "../../components/Button";
import { FC, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { QuizStartView } from "./QuizStartView";
import Error from "../Comps/Error";
import { useAuthentication } from "../../Hooks";
import { QuizQuestion } from "../Quiz/QuizQuestion";
import { QuizResult } from "../Quiz/QuizResult";
import { IQuiz } from "../../Types/quiz.types";
import PageLoader from "../../components/Loaders/PageLoader";
import { QuizQueries } from "../../Functions/QuizQueries";
import { useSessionStorage } from "@uidotdev/usehooks";
import queryString from "query-string";
import { getAnonymousID } from "../../Functions";

export const QuickQuiz: FC<{ quiz?: IQuiz }> = ({ quiz: optionalQuizData }) => {
  const { isAuthenticated } = useAuthentication();
  const quiz = new QuizQueries(isAuthenticated);
  const [quizProps, setQuizProps] = useState<IQuiz | undefined>();

  const { isLoading, data, error, refetch } = useQuery<{ data: IQuiz }>({
    queryKey: ["get_quick_quiz"],
    queryFn: () => quiz.getQuickQuiz(getAnonymousID(isAuthenticated)),
    retry: 1,
    refetchInterval: 30000,
    enabled: !optionalQuizData,
  });

  const location = useLocation();
  const [view, setView] = useState<"question" | "result" | "start">("start");
  const [questionIDs] = useSessionStorage<string[]>(
    localStorageKeys.questionUUIDs,
    []
  );

  const qs = queryString.parse(location.search) as { question_id: string };
  const questionIndex = questionIDs.indexOf(qs.question_id);

  useEffect(() => {
    if (!data?.data && !optionalQuizData) {
      return;
    }

    setQuizProps(data?.data || optionalQuizData);
  }, [data?.data, optionalQuizData]);

  useEffect(() => {
    const hash = location.hash.substring(1) as typeof view;

    const notMatching =
      hash === "question" || hash === "result" || hash === "start";

    (!hash || !notMatching) && setView("start");

    hash === "question" && setView("question");
    hash === "result" && setView("result");
    hash === "start" && setView("start");
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
    start: <QuizStartView data={quizProps} />,
    question: (
      <QuizQuestion quiz={quizProps!} questionID={questionIDs[questionIndex]} />
    ),
    result: <QuizResult {...quizProps!} />,
  };

  return (
    <div className="h-full">
      {/*</div>*/}
      <div className="w-full flex items-center -mt-2 md:-mt-3 justify-center">
        <Button
          variant={"base"}
          size={"lg"}
          className="text-xl rounded-none rounded-b-md"
        >
          Quick Quiz
        </Button>
      </div>
      <div className="w-full h-full md:-mt-4 mt-1">{views[view]}</div>
    </div>
  );
};
