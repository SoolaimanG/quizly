import { FC, Fragment, useEffect } from "react";
import {
  ICommunityDetails,
  communityLayoutProps,
} from "../../Types/community.types";
import { CommunityHome } from "./CommunityHome";
import { CommunityNavbar } from "./CommunityNavbar";
import { Card, CardContent, CardTitle } from "../../components/Card";
import { CommunityDetails, CommunityNavigation } from "./CommunityComponent";
import { CommunityCard } from "./CommunityCard";
import Glassmorphism from "../../components/App/Glassmorphism";
import { PostOnCommunity } from "./PostOnCommunity";
import { useParams } from "react-router-dom";
import { CommunityApiCalls } from "../../Functions/APIqueries";
import { useQuery } from "@tanstack/react-query";
import PageLoader from "../../components/Loaders/PageLoader";
import Error from "../Comps/Error";
import { errorMessageForToast } from "../../Functions";
import { AxiosError } from "axios";
import { useCommunityStore } from "../../provider";
import { EditPost } from "./EditPost";
import { CommunityMembers } from "./CommunityMembers";
import { CommunityRequests } from "./CommunityRequests";
import { CommunitySettings } from "./CommunitySettings";

const paths = {
  Home: CommunityHome,
  Post: PostOnCommunity,
  Settings: CommunitySettings,
  Requests: CommunityRequests,
  Members: CommunityMembers,
  Edit: EditPost,
};

const CommunityLayout: FC<communityLayoutProps> = ({ path }) => {
  const { id } = useParams() as { id: string };
  const { setCommunityDetails } = useCommunityStore();
  const View = paths[path];

  const community = new CommunityApiCalls(id);

  const { isLoading, data, error, refetch } = useQuery<{
    data: ICommunityDetails;
  }>({
    queryKey: ["community_details", id],
    queryFn: () => community.getCommunityDetails({ filter_type: "popular" }),
  });

  useEffect(() => {
    data?.data && setCommunityDetails(data.data);
  }, [data]);

  if (isLoading)
    return (
      <PageLoader
        className="h-screen"
        size={100}
        text="Getting community details"
      />
    );

  if (error)
    return (
      <Error
        className="h-screen"
        errorMessage={errorMessageForToast(
          error as AxiosError<{ message: string }>
        )}
        retry_function={refetch}
      />
    );

  return (
    <Fragment>
      <CommunityNavbar community_data={{ ...data?.data! }} currentPage={path} />
      <div className="pt-16 gap-3 h-screen px-3 overflow-hidden md:px-0 flex md:max-w-6xl m-auto">
        {/* Right Side */}
        <div className="hidden flex-col md:flex w-[25%] gap-1">
          <Card className="rounded-sm">
            <CardContent className="p-2 rounded-sm">
              <CommunityDetails data={data?.data!} />
            </CardContent>
          </Card>
          <Card className="rounded-sm">
            <CardContent className="p-2 rounded-sm">
              <CardTitle>Pages</CardTitle>
              <CommunityNavigation className="flex-col gap-3" path={path} />
            </CardContent>
          </Card>
        </div>
        {/* Middle Side */}
        <div className="md:w-[50%] w-full pb-20 overflow-auto">
          <View id={id} editable={false} />
        </div>
        {/* Left Side */}
        <Card className="rounded-sm w-[25%] md:block hidden h-[88vh]">
          <CardContent className="p-2 h-full rounded-sm">
            <CommunityCard
              size={6}
              truncate
              buttonText=""
              title="Recommended"
            />
          </CardContent>
        </Card>
        {/* Navigation bar on mobile */}
        <Glassmorphism
          className="fixed w-full md:hidden block p-0 bottom-0 left-0 justify-between"
          color="green"
        >
          <CommunityNavigation className="m-0" path={path} onMobile />
        </Glassmorphism>
      </div>
    </Fragment>
  );
};

export default CommunityLayout;
