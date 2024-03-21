import { Heart, Loader2 } from "lucide-react";
import Hint from "../Hint";
import { FC, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthentication, useMethods } from "../../Hooks";
import {
  isCommentLiked,
  likeAndUnlikeComment,
} from "../../Functions/APIqueries";
import { toast } from "../use-toaster";
import { errorMessageForToast } from "../../Functions";
import { AxiosError } from "axios";

export const CommentLike: FC<{ comment_id: number }> = ({ comment_id }) => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthentication();
  const { login_required } = useMethods();
  const { isLoading, data, error, refetch } = useQuery<{
    data: { is_liked: boolean };
  }>({
    queryKey: ["comment_like", comment_id],
    queryFn: () => isCommentLiked(comment_id),
    enabled: isAuthenticated,
  });

  // If there is an error notify the user!
  useEffect(() => {
    error &&
      toast({
        title: "Error",
        description: errorMessageForToast(
          error as AxiosError<{ message: string }>
        ),
        variant: "destructive",
      });
  }, [error]);

  const { mutate } = useMutation({
    mutationKey: ["likeAndUnlikeComment", comment_id],
    mutationFn: () => likeAndUnlikeComment(comment_id),
    onMutate: async () => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ["comment_like", comment_id],
      });

      // Snapshot the previous value
      const previousStatus = queryClient.getQueryData([
        "comment_like",
        comment_id,
      ]);

      // Return a context object with the snapshotted value
      return { previousStatus };
    },

    onError: (error, __, context) => {
      toast({
        title: "Error",
        description: errorMessageForToast(
          error as AxiosError<{ message: string }>
        ),
        variant: "destructive",
      });

      queryClient.setQueryData(
        ["comment_like", comment_id],
        context?.previousStatus
      );
    },

    onSettled: () => {
      refetch();
    },
  });

  const likeAndUnlike = () => {
    login_required();

    if (!login_required()) return;

    if (isLoading)
      return toast({
        title: "Error",
        description: "Please wait till loading is done.",
        variant: "destructive",
      });
    mutate();
  };

  return (
    <Hint
      element={
        isLoading ? (
          <Loader2 className="animate-spin" />
        ) : (
          <Heart
            onClick={likeAndUnlike}
            className="cursor-pointer text-green-700"
            fill={isAuthenticated && data?.data.is_liked ? "green" : ""}
            size={15}
          />
        )
      }
      content="Like comment"
    />
  );
};
