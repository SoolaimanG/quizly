import { cn } from "../../lib/utils";
import { Progress } from "../Progress";

export const QuestionAnsweredProgress: React.FC<{
  total_questions: number;
  questions_answered: number;
  className?: string;
}> = ({ className, questions_answered, total_questions }) => {
  // Making sure to make the value in a a way that makes its 100
  const value = (questions_answered / total_questions) * 100;
  return (
    <Progress
      bgColor="bg-green-500"
      className={cn("h-1", className)}
      value={value}
    />
  );
};
