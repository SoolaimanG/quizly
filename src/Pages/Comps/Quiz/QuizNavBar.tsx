import { capitalize_first_letter } from "../../../Functions";
import { useAuthentication } from "../../../Hooks";
import { useText } from "../../../Hooks/text";
import { quizNavbarProps } from "../../../Types/quiz.types";
import { QuizTools } from "../../../components/App/QuizTools";

import { Timer } from "../../../components/App/Timer";
import { UserAvatar } from "../../../components/App/userAvatar";

export const QuizNavBar: React.FC<quizNavbarProps> = ({
  show_timer,
  quiz_data,
}) => {
  const { isAuthenticated } = useAuthentication();
  const { allow_calculator, allow_word_search, title } = quiz_data;
  const { truncateWord } = useText();
  return (
    <div className="w-full bg-white dark:bg-slate-950 z-30 fixed flex items-center justify-between top-0 left-0 shadow-xl p-3">
      <QuizTools
        allow_calculator={allow_calculator}
        allow_word_search={allow_word_search}
      />
      <h1>{capitalize_first_letter(truncateWord(title, 12))}</h1>
      <div className="flex items-center gap-1">
        {show_timer && (
          <Timer
            quiz_id=""
            isAuthenticated
            initialTime={30}
            onTimeFinish={() => {}}
            className="py-[7px]"
          />
        )}
        <UserAvatar isAuthenticated={isAuthenticated} />
      </div>
    </div>
  );
};
