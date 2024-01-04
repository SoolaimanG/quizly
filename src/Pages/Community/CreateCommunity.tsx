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
  const [allowedCategories, setAllowCategories] = useState<subjects[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const goForward = () => {
    if (view === "start") return setView("details");

    if (view === "details") return setView("finish");

    //Process the data
  };

  const goBackward = () => {
    if (view === "finish") return setView("details");

    if (view === "details") return setView("start");

    setIsOpen(false);
  };

  const start = (
    <AlertDialogDescription>{content.description}</AlertDialogDescription>
  );

  const details = (
    <form className="w-full flex flex-col gap-2">
      <ImageUploader
        button={
          <div className="w-[5rem] flex items-center justify-center h-[5rem] border border-green-400 hover:bg-green-200 transition-all delay-75 border-dashed rounded-full">
            {/*<div>*/}
            <UploadCloud />
          </div>
        }
        setData={setImageData}
        filesToAccept={[".png", ".jpeg", ".jpg"]}
        data={imageData}
      />
      <Input placeholder="Name your community" />
      <Textarea
        className="resize-none"
        placeholder="Write a description about your community"
      />
      <Label className="flex items-center justify-between w-full">
        <div className="flex flex-col">
          <h1>Request to join</h1>
          <Description text="When this is on request of users will be sent to you for processing" />
        </div>
        <Switch />
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
        categories={allowedCategories}
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
