import { MoreHorizontal } from "lucide-react";
import { FC } from "react";
import { Button } from "../../components/Button";
import Hint from "../../components/Hint";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/Popover";
import {
  Command,
  CommandGroup,
  CommandList,
  CommandSeparator,
} from "../../components/Command";
import { useNavigate } from "react-router-dom";
import { app_config } from "../../Types/components.types";
import { toast } from "../../components/use-toaster";
import { DeleteSurvey } from "./DeleteSurvey";

export const MoreButtonSurvey: FC<{
  id: string;
  status: "DEVELOPMENT" | "PRODUCTION";
  name: string;
  participants: number;
}> = ({ id, status, name, participants }) => {
  const navigate = useNavigate();
  const handleNavigation = (path: string) => {
    navigate(path + "?id=" + id);
  };
  const handleShare = () => {
    if (navigator.canShare()) return;
    navigator.share({
      title: name,
      text: "Share " + name,
      url: "",
    });
  };
  return (
    <div>
      <Popover>
        <PopoverTrigger>
          <Hint
            element={
              <Button variant="ghost" size="icon" className="rounded-full">
                <MoreHorizontal />
              </Button>
            }
            content="More Options"
          />
        </PopoverTrigger>
        <PopoverContent className="p-1 flex flex-col gap-2">
          <Command>
            <CommandList>
              <CommandGroup heading="Quick Actions">
                <Button
                  variant="ghost"
                  className="w-full h-9 flex items-start justify-start"
                  onClick={() => handleNavigation(app_config.survey_workspace)}
                >
                  Open
                </Button>
                <Button
                  variant="ghost"
                  className="w-full h-9 flex items-start justify-start"
                  onClick={() => {
                    if (status === "DEVELOPMENT") {
                      toast({
                        title: "Error",
                        description:
                          "Cannot copy link. Survey under development.",
                        variant: "destructive",
                      });
                      return;
                    }
                    handleNavigation("");
                  }}
                >
                  Copy Link
                </Button>
                <Button
                  variant="ghost"
                  className="w-full h-9 flex items-start justify-start"
                  onClick={() => {
                    if (status === "DEVELOPMENT") {
                      toast({
                        title: "Error",
                        description:
                          "Cannot copy link. Survey under development.",
                        variant: "destructive",
                      });
                      return;
                    }
                    handleShare();
                  }}
                >
                  Share
                </Button>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Settings">
                <Button
                  onClick={() => handleNavigation(app_config.survey_result)}
                  variant="ghost"
                  className="w-full h-9 flex items-start justify-start"
                >
                  Result
                </Button>
                <DeleteSurvey name={name} participants={participants} id={id}>
                  <Button
                    variant="ghost"
                    className="w-full h-9 flex text-red-500 items-start justify-start"
                  >
                    Delete
                  </Button>
                </DeleteSurvey>
              </CommandGroup>
            </CommandList>
          </Command>

          {/* <ContextMenuItem className="text-red-400">Delete</ContextMenuItem> */}
        </PopoverContent>
      </Popover>
    </div>
  );
};
