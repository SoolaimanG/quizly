import { FC, ReactElement, useState, useTransition } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../Popover";
import { Button } from "../Button";
import { Loader2, X } from "lucide-react";
import { CheckCheckIcon } from "lucide-react";
import EmptyState from "./EmptyState";
import { PopoverClose } from "@radix-ui/react-popover";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { NotificationsApi } from "../../Functions/NotificationsApi";
import { useAuthentication } from "../../Hooks";
import { NotificationsProps } from "../../Types/components.types";
import { Skeleton } from "../Loaders/Skeleton";
import { NotificationUI } from "./NotificationUI";
import { toast } from "../use-toaster";

export const UserNotifications: FC<{ children: ReactElement }> = ({
  children,
}) => {
  const { isAuthenticated } = useAuthentication();
  const notifications = new NotificationsApi();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const query = useQueryClient();

  const { isLoading, data } = useQuery<{ data: NotificationsProps[] }>({
    queryKey: ["notifications", isAuthenticated],
    queryFn: notifications.get_notifications,
    enabled: isAuthenticated && open,
  });

  const handleAllRead = async () => {
    if (!data?.data.length) return;

    try {
      await notifications.mark_all_as_read();
      await query.invalidateQueries({
        queryKey: ["notifications", isAuthenticated],
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong try again ...",
        variant: "destructive",
      });
    }
  };

  const loader = (
    <div className="flex flex-col gap-5">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center justify-between w-full">
          <div className="flex flex-col gap-1">
            <Skeleton className="w-[200px] h-[10px] rounded-md" />
            <Skeleton className="w-[100px] h-[10px] rounded-md" />
            <Skeleton className="w-[200px] h-[10px] rounded-md" />
          </div>
          <Skeleton className="w-[3rem] h-[1.5rem] rounded-md" />
        </div>
      ))}
    </div>
  );

  return (
    <Popover open={open} onOpenChange={() => setOpen((prev) => !prev)}>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent className="h-[35rem] md:h-[32rem] w-[21.5rem] md:w-[25rem] p-0 relative">
        <header className="w-full fixed top-0 left-0 justify-between px-2 py-4 dark:bg-slate-800 bg-gray-200 rounded-t-md flex items-center">
          <h1 className=" text-green-500">Notifications</h1>
          <PopoverClose asChild>
            <Button className="w-6 h-6 p-1" size="icon" variant="secondary">
              <X />
            </Button>
          </PopoverClose>
        </header>
        {/* Notification Content */}
        <div className="pt-16 h-full">
          {isLoading && loader}
          {!isLoading && !data?.data.length && (
            <div className="h-full flex items-center justify-center">
              <EmptyState state="list" message="No notifications" />
            </div>
          )}
          {!isLoading &&
            !!data?.data.length &&
            data.data.map((notification) => (
              <NotificationUI key={notification.id} {...notification} />
            ))}
        </div>
        <footer className="w-full flex items-end justify-end p-1 rounded-b-md fixed bottom-0 left-0 dark:bg-slate-800 bg-gray-200">
          <Button
            onClick={() =>
              startTransition(() =>
                startTransition(() => {
                  handleAllRead();
                })
              )
            }
            className="flex items-center gap-1 dark:text-green-300 text-green-500 hover:text-green-500 dark:hover:text-green-600"
            variant="link"
          >
            {isPending ? (
              <Loader2 />
            ) : (
              <>
                Mark as read <CheckCheckIcon />{" "}
              </>
            )}
          </Button>
        </footer>
      </PopoverContent>
    </Popover>
  );
};
