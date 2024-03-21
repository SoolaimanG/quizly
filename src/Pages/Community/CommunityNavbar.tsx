import { FC, useState } from "react";
import Glassmorphism from "../../components/App/Glassmorphism";
import {
  ICommunityDetails,
  ICommuntityPost,
  communityNavbarProps,
} from "../../Types/community.types";
import { Input } from "../../components/Input";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/AlertModal";
import { BellIcon, ChevronDown, MenuIcon, SearchIcon, X } from "lucide-react";
import { Command, CommandShortcut } from "../../components/Command";
import { Button } from "../../components/Button";
import Hint from "../../components/Hint";
import { useAuthentication } from "../../Hooks";
import { useCommunityStore, useZStore } from "../../provider";
import { UserNotifications } from "../../components/App/UserNotifications";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/Popover";
import { Img } from "react-image";
import { Description } from "../ExplorePage/QuickQuiz";
import { useText } from "../../Hooks/text";
import { cn } from "../../lib/utils";
import useKeyboardShortcut from "use-keyboard-shortcut";
import { useQuery } from "@tanstack/react-query";
import { CommunityApiCalls } from "../../Functions/APIqueries";
import { CreateCommunity } from "./CreateCommunity";
import { Link } from "react-router-dom";
import { IUser, app_config } from "../../Types/components.types";
import { Skeleton } from "../../components/Loaders/Skeleton";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../components/Sheet";
import { CommunityDetails, CommunityFeed } from "./CommunityComponent";
import { CommunityCard } from "./CommunityCard";
import { Card, CardContent } from "../../components/Card";
import { useDebounce, useWindowSize } from "@uidotdev/usehooks";
import EmptyState from "../../components/App/EmptyState";
import PageLoader from "../../components/Loaders/PageLoader";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/App/TabUi";
import Error from "../Comps/Error";
import { errorMessageForToast } from "../../Functions";
import { AxiosError } from "axios";
import { UserCard } from "../../components/App/UserCard";

export const CommunitySearch: FC<{
  communityName: string;
  className?: string;
  id: string;
}> = ({ className, communityName, id }) => {
  const { openSearch, setOpenSearch } = useCommunityStore();
  const [search, setSearch] = useState("");
  const debouceSearch = useDebounce(search, 1400);

  const communtiy = new CommunityApiCalls(id);

  const { isLoading, data, error } = useQuery<{
    data: {
      post: ICommuntityPost[];
      members: Pick<
        IUser,
        "id" | "username" | "profile_image" | "account_type"
      >[];
    };
  }>({
    queryKey: ["search_community", id, debouceSearch],
    queryFn: () => communtiy.searchCommunity(debouceSearch),
    enabled: openSearch,
  });

  const UIObjs = {
    onError: !isLoading && error && (
      <Error
        retry_function={() => {}}
        errorMessage={errorMessageForToast(
          error as AxiosError<{ message: string }>
        )}
      />
    ),
    onLoading: isLoading && <PageLoader size={50} />,
    onEmptyState: !isLoading && (
      <EmptyState state="search" message="No post matches the given query." />
    ),
    PostUi: !!data?.data.post.length && (
      <div>
        {data.data.post.map((post) => (
          <CommunityFeed key={post.id} {...post} />
        ))}
      </div>
    ),
    MembersUi: !!data?.data.members.length && (
      <div>
        {data.data.members.map((member) => (
          <UserCard key={member.id} {...member} />
        ))}
      </div>
    ),
    AllUi: !![...(data?.data.post ?? []), ...(data?.data.members ?? [])]
      .length && (
      <div className="flex flex-col gap-3">
        {data?.data.post.map((post) => (
          <CommunityFeed key={post.id} {...post} />
        ))}
        {data?.data.members.map((member) => (
          <UserCard key={member.id} {...member} />
        ))}
      </div>
    ),
  };

  return (
    <div className={cn(className)}>
      <AlertDialog open={openSearch} onOpenChange={setOpenSearch}>
        <AlertDialogTrigger>
          <div className="w-[20rem] hidden md:px-2 bg-transparent md:flex items-center border border-gray-400 hover:border-green-300 hover:border-[1.5px] transition-all h-[2rem] rounded-md">
            <SearchIcon />
            <Command className="flex justify-center items-center bg-transparent">
              <CommandShortcut className="bg-transparent">⌘K</CommandShortcut>
            </Command>
          </div>
          <div className="md:hidden block">
            <Hint
              element={
                <Button className="w-9 h-9 p-2" variant="ghost" size="icon">
                  <SearchIcon />
                </Button>
              }
              content="Command K"
              side="bottom"
            />
          </div>
        </AlertDialogTrigger>
        <AlertDialogContent className="gap-1 overflow-auto">
          <AlertDialogHeader className=" space-y-0">
            <AlertDialogTitle className="text-green-500">
              Search {communityName}
            </AlertDialogTitle>
            <form action="">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-[3rem]"
                placeholder="Search Related"
              />
            </form>
          </AlertDialogHeader>
          <Tabs className="mt-3" defaultValue="All">
            <TabsList>
              <TabsTrigger
                className="data-[state=active]:bg-green-400 data-[state=active]:text-white"
                value="All"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                className="data-[state=active]:bg-green-400 data-[state=active]:text-white"
                value="Posts"
              >
                Posts
              </TabsTrigger>
              <TabsTrigger
                className="data-[state=active]:bg-green-400 data-[state=active]:text-white"
                value="Members"
              >
                Members
              </TabsTrigger>
            </TabsList>
            <TabsContent className="h-[20rem] overflow-auto" value="All">
              {UIObjs.onLoading}
              {UIObjs.onError}
              {UIObjs.AllUi}
              {![...(data?.data.post ?? []), ...(data?.data.members ?? [])]
                ?.length && UIObjs.onEmptyState}
            </TabsContent>
            <TabsContent className="h-[20rem] overflow-auto" value="Posts">
              {UIObjs.onLoading}
              {UIObjs.onError}
              {UIObjs.PostUi}
              {!data?.data?.post?.length && UIObjs.onEmptyState}
            </TabsContent>
            <TabsContent className="h-[20rem] overflow-auto" value="Members">
              {UIObjs.onLoading}
              {UIObjs.onError}
              {UIObjs.MembersUi}
              {!data?.data?.members?.length && UIObjs.onEmptyState}
            </TabsContent>
          </Tabs>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export const MyCommunities = () => {
  const { isAuthenticated } = useAuthentication();
  const { communityDetails } = useCommunityStore();
  const { setLoginAttempt } = useZStore();
  const { truncateWord } = useText();
  const [open, setOpen] = useState(false);

  const community = new CommunityApiCalls("");

  const { isLoading, data } = useQuery<{
    data: Pick<ICommunityDetails, "id" | "name" | "display_picture">[];
  }>({
    queryKey: ["my_communities"],
    queryFn: () => community.getMyCommunities(communityDetails?.id ?? ""),
    enabled: isAuthenticated && open,
  });

  return (
    <div>
      {isAuthenticated ? (
        <Popover open={open} onOpenChange={() => setOpen((prev) => !prev)}>
          <PopoverTrigger className="flex p-1 rounded-sm items-center gap-2  hover:bg-primary-foreground">
            <Img
              loader={<Skeleton className="w-[2rem] h-[2rem] rounded-md" />}
              className="w-[2rem] h-[2rem] rounded-md"
              src={communityDetails?.display_picture || ""}
            />
            <div className="flex items-center">
              <Description
                className="hidden md:block"
                text={truncateWord(communityDetails?.name, 7)}
              />
              <ChevronDown size={20} />
            </div>
          </PopoverTrigger>
          <PopoverContent>
            <h1 className="underline">My Communities</h1>
            {isLoading ? (
              <div className=" flex flex-col gap-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="w-full h-[2.5rem] rounded-md" />
                ))}
              </div>
            ) : !data?.data.length ? (
              <div className="w-full flex flex-col gap-3">
                <Description
                  className="text-center text-xl"
                  text="You have not created any community"
                />
                <CreateCommunity
                  button={
                    <Button className="w-full" variant="base">
                      Create Community
                    </Button>
                  }
                />
              </div>
            ) : (
              <div className="w-full flex flex-col gap-2">
                {data.data.map((d) => (
                  <Button
                    className="w-full flex gap-1 px-1 justify-start"
                    key={d.id}
                    asChild
                    variant="ghost"
                  >
                    <Link
                      to={app_config.community + d.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex gap-2 items-center">
                        <Img
                          className="w-[2rem] h-[2rem] rounded-md"
                          src={d.display_picture}
                        />
                        <Description text={d.name} />
                      </div>
                      {d.name === communityDetails?.name && (
                        <div className="w-[6px] h-[6px] rounded-full bg-green-500" />
                      )}
                    </Link>
                  </Button>
                ))}
              </div>
            )}
          </PopoverContent>
        </Popover>
      ) : (
        <Button
          onClick={() => setLoginAttempt({ attempt: true })}
          variant="base"
        >
          Login
        </Button>
      )}
    </div>
  );
};

