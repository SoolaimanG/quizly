import { Editor } from "@tiptap/react";
import { Variants } from "framer-motion";
import { SetStateAction } from "react";

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

//Image Uploader Props
export interface image_uploader_props {
  button: React.ReactElement;
  images: string[];
  url?: string;
  setUrl: React.Dispatch<SetStateAction<string>>;
  setImages: React.Dispatch<SetStateAction<string[]>>;
}
export enum imageProperties {
  supportedFiles = "JPEG,PNG",
  maxFileSize = "10MB",
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
  user: IUser | null;
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
}

//Glassmorphism Props
export interface GlassmorphismProps {
  varient?: Variants;
  children: React.ReactNode;
  className?: string;
  blur?: number;
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
  path: "Login" | "ForgetPassword" | "SignUp" | "ConfirmEmail";
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

//this is properties of user the server will return
export interface IUser {
  account_type: "T" | "S";
  age?: number;
  auth_provider: "T" | "G" | "L";
  created_at: Date;
  email: string;
  id: string;
  is_active: boolean;
  password?: string;
  first_name: string;
  last_name: string;
  points: number;
  profile_image: string | React.ReactElement;
  updated_at: Date;
  username: string;
  email_verified: boolean;
  first_time_login: boolean;
}

//Quizzes created by user props
export interface IQuiz {
  access_with_key: boolean;
  category: string;
  created_at: Date;
  descriptions: string;
  difficulty: "easy" | "medium" | "hard";
  duration: number;
  host: Pick<IUser, "profile_image" | "username">;
  id: string;
  participants: IUser[];
  requirements: string;
  subject: string;
  title: string;
  rating: number;
}

export enum app_config {
  AppName = "Quizly",
}
