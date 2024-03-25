import { FC, useTransition } from "react";
import { comingSoonProps } from "../../Types/components.types";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../DialogModal";
import ImageOne from "../../assets/profile_one.png";
import ImageTwo from "../../assets/profile_two.png";
import ImageThree from "../../assets/profile_three.png";
import ImageFour from "../../assets/profile_four.png";
import ImageFive from "../../assets/profile_five.png";
import ImageSix from "../../assets/profile_six.png";
import ImageSeven from "../../assets/profile_seven.png";
import Waiting from "../../assets/WaitingAnimation.json";

import { Button } from "../Button";
import { Loader2 } from "lucide-react";
import { Img } from "react-image";
import { Input } from "../Input";
import { useZStore } from "../../provider";
import { cn } from "../../lib/utils";
import Lottie from "lottie-react";
import { Description } from "../../Pages/ExplorePage/QuickQuiz";
import { useQuery } from "@tanstack/react-query";
import { FeatureWaitList } from "../../Functions/APIqueries";
import { toast } from "../use-toaster";
import { errorMessageForToast } from "../../Functions";
import { AxiosError } from "axios";

export type featureWaitListProps =
  | "IMAGE_FILTER"
  | "AI_HELP"
  | "QuestionGroup"
  | "Time";

export const ComingSoon: FC<{
  props: Omit<
    comingSoonProps,
    "setDescription" | "setFeatureName" | "setJoinWaitList"
  >;
}> = ({
  props: {
    joinWaitList,
    description,
    featureName,
    isVisible,
    type,
    setIsVisible,
  },
}) => {
  console.log({ type, featureName });
  const waitList = new FeatureWaitList();
  const [isPending, startTransition] = useTransition();
  const { user } = useZStore();
  const joinFeatureWaitList = async () => {
    try {
      const res: { message: string } = await waitList.join_wait_list(type);
      toast({
        title: "Success",
        description: res.message,
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
  const images = [
    ImageOne,
    ImageTwo,
    ImageThree,
    ImageFour,
    ImageFive,
    ImageSix,
    ImageSeven,
  ];

  const { isLoading, data } = useQuery<{
    data: { is_on_wait_list: boolean };
  }>({
    queryKey: [featureName],
    queryFn: () => waitList.is_user_on_wait_list(type),
    enabled: isVisible,
  });

  return (
    <Dialog open={isVisible} onOpenChange={(e) => setIsVisible(e)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{featureName}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="w-full h-full flex items-center gap-3">
          {joinWaitList ? (
            <div className="flex flex-col gap-2 w-full">
              <div className="w-full h-full flex items-center gap-3">
                {images.map((imageUrl, index) => (
                  <div
                    className={cn(
                      "w-[2.5rem] h-[2.5rem] rounded-full bg-green-100 flex justify-start -space-x-1.5"
                    )}
                    key={index}
                  >
                    <Img
                      src={imageUrl}
                      className="w-full h-full cursor-pointer"
                    />
                  </div>
                ))}
              </div>
              <Input
                value={user?.username?.toUpperCase()}
                className="w-full h-[3rem] mt-2 font-semibold text-green-500"
                // disabled
              />
            </div>
          ) : (
            <div className="w-full h-[18rem] flex-col flex items-center justify-center">
              <Lottie className="h-[8rem]" animationData={Waiting} loop />
              <Description
                className="text-lg text-green-300"
                text="We are working hard to make this available very soon."
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" size="sm">
              Close
            </Button>
          </DialogClose>
          {joinWaitList && (
            <DialogClose asChild>
              <Button
                onClick={() =>
                  startTransition(() => {
                    joinFeatureWaitList();
                  })
                }
                size="sm"
                variant="base"
                disabled={data?.data.is_on_wait_list ?? isLoading ?? true}
              >
                {isPending && <Loader2 className="animate-spin" />}
                {data?.data.is_on_wait_list
                  ? "Already Joined"
                  : "Join WaitList"}
              </Button>
            </DialogClose>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
