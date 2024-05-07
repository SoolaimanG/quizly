import { FC } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/Popover";
import { Description } from "../../components/App/Description";
import { userResponseProps } from "../../Types/quiz.types";
import { cn } from "../../lib/utils";

export const QuestionExplanationPopOver: FC<userResponseProps> = ({
  question_explanation,
  is_correct,
}) => {
  return (
    <Popover>
      <PopoverTrigger className="underline josefin-sans-font">
        See Explanation
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <div className="p-2 flex flex-col gap-2">
          <h1 className="font-bold josefin-sans-font">Basic Explanation</h1>
          <i className="text-lg text-center w-full">
            {'"" ' + question_explanation + ' ""'}
          </i>
        </div>
        <div
          className={cn(
            "w-full h-[2.5rem] rounded-b-md p-1",
            is_correct ? "bg-green-500" : "bg-red-500"
          )}
        >
          <Description
            className="text-white text-lg text-center"
            text={
              is_correct
                ? "You answer is correct"
                : "You choose the wrong answer"
            }
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};
