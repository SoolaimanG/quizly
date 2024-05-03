import { Editor } from "@tiptap/react";
import { Variants } from "framer-motion";
import React, { RefObject, SetStateAction } from "react";
import { featureWaitListProps } from "../components/App/ComingSoon";
import { mode } from "../Pages/CreateSurvey/AllSurveyBlocks";
import { IQuiz } from "./quiz.types";

//Combo-Box Type
export interface combo_box_type<T> {
  value: T;
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
  show_tools?: boolean;
  disable?: boolean;
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
  className?: string;
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
  loginAttempt: { fallback: string; attempt: boolean; note?: string };
  emailVerificationRequired: boolean;
  user: IUser | null | undefined;
  openSettings: boolean;
  openOnboardingModal: {
    open: boolean;
    fallbackUrl: string;
  };
  openTutorOnboardingModal: boolean;
}

export interface Zaction {
  setIsDarkMode: (isDarkMode: boolean) => void;
  setLoginAttempt: ({
    fallback,
    attempt,
    note,
  }: {
    fallback?: string;
    attempt: boolean;
    note?: string;
  }) => void;
  setUser: (prop: IUser | null) => void;
  setEmailVerificationRequired: (props: boolean) => void;
  setOpenOnboardingModal: (prop: {
    open: boolean;
    fallbackUrl: string;
  }) => void;
  setOpenSettings: (prop: boolean) => void;
  setTutorOnboardingModal: (prop: boolean) => void;
}

//Glassmorphism Props
export interface GlassmorphismProps {
  varient?: Variants;
  children: React.ReactNode;
  className?: string;
  blur?: string;
  color?: "green" | "default" | "dark";
}

//Rating Component Props
export interface rating_props {
  rating?: number;
  className?: string;
  rating_length?: number;
  size?: number;
  onRatingSelect: (i: number) => void;
  color?: "GREEN" | "YELLOW" | "BLUE";
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
  text: string | React.ReactElement;
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
  favourites: ICategory[];
  logs: ILogs[];
  user: IUser;
  streaks_count: number;
  xp: number;
  id: string;
  difficulty: "all" | "easy" | "medium" | "hard";
  my_teachers: ITeacher[];
}

export type educationalLevel = "masters" | "doctorate" | "bachelor";

export interface ITeacher {
  user: IUser;
  rating: number;
  student: IStudent[];
  quizzes: IQuiz[];
  specializations: ICategory[];
  educational_level: educationalLevel;
  phone_num: string;
  whatsapp_link: string;
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
  change_email = "/quizly/onboarding/change-email/",
  change_name = "/quizly/onboarding/change-name/",
  change_account_type = "/quizly/onboarding/change-account-type",
  select_categories = "/quizly/onboarding/select-categories/",
  login_page = "/auth/login/",
  explore_page = "/quizly/explore",
  forgetPassword = "/auth/forget-password",
  confrimEmail = "/auth/confirm-email/",
  create_survey = "/quizly/survey",
  more_quizzes = "/quizly/more-quizzes/",
  quiz = "/quiz/",
  user = "/quizly/user/",
  challenge_friend = "/quizly/challenge-friend",
  communities = "/quizly/communities/",
  image_path = "/media/images",
  my_profile = "/quizly/profile/",
  my_communities = "/quizly/my-communities/",
  community = "/quizly/community/",
  survey_workspace = "/quizly/survey/create/",
  connect_survey = "/quizly/survey/create/",
  share_survey = "/quizly/survey/share/#share",
  survey_result = "/quizly/survey/result/",
  connect_apps = "/quizly/connected-apps/",
  preview_survey = "/quizly/survey/preview/",
  survey = "/survey/",
  surveyUserID = "surveyUserId",
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
  style?: "dot" | "underline" | "buttons";
  className?: string;
  hideBorder?: boolean;
}

export interface commentsCompProps {
  quiz_id: string;
  type?: "input" | "textarea";
}

export interface IComment {
  username: string;
  profile_image: string;
  body: string;
  created_at: Date;
  id: number;
}

export interface IRate {
  id: string;
  rate: "quiz" | "teacher";
}

