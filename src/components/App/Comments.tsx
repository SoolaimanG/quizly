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
import { cn } from "../../lib/utils";
import { Textarea } from "../TextArea";
import Error from "../../Pages/Comps/Error";

export const Comments: React.FC<commentsCompProps> = ({
  quiz_id,
  type = "input",
}) => {
  const queryClient = useQueryClient();
  const [comment, setComment] = useState("");
  const { isLoading, data, error, refetch } = useQuery<
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

  if (error)
    return (
      <Error
        retry_function={refetch}
        errorMessage={`Could not get ${
          type === "input" ? "Comments" : "Feedbacks"
        } `}
      />
    );

  if (isLoading)
    return (
      <ButtonSkeleton
        width="w-full"
        className="flex py-2 flex-col gap-2"
        size={4}
      />
    );

  const UI = {
    input: (
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
    ),
    textarea: (
      <form
        onSubmit={addComment}
        className="flex flex-col gap-2 w-full"
        action=""
      >
        <h1 className="text-xl">Feedback</h1>
        <Textarea
          onChange={(e) => setComment(e.target.value)}
          required
          placeholder="Share your feedback"
          className="ring-offset-green-500"
        />
        <div className="w-full flex items-end justify-end">
          <Button variant="base" className="">
            Post
          </Button>
        </div>
      </form>
    ),
  };

  return (
    <div
      className={cn(
        "w-full h-[20rem] md:h-[18.5rem] mb-3 relative",
        type === "input" ? "flex-col-reverse" : "flex-col"
      )}
    >
      {UI[type]}
      <div className="flex h-full pt-3 pb-16 overflow-auto flex-col gap-2">
        {!data?.data.length ? (
          <EmptyState
            state="empty"
            message={type === "input" ? "No Comments yet!" : "No Feedback yet!"}
          />
        ) : (
          data.data.map((comment) => (
            <CommentUI key={comment.id} {...comment} />
          ))
        )}
      </div>
    </div>
  );
};
