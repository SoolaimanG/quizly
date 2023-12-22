import React from "react";
import { IUser } from "../../Types/components.types";
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
import { LogOut, PenLine, Settings, User, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../Avatar";
import Hint from "../Hint";
import Cookies from "js-cookie";

const ManageAccount: React.FC<
  Pick<IUser, "account_type" | "profile_image" | "username">
> = ({ account_type, profile_image, username }) => {
  const logout = () => {
    Cookies.remove("access_token");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <Hint
            element={
              <AvatarImage src={profile_image as string} alt="@shadcn" />
            }
            content="Manage Account"
          />
          <AvatarFallback>{username[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          {account_type === "T" && (
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

export default ManageAccount;
