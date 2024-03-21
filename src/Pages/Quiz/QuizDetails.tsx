import {
  Calculator,
  Clock,
  Key,
  MenuSquare,
  Paperclip,
  ShieldAlert,
  Speaker,
  Text,
  Users,
} from "lucide-react";
import { capitalize_first_letter } from "../../Functions";
import { useQuizStore } from "../../provider";
import { Description } from "../ExplorePage/QuickQuiz";
import { cn } from "../../lib/utils";
import { Card, CardContent, CardDescription } from "../../components/Card";
import { Button } from "../../components/Button";
import Hint from "../../components/Hint";

export const QuizDetails = () => {
  const { currentQuizData } = useQuizStore();

  const difficultyUI = {
    medium: {
      color: "text-yellow-500",
    },
    easy: {
      color: "text-yellow-500",
    },
    hard: {
      color: "text-yellow-500",
    },
  };

  const data = [
    {
      icon: <Clock />,
      content: "Time Allowed",
      data: currentQuizData?.time_limit
        ? currentQuizData?.time_limit + " Mins"
        : "Unlimited Time",
    },
    {
      icon: <Paperclip />,
      content: "No. Of Questions",
      data: currentQuizData?.total_questions,
    },
    {
      icon: <ShieldAlert />,
      content: "Allowed Users",
      data: currentQuizData?.allowed_users,
    },
    {
      icon: <Users />,
      content: "Total Participants",
      data: currentQuizData?.participants_count,
    },
    {
      icon: <Key />,
      content: currentQuizData?.access_with_key
        ? "Key Is Required to Start"
        : "Key Is Not Required",
      data: currentQuizData?.access_with_key,
    },
  ];

  //   Tools Allowed In this Quiz
  const toolsAllowed =
    currentQuizData?.allow_calculator ||
    currentQuizData?.allow_robot_read ||
    currentQuizData?.allow_word_search;

  const tools = [
    {
      isAllowed: currentQuizData?.allow_calculator,
      icon: <Calculator />,
      content: "Calculator",
    },
    {
      isAllowed: currentQuizData?.allow_word_search,
      icon: <Text />,
      content: "Dictionary",
    },
    {
      isAllowed: currentQuizData?.allow_robot_read,
      icon: <Speaker />,
      content: "Read Word Aloud",
    },
  ];

  return (
    <div className="w-full h-full flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div>
          <h1>{currentQuizData?.title}</h1>
          <Description text={currentQuizData?.category} />
        </div>
        <p className="font-semibold flex items-center gap-2">
          <MenuSquare
            className={cn(
              difficultyUI[currentQuizData?.difficulty as "hard"].color
            )}
          />
          {capitalize_first_letter(currentQuizData?.difficulty)}
        </p>
      </div>
      <Card className="w-full">
        <CardContent className="mt-3 w-full flex flex-col gap-2">
          {data.map((d, i) => (
            <div
              className="flex divide-y-reverse divide-y-2 w-full items-center gap-2"
              key={i}
            >
              <Button variant={"outline"} size={"icon"}>
                {d.icon}
              </Button>
              <div className="w-full">
                <h1>{d.content}</h1>
                <CardDescription>{d.data}</CardDescription>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      <div className="flex flex-col gap-1">
        <div>
          <h1>Description:</h1>
          <Description text={currentQuizData?.descriptions} />
        </div>
        <div>
          <h1>Allowed Tools</h1>
          {!toolsAllowed ? (
            <Description text="No tools allowed in this Quiz." />
          ) : (
            <div className="flex gap-2 items-center">
              {tools.map((t, i) => (
                <Hint
                  key={i}
                  element={
                    <Button variant="outline" size="icon">
                      {t.icon}
                    </Button>
                  }
                  content={t.content}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
