import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "../../components/AlertModal";
import { createCommunityProps } from "../../Types/community.types";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { Textarea } from "../../components/TextArea";
import ImageUploader from "../../components/App/ImageUploader";
import { UploadCloud } from "lucide-react";
import { Label } from "../../components/Label";
import { Description } from "../ExplorePage/QuickQuiz";
import { Switch } from "../../components/Switch";
import { subjects, uploaderProps } from "../../Types/components.types";
import { SelectCategory } from "../../components/App/SelectCategory";
import { createCommunity } from "../../Functions/APIqueries";
import { Img } from "react-image";
import { useMethods } from "../../Hooks";
import { toast } from "../../components/use-toaster";
import { capitalize_first_letter } from "../../Functions";

const content = Object.freeze({
  description:
    "Tired of trivia solitude? Unleash your inner Einstein in our buzzing haven for quiz connoisseurs! Dive into a sea of mind-bending questions, forge bonds with fellow word wizards, and unleash your quizmaster magic—crafting challenges that leave jaws on the floor! This is a knowledge colosseum unlike any other, so join the quest for trivia glory!",
});

export const CreateCommunity: React.FC<createCommunityProps> = ({ button }) => {
  const [view, setView] = useState<"start" | "details" | "finish">("start");
  const [imageData, setImageData] = useState<uploaderProps>({
    files: [],
    previewUrl: [],
  });
  const [data, setData] = useState({
    name: "",
    description: "",
    join_with_request: false,
  });
  const { login_required } = useMethods();
  const [allow_categories, setAllowCategories] = useState<subjects[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const goForward = async () => {
    if (view === "start") return setView("details");

    if (view === "details") return setView("finish");

    if (!login_required()) return;

    const { name, description, join_with_request } = data;

    const res = await createCommunity({
      allow_categories,
      name,
      join_with_request,
      display_image: imageData.files[0],
      description,
    });

    if (res?.message == "OK") {
      setImageData({ files: [], previewUrl: [] });
      setAllowCategories([]);
      toast({
        title: "Success",
        description: `You just created a community ${capitalize_first_letter(
          name
        )}`,
      });
      setView("start");
      setIsOpen(false);
    }
  };

  const goBackward = () => {
    if (view === "finish") return setView("details");

    if (view === "details") return setView("start");

    setIsOpen(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setData({ ...data, [name]: value });
  };

  const start = (
    <AlertDialogDescription>{content.description}</AlertDialogDescription>
  );

  const details = (
    <form className="w-full flex flex-col gap-2">
      <ImageUploader
        button={
          <div className="w-[5rem] flex items-center justify-center h-[5rem] border border-green-400 hover:bg-green-200 transition-all delay-75   border-dashed rounded-full">
            {imageData?.previewUrl![0] ? (
              <Img
                className="w-full h-full rounded-full"
                src={imageData.previewUrl[0]}
              />
            ) : (
              <UploadCloud />
            )}
          </div>
        }
        setData={setImageData}
        filesToAccept={[".png", ".jpeg", ".jpg"]}
        data={imageData}
      />
      <Input
        name="name"
        onChange={handleChange}
        placeholder="Name your community"
        className="h-[3rem]"
      />
      <Textarea
        onChange={handleChange}
        name="description"
        className="resize-none"
        placeholder="Write a description about your community"
      />
      <Label className="flex items-center justify-between w-full">
        <div className="flex flex-col">
          <h1>Request to join</h1>
          <Description text="When this is on request of users will be sent to you for processing" />
        </div>
        <Switch
          checked={data.join_with_request}
          onCheckedChange={() =>
            setData({ ...data, join_with_request: !data.join_with_request })
          }
        />
      </Label>
    </form>
  );

  const finish = (
    <div>
      <AlertDialogDescription>
        Select the subjects that can be post on your community
      </AlertDialogDescription>
      <SelectCategory
        className="mt-4"
        categories={allow_categories}
        setCategories={setAllowCategories}
        maxSelect={3}
      />
    </div>
  );

  const _view = {
    start,
    details,
    finish,
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={() => setIsOpen((prev) => !prev)}>
      <AlertDialogTrigger>{button}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader className="text-xl">
          Create Community
        </AlertDialogHeader>
        {_view[view]}
        <AlertDialogFooter className="gap-2">
          <Button onClick={goBackward} variant={"outline"}>
            {view === "start" ? "Cancel" : "Back"}
          </Button>

          <Button onClick={goForward} variant={"base"}>
            Next
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
