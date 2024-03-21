import { FC } from "react";
import { NotificationsProps } from "../../Types/components.types";
import { UserProfilePicture } from "./UserProfilePicture";
import { Description } from "../../Pages/ExplorePage/QuickQuiz";
import { formatDistanceToNow } from "date-fns";
import { useText } from "../../Hooks/text";
import { Button } from "../Button";
import { Link } from "react-router-dom";
import { NotificationsApi } from "../../Functions/NotificationsApi";
import { toast } from "../use-toaster";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthentication } from "../../Hooks";
import {
  AcceptRequestBTN,
  RejectRequestBTN,
} from "../../Pages/Comps/RequestButtons";
import { useCommunityStore } from "../../provider";

export const NotificationUI: FC<NotificationsProps> = ({
  user: { profile_image, username },
  user_requesting,
  is_read,
  message,
  created_at,
  notification_type,
  quiz,
  id,
}) => {
  const { truncateWord } = useText();
  const notification = new NotificationsApi();
  const { communityDetails } = useCommunityStore();
  const { isAuthenticated } = useAuthentication();
  const query = useQueryClient();

  const handleRead = async () => {
    try {
      if (is_read) return;
      await notification.mark_notification_as_read(id);
      await query.invalidateQueries({
        queryKey: ["notifications", isAuthenticated],
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong...",
        variant: "destructive",
      });
    }
  };

  const notificationNotRead = (
    <div className="bg-green-500 w-2 h-2 rounded-full absolute top-4 right-2" />
  );

  const time = formatDistanceToNow(new Date(created_at));
  const DefaultNotificationStyle = (
    <div className="flex items-center gap-3 relative">
      {notificationNotRead}
      <UserProfilePicture profile_image={profile_image} username={username} />
      <div className="flex flex-col">
        <Description text={truncateWord(message, 100)} />
        {time}
      </div>
    </div>
  );

  const communityRequestStyle = (
    <div className=" relative flex gap-2 ">
      {!is_read && notificationNotRead}
      <UserProfilePicture
        profile_image={user_requesting?.profile_image}
        username={user_requesting?.username}
      />
      <div className="flex flex-col gap-3">
        <Description text="Soolaiman requesting to join Best Quiz Community" />
        <div className="flex items-center gap-2">
          <RejectRequestBTN
            user_id={user_requesting?.id}
            community_id={communityDetails?.id ?? ""}
          />
          <AcceptRequestBTN
            user_id={user_requesting?.id}
            username={user_requesting?.username}
            community_id={communityDetails?.id ?? ""}
          />
        </div>
      </div>
    </div>
  );

  const newQuizAlertStyle = (
    <div className=" relative flex items-center gap-2 ">
      {!is_read && notificationNotRead}
      <UserProfilePicture profile_image={quiz?.banner} username={quiz?.title} />
      <div className="flex w-full items-end justify-end flex-col gap-2">
        <Description
          className="items-start justify-start flex w-full"
          text={quiz?.host?.username + " Just uploaded a new quiz"}
        />
        <Button asChild className="h-7 py-1" variant="secondary">
          <Link to={""}>Start Quiz</Link>
        </Button>
      </div>
    </div>
  );

  const views = {
    default: DefaultNotificationStyle,
    community_request: communityRequestStyle,
    new_quiz_alert: newQuizAlertStyle,
    achievement: "",
  };

  return (
    <div className="">
      <div
        onClick={handleRead}
        className="hover:bg-green-50 dark:hover:bg-slate-950 p-2 cursor-pointer transition-all ease-linear"
      >
        {views[notification_type]}
      </div>
      <hr />
    </div>
  );
};
