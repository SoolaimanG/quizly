import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../Dropdown";
import { Globe2, LogOut, PenLine, Settings, User, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../Avatar";
import Hint from "../Hint";
import Cookies from "js-cookie";
import { useZStore } from "../../provider";
import { Link } from "react-router-dom";
import { app_config } from "../../Types/components.types";

export const ManageAccount = () => {
  const logout = () => {
    Cookies.remove("access_token");
  };

  const { user } = useZStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <Hint
            element={
              <AvatarImage src={user?.profile_image as string} alt="@shadcn" />
            }
            content="Manage Account"
          />
          <AvatarFallback>{user?.username?.[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to={app_config.my_profile}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to={app_config.my_communities}>
              <Globe2 className="mr-2 h-4 w-4" />
              <span>My Communities</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          {user?.account_type === "T" && (
            <DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Users className="mr-2 h-4 w-4" />
                <span>My Students</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <PenLine className="mr-2 h-4 w-4" />
                <span>My Quizzes</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          )}
          <DropdownMenuSeparator />
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
