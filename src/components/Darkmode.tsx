// Importing icons from the "lucide-react" library
import { Moon, Sun } from "lucide-react";
// Importing the custom Button component
import { Button } from "./Button";
// Importing the useLocalStorage hook from the "@uidotdev/usehooks" library
import { useLocalStorage } from "@uidotdev/usehooks";
import { useZStore } from "../provider";

// Darkmode component
const Darkmode = () => {
  // Using the useLocalStorage hook to manage theme in local storage
  const [localstorage_data, saveTheme] = useLocalStorage<
    "dark" | "light" | null
  >("theme", null);
  const { setIsDarkMode } = useZStore();

  // Function to toggle between dark and light modes
  const toggle_modes = () => {
    // Toggle to light mode if the current theme is dark
    if (localstorage_data === "dark") {
      saveTheme("light");
      document.documentElement.classList.remove("dark");
      setIsDarkMode(false);
    }

    // Toggle to dark mode if the current theme is light
    if (localstorage_data === "light") {
      saveTheme("dark");
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    }
  };

  // Render the Darkmode component with a Button that toggles modes
  return (
    <Button
      className="bg-green-50 dark:hover:bg-green-100 dark:text-green-500"
      onClick={toggle_modes}
      variant={"outline"}
      size={"icon"}
    >
      {/* Display a sun icon if the current theme is dark, otherwise display a moon icon */}
      {localstorage_data === "dark" ? <Sun /> : <Moon />}
    </Button>
  );
};

// Export the Darkmode component as the default export
export default Darkmode;
