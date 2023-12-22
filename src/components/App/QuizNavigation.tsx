import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../Button";
import Hint from "../Hint";

export type quizNavigationProps = {
  havePrev?: boolean;
  prevFunction?: () => void;
  nextFunction: () => void;
};

export const QuizNavigation: React.FC<quizNavigationProps> = ({
  havePrev = false,
  prevFunction,
  nextFunction,
}) => {
  return (
    <div className="w-full gap-3 flex items-center justify-end">
      {havePrev && (
        <Hint
          element={
            <Button variant={"base"} onClick={prevFunction} size={"icon"}>
              <ChevronLeft />
            </Button>
          }
          content="Go Back"
        />
      )}
      <Hint
        element={
          <Button variant={"base"} onClick={nextFunction} size={"icon"}>
            <ChevronRight />
          </Button>
        }
        content="Start/Next"
      />
    </div>
  );
};
