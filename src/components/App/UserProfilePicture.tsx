import { FC } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../Avatar";
import { useText } from "../../Hooks/text";

export const UserProfilePicture: FC<{
  profile_image?: string;
  username: string;
}> = ({ profile_image, username }) => {
  const { getFirstLetterAndCapitalize } = useText();
  return (
    <Avatar>
      <AvatarImage src={profile_image} />
      <AvatarFallback>{getFirstLetterAndCapitalize(username)}</AvatarFallback>
    </Avatar>
  );
};
