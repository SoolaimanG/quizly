import { CalculatorIcon, ChevronDown } from "lucide-react";
import { IQuiz } from "../../Types/components.types";
import { Button } from "../Button";
import Calculator from "./Calculator";
import { Popover, PopoverContent, PopoverTrigger } from "../Popover";
import { Dictionary } from "./Dictionary";
import { WholeWordIcon } from "lucide-react";
import { useLocalStorage } from "@uidotdev/usehooks";
import { Sun } from "lucide-react";
import { Moon } from "lucide-react";
import { useZStore } from "../../provider";
import { toggle_modes } from "../../Functions";
import { Command } from "cmdk";
import { CommandShortcut } from "../Command";
import { Description } from "./Description";

export const QuizTools: React.FC<
  Pick<IQuiz, "allow_calculator" | "allow_word_search">
> = ({ allow_calculator, allow_word_search }) => {
  const ToolsAvailable = allow_calculator || allow_word_search;

  const { setIsDarkMode } = useZStore();
  const [theme, saveTheme] = useLocalStorage<"dark" | "light" | null>(
    "theme",
    null
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="flex  border-slate-400 items-center gap-1"
          variant={"outline"}
        >
          Tools <ChevronDown />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col p-1 gap-3">
        <Description
          text={!ToolsAvailable ? "No Tools Are Allowed" : "Available Tools"}
        />
        {allow_calculator && (
          <Calculator
            button={
              <Button
                variant={"ghost"}
                className="flex w-full items-center justify-start gap-1"
              >
                <CalculatorIcon />
                Calculator
              </Button>
            }
            answer={""}
            setAnswer={() => {}}
          />
        )}
        {allow_word_search && (
          <Dictionary>
            <Button variant={"ghost"} className="w-full">
              <div className="flex w-full items-center justify-start gap-1">
                <WholeWordIcon />
                Dictionary
              </div>
              <Command>
                <CommandShortcut>⌘D</CommandShortcut>
              </Command>
            </Button>
          </Dictionary>
        )}
        <Button
          onClick={() => toggle_modes({ theme, saveTheme, setIsDarkMode })}
          variant={"ghost"}
          className="w-full"
        >
          <div className="flex w-full items-center justify-start gap-1">
            {theme === "dark" ? <Sun /> : <Moon />}
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </div>
          <Command>
            <CommandShortcut>⌘M</CommandShortcut>
          </Command>
        </Button>
      </PopoverContent>
    </Popover>
  );
};
