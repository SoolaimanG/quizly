import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../Button";
import Hint from "../Hint";

export type quizNavigationProps = {
  prevFunction?: () => void;
  nextFunction: () => void;
};

export const QuizNavigation: React.FC<quizNavigationProps> = ({
  prevFunction,
  nextFunction,
}) => {
  return (
    <div className="w-full gap-3 flex items-center justify-end">
      {prevFunction && (
        <Hint
          element={
            <Button
              className="flex items-center gap-2"
              variant={"secondary"}
              onClick={prevFunction}
            >
              <ChevronLeft />
              Prev
            </Button>
          }
          content="Previous Question"
        />
      )}
      <Hint
        element={
          <Button
            className="flex items-center gap-2"
            variant={"secondary"}
            onClick={nextFunction}
          >
            Next
            <ChevronRight />
          </Button>
        }
        content="Next Question"
      />
    </div>
  );
};
