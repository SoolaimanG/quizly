import {
  BeakerIcon,
  Calculator,
  CandlestickChart,
  History,
  Laptop,
  Microscope,
  Paperclip,
  Rat,
  Trees,
} from "lucide-react";
import { subjects } from "../Types/components.types";
import { CircuitBoard } from "lucide-react";

export const useQuizHook = () => {
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
    assignIconToCategory,
  };
};

export const useCheckPerformance = (
  user_point?: number,
  expected_point?: number
):
  | { bg_color: string; text_color: string; circular_color?: string }
  | undefined => {
  if (user_point === undefined || expected_point === undefined) return;

  const averageScore = expected_point / 2;

  switch (true) {
    case user_point < averageScore:
      return {
        bg_color: "bg-red-100",
        text_color: "text-red-500",
        circular_color: "#ef4444",
      };
    case user_point >= averageScore && user_point < expected_point:
      return {
        bg_color: "bg-yellow-100",
        text_color: "text-yellow-500",
        circular_color: "#facc15",
      };
    default:
      return {
        bg_color: "bg-green-100",
        text_color: "text-green-500",
        circular_color: "#22c55e",
      };
  }
};
