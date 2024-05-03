import { Img } from "react-image";
import { JoinCommunity } from "./CommunityCard";
import { useText } from "../../Hooks/text";
import { app_config } from "../../Types/components.types";
import {
  AlertCircleIcon,
  Edit2Icon,
  Heart,
  HomeIcon,
  Loader2,
  MessageCircle,
  MoreVertical,
  Play,
  Plus,
  SettingsIcon,
  Trash2Icon,
  Users,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { cn } from "../../lib/utils";
import {
  FC,
  FormEvent,
  Fragment,
  useEffect,
  useState,
  useTransition,
} from "react";
import {
  ICommunityDetails,
  ICommuntityPost,
  PostCommentsProps,
  path,
} from "../../Types/community.types";
import { Card, CardContent, CardDescription } from "../../components/Card";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/Avatar";
import { Button } from "../../components/Button";
import { ImageCarosel } from "../../components/App/ImageCarosel";
import EmptyState from "../../components/App/EmptyState";
import { capitalize_first_letter, errorMessageForToast } from "../../Functions";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/Popover";
import { useCommunityStore, useZStore } from "../../provider";
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
import { Alert, AlertDescription } from "../../components/Alert";
import { CommunityApiCalls } from "../../Functions/APIqueries";
import queryString from "query-string";
import { toast } from "../../components/use-toaster";
import { AxiosError } from "axios";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { useAuthentication, useMethods } from "../../Hooks";
import Hint from "../../components/Hint";
import { useIntersectionObserver, useWindowSize } from "@uidotdev/usehooks";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../components/Sheet";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../../components/Drawer";
import { Textarea } from "../../components/TextArea";
import { Input } from "../../components/Input";
import { CommentUI } from "../../components/App/CommentUI";
import { Skeleton } from "../../components/Loaders/Skeleton";
import { LoadMoreBtn } from "../../components/App/LoadMoreBtn";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/DialogModal";
import { Badge } from "../../components/Badge";
import { Description } from "../../components/App/Description";

export const CommunityDetails: FC<{
  data: ICommunityDetails;
}> = ({ data }) => {
  const { truncateWord } = useText();

  const variants: (
    | "default"
    | "destructive"
    | "success"
    | "warning"
    | "friendly"
  )[] = ["destructive", "success", "warning", "friendly", "default"];

  const details = [
    {
      numbers: data.participants_count,
      content: "Members",
    },
    {
      numbers: data.posts_count,
      content: "Posts",
    },
    {
      numbers: data.requests_count,
      content: "Requests",
    },
  ];

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <Img
          className="w-[3rem] rounded-sm h-[3rem]"
          loader={
            <div className="w-[3rem] h-[3rem] bg-green-200 animate-pulse"></div>
          }
          src={data.display_picture}
        />
        <div>
          <h1 className="josefin-sans-font">{truncateWord(data.name, 15)}</h1>
          <Description
            text={`Created by ${capitalize_first_letter(data.created_by)}`}
          />
        </div>
      </div>
      <div className="flex justify-between items-center">
        {details.map((detail, i) => (
          <div key={i} className="flex items-center flex-col">
            <h1 className="josefin-sans-font">{detail.numbers}</h1>
            <Description className="text-lg" text={detail.content} />
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {data.allow_categories.map((category, i) => (
          <Badge className="rounded-sm" key={i} variant={variants[i]}>
            {category.body}
          </Badge>
        ))}
      </div>
      <JoinCommunity
        className="text-white"
        community_id={data.id}
        buttonVarient={{ variant: "base" }}
      />
    </div>
  );
};

export const CommunityNavigation: FC<{
  path: path;
  className?: string;
  onMobile?: boolean;
}> = ({ path, className, onMobile = false }) => {
  const { truncateWord } = useText();
  const { id } = useParams();
  const navigations = [
    {
      path: app_config.community + id,
      name: "Home",
      icon: <HomeIcon size={20} />,
    },
    {
      path: app_config.community + "post/" + id,
      name: "Post",
      icon: <Plus size={20} />,
    },
    {
      path: app_config.community + "members/" + id,
      name: "Members",
      icon: <Users size={20} />,
    },
    {
      path: app_config.community + "requests/" + id,
      name: "Requests",
      icon: <Users size={20} />,
    },
    {
      path: app_config.community + "settings/" + id,
      name: "Settings",
      icon: <SettingsIcon size={20} />,
    },
  ];
  return (
    <div className={cn("w-full mt-3 flex", className)}>
      {navigations.map((navigation) => (
        <Link
          className={cn(
            "flex items-center josefin-sans-font gap-2 p-2 rounded-md transition-all ease-linear",
            !onMobile &&
              path === navigation.name &&
              "bg-green-500 text-white hover:text-white",
            onMobile && path === navigation.name && "text-green-500",
            onMobile && "flex-col w-full"
          )}
          to={navigation.path}
          key={navigation.name}
        >
          {navigation.icon}
          {truncateWord(
            navigation.name,
            !onMobile ? navigation.name.length : 6
          )}
        </Link>
      ))}
    </div>
  );
};

export const CommunityFeed: FC<ICommuntityPost> = ({
  id,
  likes_count,
  comments_count,
  posted_by: { profile_image, username },
  caption,
  images,
  quiz_id,
  created_at,
}) => {
  const { getFirstLetterAndCapitalize } = useText();

  return (
    <Card className="rounded-sm">
      <CardContent className="p-2 rounded-sm flex flex-col gap-2 py-3 w-full">
        {/* Header */}
        <header className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            {/* Profile Picture */}
            <Avatar>
              <AvatarImage src={profile_image} />
              <AvatarFallback>
                {getFirstLetterAndCapitalize(username)}
              </AvatarFallback>
            </Avatar>
            {/* Name and date posted */}
            <div className="flex flex-col gap-1 md:gap-0">
              <Link
                to={app_config.user + username}
                className="text-green-500 font-semibold hover:underline"
              >
                {capitalize_first_letter(username)}
              </Link>
              <Description
                text={formatDistanceToNow(new Date(created_at), {
                  includeSeconds: true,
                })}
              />
            </div>
          </div>
          <PostMoreIcon
            images={images.map((i) => i.image)}
            quiz_id={quiz_id}
            caption={caption}
            id={id}
            posted_by={username}
          />
        </header>
        <CardDescription>{caption}</CardDescription>
        {/* Posts Image */}
        <div className="w-full mt-1">
          <ImageCarosel
            // swiperClassName="-z-10"
            onElementClick={() => {}}
            slidePerView={images.length > 1 ? 2 : 1}
            images={images.map((i) => i.image)}
          />
        </div>
        {/* Post Has Quiz */}
        {quiz_id && (
          <div className="w-full flex items-end justify-end">
            <Button
              asChild
              className="flex items-center gap-1 py-1"
              variant="base"
            >
              <Link to={app_config.quiz + quiz_id}>
                <Play /> Start Quiz
              </Link>
            </Button>
          </div>
        )}
        <hr className="mt-2 h-2" />
        <footer className="flex items-center gap-3">
          <PostLike likes={likes_count} id={id} />
          <PostComments comments_count={comments_count} id={id} />
        </footer>
      </CardContent>
    </Card>
  );
};

export const PostLike: FC<{ likes: number; id: string }> = ({ likes, id }) => {
  const { isAuthenticated } = useAuthentication();
  const { login_required } = useMethods();
  const query = useQueryClient();
  const { communityDetails } = useCommunityStore();
  const post = new CommunityApiCalls(communityDetails?.id || "");
  const { isLoading, data } = useQuery<{ data: boolean }>({
    queryKey: ["post_like", id, isAuthenticated],
    queryFn: () => post.has_user_like_post(id),
    enabled: isAuthenticated,
  });

  const { mutate } = useMutation({
    mutationKey: ["post_like", id, isAuthenticated],
    mutationFn: () => post.likePost(id),
    async onMutate() {
      await query.cancelQueries({
        queryKey: ["post_like", id, isAuthenticated],
      });

      const previousData: boolean =
        query.getQueryData(["post_like", id, isAuthenticated]) ?? false;

      query.setQueryData(
        ["post_like", id, isAuthenticated],
        () => !previousData
      );
      return previousData;
    },
    onError(error, variables) {
      // Notify user about what is wrong
      toast({
        title: "Error",
        description: errorMessageForToast(
          error as AxiosError<{ message: string }>
        ),
        variant: "destructive",
      });
      query.setQueryData(["post_like", id, isAuthenticated], () => variables);
    },

    onSettled() {
      query.invalidateQueries({
        queryKey: ["community_posts", communityDetails?.id],
        exact: true,
      });
      query.invalidateQueries({
        queryKey: ["post_like", id, isAuthenticated],
        exact: true,
      });
    },
  });

  const handleLike = () => {
    login_required();

    if (!login_required("Login to like this post. ❤") || isLoading) {
      return;
    }

    mutate();
  };

  return (
    <div
      onClick={handleLike}
      className="flex items-center gap-1 cursor-pointer "
    >
      <Hint
        element={
          isLoading ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Heart
              fill={(isAuthenticated && data?.data && "#22c55e") || ""}
              size={15}
              className={cn(isAuthenticated && data?.data && "text-green-500")}
            />
          )
        }
        content="Like this post"
        side="bottom"
      />
      <Description text={likes + " Likes"} />
    </div>
  );
};

export const PostComments: FC<{ comments_count: number; id: string }> = ({
  id,
  comments_count,
}) => {
  const { width } = useWindowSize();
  const { communityDetails } = useCommunityStore();
  const { login_required } = useMethods();
  const { user } = useZStore();
  const query = useQueryClient();
  const post = new CommunityApiCalls(communityDetails?.id ?? "");
  const [ref, entry] = useIntersectionObserver({
    threshold: 0.3,
  });

  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [commentData, setCommentData] = useState<PostCommentsProps[]>([]);

  const {
    isLoading,
    data,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
  } = useInfiniteQuery<{
    data: PostCommentsProps[];
  }>({
    queryKey: ["post_comments", id],
    queryFn: ({ pageParam = 1 }) =>
      post.getPostComments(id, Number(pageParam) * 8),
    enabled: open,
    initialPageParam: 1,
    getNextPageParam(lastPage, _, lastPageParams) {
      if (lastPage.data.length === comments_count) {
        return;
      }

      return (lastPageParams as number) + 1;
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["add_comment", id],
    mutationFn: () => post.addComment(id, comment),
    onMutate(variables: PostCommentsProps) {
      setCommentData((prev) => [variables, ...prev]);
      const previousData: { data: PostCommentsProps[] } | undefined =
        query.getQueryData(["post_comments", id]);

      return { previousData };
    },

    onError(error, _, context) {
      toast({
        title: "Error",
        description: errorMessageForToast(
          error as AxiosError<{ message: string }>
        ),
        variant: "destructive",
      });
      setCommentData(context?.previousData?.data ?? []);
    },

    onSettled() {
      // Invalidate the queries to trigger a refetch
      query.invalidateQueries({
        queryKey: ["post_comments", id],
        exact: true,
      });
      query.invalidateQueries({
        queryKey: ["community_posts", id],
        exact: true,
      });
    },

    onSuccess() {
      setComment("");
    },
  });

  const handleAddComment = () => {
    login_required();

    if (!login_required("Login to comment on this post. 📥") || isLoading) {
      return;
    }

    if (!user) {
      return;
    }

    const { profile_image, username, id } = user;

    const payload: PostCommentsProps = {
      user: {
        profile_image,
        username,
        id,
      },
      body: comment,
      created_at: new Date(),
      updated_at: new Date(),
      id: Date.now(),
    };

    mutate(payload);
  };

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage) {
      fetchNextPage();
    }
  }, [entry?.isIntersecting]);

  useEffect(() => {
    if (!!data?.pages[0].data.length) {
      data.pages.map((pg) => {
        return setCommentData(pg.data ?? []);
      });
    }

    if (!error) {
      return;
    }
    toast({
      title: "Error",
      description: "Something went wromg with comment " + id,
      variant: "destructive",
    });
  }, [error, data]);

  const loader = (
    <div className="w-full flex flex-col gap-3">
      {[...Array(5)].map((_, i) => (
        <div className="flex items-center gap-2 w-full" key={i}>
          <Skeleton className="w-[3rem] h-[3rem] rounded-full" />
          <div className="flex flex-col w-full gap-1">
            <Skeleton className="w-[250px] h-[10px] rounded-md" />
            <Skeleton className="w-[250px] h-[10px] rounded-md" />
            <Skeleton className="w-[250px] h-[10px] rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );

  const content = Object.freeze({
    header: "Comments",
    description: "Read and write something about this post.",
    inputDesktop: (
      <Textarea
        onChange={(e) => setComment(e.target.value)}
        value={comment}
        placeholder="Say Something..."
      />
    ),
    inputMobile: (
      <Input
        onChange={(e) => setComment(e.target.value)}
        value={comment}
        placeholder="Say Something..."
      />
    ),
    commentButton: (
      <Button disabled={!comment} onClick={handleAddComment} variant="base">
        {isPending ? (
          <Loader2 className=" animate-spin" size={15} />
        ) : (
          "Comment"
        )}
      </Button>
    ),
    commentsListing: isLoading ? (
      loader
    ) : !commentData.length ? (
      <EmptyState state="list" message="No Comments Yet! Care to add?" />
    ) : (
      <div className="flex w-full flex-col gap-2">
        {commentData.map((comment, index) => (
          <CommentUI
            ref={commentData.length - 3 === index ? ref : undefined}
            key={comment.id}
            {...{
              username: comment.user.username,
              profile_image: comment.user.profile_image,
              created_at: new Date(comment.created_at),
              id: comment.id,
              type: "community",
              body: comment.body,
            }}
          />
        ))}
        <LoadMoreBtn
          hasNextPage={hasNextPage}
          loadingText="Loading more comments"
          isFetching={isFetchingNextPage}
          endOfPages
          onClick={fetchNextPage}
        />
      </div>
    ),
  });

  const openButton = (
    <div className="flex items-center gap-1 cursor-pointer ">
      <MessageCircle size={15} />
      <Description text={comments_count + " Comments"} />
    </div>
  );

  return (
    <Fragment>
      {Number(width) > 767 ? (
        <Sheet open={open} onOpenChange={() => setOpen((prev) => !prev)}>
          <SheetTrigger>{openButton}</SheetTrigger>
          <SheetContent className="flex flex-col gap-5 overflow-hidden">
            <SheetHeader className="flex flex-col gap-2">
              <SheetTitle>{content.header}</SheetTitle>
              <SheetDescription>{content.description}</SheetDescription>
              <div className="w-full flex flex-col items-end justify-end gap-2">
                {content.inputDesktop}
                {content.commentButton}
              </div>
            </SheetHeader>
            <section className=" overflow-auto">
              {content.commentsListing}
            </section>
          </SheetContent>
        </Sheet>
      ) : (
        <Drawer
          open={open}
          onOpenChange={(open) => {
            setOpen(open);
          }}
        >
          <DrawerTrigger>{openButton}</DrawerTrigger>
          <DrawerContent className="p-2 h-[30rem] overflow-hidden">
            <DrawerHeader>
              <DrawerTitle>{content.header}</DrawerTitle>
              <DrawerDescription>{content.description}</DrawerDescription>
            </DrawerHeader>
            <section className=" overflow-auto">
              {content.commentsListing}
            </section>
            <DrawerFooter className="w-full">
              <div className="w-full flex items-center gap-2">
                {content.inputMobile}
                {content.commentButton}
              </div>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </Fragment>
  );
};

export const NoPostYet: FC<{}> = () => {
  return (
    <div className="w-full h-screen">
      <EmptyState state="empty" message="No post yet!!" />
    </div>
  );
};

export const PostMoreIcon: FC<{
  id: string;
  images: string[];
  quiz_id: string;
  caption: string;
  posted_by: string;
}> = ({ id, images, caption, quiz_id, posted_by }) => {
  const { user } = useZStore();
  const { login_required } = useMethods();
  const { id: communityId } = useParams();
  const query = useQueryClient();
  const { communityDetails } = useCommunityStore();
  const [isPending, startTransition] = useTransition();
  const [report, setReport] = useState("");

  const owner =
    user?.username.toLowerCase() === posted_by.toLowerCase() ||
    communityDetails?.created_by?.toLowerCase() ===
      user?.username?.toLowerCase();

  const params = queryString.stringify({
    caption,
    quiz_id,
    post_id: id,
    images: images,
  });

  const community = new CommunityApiCalls(id);

  const handleDelete = async () => {
    try {
      await community.deletePost(id);
      toast({
        title: "Post Deleted",
        description: "You delete a post with id " + id,
      });
      query.invalidateQueries({
        queryKey: ["community_details", communityDetails?.id],
        exact: true,
      });
      query.invalidateQueries({
        queryKey: ["community_posts", communityDetails?.id],
        exact: true,
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

  const handleReport = async (
    e: FormEvent<HTMLFormElement | HTMLButtonElement>
  ) => {
    e.preventDefault();
    login_required("You have to login before reporting this post");
    if (!login_required("You have to login before reporting this post")) {
      return;
    }
  };

  const deletePost = (
    <AlertDialog>
      <AlertDialogTrigger className="w-full">
        <Button
          className="w-full flex items-center gap-2 justify-start"
          variant="destructive"
        >
          {isPending ? (
            <Loader2 className=" animate-spin" size={15} />
          ) : (
            <Trash2Icon size={15} />
          )}
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-500">
            Delete Post
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this post?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertDescription>
            Please note that the action you are about to perform is irrevesible!
            And {app_config.AppName} will be responsible for any data loss!
          </AlertDescription>
        </Alert>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            onClick={() =>
              startTransition(() => {
                handleDelete();
              })
            }
            variant="destructive"
          >
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  const reportPost = (
    <Dialog>
      <DialogTrigger className="w-full">
        <Button
          className="w-full flex items-center gap-2 justify-start"
          variant="destructive"
        >
          <AlertCircleIcon size={15} /> Report
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report a post</DialogTitle>
          <DialogDescription>
            If there is something you notice isn't right about this post write
            it down and the admin of this community will be notify
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleReport}
          className="w-full flex flex-col gap-3"
          action=""
        >
          <Textarea
            value={report}
            onChange={(e) => setReport(e.target.value)}
          />
          <Button
            disabled={!report}
            onClick={handleReport}
            className="w-full"
            variant="destructive"
          >
            Report
          </Button>
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <Popover>
      <PopoverTrigger>
        <Button className="w-7 h-7 p-1" variant="ghost" size="icon">
          <MoreVertical />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex items-center gap-2 flex-col w-[200px]">
        <Description
          text="Perform action"
          className=" underline items-start justify-start flex w-full"
        />
        {owner && (
          <Button
            asChild
            className="w-full flex items-center gap-2 justify-start"
            variant="ghost"
          >
            <Link
              to={
                app_config.community +
                "edit-post/" +
                communityId +
                `/?${params}`
              }
            >
              <Edit2Icon size={15} />
              Edit
            </Link>
          </Button>
        )}
        {!owner && reportPost}
        {owner && deletePost}
      </PopoverContent>
    </Popover>
  );
};
