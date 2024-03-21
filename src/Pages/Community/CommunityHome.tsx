import { FC } from "react";
import { CommunityFeed, NoPostYet } from "./CommunityComponent";
import { CommunityApiCalls } from "../../Functions/APIqueries";
import { useQuery } from "@tanstack/react-query";
import Error from "../Comps/Error";
import { errorMessageForToast } from "../../Functions";
import { AxiosError } from "axios";
import { ICommuntityPost } from "../../Types/community.types";
import { Card, CardContent } from "../../components/Card";
import { Skeleton } from "../../components/Loaders/Skeleton";

const FeedLoader = () => {
  return (
    <Card>
      <CardContent className="p-2 rounded-sm flex flex-col gap-2 w-full">
        {/* Header */}
        <header className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            {/* Profile Picture */}
            <Skeleton className="w-[3rem] h-[3rem] rounded-full" />
            {/* Name and date posted */}
            <div className="flex flex-col gap-2">
              <Skeleton className="w-[200px] h-[13px]" />
              <Skeleton className="w-[200px] h-[13px]" />
            </div>
          </div>
        </header>
        <Skeleton className="w-full h-[6rem]" />
        {/* Posts Image */}
        <div className="w-full mt-1 flex gap-3">
          {[...Array(2)].map((_, i) => (
            <Skeleton key={i} className="w-full h-[9rem] flex" />
          ))}
        </div>
        {/* Post Has Quiz */}

        <hr className="mt-2 h-2" />
        <footer className="flex items-center gap-3">
          <Skeleton className="w-[100px] h-[15px]" />
          <Skeleton className="w-[100px] h-[15px]" />
        </footer>
      </CardContent>
    </Card>
  );
};

export const CommunityHome: FC<{ id: string }> = ({ id }) => {
  const community = new CommunityApiCalls(id);

  const { isLoading, data, error, refetch } = useQuery<{
    data: ICommuntityPost[];
  }>({
    queryKey: ["community_posts", id],
    queryFn: () => community.getCommunityPost({ size: 5 }),
  });

  if (isLoading)
    return (
      <div className="flex flex-col gap-3">
        {[...Array(3)].map((_, i) => (
          <FeedLoader key={i} />
        ))}
      </div>
    );

  if (error)
    return (
      <Error
        retry_function={refetch}
        errorMessage={errorMessageForToast(
          error as AxiosError<{ message: string }>
        )}
      />
    );

  if (!data?.data.length) return <NoPostYet />;

  return (
    <div className="flex flex-col gap-5 ">
      {data.data.map((community, index) => (
        <CommunityFeed key={index} {...community} />
      ))}
    </div>
  );
};
