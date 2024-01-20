import { Loader2, Star } from "lucide-react";
import { IRate } from "../../Types/components.types";
import { Button } from "../Button";
import Hint from "../Hint";
import { useEffect } from "react";
import { cn } from "../../lib/utils";
import { useAuthentication, useMethods } from "../../Hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { hasRated, rateAndUnRate } from "../../Functions/APIqueries";
import { toast } from "../use-toaster";
import { errorMessageForToast } from "../../Functions";
import { AxiosError } from "axios";

export const Rate = ({ rate, id }: IRate) => {
  const { login_required } = useMethods();
  const { isAuthenticated } = useAuthentication();
  const queryClient = useQueryClient();
  const { isLoading, data, error, refetch } = useQuery<{ data: boolean }>({
    queryKey: ["rating", id],
    queryFn: () => hasRated(id, rate),
    enabled: isAuthenticated,
  });

  // Perform uptimistic update on rating
  const { mutate } = useMutation({
    mutationKey: [`rateAndUnrate`, id],
    mutationFn: () => rateAndUnRate(id, rate),
    onMutate: async () => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: [`rating`, id],
      });

      // Snapshot the previous value
      const previousStatus = queryClient.getQueryData([`rating`, id]);

      // Optimistically update to the new value
      queryClient.setQueryData([`rating`, id], (prev: boolean) => {
        return !prev;
      });

      // Return a context object with the snapshotted value
      return { previousStatus };
    },

    // When the request is successfull
    onSuccess(data) {
      toast({
        title: "Success",
        description: data.message,
      });
    },

    // When there is an error
    onError: (error, __, context) => {
      toast({
        title: "Error",
        description: errorMessageForToast(
          error as AxiosError<{ message: string }>
        ),
        variant: "destructive",
      });
      queryClient.setQueryData([`rating`, id], context?.previousStatus);
    },

    // Always refetch after error or success:
    onSettled: () => {
      refetch();
    },
  });

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

  const handleClick = () => {
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

  const content = data?.data ? "Unrate Quiz" : "Rate Quiz";

  return (
    <Hint
      element={
        <Button
          onClick={handleClick}
          className={cn("rounded-full", data?.data && "text-green-500")}
          size={"icon"}
          variant="secondary"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Star className={cn("")} />
          )}
        </Button>
      }
      content={content}
      side="left"
    />
  );
};
