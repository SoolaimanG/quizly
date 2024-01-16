import { Link } from "react-router-dom";
import { IQuiz, app_config } from "../../Types/components.types";
import { Badge } from "../../components/Badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/Avatar";
import { Label } from "../../components/Label";
import Glassmorphism from "../../components/App/Glassmorphism";
import { Bomb, Eye, Star } from "lucide-react";
import { Button } from "../../components/Button";
import { useText } from "../../Hooks/text";
import { Calendar } from "lucide-react";
import Rating from "../../components/App/Rating";
import Chip from "../../components/App/Chip";
import { Sparkles } from "lucide-react";
import Hint from "../../components/Hint";
import { Lock } from "lucide-react";
import { Skeleton } from "../../components/Loaders/Skeleton";
import ProfilePicture from "../../assets/profile_four.png";
import { motion } from "framer-motion";
import { Rate } from "../../components/App/Rate";

export const difficultyRanking = {
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

const _IMAGE =
  "https://img.freepik.com/free-photo/blackboard-inscribed-with-scientific-formulas-calculations_1150-19413.jpg?size=626&ext=jpg&ga=GA1.1.1625688455.1702614046&semt=sph";

export const QuizListUI = ({
  data,
  type,
  isLoading,
}: {
  data: IQuiz;
  type: "small" | "large";
  isLoading: boolean;
}) => {
  const {
    id,
    banner,
    title,
    category,
    host,
    total_questions,
    created_at,
    descriptions,
    difficulty,
    requirements,
    rating,
    access_with_key,
    participants_count,
  } = data;

  const { truncateWord, tagColor } = useText();

  const large = (
    <div className="md:w-[20rem] w-[20.5rem] flex flex-col gap-2">
      <div className="relative">
        <div className="absolute top-2 right-2">
          <Rate rate="quiz" />
        </div>
        <img
          className="rounded-md h-[25rem]"
          src={banner || _IMAGE}
          alt={title}
        />
        <Badge
          variant={tagColor(category) as "default"}
          styles={"right_round"}
          className=" absolute left-0 mt-5 py-2 top-0"
        >
          {total_questions + " Questions"}
        </Badge>
        <Link
          to={app_config.user + host.username}
          className="cursor-pointer absolute left-5 bottom-5"
        >
          <Glassmorphism
            blur={"9px"}
            className="rounded-3xl flex gap-1 items-center py-[2px] px-1"
          >
            <Avatar>
              <AvatarImage
                className="w-[3rem]"
                src={(host.profile_image as string) || ProfilePicture}
              />
              <AvatarFallback>{host.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <Label className="px-2 text-slate-700">{host.username}</Label>
          </Glassmorphism>
        </Link>
      </div>
      <Badge className="w-fit" variant="success">
        {category}
      </Badge>
      <h1 className="text-xl text-green-800">{title}</h1>
      <p>{truncateWord(descriptions, 30)}</p>
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400 ">
          <Calendar size={12} />
          {new Date(created_at).toISOString()}
        </span>
        <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400 ">
          <Eye size={13} />
          {participants_count}
        </span>
      </div>
      <Button asChild variant={"base"} className="w-full">
        <Link to={app_config.quiz + id + "#get-ready"}>Take Quiz</Link>
      </Button>
    </div>
  );
  const small = (
    <Link
      to={`/quiz/${id}`}
      className="w-full transition-all duration-300 ease-in-out hover:shadow-md cursor-pointer rounded-xl relative p-2 flex gap-1 border border-gray-400 dark:border-gray-300 h-[13rem]"
      key={id}
    >
      <span
        className={`p-2 h-fit rounded-xl ${difficultyRanking[difficulty].className}`}
      >
        {difficultyRanking[difficulty].icon}
      </span>
      <div className="flex transition-all delay-100 ease-linear flex-col gap-1">
        <h1>{title}</h1>
        <div className="flex items-center gap-1">
          <img
            className="w-[1.5rem] h-[1.5rem]"
            src={host.profile_image as string}
            alt=""
          />
          <p>{host.username}</p>
        </div>
        <div className="flex flex-col gap-2">
          {requirements && (
            <div>
              <p className="underline">Quiz Description</p>
              <p>{truncateWord(descriptions, 25)}</p>
            </div>
          )}
          <Rating rating={rating} />
        </div>
        <div className="flex items-center gap-2">
          <p className="text-green-500">
            {participants_count + " people have taken this quiz"}
          </p>
          <Chip
            type={
              difficulty === "easy"
                ? "default"
                : difficulty === "hard"
                ? "danger"
                : "warning"
            }
            text={difficulty}
          />
        </div>
      </div>
      {access_with_key && (
        <Hint
          element={
            <span className="w-1 rounded-md">
              <Lock className="text-red-500" size={17} />
            </span>
          }
          content="Code is required"
        />
      )}
    </Link>
  );

  const view = {
    large: isLoading ? <QuizLoadingSkeleton view="large" len={3} /> : large,
    small: isLoading ? <QuizLoadingSkeleton view="small" len={3} /> : small,
  };
  return <motion.div layout>{view[type]}</motion.div>;
};

export const QuizLoadingSkeleton = ({
  len,
  view,
}: {
  len: number;
  view: "large" | "small";
}) => {
  return (
    <>
      {view === "large" ? (
        <div className="flex overflow-auto gap-2">
          {[...Array(len || 3)].map((_, i) => (
            <div key={i} className="w-[20rem] flex flex-col gap-2">
              <div className="relative">
                <Skeleton className=" h-[25rem] rounded-md" />
              </div>
              <Skeleton className="w-full h-[1.5rem]" />
              <Skeleton className="h-[3rem] rounded-md w-full" />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex gap-1">
          <Skeleton className="h-8 w-8 rounded-2xl" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-10 w-[10rem] rounded-2xl" />
            <Skeleton className="h-[10rem] w-[10rem] rounded-2xl" />
          </div>
        </div>
      )}
    </>
  );
};
