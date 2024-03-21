import { FC, ReactElement } from "react";
import { UserProfilePicture } from "./UserProfilePicture";
import { Card, CardContent, CardDescription } from "../Card";
import { capitalize_first_letter } from "../../Functions";
import { IUser } from "../../Types/components.types";
import { Button } from "../Button";
import { FollowTutorBtn } from "./FollowTutorBtn";
import { cn } from "../../lib/utils";

export const UserCard: FC<
  Pick<IUser, "id" | "profile_image" | "username" | "account_type"> & {
    allow_follow?: boolean;
    className?: string;
    children?: ReactElement;
  }
> = ({
  profile_image,
  username,
  account_type,
  allow_follow,
  children,
  className,
}) => {
  return (
    <Card className={cn("w-full cursor-pointer", className)}>
      <CardContent className="px-2 w-full py-3 rounded-sm flex items-center gap-3">
        <UserProfilePicture profile_image={profile_image} username={username} />
        <div>
          <h1 className="text-green-500">
            {capitalize_first_letter(username)}
          </h1>
          <CardDescription>Student</CardDescription>
        </div>
        {account_type === "T" && allow_follow && (
          <div className="flex items-end justify-end w-full">
            <FollowTutorBtn>
              <Button variant="base" className="h-8 px-3 py-2">
                Follow
              </Button>
            </FollowTutorBtn>
          </div>
        )}
      </CardContent>
      {children && <CardContent>{children}</CardContent>}
    </Card>
  );
};
