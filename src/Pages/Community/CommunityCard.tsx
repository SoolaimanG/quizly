import { Link } from "react-router-dom";
import { useText } from "../../Hooks/text";
import { ICommunity } from "../../Types/community.types";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/Avatar";
import { Button, buttonVariants } from "../../components/Button";
import { ShadowCard } from "../Quiz/QuizResult";
import React, { FC, useTransition } from "react";
import { useNumbers } from "../../Hooks/numbers";
import { useQuery } from "@tanstack/react-query";
import {
  checkForMembership,
  get_trending_communities,
  join_or_leave_community,
} from "../../Functions/APIqueries";
import { ButtonSkeleton } from "../../components/App/FilterByCategory";
import { app_config } from "../../Types/components.types";
import { toast } from "../../components/use-toaster";
import { Loader2, PlusSquare } from "lucide-react";
import { errorMessageForToast } from "../../Functions";
import { useAuthentication, useMethods } from "../../Hooks";
import { VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import Hint from "../../components/Hint";
import { ToastAction } from "../../components/Toast";
import Error from "../Comps/Error";
import { CreateCommunity } from "./CreateCommunity";
import EmptyState from "../../components/App/EmptyState";
import { AxiosError } from "axios";
import { Description } from "../../components/App/Description";

export const CommunityCard: FC<{
  title?: string;
  buttonText?: string;
  truncate?: boolean;
  size?: number;
}> = ({
  title = "Trending Communities",
  buttonText = "Create",
  truncate = false,
  size = 5,
}) => {
  const { loading, isAuthenticated } = useAuthentication();
  const { isLoading, data, error, refetch } = useQuery<{ data: ICommunity[] }>({
    queryKey: ["trending_communities", isAuthenticated],
    queryFn: () =>
      get_trending_communities({ size, isAuthenticated, get_popular: true }),
    enabled: !loading,
  });

  const { getFirstLetterAndCapitalize, truncateWord } = useText();
  const { formatNumber } = useNumbers();

  if (isLoading)
    return (
      <ButtonSkeleton
        size={7}
        className="flex-col gap-5 w-full"
        width="w-full"
        height="h-[4rem]"
      />
    );

  if (error)
    return (
      <Error
        errorMessage="Could not get trending communities"
        retry_function={() => refetch()}
      />
    );

  return (
    <div className="mt-2 h-full w-full flex relative flex-col gap-5">
      <div className="flex px-2 items-center justify-between w-full">
        <h1 className="text-xl josefin-sans-font">{title}</h1>
        <CreateCommunity
          button={
            <Hint
              content="Start A New Community"
              element={
                <Button
                  className="flex items-center hover:text-green-500 h-9 text-lg gap-1"
                  variant={"ghost"}
                >
                  <PlusSquare className="p-0" size={17} /> {" " + buttonText}
                </Button>
              }
            />
          }
        />
      </div>
      {!data?.data.length ? (
        <EmptyState
          state="empty"
          message="Seems you are already in all the trending communities or no trending community available."
        />
      ) : (
        data?.data?.map((d) => (
          <ShadowCard
            className="shadow-none p-2 hover:shadow-md flex items-center justify-between transition-all delay-75 ease-linear"
            key={d.id}
          >
            <Link
              to={app_config.community + d.id}
              className="flex items-center gap-3"
            >
              <Avatar>
                <AvatarImage src={d.display_picture} />
                <AvatarFallback className=" rounded-md">
                  {getFirstLetterAndCapitalize(d.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-green-500">
                  {truncateWord(d.name, truncate ? 10 : d.name.length)}
                </h1>
                <Description
                  text={formatNumber(d.participants_count) + " Participants"}
                />
              </div>
            </Link>
            <JoinCommunity
              buttonVarient={{ variant: "ghost" }}
              community_id={d.id}
            />
          </ShadowCard>
        ))
      )}
      <Button
        asChild
        variant={"base"}
        className="w-full h-[3rem] absolute bottom-2"
      >
        <Link to={app_config.communities}>See All</Link>
      </Button>
    </div>
  );
};

export const JoinCommunity: React.FC<{
  community_id: string;
  buttonVarient: VariantProps<typeof buttonVariants>;
  className?: string;
}> = ({ community_id, buttonVarient, className }) => {
  const { login_required } = useMethods();
  const { isAuthenticated } = useAuthentication();
  const [isPending, startTransition] = useTransition();

  const { isLoading, data, error, refetch } = useQuery<{
    data: { is_member: boolean; is_requested: boolean };
  }>({
    queryKey: ["check_membership", community_id],
    queryFn: () => checkForMembership(community_id, isAuthenticated),
    enabled: isAuthenticated,
  });

  const joinCommunity = async () => {
    try {
      if (!login_required()) {
        return;
      }
      await join_or_leave_community(community_id, isAuthenticated);
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: errorMessageForToast(
          error as AxiosError<{ message: string }>
        ),
        variant: "destructive",
        action: (
          <ToastAction onClick={() => refetch()} altText="Retry">
            Retry
          </ToastAction>
        ),
      });
    }
  };

  const _BUTTON_TEXT = data?.data.is_member
    ? "Leave"
    : data?.data.is_requested
    ? "Requested"
    : "Join";

  if (isLoading)
    return (
      <ButtonSkeleton
        size={1}
        className=""
        width="w-full"
        height="h-[4.5rem]"
      />
    );

  if (error) {
    toast({
      title: "Error",
      description: errorMessageForToast(
        error as AxiosError<{ message: string }>
      ),
      variant: "destructive",
    });
  }

  return (
    <Button
      disabled={isPending && isLoading}
      onClick={() =>
        startTransition(() => {
          joinCommunity();
        })
      }
      className={cn(
        `px-3 text-green-700 py-[1px] ${isPending && "animate-spin"}`,
        className
      )}
      variant={buttonVarient.variant}
    >
      {isPending ? <Loader2 size={20} /> : _BUTTON_TEXT}
    </Button>
  );
};
