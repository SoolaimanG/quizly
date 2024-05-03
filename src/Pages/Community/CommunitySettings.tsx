import { FC, useEffect, useState, useTransition } from "react";
import { useCommunityStore, useZStore } from "../../provider";
import { Restricted } from "../../components/App/Restricted";
import { Button } from "../../components/Button";
import { Check, ImageIcon, Loader2 } from "lucide-react";
import { Input } from "../../components/Input";
import ImageUploader from "../../components/App/ImageUploader";
import { subjects, uploaderProps } from "../../Types/components.types";
import { Img } from "react-image";
import { Skeleton } from "../../components/Loaders/Skeleton";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "../../components/Accordion";
import { AccordionContent } from "../../components/App/Accordion";
import { SelectCategory } from "../../components/App/SelectCategory";
import { Switch } from "../../components/Switch";
import { CommunityApiCalls } from "../../Functions/APIqueries";
import { toast } from "../../components/use-toaster";
import { errorMessageForToast } from "../../Functions";
import { AxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { Description } from "../../components/App/Description";

export const CommunitySettings: FC<{}> = () => {
  const { user } = useZStore();
  const { communityDetails } = useCommunityStore();
  const [name, setName] = useState("");
  const [allowRequest, setAllowRequest] = useState(false);
  const [categories, setCategories] = useState<subjects[]>([]);
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();
  const [data, setData] = useState<uploaderProps>({
    files: [],
    previewUrl: [communityDetails?.display_picture as string],
  });

  const community = new CommunityApiCalls(communityDetails?.id ?? "");

  useEffect(() => {
    if (!communityDetails) return;

    setName(communityDetails?.name ?? "");
    setAllowRequest(communityDetails?.join_with_request ?? false);
    setCategories(
      communityDetails?.allow_categories.map(
        (subject) => subject.body as subjects
      ) ?? []
    );

    return () => {
      setName("");
      setAllowRequest(false);
      setCategories([]);
    };
  }, [communityDetails]);

  const handleEditCommunity = async () => {
    try {
      await community.editCommunity({
        name,
        allow_categories: categories,
        display_picture: data.files[0],
        join_with_request: allowRequest,
      });
      await queryClient.invalidateQueries({
        queryKey: ["community_details", communityDetails?.id ?? ""],
      });
      toast({
        title: "Success",
        description: "Changes Applied",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: errorMessageForToast(
          error as AxiosError<{ message: string }>
        ),
        variant: "destructive",
      });
    }
  };

  const isAdmin =
    communityDetails?.created_by.toLowerCase() === user?.username.toLowerCase();

  if (!isAdmin)
    return (
      <Restricted
        className="h-screen"
        message="You are prohibited to see this page"
      />
    );

  return (
    <div className="w-full">
      <nav className="w-full flex items-center justify-between">
        <h1>Settings</h1>
        <Button
          onClick={() =>
            startTransition(() => {
              handleEditCommunity();
            })
          }
          className="flex items-center gap-2"
          variant="base"
        >
          {" "}
          {isPending ? <Loader2 className="animate-spin" /> : <Check />} Save
          Changes
        </Button>
      </nav>
      <section className="flex flex-col gap-6">
        <ImageUploader
          button={
            <div className="w-[5rem] h-[5rem] flex transition-all ease-linear delay-75 items-center justify-center border border-green-200 hover:border-green-500 rounded-full">
              {!data.previewUrl?.length ? (
                <ImageIcon />
              ) : (
                <Img
                  alt="Display Picture"
                  className="w-full h-full rounded-full"
                  src={data.previewUrl[0]}
                  loader={
                    <Skeleton className="w-[5rem] h-[5rem] rounded-full" />
                  }
                />
              )}
            </div>
          }
          setData={setData}
          data={data}
          filesToAccept={["jpg,png,jpeg"]}
        />
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Change Community Name"
          className="w-full h-[3rem]"
        />
        <div className="w-full rounded-md flex items-center justify-between p-">
          <div className="flex flex-col">
            <h1>Request to join</h1>
            <Description text="When this is on request of users will be sent to you for processing" />
          </div>
          <Switch
            checked={allowRequest}
            onCheckedChange={() => setAllowRequest((prev) => !prev)}
          />
        </div>
        <Accordion type="single" collapsible>
          <AccordionItem value="edit-category">
            <AccordionTrigger>
              Change Category Allow On This Community.
            </AccordionTrigger>
            <AccordionContent>
              <SelectCategory
                categories={categories}
                setCategories={setCategories}
                maxSelect={3}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  );
};
