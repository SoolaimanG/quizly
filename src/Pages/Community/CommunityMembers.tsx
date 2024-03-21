import { FC, useState } from "react";
import { useCommunityStore, useZStore } from "../../provider";
import { Button } from "../../components/Button";
import { CommunityApiCalls } from "../../Functions/APIqueries";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { IUser } from "../../Types/components.types";
import { UserCard } from "../../components/App/UserCard";
import { PaginationNavigation } from "../../components/App/PaginationNavigation";
import queryString from "query-string";
import { useLocation, useNavigate } from "react-router-dom";
import { AlertCircle, Trash2Icon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/AlertModal";
import { Alert, AlertDescription, AlertTitle } from "../../components/Alert";
import { Input } from "../../components/Input";
import { capitalize_first_letter, errorMessageForToast } from "../../Functions";
import { ButtonSkeleton } from "../../components/App/FilterByCategory";
import { toast } from "../../components/use-toaster";
import { AxiosError } from "axios";
import Error from "../Comps/Error";

export const CommunityMembers: FC<{}> = () => {
  const { communityDetails } = useCommunityStore();
  const { user: CurrentUser } = useZStore();
  const community = new CommunityApiCalls(communityDetails?.id ?? "");
  const location = useLocation();
  const navigate = useNavigate();

  const query = queryString.parse(location.search, { parseBooleans: true }) as {
    page?: string;
    sort?: boolean;
  };

  const { isLoading, data, error, refetch } = useInfiniteQuery<{
    data: Pick<IUser, "id" | "account_type" | "username" | "profile_image">[];
  }>({
    queryKey: ["community_members", communityDetails?.id, query.sort],
    queryFn: ({ pageParam = 1 }) =>
      community.getCommunityMembers({
        pageParam: Number(pageParam) * 7,
        sort: query.sort ?? false,
      }),
    initialPageParam: 1,
    getNextPageParam(__, _, lastPageParams) {
      if (10 < 0) return undefined;

      return (lastPageParams as number) + 1;
    },
    select: (data) => ({
      ...data,
      pages: data.pages.slice(Number(query.page) - 1),
    }),
  });

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

  return (
    <div className="mt-2 relative h-[86vh]">
      <div className="flex items-center justify-between">
        <h1>
          {"All Community Members " +
            "(" +
            communityDetails?.participants_count +
            ")"}
        </h1>

        <Button
          onClick={() =>
            navigate(
              `?${queryString.stringify(
                {
                  ...query,
                  sort: !query.sort,
                },
                { skipEmptyString: true }
              )}`
            )
          }
          variant={query.sort ? "base" : "secondary"}
          className="h-5 py-1 px-2"
        >
          Sort A-Z
        </Button>
      </div>
      <div className="flex flex-col gap-3 mt-3">
        {isLoading && (
          <ButtonSkeleton
            className="flex-col"
            size={5}
            height="h-[6rem] w-full"
          />
        )}
        {!isLoading &&
          data?.pages[0]?.data?.map((user) => (
            <div className="w-full h-[5rem] flex gap-2" key={user.id}>
              <UserCard {...user} />
              {CurrentUser?.username.toLowerCase() ===
                communityDetails?.created_by.toLowerCase() && (
                <RemoveUser
                  community_id={communityDetails?.id ?? ""}
                  user_id={user.id}
                  username={user.username}
                />
              )}
            </div>
          ))}
      </div>
      <PaginationNavigation
        length={Math.ceil((communityDetails?.participants_count as number) / 7)}
        className="absolute bottom-0"
      />
    </div>
  );
};

export const RemoveUser: FC<{
  username: string;
  user_id: string;
  community_id: string;
}> = ({ username, user_id, community_id }) => {
  const [confirmRemoval, setConfirmRemoval] = useState("");
  const location = useLocation();

  const query = queryString.parse(location.search, { parseBooleans: true }) as {
    sort?: boolean;
  };
  const queryClient = useQueryClient();
  const community = new CommunityApiCalls(community_id);
  const handleRemove = async () => {
    try {
      await community.deletePost(
        confirmRemoval,
        "members",
        "",
        community_id,
        user_id
      );
      await queryClient.invalidateQueries({
        queryKey: ["community_members", community_id, query.sort],
      });
      await queryClient.invalidateQueries({
        queryKey: ["community_details", community_id],
      });
      toast({
        title: "Success",
        description: "User has been removed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: errorMessageForToast(
          error as AxiosError<{ message: string }>
        ),
        variant: "destructive",
      });
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger className="w-1/3">
        <Button
          className="flex w-full h-full items-center gap-3"
          variant="destructive"
        >
          <Trash2Icon size={16} />
          Remove
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-500">
            Remove User
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove this{" "}
            <b className="text-lg">{username}</b> from your community?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>Be aware this is irrerevisible</AlertTitle>
          <AlertDescription>
            This action cannot be undone by you.
          </AlertDescription>
        </Alert>
        <p>
          Please type <b>{username}</b> in the input field below
        </p>
        <Input
          value={confirmRemoval}
          onChange={(e) => setConfirmRemoval(e.target.value)}
          className="h-[3rem]"
          placeholder={`Type ${capitalize_first_letter(username)} here`}
        />
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            onClick={handleRemove}
            className="disabled:cursor-not-allowed"
            disabled={!confirmRemoval || username !== confirmRemoval}
            variant="destructive"
          >
            Remove
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
