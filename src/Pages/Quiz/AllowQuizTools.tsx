import { FC, ReactElement } from "react";
import { IQuiz } from "../../Types/quiz.types";
import { Calculator, RefreshCw, Volume1Icon } from "lucide-react";
import Hint from "../../components/Hint";
import { SearchIcon } from "lucide-react";
import { Description } from "../../components/App/Description";

export const AllowQuizTools: FC<
  Pick<
    IQuiz,
    | "allow_calculator"
    | "allow_robot_read"
    | "allow_retake"
    | "allow_word_search"
  >
> = ({
  allow_calculator,
  allow_retake,
  allow_robot_read,
  allow_word_search,
}) => {
  const noToolsAllowed =
    !allow_calculator &&
    !allow_retake &&
    !allow_robot_read &&
    !allow_word_search;

  const iconBorder = (icon: ReactElement, text: string) => {
    return (
      <Hint
        element={
          <div className="w-[2.5rem] flex cursor-pointer items-center justify-center h-[2.5rem] border-[1.5px] border-gray-400 rounded-full">
            {icon}
          </div>
        }
        content={text}
      />
    );
  };
  return (
    <div className="flex items-center gap-2">
      {allow_calculator && iconBorder(<Calculator size={17} />, "Calculator")}
      {allow_robot_read &&
        iconBorder(<Volume1Icon size={17} />, "Speech Assistant")}
      {allow_retake &&
        iconBorder(<RefreshCw size={17} />, "Multiple Participation")}
      {allow_word_search &&
        iconBorder(<SearchIcon size={17} />, "Search using dictionary")}
      {noToolsAllowed && (
        <Description text="This Quiz Does Not Allow Any Of Our Assistive tools to be use" />
      )}
    </div>
  );
};
