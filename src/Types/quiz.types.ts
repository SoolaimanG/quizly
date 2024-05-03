export interface quizNavbarProps {
  quiz_data: Partial<IQuiz>;
}

export type quizDifficulty = "easy" | "medium" | "hard";
export type quizResultDisplayType =
  | "on_complete"
  | "on_submit"
  | "mark_by_teacher";

interface IQuiz {
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
  host: null;
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
  user_status: "start-quiz" | "is-completed" | "continue-quiz";
}
