import React from "react";
import { IComment, app_config } from "../../Types/components.types";
import { Avatar, AvatarFallback, AvatarImage } from "../Avatar";
import { useText } from "../../Hooks/text";
import { Description } from "../../Pages/ExplorePage/QuickQuiz";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { capitalize_first_letter } from "../../Functions";

export const CommentUI: React.FC<IComment> = ({
  created_at,
  username,
  profile_image,
  body,
}) => {
  const { getFirstLetterAndCapitalize } = useText();

  const date = formatDistanceToNow(new Date(created_at));
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full">
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage src={profile_image} />
          <AvatarFallback>
            {getFirstLetterAndCapitalize(username)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <Link className="" to={app_config.user + username}>
            <Description text={capitalize_first_letter(username)} />
          </Link>
          <p>{body}</p>
        </div>
      </div>
      <div className="ml-12 md:ml-0">
        <Description text={date} />
      </div>
    </div>
  );
};
