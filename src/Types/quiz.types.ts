import { IQuiz } from "./components.types";

export interface quizNavbarProps {
  headerText: string;
  show_timer: boolean;
  quiz_data: Partial<IQuiz>;
}
