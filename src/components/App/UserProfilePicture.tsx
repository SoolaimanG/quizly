import { Avatar, AvatarFallback, AvatarImage } from "../Avatar";
import { useText } from "../../Hooks/text";
import { useZStore } from "../../provider";

export const UserProfilePicture = () => {
  const { user } = useZStore();
  const { getFirstLetterAndCapitalize } = useText();
  return (
    <Avatar className="cursor-pointer">
      <AvatarImage src={user?.profile_image} alt="user-profile-image" />
      <AvatarFallback>
        {getFirstLetterAndCapitalize(user?.username || "")}
      </AvatarFallback>
    </Avatar>
  );
};
