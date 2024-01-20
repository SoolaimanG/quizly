import { useQuery } from "@tanstack/react-query";
import { getQuizQuestions } from "../../Functions/APIqueries";
import { useAuthentication } from "../../Hooks";
import { useLocalStorage } from "@uidotdev/usehooks";
import { app_config, localStorageKeys } from "../../Types/components.types";
import PageLoader from "../../components/Loaders/PageLoader";
import Error from "../Comps/Error";
import { errorMessageForToast} from "../../Functions";
import { AxiosError } from "axios";
import { useQuizStore } from "../../provider";
import { QuizQuestion } from "./QuizQuestion";
import { Card, CardContent } from "../../components/Card";
import { Button } from "../../components/Button";
import { MenuIcon, X } from "lucide-react";
import Hint from "../../components/Hint";
import React, { RefObject, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FileSpreadsheet } from "lucide-react";
import { Frown } from "lucide-react";
import { Link } from "react-router-dom";

export const RenderQuestions: React.FC<{ quiz_id: string }> = ({ quiz_id }) => {
  const { isAuthenticated } = useAuthentication();
  const { currentQuizData, setQuestionsAnswered } =
    useQuizStore();
  const [anonymous_id] = useLocalStorage<string>(localStorageKeys.anonymous_id);
  const [showQuestionList, setShowQuestionList] = useState(false);
  // const [ids, setIds] = useState<string[]>([]);
  const [refs, setRefs] = useState<RefObject<HTMLDivElement>[]>([]);

  const { isLoading, data, error, refetch } = useQuery<{
    data: {
      ids: string[];
      questions_remaining: boolean;
      questions_answered: number;
    };
  }>({
    queryKey: ["quiz", quiz_id],
    queryFn: () => getQuizQuestions({ quiz_id, isAuthenticated, anonymous_id }),
  });
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (data) {
      // setIds(data.data.ids)
      const allRefs = data.data.ids.map(() =>
        React.createRef<HTMLDivElement>()
      );
      setRefs(allRefs);
      for (let i = 0; i < data.data.questions_answered; i++) {
        setQuestionsAnswered("increment");
      }
    }
  }, [data]);

  const handleScroll = (index: number) => {
    setActive(index);

    const ref = refs[index];

    ref.current?.scrollIntoView({
      inline: "center",
      behavior: "smooth",
    });

    // handleScrollToNextQuestion(ref)
  };

  if (isLoading) return <PageLoader size={80} text="Getting Questions..." />;

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
    <motion.div className="pt-16 relative flex gap-4 py-5 w-full">
      <Hint
        element={
          <Button
            onClick={() => setShowQuestionList((prev) => !prev)}
            size={"icon"}
            variant={"secondary"}
            className="fixed top-10 mt-10 md:left-4 left-2"
          >
            {showQuestionList ? <X /> : <MenuIcon />}
          </Button>
        }
        content={showQuestionList ? "Close List" : "Questions List"}
        side="right"
      />

      <AnimatePresence>
        {showQuestionList && (
          <motion.div
            className="h-screen sticky top-24"
            animate={{ width: "5%", opacity: 1 }}
            exit={{ width: "0%", opacity: 0 }}
          >
            <div className="w-full md:ml-4 ml-2 mt-10 flex flex-col gap-3">
              {[...Array(data?.data.ids.length)].map((_, i) => (
                <Button
                  onClick={() => handleScroll(i)}
                  variant={active === i ? "outline" : "ghost"}
                  size="icon"
                  key={i}
                >
                  {i + 1}
                </Button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        animate={{ width: showQuestionList ? "95%" : "100%" }}
        className=" md:max-w-4xl px-5 m-auto flex flex-col gap-3"
      >
        {data?.data?.ids?.map((id, index) => (
          <Card className="dark:bg-slate-950 bg-gray-50" key={id}>
            <CardContent>
              <QuizQuestion
                ref={refs[index]}
                displayTimer={false}
                haveNavigation={false}
                quiz={currentQuizData!}
                question_id={id}
              />
            </CardContent>
          </Card>
        ))}
        <div className="w-full mt-5 flex-col gap-3 flex items-center justify-center">
          {!data?.data.questions_remaining ? (
            <div className="w-full items-center justify-center flex flex-col gap-3">
              <FileSpreadsheet size={100} />
              <h1 className="text-2xl text-center">
                All done! Ready to submit your quiz?
              </h1>
            </div>
          ) : (
            <div className="w-full items-center justify-center flex flex-col gap-3">
              <Frown size={100} />
              <h1 className="text-2xl text-center">
                Login to view all questions
              </h1>
              <Button asChild variant="link">
                <Link to={app_config.login_page}>Login</Link>
              </Button>
            </div>
          )}
          <Button className="h-[4.5rem] w-full" variant="base">
            Submit
          </Button>
        </div>
      </motion.div>
    </motion.div>
    // </AnimatePresence>
  );
};
