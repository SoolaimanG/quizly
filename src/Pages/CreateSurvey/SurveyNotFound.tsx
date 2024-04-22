import { Navbar } from "./Navbar";
import { ManageAccount } from "../../components/App/ManageAccount";
import { toggle_modes } from "../../Functions";
import { MoonIcon, SunIcon } from "lucide-react";
import { Description } from "../ExplorePage/QuickQuiz";
import { Button } from "../../components/Button";
import { Link } from "react-router-dom";
import { app_config } from "../../Types/components.types";
import { useLocalStorage } from "@uidotdev/usehooks";
import { useZStore } from "../../provider";

export const SurveyNotFound = () => {
  const { setIsDarkMode, is_darkmode } = useZStore();
  const [theme, saveTheme] = useLocalStorage<"dark" | "light" | null>(
    "theme",
    "dark"
  );
  return (
    <div>
      <Navbar
        title="404"
        middleContent={<></>}
        lastContent={
          <div className="flex items-center gap-2">
            <Button
              className="rounded-full"
              onClick={() => toggle_modes({ theme, saveTheme, setIsDarkMode })}
              size="icon"
              variant="secondary"
            >
              {is_darkmode ? <SunIcon size={18} /> : <MoonIcon size={18} />}
            </Button>
            <ManageAccount />
          </div>
        }
      />
      <div className="w-full h-screen flex flex-col gap-3 items-center justify-center">
        <h1 className="text-4xl text-center">404 - Looks like you are lost.</h1>
        <Description text="Maybe this page used to exist or you spelled something wrong." />
        <Description text="Chances are there you spelled something wrong, so you can double check the URL." />
        <Button asChild className="hover:bg-primary " variant="base">
          <Link to={app_config.create_survey + "?list=grid"}>Back Home</Link>
        </Button>
      </div>
    </div>
  );
};
