// Importing icons from the "lucide-react" library
import { Moon, Sun } from "lucide-react";
// Importing the custom Button component
import { Button } from "./Button";
// Importing the useLocalStorage hook from the "@uidotdev/usehooks" library
import { useLocalStorage } from "@uidotdev/usehooks";
import { useZStore } from "../provider";
import { toggle_modes } from "../Functions";
import { FC, ReactElement } from "react";

// Darkmode component
export const DarkMode: FC<{ children?: ReactElement }> = ({ children }) => {
  // Using the useLocalStorage hook to manage theme in local storage
  const [theme, saveTheme] = useLocalStorage<"dark" | "light" | null>(
    "theme",
    null
  );
  const { setIsDarkMode } = useZStore();

  const defaultUI = (
    <Button
      className="bg-green-50 dark:hover:bg-green-100 dark:text-green-500"
      onClick={() => toggle_modes({ theme, saveTheme, setIsDarkMode })}
      variant={"outline"}
      size={"icon"}
    >
      {/* Display a sun icon if the current theme is dark, otherwise display a moon icon */}
      {theme === "dark" ? <Sun /> : <Moon />}
    </Button>
  );

  const devPreference = (
    <div onClick={() => toggle_modes({ theme, saveTheme, setIsDarkMode })}>
      {children}
    </div>
  );

  return children ? devPreference : defaultUI;
};
