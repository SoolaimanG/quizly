import { Bomb, Star } from "lucide-react";

import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Ref, forwardRef } from "react";
import { IQuiz } from "../../Types/quiz.types";
import { Img } from "react-image";
import { Button } from "../../components/Button";
import Glassmorphism from "../../components/App/Glassmorphism";
import { SparklesIcon } from "lucide-react";
import { cn } from "../../lib/utils";
import Hint from "../../components/Hint";
import { useText } from "../../Hooks/text";
import Rating from "../../components/App/Rating";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../../components/HoverCard";
import { Link } from "react-router-dom";
import { app_config } from "../../Types/components.types";
import { Description } from "../../components/App/Description";

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

const _fallbackImage =
  "https://img.freepik.com/free-photo/blackboard-inscribed-with-scientific-formulas-calculations_1150-19413.jpg?size=626&ext=jpg&ga=GA1.1.1625688455.1702614046&semt=sph";

export const QuizDetailsSneakPeak = forwardRef(
  (
    {
      banner,
      user_status,
      host,
      is_ai_generated,
      descriptions,
      rating,
      title,
      category,
      total_questions,
      time_limit,
      id,
    }: IQuiz,
    ref: Ref<HTMLDivElement>
  ) => {
    const { truncateWord } = useText();

    const buttonText: Record<typeof user_status, any> = {
      "continue-quiz": "Continue Quiz",
      "is-completed": "You Already Completed This Quiz",
      "start-quiz": "Start Quiz",
    };

    return (
      <motion.div layout ref={ref} className="flex w-[19rem] flex-col gap-2">
        <div className="w-full h-[22rem] rounded-md relative">
          <Img
            src={banner || _fallbackImage}
            className="w-full h-full absolute top-0 left-0 rounded-md"
            loader={
              <div className="w-full absolute top-0 left-0 h-full auth-gradient rounded-md" />
            }
          />
          {/* The Host Profile Picture */}
          <div className="absolute top-2 left-2 flex items-center justify-between w-[95%] m-auto">
            <Glassmorphism
              className={cn(
                " w-[3rem] h-[3rem] rounded-full p-[2px]",
                is_ai_generated &&
                  "flex items-center justify-center text-green-500"
              )}
            >
              {host && <div></div>}
              {is_ai_generated && (
                <Hint
                  side="right"
                  element={<SparklesIcon size={22} />}
                  content="Created by AI."
                />
              )}
            </Glassmorphism>
            <Rating size={20} rating={rating + 1} onRatingSelect={() => {}} />
          </div>

          <div className="w-full flex items-center justify-center">
            <HoverCard>
              <HoverCardTrigger className="bottom-2 cursor-pointer absolute w-[95%]">
                <Glassmorphism className="rounded-sm">
                  <Description
                    className="text-white"
                    text={truncateWord(descriptions, 150)}
                  />
                </Glassmorphism>
              </HoverCardTrigger>
              <HoverCardContent className="h-fit" side="bottom">
                <h1 className="josefin-sans-font underline">
                  Quiz Description
                </h1>
                <Description text={descriptions} />
              </HoverCardContent>
            </HoverCard>
          </div>
        </div>
        <div className="flex flex-col">
          <Description text={category} />
          <h1 className="josefin-sans-font">{title}</h1>
          <Description
            text={`${total_questions} Questions | ${
              Boolean(time_limit) ? time_limit + " Mins" : "Unlimited Time"
            }`}
          />
        </div>
        <Button asChild variant="base" className="w-full h-[2.5rem]">
          <Link to={app_config.quiz + id}>{buttonText[user_status]}</Link>
        </Button>
      </motion.div>
    );
  }
);
