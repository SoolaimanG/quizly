import React, { useState } from "react";
import { IComment, commentsCompProps } from "../../Types/components.types";
import EmptyState from "./EmptyState";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addCommentFuncton, getQuizComments } from "../../Functions/APIqueries";
import { CommentUI } from "./CommentUI";
import { Input } from "../Input";
import { Button } from "../Button";
import { useMethods } from "../../Hooks";
import { ButtonSkeleton } from "./FilterByCategory";
import { useZStore } from "../../provider";

export const Comments: React.FC<commentsCompProps> = ({ quiz_id }) => {
  const queryClient = useQueryClient();
  const [comment, setComment] = useState("");
  const { isLoading, data, error } = useQuery<
    string,
    any,
    { data: IComment[] }
  >({
    queryKey: [`quiz_comments_${quiz_id}`],
    queryFn: () => getQuizComments(quiz_id),
    retry: 1,
  });

  const { mutate } = useMutation({
    mutationKey: [`add_comment_${quiz_id}`],
    mutationFn: () => addCommentFuncton({ comment, quiz_id }),
    onMutate: async (newComment: IComment) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: [`quiz_comments_${quiz_id}`],
      });

      // Snapshot the previous value
      const previousComments = queryClient.getQueryData<{ data: IComment[] }>([
        `quiz_comments_${quiz_id}`,
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData(
        [`quiz_comments_${quiz_id}`],
        (data: { data: IComment[] }) => {
          data: [...data.data, newComment];
        }
      );

      // Return a context object with the snapshotted value
      return { previousComments };
    },

    onError: (_, __, context) => {
      console.log({ _, __, context });
      queryClient.setQueryData(
        [`quiz_comments_${quiz_id}`],
        context?.previousComments
      );
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [`quiz_comments_${quiz_id}`] });
      setComment("");
    },
  });

  const { user } = useZStore();
  const { login_required } = useMethods();

  const addComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!login_required()) return;

    if (!comment) return;

    const newComment: IComment = {
      username: user?.username!,
      profile_image: user?.profile_image!,
      body: comment,
      created_at: new Date(),
      id: Date.now(),
    };

    mutate(newComment);
  };

  if (error) return <p>Error</p>;

  if (isLoading)
    return (
      <ButtonSkeleton
        width="w-full"
        className="flex py-2 flex-col gap-2"
        size={4}
      />
    );

  if (!data?.data.length)
    return (
      <div className="md:h-[18.5rem] h-[20rem] flex flex-col py-2 gap-2">
        <EmptyState state="empty" message="No Comments Add one" />
        <form
          onSubmit={addComment}
          className="w-full flex items-center gap-2"
          action=""
        >
          <Input
            required
            onChange={(e) => setComment(e.target.value)}
            placeholder="Say Something About This Quiz"
            className="h-[3rem]"
          />
          <Button variant={"secondary"} className="h-[2.9rem]">
            Comment
          </Button>
        </form>
      </div>
    );

  return (
    <div className="w-full h-[20rem] md:h-[18.5rem] mb-3 relative">
      <div className="flex h-full pt-3 pb-16 overflow-auto flex-col gap-2">
        {data?.data.map((comment) => (
          <CommentUI {...comment} key={comment.id} />
        ))}
      </div>
      <form
        onSubmit={addComment}
        className="w-full flex items-center justify-center gap-2 absolute bottom-2"
        action=""
      >
        <Input
          onChange={(e) => setComment(e.target.value)}
          placeholder="Say Something About This Quiz"
          className="h-[3rem]"
        />
        <Button variant={"secondary"} className="h-[2.9rem]">
          Comment
        </Button>
      </form>
    </div>
  );
};
