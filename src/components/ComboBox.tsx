import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "../lib/utils";
import { Button } from "../components/Button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../components/Command";
import { Popover, PopoverContent, PopoverTrigger } from "../components/Popover";

import { combo_box_type } from "../Types/components.types.ts";

export function Combobox({
  data,
  value,
  setValue,
  title,
  className,
}: {
  title?: string;
  data: combo_box_type[];
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`${className ? className : "w-[200px]"} justify-between`}
        >
          {value
            ? data.find((d) => d.value.toLowerCase() === value.toLowerCase())
                ?.label
            : title ?? "Select from data..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." />
          <CommandEmpty>No framework found.</CommandEmpty>
          <CommandGroup>
            {data.map((d, i) => (
              <CommandItem
                key={i}
                value={d.value}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === d.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {d.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
