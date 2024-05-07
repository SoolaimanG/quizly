import { IUser } from "./components.types";

export interface quizNavbarProps {
  quiz_data: Partial<IQuiz>;
}

export type userQuizStatus = "start-quiz" | "is-completed" | "continue-quiz";
export type quizDifficulty = "easy" | "medium" | "hard";
export type quizResultDisplayType =
  | "on_complete"
  | "on_submit"
  | "mark_by_teacher";

export interface IQuiz {
  access_with_key: boolean;
  allow_calculator: boolean;
  allow_retake: boolean;
  allow_robot_read: boolean;
  allow_word_search: boolean;
  allowed_users: string;
  banner: string;
  category: string;
  comments_count: number;
  created_at: string;
  descriptions: string;
  difficulty: quizDifficulty;
  expected_xp: number;
  finish_message: string;
  host: null | IUser;
  id: string;
  instructions: string;
  is_ai_generated: boolean;
  is_published: boolean;
  participants_count: number;
  rating: number;
  requirements: string;
  result_display_type: quizResultDisplayType;
  submit_on_leave: boolean;
  time_limit: number;
  title: string;
  total_questions: number;
  user_status: userQuizStatus;
}

export interface startQuizButtonProps {
  quiz: IQuiz;
  button_text?: string;
  className?: string;
  onQuizStart?: () => void;
}

export interface quizQuestionCompProps {
  questionID: string;
  quiz: IQuiz;
  haveNavigation?: boolean;
  index?: number;
}

export type question_type =
  | "true_or_false"
  | "objective"
  | "open_ended"
  | "multiple_choices";

export type resultDisplayProps =
  | "on_submit"
  | "on_complete"
  | "mark_by_teacher";

export type objectioOptionsProps = {
  body: string;
  is_correct_answer?: boolean;
  image_url: string;
  id: string;
};

export type userResponseProps = {
  is_correct: boolean;
  correct_answer: string[];
  question_explanation: string;
  open_ended_response?: string;
  show_answer: boolean;
  user_answer: string[];
};

export type questionProps = {
  body: string;
  image_url: string;
};

export type booleanOptionProps = {
  answer?: boolean;
};

export interface IQuestion {
  question_type: question_type;
  quiz_id: string;
  options?: objectioOptionsProps[]; //If the question type is objective
  booleanOption?: boolean;
  question_body: string;
  question_image?: string;
  answer?: string;
  is_compulsary?: boolean; //Cannot allow next question is this isnt answers
  question_point: number;
  correct_answer_explanation: string;
  incorrect_answer_penalty: "";
  hint?: string;
  question_number: number;
  is_strict?: boolean;
  mistakesToIgnore?: number;
  id: string;
  multiple_answer_length?: number;
  user_previous_response?: userResponseProps;
}

export type resultCorrectionProps = {
  question: string;
  answer: string;
  explanation: string;
};

export interface quizResultProps {
  wrong_answers: number;
  corrections: resultCorrectionProps[];
  xp_earn: number;
  start_time: string;
  questions_attempted: number;
  feedback: string;
  total_questions: number;
  end_time: string;
  expected_xp: number;
}
