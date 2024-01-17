import Hint from "../../components/Hint";
import { Bookmark, Loader2 } from "lucide-react";
import { Button } from "../../components/Button";
import { useWindowSize } from "@uidotdev/usehooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isQuizSaved, savedAndRemoveQuiz } from "../../Functions/APIqueries";
import { useAuthentication, useMethods } from "../../Hooks";
import { cn } from "../../lib/utils";
import { useEffect } from "react";
import { toast } from "../../components/use-toaster";
import { errorMessageForToast } from "../../Functions";
import { AxiosError } from "axios";

export const SaveQuiz: React.FC<{ quiz_id: string }> = ({ quiz_id }) => {
  const { width } = useWindowSize();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthentication();
  const { login_required } = useMethods();
  const { isLoading, data, error } = useQuery<{ data: { is_saved: boolean } }>({
    queryKey: ["saved_quiz", quiz_id],
    queryFn: () => isQuizSaved(quiz_id),
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
    mutationKey: ["saveOrUnsaveQuiz", quiz_id],
    mutationFn: () => savedAndRemoveQuiz(quiz_id),
    onMutate: async () => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ["saved_quiz", quiz_id],
      });

      // Snapshot the previous value
      const previousStatus = queryClient.getQueryData(["saved_quiz", quiz_id]);

      // Optimistically update to the new value
      queryClient.setQueryData(
        ["saved_quiz", quiz_id],
        (prev: { data: { is_saved: boolean } }) => !prev.data.is_saved
      );

      // Return a context object with the snapshotted value
      return { previousStatus };
    },

    onSuccess(data) {
      toast({
        title: "Success",
        description: data?.message,
      });
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
        ["saved_quiz", quiz_id],
        context?.previousStatus
      );
    },
    // Always refetch after error or success:

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["saved_quiz", quiz_id] });
    },
  });

  const saveAndUnsave = () => {
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
    <div>
      <Hint
        element={
          <Button
            onClick={saveAndUnsave}
            variant={"secondary"}
            className="rounded-full"
            size={"icon"}
          >
            {isLoading ? (
              <Loader2 className=" animate-spin" />
            ) : (
              <Bookmark
                className={cn(
                  isAuthenticated && data?.data.is_saved && "text-green-500"
                )}
              />
            )}
          </Button>
        }
        content="Save Quiz"
        side={Number(width) > 800 ? "left" : "top"}
      />
    </div>
  );
};
