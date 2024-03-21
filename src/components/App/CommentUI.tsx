import { Ref, forwardRef } from "react";
import { IComment, app_config } from "../../Types/components.types";
import { Avatar, AvatarFallback, AvatarImage } from "../Avatar";
import { useText } from "../../Hooks/text";
import { Description } from "../../Pages/ExplorePage/QuickQuiz";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { capitalize_first_letter } from "../../Functions";

import { LikeQuizComment } from "./LikeQuizComment";

export const CommentUI = forwardRef(
  (
    {
      id,
      body,
      type = "quiz",
      username,
      created_at,
      profile_image,
    }: IComment & { type: "quiz" | "community" },
    ref: Ref<HTMLDivElement>
  ) => {
    const { getFirstLetterAndCapitalize } = useText();

    const date = formatDistanceToNow(new Date(created_at));
    return (
      <div
        ref={ref}
        className="flex md:flex-row items-center justify-between w-full"
      >
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
            <Description text={date} />
          </div>
        </div>
        {type === "quiz" && <LikeQuizComment comment_id={id} />}
      </div>
    );
  }
);
