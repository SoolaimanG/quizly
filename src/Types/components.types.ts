import { Editor } from "@tiptap/react";
import { Variants } from "framer-motion";
import React, { SetStateAction } from "react";

//Combo-Box Type
export interface combo_box_type {
  value: string;
  label: string;
}

//Logo Props
export interface logo_props {
  size?: "lg" | "default" | "sm";
  color?: boolean;
  style?: "italic" | "normal" | "bold";
  className?: string;
  show_word?: boolean;
}

//Input Props
export interface input_props {
  type?: "email" | "text" | "password";
  placeholder?: string;
  input_state?: "loading" | "success" | null;
  disabled?: boolean;
  className?: string;
  variant?: "default" | "error" | "no_border";
}

//Editor Props
export interface editor_toolbar_prop {
  editor: Editor | null;
}

export interface editor_props {
  value: string;
  setValue: React.Dispatch<SetStateAction<string>>;
  setHtml: React.Dispatch<SetStateAction<string>>;
  className?: string;
}

export interface uploaderProps {
  files: File[];
  previewUrl?: string[];
}

//Image Uploader Props
export interface image_uploader_props {
  button: React.ReactElement;
  setData: React.Dispatch<SetStateAction<uploaderProps>>;
  maxSize?: number;
  filesToAccept: string[];
  multiples?: number;
  data: uploaderProps;
}

//Calculator Props
export interface CalculatorProps {
  button: React.ReactElement;
  answer: string | number;
  setAnswer: React.Dispatch<SetStateAction<string | number>>;
}

//Protected Route Login
export interface protected_route_props {
  element: React.ReactElement;
}

//Zustand state props for States and Actions
export interface Zstate {
  is_darkmode: boolean;
  loginAttempt: { fallback: string; attempt: boolean };
  emailVerificationRequired: boolean;
  user: IUser | null | undefined;
}

export interface Zaction {
  setIsDarkMode: (isDarkMode: boolean) => void;
  setLoginAttempt: ({
    fallback,
    attempt,
  }: {
    fallback?: string;
    attempt: boolean;
  }) => void;
  setUser: (prop: IUser | null) => void;
  setEmailVerificationRequired: (props: boolean) => void;
}

//Glassmorphism Props
export interface GlassmorphismProps {
  varient?: Variants;
  children: React.ReactNode;
  className?: string;
  blur?: string;
  color?: "green" | "default";
}

//Rating Component Props
export interface rating_props {
  rating?: number;
  setRating?: React.Dispatch<SetStateAction<number>>;
}

//Contact us bodyParams
export interface emailJSParams {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email: string;
  message: string;
}

//Auth-Layout Properties
export interface authLayout {
  path: "Login" | "ForgetPassword" | "ConfirmEmail";
}

//Login Properties [FallbackURL: this means path to go after login, isPopup: this means the style to render the login form]
export interface loginProps {
  fallback?: string;
  title: string;
  description?: string;
  isPopup?: boolean;
}

//Properties for chips comp
export interface chipProps {
  className?: string;
  varient?: Variants;
  type: "default" | "danger" | "warning";
  text: string;
}

export type account_type = "T" | "S";

//this is properties of user the server will return
export interface IUser {
  account_type: account_type;
  age?: number;
  auth_provider: "T" | "G" | "L";
  date_joined: Date;
  email: string;
  id: string;
  is_active: boolean;
  password?: string;
  first_name: string;
  last_name: string;
  points: number;
  profile_image: string;
  updated_at: Date;
  username: string;
  email_verified: boolean;
  first_time_login: boolean;
  signup_complete: boolean;
  bio: string;
}

//Quizzes created by user props
export interface IQuiz {
  access_with_key: boolean;
  category: subjects;
  created_at: Date;
  descriptions: string;
  difficulty: "easy" | "medium" | "hard";
  duration: number;
  host: Pick<IUser, "profile_image" | "username" | "id" | "bio"> &
    Pick<ITeacher, "phone_num">;
  id: string;
  participants: Pick<IUser, "profile_image" | "username" | "id">[];
  requirements: string;
  subject: string;
  banner?: string;
  title: string;
  rating: number;
  participants_count: number;
  total_questions: number;
  submit_on_leave?: boolean;
  allow_calculator?: boolean;
  allow_word_search?: boolean;
  allow_robot_read?: boolean;
  instructions?: string;
  result_display_type?: resultDisplayProps;
  comments_count: number;
  has_user_started_quiz: boolean;
  finish_message?: string;
  allow_retake?: boolean;
}

