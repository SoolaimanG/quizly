"use client";

import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { cn } from "../lib/utils";
import { Button } from "../components/Button";
import { Calendar } from "../components/Calender";
import { Popover, PopoverContent, PopoverTrigger } from "../components/Popover";
import { FC } from "react";
import { dateFormat } from "../Types/survey.types";

export const DatePicker: FC<{
  date: Date | undefined;
  format?: dateFormat;
  className?: string;
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
}> = ({ date, setDate, format: formatter = "PPP", className }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            format(date, formatter?.toLowerCase() === "ppp" ? "PPP" : formatter)
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};
