import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Array of navigation link
export const navbar_links = [
  { name: "Home", path: "#home" },
  { name: "Service", path: "#service" },
  {
    name: "Reviews",
    path: "#reviews",
  },
  {
    name: "Contact Us",
    path: "#contact-us",
  },
];
