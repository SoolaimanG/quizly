import { FC } from "react";
import { Button } from "../../components/Button";
import { toast } from "../../components/use-toaster";
import { CommunityApiCalls } from "../../Functions/APIqueries";

export const RejectRequestBTN: FC<{
  user_id: string;
  community_id: string;
  revalidate?: () => void;
}> = ({ user_id, community_id, revalidate }) => {
  const communtiy = new CommunityApiCalls(community_id);

  const handleCommunityRequest = async () => {
    try {
      await communtiy.accept_or_reject_request("reject", user_id);
      revalidate && revalidate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong..",
        variant: "destructive",
      });
    }
  };
  return (
    <Button
      onClick={handleCommunityRequest}
      className="h-7 px-2 py-1"
      variant="destructive"
    >
      Reject
    </Button>
  );
};

export const AcceptRequestBTN: FC<{
  user_id: string;
  username: string;
  community_id: string;
  revalidate?: () => void;
}> = ({ user_id, username, community_id, revalidate }) => {
  const communtiy = new CommunityApiCalls(community_id);

  const handleCommunityRequest = async () => {
    try {
      await communtiy.accept_or_reject_request("accept", user_id);
      revalidate && revalidate();
      toast({
        title: "Success",
        description: `You just accepted ${username} to your community`,
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Something went wrong..",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      onClick={handleCommunityRequest}
      className="h-7 px-2 py-1"
      variant="base"
    >
      Accept
    </Button>
  );
};
