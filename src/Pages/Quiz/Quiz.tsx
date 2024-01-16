import useKeyboardShortcut from "use-keyboard-shortcut";
import { useDocumentTitle } from "@uidotdev/usehooks";
import { QuizNavBar } from "../Comps/Quiz/QuizNavBar";
import { useQuizStore } from "../../provider";
import { Dictionary } from "../../components/App/Dictionary";
import Calculator from "../../components/App/Calculator";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getQuizDetails } from "../../Functions/APIqueries";
import PageLoader from "../../components/Loaders/PageLoader";
import Error from "../Comps/Error";
import { errorMessageForToast } from "../../Functions";
import { AxiosError } from "axios";
import { IQuiz } from "../../Types/components.types";
import { toast } from "../../components/use-toaster";
import { StartPage } from "./StartPage";
import { useEffect, useState } from "react";

const ERROR_MESSAGE = "This tool is not allowed in this quiz.";

const Quiz = () => {
  const { id } = useParams();
  const { setOpenDictionary, setOpenCalculator, setCurrentQuizData } =
    useQuizStore();

  const { isLoading, data, error, refetch } = useQuery<{ data: IQuiz }>({
    queryKey: ["quiz", id],
    queryFn: () => getQuizDetails(id as string),
  });

  useDocumentTitle(data?.data.title || "Take Quiz");
  // Open Dictionary
  useKeyboardShortcut(
    ["Control", "d"],
    () => {
      if (!data?.data.allow_word_search)
        return toast({
          title: "Error",
          description: ERROR_MESSAGE,
          variant: "destructive",
        });
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

  if (isLoading)
    return <PageLoader className="h-screen" size={100} text="Please wait..." />;

  if (error)
    return (
      <Error
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
        }}
        headerText="Quiz"
        show_timer={false}
      />
      {views["start"]}
    </div>
  );
};

export default Quiz;
