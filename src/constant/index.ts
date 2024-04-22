import PatternOne from "../assets/PatternOne.svg";
import PatternTwo from "../assets/PatternTwo.svg";
import PatternThree from "../assets/PatternThree.svg";
import PatternFour from "../assets/PatternFour.svg";
import PatternFive from "../assets/PatternFive.svg";
import PatternSix from "../assets/PatternSix.svg";
import PatternSeven from "../assets/PatternSeven.svg";
import { background_pattern } from "../Types/survey.types";
import { integratedApps } from "../Functions/surveyApis";

export const allStyles = {
  font_size: {
    SMALL: "text-xs", // Tailwind class for small font size
    MEDIUM: "text-base", // Tailwind class for medium font size
    LARGE: "text-lg", // Tailwind class for large font size
  },
  font_family: {
    SYSTEM: "", // Use user's system font
    ARIAL: "inter-font", // Apply Tailwind's sans-serif class for Arial
    FUTURA: "noto-sans-font", // Futura might require additional font loading (see considerations)
    JOSEFIN_SANS: "josefin-sans-font", // Apply Tailwind's sans-serif class for JosefinSans
    TIMES_NEW_ROMAN: "serif", // Apply Tailwind's serif class for TimesNewRoman
    HELVETICA: "font-sans", // Apply Tailwind's sans-serif class for Helvetica
    GARAMOND: "garamond-font", // Apply Tailwind's serif class for Garamond; consider font loading
  },
  border_radius: {
    SMALL: "rounded-sm", // Tailwind class for small rounded corners
    MEDIUM: "rounded-md", // Tailwind class for medium rounded corners
    LARGE: "rounded-lg", // Tailwind class for large rounded corners
  },
  color: {
    BLUE: "text-blue-500", // Tailwind class for blue color (adjust shade as needed)
    YELLOW: "text-yellow-500", // Tailwind class for yellow color (adjust shade as needed)
    GREEN: "text-green-500", // Tailwind class for green color (adjust shade as needed)
    WHITE: "text-slate-900 dark:text-gray-100",
  },
  button: {
    BLUE: "bg-blue-500 hover:bg-blue-600 disabled:bg-blue-800", // Tailwind class for blue color (adjust shade as needed)
    YELLOW: "bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-800", // Tailwind class for yellow color (adjust shade as needed)
    GREEN: "bg-green-500 hover:bg-green-600 disabled:bg-green-800", // Tailwind class for green color (adjust shade as needed)
  },
  border: {
    BLUE: "border-blue-500 hover:bg-blue-300 focus:border-b-blue-700",
    YELLOW: "border-yellow-500 hover:bg-yellow-300 focus:border-b-yellow-700",
    GREEN: "border-green-500 hover:bg-green-300 focus:border-b-green-700",
  },
  button_text: {
    BLUE: "text-blue-500", // Tailwind class for blue color (adjust shade as needed)
    YELLOW: "text-yellow-500", // Tailwind class for yellow color (adjust shade as needed)
    GREEN: "text-green-500",
    WHITE: "text-white",
  },
  background_color: {
    BLUE: "bg-blue-500", // Tailwind class for blue color (adjust shade as needed)
    YELLOW: "bg-yellow-500", // Tailwind class for yellow color (adjust shade as needed)
    GREEN: "bg-green-500",
    WHITE: "bg-card",
  },
  light_background_color: {
    GREEN: "bg-green-200 border-green-500 dark:bg-green-300 text-green-500",
    BLUE: "bg-blue-200 border-blue-500 dark:bg-blue-300 text-blue-500",
    YELLOW:
      "bg-yellow-200 border-yellow-500 dark:bg-yellow-300 text-yellow-500",
    WHITE: "text-white border-white",
  },
  dark_background_color: {
    GREEN: "bg-green-300 border-green-500 dark:bg-green-400 text-green-500",
    BLUE: "bg-blue-300 border-blue-500 dark:bg-blue-400 text-blue-500",
    YELLOW:
      "bg-yellow-300 border-yellow-500 dark:bg-yellow-400 text-yellow-500",
  },
  button_style: {
    BLUE: "text-blue-500 hover:text-blue-600", // Tailwind class for blue color (adjust shade as needed)
    YELLOW: "text-yellow-500 hover:text-yellow-600 ", // Tailwind class for yellow color (adjust shade as needed)
    GREEN: "text-green-500 hover:text-green-600 ",
  },
};

export const backgroundPatterns: { id: background_pattern; image: string }[] = [
  {
    id: "pattern-uvskajs",
    image: PatternOne,
  },
  {
    id: "pattern-euukzq",
    image: PatternTwo,
  },
  {
    id: "pattern-ahwmak",
    image: PatternThree,
  },
  {
    id: "pattern-ydfyai",
    image: PatternFour,
  },
  {
    id: "pattern-arywav",
    image: PatternFive,
  },
  {
    id: "pattern-arraaj",
    image: PatternSix,
  },
  {
    id: "Non",
    image: PatternSeven,
  },
];

export const apps: integratedApps[] = ["google_drive", "excel"];

export const appAccess = [
  "Admin Console",
  "User Accounts",
  "Permissions",
  "Storage Allocation",
  "Security",
  "Collaboration Tools",
  "Mobile Access",
];