export const CommunityNavbar: FC<
  communityNavbarProps & { community_data: ICommunityDetails }
> = ({ currentPage, community_data }) => {
  const { setOpenSearch } = useCommunityStore();
  const { is_darkmode } = useZStore();
  const { width } = useWindowSize();
  useKeyboardShortcut(["Control", "K"], () => setOpenSearch(), {
    repeatOnHold: false,
    overrideSystem: true,
  });

  const sideBar = (
    <Sheet>
      <SheetTrigger>
        <Button className="w-9 h-9 p-2" variant="ghost" size="icon">
          <MenuIcon size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="flex overflow-auto flex-col gap-3 w-full h-full"
      >
        <SheetHeader className="flex w-full  flex-col">
          <SheetTitle>{community_data.name}</SheetTitle>
          <SheetClose className=" absolute border p-[3px] border-gray-400 rounded-md hover:border-gray-200 top-1 right-1">
            <X size={15} />
          </SheetClose>
        </SheetHeader>
        <Card>
          <CardContent className="p-2">
            <CommunityDetails data={community_data} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-2 h-[70vh]">
            <CommunityCard
              size={6}
              truncate
              buttonText=""
              title="Recommended"
            />
          </CardContent>
        </Card>
      </SheetContent>
    </Sheet>
  );

  return (
    <Glassmorphism
      color={!is_darkmode ? "default" : "dark"}
      className="w-full py-2 fixed top-0 z-30"
    >
      <div className="md:max-w-6xl flex items-center justify-between px-2 m-auto">
        <h1 className="text-xl text-green-500">{currentPage}</h1>
        <CommunitySearch
          id={community_data.id}
          className="hidden md:block"
          communityName={community_data.name}
        />
        <div className="flex items-center gap-1 md:gap-2">
          {Number(width) < 767 && sideBar}
          <CommunitySearch
            id={community_data.id}
            className="md:hidden block"
            communityName={community_data.name}
          />
          <UserNotifications>
            <Hint
              element={
                <Button className="w-9 h-9 p-2" variant="ghost" size="icon">
                  <BellIcon size={20} />
                </Button>
              }
              content="Notification"
              side="bottom"
            />
          </UserNotifications>
          <MyCommunities />
        </div>
      </div>
    </Glassmorphism>
  );
};
