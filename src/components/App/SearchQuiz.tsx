import {
  Bomb,
  Loader,
  Lock,
  MoveLeft,
  MoveRight,
  Sparkles,
} from "lucide-react";
import ProfileOne from "../../assets/profile_one.png";
import ProfileTwo from "../../assets/profile_two.png";
import ProfileThree from "../../assets/profile_three.png";
import { CalculatorProps, IQuiz } from "../../Types/components.types";
import { Button } from "../Button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../Sheet";
import { Input } from "../Input";
import Glassmorphism from "./Glassmorphism";
import { useState } from "react";
import { Star } from "lucide-react";
import Chip from "./Chip";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../Tooltip";
import { Link, useSearchParams } from "react-router-dom";
import Rating from "./Rating";
import EmptyState from "./EmptyState";
import { seriliazeParams } from "../../Functions";

const dummyData: IQuiz[] = [
  {
    access_with_key: true,
    rating: 1,
    category: "Science",
    created_at: new Date("2023-01-01T10:00:00"),
    descriptions: "Test your knowledge in basic science.",
    difficulty: "medium",
    duration: 120,
    host: {
      profile_image: ProfileOne,
      username: "Soolaiman",
    },
    id: "quiz1",
    quiz_takers: [
      {
        username: "user_one",
      },
      { username: "user_two" },
      { username: "user_three" },
    ],
    requirements: "None",
    subject: "Physics",
    title: "Science Quiz",
  },
  {
    access_with_key: false,
    rating: 3,
    category: "History",
    created_at: new Date("2023-02-15T15:30:00"),
    descriptions: "Explore historical events and figures.",
    difficulty: "hard",
    duration: 90,
    host: {
      profile_image: ProfileOne,
      username: "Soolaiman",
    },
    id: "quiz2",
    quiz_takers: [
      {
        username: "user_four",
      },
      {
        username: "user_one",
      },
      { username: "user_two" },
      { username: "user_three" },
    ],
    requirements: "Previous knowledge in history.",
    subject: "World History",
    title: "History Challenge",
  },
  {
    access_with_key: true,
    category: "Mathematics",
    rating: 5,
    created_at: new Date("2023-03-10T08:45:00"),
    descriptions: "Solve complex math problems and equations.",
    difficulty: "easy",
    duration: 180,
    host: {
      profile_image: ProfileTwo,
      username: "Nazman",
    },
    id: "quiz3",
    quiz_takers: [
      {
        username: "user_five",
      },
      {
        username: "user_four",
      },
      {
        username: "user_one",
      },
      { username: "user_two" },
      { username: "user_three" },
    ],
    requirements: "Advanced math skills",
    subject: "Algebra",
    title: "Mathematics Masterclass",
  },
  {
    access_with_key: false,
    category: "Technology",
    rating: 3,
    created_at: new Date("2023-04-05T14:20:00"),
    descriptions: "Explore the latest in technology and innovation.",
    difficulty: "medium",
    duration: 150,
    host: {
      profile_image: ProfileThree,
      username: "Abdullah",
    },
    id: "quiz4",
    quiz_takers: [
      {
        username: "user_six",
      },
      {
        username: "user_five",
      },
      {
        username: "user_four",
      },
      {
        username: "user_one",
      },
      { username: "user_two" },
      { username: "user_three" },
    ],
    requirements: "Basic knowledge of technology",
    subject: "Digital Trends",
    title: "Tech Insights",
  },
];

const SearchQuiz: React.FC<Pick<CalculatorProps, "button">> = ({ button }) => {
  const [results, _] = useState<IQuiz[]>(dummyData);
  const [___, setSearch] = useSearchParams();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seriliazer = seriliazeParams(e);

    setSearch(seriliazer);
  };

  const [state, __] = useState({
    loading: false,
    error: false,
  });

  const difficulty = {
    easy: {
      icon: <Star />,
      className: "text-green-300 bg-green-100",
    },
    medium: {
      icon: <Sparkles />,
      className: "text-yellow-300 bg-yellow-100",
    },
    hard: {
      icon: <Bomb />,
      className: "text-red-300 bg-red-100",
    },
  };

  return (
    <Sheet>
      <SheetTrigger>{button}</SheetTrigger>
      <SheetContent className="w-full h-screen p-0 md:w-3/4">
        <SheetHeader className="w-full">
          <Glassmorphism
            blur={7}
            className="w-full fixed flex items-center gap-2 justify-start"
          >
            <SheetClose>
              <Button size={"icon"} variant="ghost">
                <MoveLeft />
              </Button>
            </SheetClose>
            <SheetTitle>Explore Quizly</SheetTitle>
          </Glassmorphism>
        </SheetHeader>
        <div className="pt-14 h-full p-2">
          <form className="flex mt-2 items-center gap-1">
            <Input
              name="search"
              onChange={handleChange}
              className="h-[2.5rem] w-full"
              placeholder="Find quizzes within quizly"
            />
            <Button
              type="submit"
              className="h-[2.5rem]"
              size={"icon"}
              variant={"secondary"}
            >
              <MoveRight />
            </Button>
          </form>
          <h1 className="mt-3">
            {results.length >= 1
              ? "Match Results " + results.length
              : " Discover Quizzes"}
          </h1>
          {state.loading ? (
            <div className="w-full h-full flex items-center jus">
              <Loader />
            </div>
          ) : results.length >= 1 ? (
            <div className="w-full overflow-auto flex flex-col gap-2">
              {results.map((quiz) => (
                <Link
                  to={`/quiz/${quiz.id}`}
                  className="w-full group/item transition-all duration-300 ease-in-out hover:shadow-md cursor-pointer rounded-xl relative p-2 flex gap-1 border border-gray-400 dark:border-gray-300 h-fit"
                  key={quiz.id}
                >
                  <span
                    className={`p-2 h-fit rounded-xl ${
                      difficulty[quiz.difficulty].className
                    }`}
                  >
                    {difficulty[quiz.difficulty].icon}
                  </span>
                  <div className="flex transition-all delay-100 ease-linear flex-col gap-1">
                    <h1>{quiz.title}</h1>
                    <div className="flex items-center gap-1">
                      <img
                        className="w-[1.5rem] h-[1.5rem]"
                        src={quiz.host.profile_image as string}
                        alt=""
                      />
                      <SheetDescription>{quiz.host.username}</SheetDescription>
                    </div>
                    <div className="hidden group-hover/item:flex flex-col gap-2">
                      {quiz.requirements && (
                        <div>
                          <p className="underline">Quiz Description</p>
                          <SheetDescription>
                            {quiz.descriptions.slice(0, 100) + "..."}
                          </SheetDescription>
                        </div>
                      )}
                      <Rating rating={quiz.rating} />
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-green-500">
                        {quiz.quiz_takers.length + " people take this quiz"}
                      </p>
                      <Chip
                        type={
                          quiz.difficulty === "easy"
                            ? "default"
                            : quiz.difficulty === "hard"
                            ? "danger"
                            : "warning"
                        }
                        text={quiz.difficulty}
                      />
                    </div>
                  </div>
                  {quiz.access_with_key && (
                    <div className=" absolute top-0 cursor-pointer mt-2 mr-2 right-0">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="w-1 rounded-md">
                              <Lock className="text-red-500" size={17} />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Code is required</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState message="No Quiz Found" state="search" />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SearchQuiz;
