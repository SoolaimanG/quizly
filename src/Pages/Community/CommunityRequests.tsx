import { FC } from "react";
import { useCommunityStore, useZStore } from "../../provider";
import { Button } from "../../components/Button";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { CommunityApiCalls } from "../../Functions/APIqueries";
import { IUser } from "../../Types/components.types";
import queryString from "query-string";
import Error from "../Comps/Error";
import { errorMessageForToast } from "../../Functions";
import { AxiosError } from "axios";
import { Skeleton } from "../../components/Loaders/Skeleton";
import { UserCard } from "../../components/App/UserCard";
import { AcceptRequestBTN, RejectRequestBTN } from "../Comps/RequestButtons";
import { Restricted } from "../../components/App/Restricted";
import { toast } from "../../components/use-toaster";

export const CommunityRequests: FC<{}> = () => {
  const { communityDetails } = useCommunityStore();
  const { user: CurrentUser } = useZStore();
  const community = new CommunityApiCalls(communityDetails?.id ?? "");
  const queryClient = useQueryClient();

  const query = queryString.parse(location.search, { parseBooleans: true }) as {
    page?: string;
    sort?: boolean;
  };

  const isAdmin =
    CurrentUser?.username.toLowerCase() ===
    communityDetails?.created_by.toLowerCase();

  const { isLoading, data, error, refetch } = useInfiniteQuery<{
    data: Pick<IUser, "id" | "account_type" | "username" | "profile_image">[];
  }>({
    queryKey: ["community_requests", communityDetails?.id],
    queryFn: ({ pageParam = 1 }) =>
      community.getCommunityRequests(Number(pageParam) * 7),
    initialPageParam: 1,
    getNextPageParam(_, __, lastPageParams) {
      if (10 < 0) return undefined;

      return (lastPageParams as number) + 1;
    },
    select: (data) => ({
      ...data,
      pages: data.pages.slice(Number(query.page) - 1),
    }),
    enabled: isAdmin,
  });

  const revalidate = () => {
    queryClient.invalidateQueries({
      queryKey: ["community_details", communityDetails?.id],
    });
    queryClient.invalidateQueries({
      queryKey: ["community_requests", communityDetails?.id],
    });
  };

  const acceptAllUsers = async () => {
    try {
      await community.accept_or_reject_request(
        "accept_all",
        CurrentUser?.id ?? ""
      );
      revalidate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong...",
        variant: "destructive",
      });
    }
  };

  if (error)
    return (
      <Error
        className="h-screen"
        retry_function={refetch}
        errorMessage={errorMessageForToast(
          error as AxiosError<{ message: string }>
        )}
      />
    );

  if (!isAdmin)
    return (
      <Restricted
        className="h-screen"
        message="You are not allow to view this page"
      />
    );

  return (
    <div className="w-full flex flex-col gap-5">
      <header className="w-full flex items-center justify-between">
        <nav>Requests ({communityDetails?.requests_count})</nav>
        <Button
          disabled={(communityDetails?.requests_count ?? 0) < 1}
          onClick={acceptAllUsers}
          variant="base"
        >
          Accept All
        </Button>
      </header>
      <section className="w-full flex flex-col gap-4">
        {isLoading && (
          <div className="h-full w-full flex flex-col gap-3">
            {[...Array(4)].map((_, i) => (
              <div className="flex flex-col gap-3" key={i}>
                <Skeleton className="h-[3rem] w-full rounded-md" />
                <div className="flex items-center gap-2">
                  <Skeleton className="w-[2rem] rounded-md h-[0.7rem]" />
                  <Skeleton className="w-[2rem] rounded-md h-[0.7rem]" />
                </div>
              </div>
            ))}
          </div>
        )}
        {!isLoading &&
          !!data?.pages[0].data.length &&
          data?.pages[0].data.map((user) => (
            <UserCard key={user.id} {...user} allow_follow={false} className="">
              <div className="flex items-center gap-2">
                <AcceptRequestBTN
                  user_id={user.id}
                  username={user.username}
                  community_id={communityDetails?.id ?? ""}
                  revalidate={revalidate}
                />
                <RejectRequestBTN
                  user_id={user.id}
                  community_id={communityDetails?.id ?? ""}
                  revalidate={revalidate}
                />
              </div>
            </UserCard>
          ))}
      </section>
    </div>
  );
};
