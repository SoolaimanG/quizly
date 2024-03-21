import { FC, useState } from "react";
import { Input } from "../Input";
import { cn } from "../../lib/utils";
import { ChevronDown, DropletIcon } from "lucide-react";
import { Label } from "../Label";

export const Color: FC<{ className?: string }> = ({ className }) => {
  const [hex, setHex] = useState("");
  return (
    <div className={cn("border-[1.3px] rounded-md", className)}>
      <Label className="flex items-center gap-1 p-2" htmlFor="color">
        <DropletIcon size={15} />
        <ChevronDown size={15} />
        <Input
          value={hex}
          onChange={(e) => setHex(e.target.value)}
          className="hidden"
          id="color"
          type="color"
        />
      </Label>
    </div>
  );
};
