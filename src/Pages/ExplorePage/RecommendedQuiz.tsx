import { FC, useEffect } from "react";
import { QuizQueries } from "../../Functions/QuizQueries";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { IQuiz } from "../../Types/quiz.types";
import { Skeleton } from "../../components/Loaders/Skeleton";
import { useExplorePageProvider } from "../../provider";
import queryString from "query-string";
import { useLocation } from "react-router-dom";
import { subjects } from "../../Types/components.types";
import { QuizDetailsSneakPeak } from "../Quiz/QuizDetailsSneakPeak";

export const RecommendedQuiz: FC<{}> = () => {
  const quiz = new QuizQueries();
  const location = useLocation();
  const {
    setRecommendedQuizzes,
    filterRecommendedQuiz,
    recommendedQuizzes,
    setFilterRecommendedQuiz,
  } = useExplorePageProvider();
  const { isLoading, data } = useQuery<{ data: IQuiz[] }>({
    queryKey: ["recommended-quizzes"],
    queryFn: () => quiz.getTrendingQuiz(false),
  });

  const qs = queryString.parse(location.search, { parseBooleans: true }) as {
    category: subjects;
  };

  useEffect(() => {
    if (!data?.data) {
      return;
    }

    setRecommendedQuizzes(data.data);
  }, [data?.data]);

  useEffect(() => {
    if (!qs.category || !recommendedQuizzes.length) {
      setFilterRecommendedQuiz(recommendedQuizzes);
      return;
    }

    // Check if the user filter quiz by category if yes then filter for the user
    const filtered_quiz = recommendedQuizzes.filter(
      (q) => q.category.toLowerCase() === qs.category.toLowerCase()
    );

    setFilterRecommendedQuiz(filtered_quiz);
  }, [recommendedQuizzes, qs.category]);

  if (isLoading)
    return (
      <div className="w-full md:p-0 overflow-auto flex items-center gap-2">
        {[...new Array(5)].map((_, i) => (
          <div key={i} className="w-[18rem] flex flex-col gap-2">
            <Skeleton className="h-[20rem] w-[18rem] rounded-md" />
            <Skeleton className="rounded-md w-full h-[3rem]" />
          </div>
        ))}
      </div>
    );

  return (
    <div className="overflow-auto w-full">
      <AnimatePresence>
        <motion.div
          layout
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { ease: "linear" },
            layout: { duration: 0.3 },
          }}
          className="w-fit flex gap-5"
        >
          {filterRecommendedQuiz?.map((quiz) => (
            <QuizDetailsSneakPeak key={quiz.id} {...quiz} />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
