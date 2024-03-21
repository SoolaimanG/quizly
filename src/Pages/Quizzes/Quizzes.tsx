import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuthentication } from "../../Hooks";
import NavBar from "../ExplorePage/NavBar";
import { getQuizzesForUser } from "../../Functions/APIqueries";
import EmptyState from "../../components/App/EmptyState";
import { QuizListUI, QuizLoadingSkeleton } from "../ExplorePage/QuizListUI";
import { useIntersectionObserver } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";
import { Combobox } from "../../components/ComboBox";
import { IQuiz, combo_box_type } from "../../Types/components.types";
import { Button } from "../../components/Button";
import { FilterIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const _difficulty: combo_box_type<string>[] = [
  {
    value: "hard",
    label: "Hard",
  },
  {
    value: "medium",
    label: "Medium",
  },
  {
    value: "easy",
    label: "Easy",
  },
];

const _rating: combo_box_type<string>[] = [
  {
    value: "1",
    label: "One",
  },
  {
    value: "2",
    label: "Two",
  },
  {
    value: "3",
    label: "Three",
  },
  {
    value: "4",
    label: "Four",
  },
  {
    value: "5",
    label: "Five",
  },
];

const Quizzes = () => {
  const { isAuthenticated } = useAuthentication();
  const [difficulty, setDifficulty] = useState("");
  const [rating, setRating] = useState("");
  const [ref, entry] = useIntersectionObserver({ threshold: 0.3 });
  const { isLoading, data, fetchNextPage } = useInfiniteQuery<{
    data: IQuiz[];
  }>({
    queryKey: ["get_quizzes"],
    queryFn: ({ pageParam = 1 }) => getQuizzesForUser(Number(pageParam) * 10),
    initialPageParam: 1,
    getNextPageParam(_, __, lastPageParams) {
      if (0 === 0) return undefined;

      return (lastPageParams as number) + 1;
    },
  });
  const [quizzes, setQuizzes] = useState<IQuiz[]>([]);

  useEffect(() => {
    if (data) {
      setQuizzes(data.pages.flatMap((pg) => pg.data));
    }
  }, [data]),
    useEffect(() => {
      if (entry?.isIntersecting) {
        fetchNextPage();
      }
    }, [entry?.isIntersecting]);

  const filterQuiz = () => {
    setQuizzes(
      data?.pages[0].data
        .filter((quiz) =>
          difficulty
            ? quiz.difficulty.toLowerCase() === difficulty.toLowerCase()
            : true
        )
        .filter((q) => (!rating ? true : q.rating === Number(rating))) ?? []
    );
  };

  const handleSearch = (q: string) => {
    if (!q) {
      setQuizzes(data?.pages[0].data ?? []);
      return;
    }

    const searchQuizzes = data?.pages[0].data?.filter(
      (quiz) =>
        quiz?.title?.toLowerCase().includes(q.toLowerCase()) ||
        quiz?.descriptions?.toLowerCase().includes(q.toLowerCase()) ||
        quiz?.difficulty?.toLowerCase().includes(q.toLowerCase()) ||
        quiz?.category?.toLowerCase().includes(q.toLowerCase()) ||
        quiz?.subject?.toLowerCase().includes(q.toLowerCase())
    );
    setQuizzes(searchQuizzes ?? []);
  };

  return (
    <div className="flex flex-col gap-3">
      <NavBar
        onSubmit={handleSearch}
        show_search_bar
        navbarText="Quizzes"
        isAuthenticated={isAuthenticated}
      />
      <nav className="w-full flex items-end justify-end px-2 pt-16">
        <div className="flex items-center gap-2">
          <Combobox
            title="Select Difficulty"
            data={_difficulty}
            setValue={setDifficulty}
            value={difficulty}
            search=""
            setSearch={() => {}}
          />
          <Combobox
            title="Select Rating"
            data={_rating}
            setValue={setRating}
            value={rating}
            search=""
            setSearch={() => {}}
          />
          <Button onClick={filterQuiz} className="flex items-center gap-2">
            <FilterIcon size={15} />
            <p className=" hidden md:block">Filter</p>
          </Button>
        </div>
      </nav>
      <div className="w-full">
        {isLoading && (
          <QuizLoadingSkeleton
            className="grid grid-cols-3 gap-3 w-full"
            len={10}
            view="small"
          />
        )}
        {!isLoading && !quizzes.length && (
          <EmptyState
            message="No Quiz Matches Your Filter"
            state="search"
            className="flex items-center justify-center w-screen"
          />
        )}
        <AnimatePresence>
          <motion.div
            layout
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { ease: "linear" },
              layout: { duration: 0.3 },
            }}
            className="w-full grid md:grid-cols-3 grid-cols-1  gap-3 p-3"
          >
            {!isLoading &&
              !!quizzes.length &&
              quizzes.map((quiz, index) => (
                <QuizListUI
                  key={index}
                  ref={quizzes.length - 2 === index ? ref : undefined}
                  className="h-fit"
                  data={quiz}
                  type="small"
                  isLoading={false}
                />
              ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Quizzes;
