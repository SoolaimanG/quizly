import * as React from "react";
import { ChevronDown, X } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/Dropdown";
import { cn } from "../../lib/utils";
import { Badge } from "../Badge";
import { Description } from "../../Pages/ExplorePage/QuickQuiz";
import { Button } from "../Button";
import { useSurveyWorkSpace } from "../../provider";
import { allStyles } from "../../constant";
import { colorVariant } from "../../Types/survey.types";

export type dropDownAlign = "center" | "start" | "end";

export const DropDownComponent: React.FC<{
  className?: string;
  align?: dropDownAlign;
  extraClassName?: string;
  allowMultipleSelection?: boolean;
  dropDownOptions?: string[];
  placeHolder: string;
  color?: colorVariant;
  list: string[];
  setList: React.Dispatch<React.SetStateAction<string[]>>;
}> = ({
  className,
  align = "center",
  extraClassName,
  dropDownOptions,
  allowMultipleSelection,
  placeHolder,
  color,
  list,
  setList,
}) => {
  const [open, setOpen] = React.useState(false);
  const { surveyDesign } = useSurveyWorkSpace();

  const removeOption = (e: string) => {
    if (list.find((l) => l === e)) {
      setList((prev) => {
        const d = prev.filter((p) => p !== e);
        return d;
      });
    }
  };

  const selectOption = (e: string) => {
    if (list.find((l) => l === e)) {
      removeOption(e);
      return;
    }

    if (!allowMultipleSelection) {
      setList([e]);
      return;
    }

    setList((prev) => {
      const uniqueList = [...new Set([...prev, e])];

      return uniqueList;
    });
  };

  const c: Record<colorVariant, any> = {
    BLUE: {
      indicator: "text-blue-500 font-semibold",
    },
    GREEN: {
      indicator: "text-green-500 font-semibold",
    },
    YELLOW: {
      indicator: "text-yellow-500 font-semibold",
    },
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild className={cn("cursor-pointer", className)}>
        <div
          className={cn(
            "flex gap-1 w-full h-fit flex-wrap rounded-md border px-2 py-2 relative",
            allStyles.color[surveyDesign?.color ?? "GREEN"],
            allStyles.border[surveyDesign?.button ?? "GREEN"]
          )}
        >
          {!list.length ? (
            <Description text={placeHolder} />
          ) : (
            list.slice(0, 3).map((l) => (
              <Badge
                className={cn(
                  !allowMultipleSelection
                    ? "rounded-none border-none"
                    : "rounded-sm flex items-center gap-2"
                )}
                key={l}
                variant={
                  surveyDesign?.button === "BLUE"
                    ? "outline"
                    : surveyDesign?.button === "YELLOW"
                    ? "friendly"
                    : "success"
                }
              >
                {l}
                {allowMultipleSelection && (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeOption(l);
                    }}
                    className="w-3 h-3 p-0 bg-transparent rounded-full"
                    variant="outline"
                  >
                    <X size={11} />
                  </Button>
                )}
              </Badge>
            ))
          )}
          {list.length > 3 && (
            <Badge className="rounded-sm" variant="success">{`+${
              list.slice(3, list.length).length
            }`}</Badge>
          )}
          <div className="flex absolute right-1 items-center justify-end">
            <ChevronDown
              size={17}
              className={cn(
                "transition-all ease-linear",
                open && "rotate-180",
                c[color ?? "GREEN"]?.indicator
              )}
            />
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        className={cn("w-[200px] overflow-auto", extraClassName)}
      >
        <DropdownMenuGroup>
          {!dropDownOptions?.length ? (
            <Description
              className="h-full mt-4 w-full flex items-center justify-center"
              text="No Data Found."
            />
          ) : (
            dropDownOptions?.map((option, index) => (
              <DropdownMenuItem
                className={cn(
                  "cursor-pointer",
                  list.includes(option) && c[color ?? "GREEN"]?.indicator
                )}
                key={index}
                onClick={() => selectOption(option)}
              >
                {option}
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
