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

export type dropDownAlign = "center" | "start" | "end";

export const DropDownComponent: React.FC<{
  className?: string;
  dropDownHeader: string;
  align?: dropDownAlign;
  extraClassName?: string;
  allowMultipleSelection?: boolean;
  dropDownOptions?: string[];
  placeHolder: string;
}> = ({
  className,
  dropDownHeader,
  align = "center",
  extraClassName,
  dropDownOptions,
  allowMultipleSelection,
  placeHolder,
}) => {
  const [open, setOpen] = React.useState(false);
  const [list, setList] = React.useState<string[]>([]);

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

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild className={cn("cursor-pointer", className)}>
        <div
          className={cn(
            "flex gap-1 w-full h-fit flex-wrap rounded-md border border-green-200 px-2 py-2 relative"
          )}
        >
          {!list.length ? (
            <Description text={placeHolder} />
          ) : (
            list.slice(0, 3).map((l) => (
              <Badge
                className="rounded-sm flex items-center gap-2"
                key={l}
                variant="success"
              >
                {l}
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
                "transition-all text-green-500 ease-linear",
                open && "rotate-180"
              )}
            />
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        className={cn("w-[200px] overflow-auto", extraClassName)}
      >
        <Description className="italic" text={dropDownHeader} />
        <DropdownMenuGroup>
          {!dropDownOptions?.length ? (
            <Description
              className="h-full mt-3 w-full flex items-center justify-center"
              text="No Data Found."
            />
          ) : (
            dropDownOptions?.map((option, index) => (
              <DropdownMenuItem
                className={cn(
                  "cursor-pointer",
                  list.includes(option) && "text-green-600 font-medium"
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