export type question_type =
  | "true_or_false"
  | "objective"
  | "german"
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
  correct_answer_length?: number;
}

export type subjects =
  | "Chemistry"
  | "Physics"
  | "Biology"
  | "Agriculture"
  | "Mathematics"
  | "English"
  | "Science"
  | "Computer"
  | "Electronics"
  | "Economics"
  | "History";

export type ICategory = {
  body: subjects;
};

export interface IStudent {
  favourites: subjects[];
  logs: ILogs[];
  user: IUser;
  streaks_count: number;
  xp: number;
  id: string;
  difficulty: "all" | "easy" | "medium" | "hard";
  my_teachers: ITeacher[];
}

export interface ITeacher {
  user: IUser;
  rating: number;
  student: IStudent[];
  quizzes: IQuiz[];
  specializations: ICategory[];
  educational_level: "masters" | "doctorate" | "bachelor";
  phone_num: string;
  whatsapp_link: URL;
  address: string;
}

export interface ILogs {
  statements: string;
  user: Partial<IUser>;
  id: string;
  created_at: Date;
}

export enum app_config {
  AppName = "Quizly",
  landing_page = "/",
  onboarding_page = "/quizly/onboarding",
  login_page = "/auth/login",
  explore_page = "/quizly/explore",
  forgetPassword = "/auth/forget-password",
  confrimEmail = "/auth/confirm-email/",
  create_survey = "/quizly/create-survey",
  quizzes = "/quizly/quizzes",
  quiz = "/quizly/quiz/",
  user = "/quizly/user/",
  challenge_friend = "/quizly/challenge-friend",
  communities = "/quizly/communities/",
  image_path = "/media/images",
}

export type onboardingProps =
  | "DefaultView"
  | "FirstView"
  | "SecondView"
  | "ThirdView"
  | "FourthView";

export interface errorPageProps {
  errorMessage?: string;
  retry_function: () => void;
  className?: string;
}

export type hintProps = {
  element: React.ReactElement;
  content: string;
  delay?: number;
  side?: "top" | "right" | "bottom" | "left";
};

export type answered_question = {
  question_id: string;
  quiz_id: string;
  user_answer: string | string[];
};

//Quiz Hooks
export interface localStorageQuestions {
  answered_question: answered_question[];
}

export interface TabsProps {
  header: string[];
  elements: React.ReactElement[];
}

export interface commentsCompProps {
  quiz_id: string;
}

export interface IComment {
  username: string;
  profile_image: string;
  body: string;
  created_at: Date;
  id: number;
}

export interface IRate {
  rate: "quiz" | "tutor";
}

export interface startQuizFunctionProps {
  quiz_id: string;
  isAuthenticated?: boolean;
  anonymous_id: string;
  access_key?: string;
}

export interface startQuizButtonProps {
  id?: string;
  isAuthenticated: boolean;
  button_text?: string;
}

export interface markQuestionProps {
  isAuthenticated: boolean;
  is_completed?: boolean;
  anonymous_id: string;
  question_id: string;
  user_answer: string | string[];
}

export enum localStorageKeys {
  anonymous_id = "anonymousID",
  questions_answered = "questionsAnswered",
  questionUUIDs = "questionuuids",
}

export interface questionAnsweredProps {
  quiz_id: string;
  details: {
    question_id: string;
    user_answer: string | string[];
  }[];
}

export type resultCorrectionProps = {
  question: string;
  correct_answer: string;
};

export interface quizResultProps {
  feedback?: string;
  xp_earn?: number;
  attempted_questions?: number;
  start_time?: Date;
  end_time?: Date;
  wrong_answers?: number;
  corrections?: resultCorrectionProps[];
  total_questions?: number;
  expected_xp?: number;
}

export interface retakeQuizBtnProps {
  quiz_id: string;
  to_go?: string;
}

export interface selectionToolsProps {
  categories: subjects[];
  setCategories: React.Dispatch<SetStateAction<subjects[]>>;
  className?: string;
  maxSelect?: number;
}
