import {
  BeakerIcon,
  Calculator,
  CandlestickChart,
  CheckCircle2,
  History,
  Laptop,
  Microscope,
  Paperclip,
  Rat,
  Smile,
  Trees,
} from "lucide-react";
import { localStorageQuestions, subjects } from "../Types/components.types";
import { CircuitBoard } from "lucide-react";
import { useLocalStorage } from "@uidotdev/usehooks";
import { Frown } from "lucide-react";

const ParentUI = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full flex items-center justify-center flex-col gap-3">
      {children}
    </div>
  );
};

export const useQuizHook = () => {
  const [_] = useLocalStorage<localStorageQuestions>("questions", {
    score: 0,
    answered_question: [],
  });
  const shuffleOptions = () => {
    // Implementation of shuffling options (not provided in the code snippet)
  };

  //This is for unauthenticated users
  const calculate_score = (is_correct: boolean, question_point: number) => {
    if (is_correct) {
      return _.score + question_point;
    } else {
      return _.score;
    }
  };

  const scoreRating = (totalScore: number, user_score: number) => {
    const _EXCELLENT = 0;
    const _AVG = totalScore / 2;

    const DIFFERENCE = totalScore - user_score;

    const perfectScore = DIFFERENCE === _EXCELLENT;
    const goodScore = DIFFERENCE < _AVG;

    const ranking = perfectScore ? "excellent" : goodScore ? "good" : "poor";

    const excellentUI = (
      <ParentUI>
        <CheckCircle2 className="text-green-500" size={85} />
        <h1 className="text-2xl">Perfect Scorer</h1>
        <i className="text-lg text-center">
          Your flawfless quiz performance set a new standard of excellence.
        </i>
      </ParentUI>
    );

    const goodUI = (
      <ParentUI>
        <Smile className="text-yellow-500" size={85} />
        <h1 className="text-2xl">You Did Good</h1>
        <i className="text-lg text-center">
          Well done! Your performance is commendable.
        </i>
      </ParentUI>
    );

    const poorUI = (
      <ParentUI>
        <Frown className="text-red-400" size={85} />
        <h1 className="text-2xl">Not Bad</h1>
        <i className="text-lg text-center">
          There is room for improvement. Don't be discouraged
        </i>
      </ParentUI>
    );

    const views = {
      excellent: excellentUI,
      good: goodUI,
      poor: poorUI,
    };

    const UI = views[ranking];

    return { UI, ranking };
  };

  const assignIconToCategory = (subject: subjects) => {
    if (!subject) return null;

    switch (subject) {
      case "Chemistry":
        return <BeakerIcon />;
      case "Agriculture":
        return <Rat />;
      case "Biology":
        return <Trees />;
      case "Computer":
        return <Laptop />;
      case "English":
        return <Paperclip />;
      case "Mathematics":
        return <Calculator />;
      case "Physics":
        return <Microscope />;
      case "Science":
        return <BeakerIcon />;
      case "History":
        return <History />;
      case "Electronics":
        return <CircuitBoard />;
      case "Economics":
        return <CandlestickChart />;
      default:
        return null;
    }
  };

  return {
    shuffleOptions,
    calculate_score,
    assignIconToCategory,
    scoreRating,
  };
};
