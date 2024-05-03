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

import { ComboBoxProps } from "../Types/components.types.ts";
import { Description } from "./App/Description.tsx";

export function Combobox({
  data,
  value,
  title,
  search,
  disabled,
  isLoading,
  className,
  popoverClassName,
  setValue,
  setSearch,
}: ComboBoxProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger disabled={disabled} asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(`"w-[200px] justify-between`, className)}
        >
          {value
            ? data.find((d) => d.value.toLowerCase() === value.toLowerCase())
                ?.label
            : title ?? "Select from data..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("w-[200px] p-0", popoverClassName)}>
        <Command className="w-full">
          <CommandInput
            value={search}
            onValueChange={setSearch}
            placeholder={title}
          />

          {!isLoading && <CommandEmpty>No data found.</CommandEmpty>}
          {isLoading && (
            <Description
              className="animate-pulse text-center p-3"
              text="Please wait..."
            />
          )}
          <CommandGroup className="w-full">
            {data?.map((d, i) => (
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
                    value?.toLowerCase() === d.value?.toLowerCase()
                      ? "opacity-100"
                      : "opacity-0"
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
