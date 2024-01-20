import { capitalize_first_letter } from "../../../Functions";
import { useAuthentication } from "../../../Hooks";
import { useText } from "../../../Hooks/text";
import { quizNavbarProps } from "../../../Types/quiz.types";
import { QuestionAnsweredProgress } from "../../../components/App/QuestionAnsweredProgress";
import { QuizTools } from "../../../components/App/QuizTools";

import { Timer } from "../../../components/App/Timer";
import { UserAvatar } from "../../../components/App/userAvatar";
import { useQuizStore } from "../../../provider";

export const QuizNavBar: React.FC<quizNavbarProps> = ({ quiz_data }) => {
  const { isAuthenticated } = useAuthentication();
  const {
    allow_calculator,
    allow_word_search,
    title,
    id,
    time_limit,
    total_questions,
  } = quiz_data;
  const { truncateWord } = useText();
  const { questionsAnswered } = useQuizStore();
  return (
    <div className="w-full fixed flex flex-col top-0 left-0 shadow-xl p-3 bg-white dark:bg-slate-950 z-30">
      <div className="w-full flex items-center justify-between ">
        <QuizTools
          allow_calculator={allow_calculator}
          allow_word_search={allow_word_search}
        />
        <h1>{capitalize_first_letter(truncateWord(title, 12))}</h1>
        <div className="flex items-center gap-1">
          {Boolean(time_limit) && (
            <Timer
              quiz_id={id!}
              isAuthenticated
              initialTime={time_limit as number}
              onTimeFinish={() => {}}
              className="py-[7px]"
            />
          )}
          <UserAvatar isAuthenticated={isAuthenticated} />
        </div>
      </div>
      {Boolean(questionsAnswered) && (
        <QuestionAnsweredProgress
          className="absolute -ml-3 rounded-none w-screen bottom-0"
          total_questions={total_questions!}
          questions_answered={questionsAnswered}
        />
      )}
    </div>
  );
};