export interface startQuizFunctionProps {
  quiz_id: string;
  isAuthenticated?: boolean;
  anonymous_id: string;
  access_key?: string;
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
  surveyResponses = "surveyResponses",
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

export interface timerProps {
  quiz_id: string;
  className?: string;
  initialTime: number;
  onTimeFinish: () => void;
}

export interface dictionaryProps {
  children: React.ReactElement;
}

export type phoneticsTypes = {
  text: [];
  audio: string;
  sourceUrl?: string;
  license?: {
    name: string;
    url: string;
  };
};

export type definitionsTypes = {
  definition: string;
  synonyms: string[];
  antonyms: string[];
  example?: string;
};

export type meaningType = {
  partOfSpeech: string;
  definitions: definitionsTypes[];
  synonyms: string[];
  antonyms: string[];
};

export interface dictionaryResultProps {
  word: string;
  phonetic: [];
  phonetics: phoneticsTypes[];
  meanings: meaningType[];
  license: {
    name: string;
    url: string;
  };
  sourceUrls: string[];
}

export interface QuizState {
  openDictionary: boolean;
  openCalculator: boolean;
  questionIDs: string[];
  currentQuizData: IQuiz | null;
  openComment: boolean;
  questionsAnswered: number;
  refs: RefObject<HTMLDivElement>[];
}

export interface QuizAction {
  setOpenDictionary: () => void;
  setOpenCalculator: () => void;
  setQuestionIDs: (props: string[]) => void;
  setCurrentQuizData: (props: IQuiz | null) => void;
  setOpenComment: (props: boolean) => void;
  setQuestionsAnswered: (props: "increment" | "decrement") => void;
  setRefs: (props: RefObject<HTMLDivElement>[]) => void;
  clearQuestionAnswered: () => void;
}

export interface SideBarProps {
  children: React.ReactNode;
  can_collapse?: boolean;
  className?: string;
  openAndCloseButton: React.ReactNode;
}

export interface SideBarState {
  isNavOpen: boolean;
  isCollapsed: boolean;
}

export interface SideBarAction {
  toggleSideBar: (props: boolean) => void;
  setCollapseSidebar: (props: boolean) => void;
}

export interface QuickActionProps {
  className?: string;
}

export type questionUIStateProps = {
  show_answer?: boolean;
  is_correct?: boolean;
  question_type: string;
  correct_answer: string;
  editted: boolean;
};

export interface ComboBoxProps {
  isLoading?: boolean;
  error?: Error | null;
  disabled?: boolean;
  title?: string;
  data: combo_box_type<string>[];
  value: string;
  className?: string;
  popoverClassName?: string;
  search: string;

  setSearch: React.Dispatch<React.SetStateAction<string>>;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

export interface NotificationsProps {
  id: string;
  message: string;
  path: null;
  user: Pick<IUser, "id" | "profile_image" | "username">;
  user_requesting: Pick<IUser, "id" | "profile_image" | "username">;
  notification_type:
    | "default"
    | "community_request"
    | "new_quiz_alert"
    | "achievement";
  is_read: boolean;
  created_at: Date;
  updated_at: Date;
  quiz: Pick<IQuiz, "id" | "title" | "banner" | "host">;
}

export interface paginationNavProps {
  className?: string;
  length: number;
}

export interface comingSoonProps {
  isVisible: boolean;
  featureName: string;
  description: string;
  joinWaitList: boolean;
  type: featureWaitListProps;

  // Actions
  setFeatureName: (prop: string) => void;
  setDescription: (prop: string) => void;
  setJoinWaitList: (prop: boolean) => void;
  setIsVisible: (prop: boolean) => void;
  setType: (prop: featureWaitListProps) => void;
}

export type publishDetails = {
  surveyLink: string;
  publishDate: string;
  isFirstPublish: boolean;
};

export interface publicationTypes {
  openPublishModal: boolean;
  recipients: string;
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
  publishDetails: publishDetails | null;

  // Actions Here
  setOpenPublishModal: (prop: boolean) => void;
  setRecipients: (prop: string) => void;
  setPublishDetails: (props: publishDetails) => void;
  setIsSuccess: (prop: boolean) => void;
}

export interface explorePageProps {
  // Recommended Quiz
  recommendedQuizzes: IQuiz[];
  filterRecommendedQuiz: IQuiz[];
  setRecommendedQuizzes: (props: IQuiz[]) => void;
  setFilterRecommendedQuiz: (props: IQuiz[]) => void;
}
