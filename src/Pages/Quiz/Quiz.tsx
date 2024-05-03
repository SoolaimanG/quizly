import useKeyboardShortcut from "use-keyboard-shortcut";
import { useDocumentTitle, useLocalStorage } from "@uidotdev/usehooks";
import { QuizNavBar } from "../Comps/Quiz/QuizNavBar";
import { useQuizStore } from "../../provider";
import { Dictionary } from "../../components/App/Dictionary";
import Calculator from "../../components/App/Calculator";
import { Link, useLocation, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getQuizDetails } from "../../Functions/APIqueries";
import PageLoader from "../../components/Loaders/PageLoader";
import Error from "../Comps/Error";
import { errorMessageForToast } from "../../Functions";
import { AxiosError } from "axios";
import { app_config, localStorageKeys } from "../../Types/components.types";
import { toast } from "../../components/use-toaster";
import { StartPage } from "./StartPage";
import { useEffect, useState } from "react";
import { RenderQuestions } from "./RenderQuestions";
import { useAuthentication } from "../../Hooks";
import { QuizResult } from "./QuizResult";
import { Button } from "../../components/Button";
import { IQuiz } from "../../Types/quiz.types";

const ERROR_MESSAGE = "This tool is not allowed in this quiz.";

const Quiz = () => {
  const { id } = useParams();
  const { setOpenDictionary, setOpenCalculator, setCurrentQuizData } =
    useQuizStore();
  const location = useLocation();
  const [view, setView] = useState<"start" | "questions" | "result">("start");
  const { isAuthenticated } = useAuthentication();
  const [anonymous_id] = useLocalStorage<string | undefined>(
    localStorageKeys.anonymous_id
  );

  const { isLoading, data, error, refetch } = useQuery<{ data: IQuiz }>({
    queryKey: ["quiz", id, isAuthenticated],
    queryFn: () => getQuizDetails(id!, anonymous_id!, isAuthenticated),
  });

  useDocumentTitle(data?.data.title ?? "Take Quiz");
  // Open Dictionary
  useKeyboardShortcut(
    ["Control", "d"],
    () => {
      if (!data?.data.allow_word_search) {
        return toast({
          title: "Error",
          description: ERROR_MESSAGE,
          variant: "destructive",
        });
      }

      setOpenDictionary();
    },
    {
      overrideSystem: true,
    }
  );
  // Open Calculator
  useKeyboardShortcut(
    ["Control", "c"],
    () => {
      if (!data?.data.allow_calculator)
        return toast({
          title: "Error",
          description: ERROR_MESSAGE,
          variant: "destructive",
        });
      setOpenCalculator();
    },
    {
      overrideSystem: true,
    }
  );

  useEffect(() => {
    data?.data && setCurrentQuizData(data.data);
  }, [data?.data]);

  useEffect(() => {
    const hash = location.hash.substring(1) as typeof view;

    const notMatching =
      hash === "start" || hash === "questions" || hash === "result";

    (!hash || !notMatching) && setView("start");
    hash === "questions" && setView("questions");
    hash === "start" && setView("start");
    hash === "result" && setView("result");
  }, [location.hash]);

  if (isLoading)
    return <PageLoader className="h-screen" size={100} text="Please wait..." />;

  if (error)
    return (
      <Error
        className="w-full h-screen"
        retry_function={refetch}
        errorMessage={errorMessageForToast(
          error as AxiosError<{ message: string }>
        )}
      />
    );

  const shortCut = (
    <div>
      <Dictionary>
        <></>
      </Dictionary>
      <Calculator answer="" button={<></>} setAnswer={() => {}} />
    </div>
  );
  const views = {
    start: <StartPage data={data?.data!} />,
    questions: <RenderQuestions quiz_id={data?.data.id!} />,
    result: (
      <div className="flex flex-col">
        <QuizResult
          className={" pt-20 md:max-w-4xl px-5 m-auto flex flex-col gap-3"}
          title={data?.data.title}
          id={data?.data?.id}
          result_display_type={data?.data?.result_display_type}
          finish_message={data?.data?.finish_message}
        >
          <Button
            asChild
            variant={"destructive"}
            className="w-full h-[3rem] mt-3"
          >
            <Link to={app_config.my_profile}>Go Home</Link>
          </Button>
        </QuizResult>
        <RenderQuestions disableSubmit quiz_id={data?.data.id!} />
      </div>
    ),
  };

  return (
    <div className="w-full h-screen">
      {/* This will allow the dictionary to show is COMMAND OR CONTROL D is pressed  */}
      {shortCut}
      <QuizNavBar
        quiz_data={{
          allow_word_search: data?.data.allow_word_search,
          allow_calculator: data?.data.allow_calculator,
          title: data?.data.title,
          id: data?.data.id,
          time_limit: data?.data.time_limit,
          total_questions: data?.data.total_questions,
        }}
      />
      {views[view]}
    </div>
  );
};

export default Quiz;
