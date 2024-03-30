// import React from 'react'

import { FC, ReactNode, useTransition } from "react";
import { cn } from "../../lib/utils";
import { useComingSoonProps, useSurveyWorkSpace } from "../../provider";
import { AnimatePresence, motion } from "framer-motion";

import { Button } from "../../components/Button";
import { MoreVertical, PlusIcon, TrashIcon } from "lucide-react";
import { RecommendedContent } from "./RecommendedContent";
import { ContentTools } from "./ContentTools";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "../../components/DialogModal";
import { BlockToolProps, ISurveyBlocks } from "../../Types/survey.types";
import { Description } from "../ExplorePage/QuickQuiz";
import { useText } from "../../Hooks/text";
import { useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/Popover";
import { Command } from "cmdk";
import { CommandGroup, CommandList } from "../../components/Command";
import { app_config } from "../../Types/components.types";
import { SurveyWorkSpace } from "../../Functions/surveyApis";
import { errorMessageForToast, handleAddBlock } from "../../Functions";
import { AxiosError } from "axios";
import { toast } from "../../components/use-toaster";
import { useQueryClient } from "@tanstack/react-query";
import Hint from "../../components/Hint";
import { useWindowSize } from "@uidotdev/usehooks";
import { Sheet, SheetContent, SheetTrigger } from "../../components/Sheet";

export const ContactGroup: BlockToolProps[] = ["Email", "PhoneNumber"];
export const InputGroup: BlockToolProps[] = ["LongText", "ShortText", "Number"];
export const MediaGroup: BlockToolProps[] = ["PictureChoice"];
export const ChoicesGroup: BlockToolProps[] = [
  "DropDown",
  "Choices",
  "Rating",
  "YesNo",
];
export const DateGroup: BlockToolProps[] = ["Date", "Time"];
export const ScreenGroup: BlockToolProps[] = ["EndScreen", "WelcomeScreen"];
export const OtherGroup: BlockToolProps[] = [
  "RedirectToURL",
  "QuestionGroup",
  "Website",
];

export const AddContents: FC<{ className?: string }> = ({ className }) => {
  const {
    collapseSideBar: { sideBarOne },
    survey_blocks,
  } = useSurveyWorkSpace();
  const { truncateWord } = useText();
  const navigate = useNavigate();
  const location = useLocation();

  const qs = queryString.parse(location.search, { parseBooleans: true }) as {
    id: string;
    block: string;
    opend: boolean;
  };

  const handleClick = (id: string) => {
    const params = queryString.stringify({
      ...qs,
      block: id,
    });
    navigate("?" + params);
  };

  return (
    <AnimatePresence mode="wait">
      {!sideBarOne && (
        <motion.div
          initial={{ opacity: 0, width: "0%" }}
          animate={{ opacity: 1, width: "35%" }}
          exit={{ opacity: 0, width: "0%" }}
          className={cn(
            "dark:bg-slate-950 bg-white p-2 h-screen overflow-auto",
            className
          )}
        >
          <header className="flex items-center border-gray-100 pb-2 dark:border-slate-700 border-b justify-between">
            <Description text="Add Content" className="text-lg" />
            <OpenAddBlocksModal>
              <Hint
                element={
                  <Button className="h-7" variant="secondary" size="icon">
                    <PlusIcon size={18} />
                  </Button>
                }
                content="Press Ctrl + / to open and close"
              />
            </OpenAddBlocksModal>
          </header>
          {survey_blocks?.length ? (
            <section className="w-full flex mt-5 flex-col gap-2">
              {survey_blocks?.map((block, index) => {
                const sub_block = {
                  Choices: block.choices,
                  Date: block.date,
                  DropDown: block.dropdown,
                  Email: block.email,
                  EndScreen: block.end_screen,
                  LongText: block.long_text,
                  Number: block.number,
                  PhoneNumber: block.phone_number,
                  PictureChoice: block.picture_choice,
                  QuestionGroup: "",
                  Rating: block.ratings,
                  RedirectToURL: block.redirect_with_url,
                  ShortText: block.short_text,
                  Time: "",
                  Website: block.website,
                  WelcomeScreen: block.welcome_screen,
                  YesNo: block.yes_no,
                }[block.block_type] as { id: number | string };
                return (
                  <div onClick={() => handleClick(block?.id)} key={block?.id}>
                    <div
                      className={cn(
                        "w-full cursor-pointer flex relative hover:bg-gray-100 hover:dark:bg-slate-700 rounded-md items-center gap-1 py-1 px-[2px]",
                        qs.block === block.id &&
                          "bg-gray-100 dark:bg-slate-700",
                        !qs.block &&
                          index === 0 &&
                          "bg-gray-100 dark:bg-slate-700"
                      )}
                    >
                      <ContentTools
                        size={17}
                        className="text-white w-[55px]"
                        toolType={block.block_type}
                        index={index + 1}
                        hideName
                      />
                      <p>
                        {truncateWord(
                          block.block_type === "WelcomeScreen"
                            ? block.welcome_screen.message
                            : block.block_type === "EndScreen"
                            ? block.end_screen.message
                            : block.question,
                          20
                        )}
                      </p>
                      <BlockMoreOptions
                        id={sub_block.id as string}
                        className="rounded-full p-1 absolute right-0 top-0"
                        blockType={block.block_type}
                      />
                    </div>
                  </div>
                );
              })}
            </section>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Description className="text-lg" text="Start by Adding Blocks." />
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const BlockMoreOptions: FC<{
  className?: string;
  id: string;
  blockType: BlockToolProps;
}> = ({ id, className, blockType }) => {
  const { survey_blocks, survey, setAutoSaveUiProps } = useSurveyWorkSpace();
  const survey_action = new SurveyWorkSpace(survey?.id ?? "");
  const location = useLocation();
  const queryClient = useQueryClient();

  const parser = queryString.parse(location.search, {
    parseBooleans: true,
  }) as { id: string; block: string; opend?: boolean };

  // This is to remove block that is not needed.

  // This is to duplicate  a block
  const handleDuplicateBlock = async () => {
    setAutoSaveUiProps({
      is_visible: true,
      status: "loading",
      message: "Please wait Duplicating....",
    });
    //
    const blockIndex =
      survey_blocks?.findIndex((block) => block.id === parser.block) ?? -1;

    if (blockIndex === -1) return;

    const block = survey_blocks?.[blockIndex];

    if (!block) return;

    try {
      await survey_action.blockAction({
        survey_id: survey?.id!,
        block_type: block.block_type,
        block_id: id,
        action: "DUPLICATE",
        id: block.id,
      });

      setAutoSaveUiProps({
        is_visible: true,
        message: "Block Duplicated.",
        status: "success",
      });

      await queryClient.invalidateQueries({ queryKey: ["survey", survey?.id] });
    } catch (error) {
      setAutoSaveUiProps({
        is_visible: true,
        message: errorMessageForToast(error as AxiosError<{ message: string }>),
        status: "failed",
      });
    }
  };

  return (
    <Popover>
      <PopoverTrigger>
        <Button size="icon" variant="ghost" className={className}>
          <MoreVertical size={15} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-1" side="right">
        <Command>
          <CommandList>
            <CommandGroup heading="Actions">
              <Button
                onClick={handleDuplicateBlock}
                variant="ghost"
                className="w-full h-9 flex items-start justify-start"
              >
                Duplicate
              </Button>
              <DeleteBlock blockType={blockType} id={id}>
                <Button
                  variant="ghost"
                  className="w-full h-9 flex gap-1 text-red-500 items-center justify-start"
                >
                  <TrashIcon size={16} />
                  Delete
                </Button>
              </DeleteBlock>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export const DeleteBlock: FC<{
  children: React.ReactNode;
  id: string;
  blockType: BlockToolProps;
  shouldNavigate?: boolean;
}> = ({ children, id, blockType, shouldNavigate = true }) => {
  const { survey_blocks, survey, setAutoSaveUiProps, setSurveyBlocks } =
    useSurveyWorkSpace();
  const action = new SurveyWorkSpace(survey?.id ?? "");
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();

  const parser = queryString.parse(location.search, {
    parseBooleans: true,
  }) as { id: string; block: string; opend?: boolean };

  const handleRemoveBlock = async () => {
    const _ = survey_blocks;

    const data = survey_blocks?.filter((block) => {
      return block.id !== parser.block;
    }) as ISurveyBlocks[];

    const currentBlockIndex = survey_blocks?.findIndex(
      (block) => block.id === id
    );
    const leftBlock = survey_blocks?.[Number(currentBlockIndex) - 1]?.id;
    const rightBlock = survey_blocks?.[Number(currentBlockIndex) + 1]?.id;

    try {
      setAutoSaveUiProps({
        is_visible: true,
        message: app_config.AppName + " Is saving your progress, Please wait.",
        status: "loading",
      });

      // Logic here....
      await action.removeBlock(id, blockType);
      await queryClient.invalidateQueries({ queryKey: ["survey", parser.id] }); //Revalidate to updated data

      const qs = queryString.stringify({
        block: leftBlock ?? rightBlock ?? "",
        id: parser.id,
        opend: parser?.opend ?? false,
      });

      shouldNavigate && navigate("?" + qs);
      setSurveyBlocks(data);

      setAutoSaveUiProps({
        is_visible: true,
        message: "Your progress is saved.",
        status: "success",
      });
    } catch (error) {
      setSurveyBlocks(_ as ISurveyBlocks[]); //If there is an error reverse the state to the previous one.
      setAutoSaveUiProps({
        is_visible: true,
        message: errorMessageForToast(error as AxiosError<{ message: string }>),
        status: "failed",
      });
    }
  };
  return <div onClick={handleRemoveBlock}>{children}</div>;
};

export const OpenAddBlocksModal: FC<{
  children: ReactNode;
  className?: string;
}> = ({ children, className }) => {
  const { width } = useWindowSize();
  const { survey, openBlockDialog, setOpenBlockDialog, setAutoSaveUiProps } =
    useSurveyWorkSpace();
  const action = new SurveyWorkSpace(survey?.id ?? "");

  const location = useLocation();
  const qs = queryString.parse(location.search, { parseBooleans: true }) as {
    id: string;
    block: string;
    opend: boolean;
  };
  const query = useQueryClient();
  const [isPending, startTransition] = useTransition();
  const {
    setIsVisible,
    setFeatureName,
    setJoinWaitList,
    setDescription,
    setType,
  } = useComingSoonProps();

  const addBlock = async (block_type: BlockToolProps) => {
    if (block_type === "QuestionGroup" || block_type === "Time") {
      setJoinWaitList(true);
      setFeatureName(block_type);
      setIsVisible(true);
      setDescription(
        "This Block is currently under development and will soon be available. Join the wait-list to be among the first people to use it."
      );
      setType(block_type);
      return;
    }

    if (isPending)
      return toast({
        title: "Error",
        description: "Please wait while the previous request is completed.",
        variant: "destructive",
      });

    startTransition(() => {
      handleAddBlock({
        survey_id: survey?.id!,
        block_type,
        setAutoSaveUiProps,
      });
    });

    await action.addLastUsedBlock(block_type);

    await query.invalidateQueries({ queryKey: ["last_used_block"] });
    await query.invalidateQueries({ queryKey: ["survey", qs.id] });
    setOpenBlockDialog(false);
  };

  return Number(width) > 767 ? (
    <Dialog open={openBlockDialog} onOpenChange={(e) => setOpenBlockDialog(e)}>
      <DialogTrigger className={cn(className)}>{children}</DialogTrigger>
      <DialogContent className="md:w-[80%]">
        <div className="h-[80vh] flex gap-3 w-full overflow-hidden">
          <RecommendedContent className="w-[35%]" />
          <div className="w-[65%] grid grid-cols-2 gap-4 overflow-auto">
            {/* Input Group */}
            <div className="flex flex-col gap-3">
              <h1 className="text-green-500">Input Tools</h1>
              {InputGroup.map((tool, index) => (
                <div key={index} onClick={() => addBlock(tool)}>
                  <ContentTools toolType={tool} className="p-2" />
                </div>
              ))}
            </div>

            {/* Media Group */}
            <div className="flex flex-col gap-3">
              <h1 className="text-green-500">Media Tools</h1>
              {MediaGroup.map((tool, index) => (
                <div key={index} onClick={() => addBlock(tool)}>
                  <ContentTools toolType={tool} className="p-2" />
                </div>
              ))}
            </div>

            {/* Choice Group */}
            <div className="flex flex-col gap-3">
              <h1 className="text-green-500">Choice Group</h1>
              {ChoicesGroup.map((tool, index) => (
                <div key={index} onClick={() => addBlock(tool)}>
                  <ContentTools toolType={tool} className="p-2" />
                </div>
              ))}
            </div>

            {/* Date Group */}
            <div className="flex flex-col gap-3">
              <h1 className="text-green-500">Date Tools</h1>
              {DateGroup.map((tool, index) => (
                <div key={index} onClick={() => addBlock(tool)}>
                  <ContentTools toolType={tool} className="p-2" />
                </div>
              ))}
            </div>

            {/* Screen Group */}
            <div className="flex flex-col gap-3">
              <h1 className="text-green-500">Screens</h1>
              {ScreenGroup.map((tool, index) => (
                <div key={index} onClick={() => addBlock(tool)}>
                  <ContentTools toolType={tool} className="p-2" />
                </div>
              ))}
            </div>

            {/* Contact Group */}
            <div className="flex flex-col gap-3">
              <h1 className="text-green-500">Contact Tools</h1>
              {ContactGroup.map((tool, index) => (
                <div key={index} onClick={() => addBlock(tool)}>
                  <ContentTools toolType={tool} className="p-2" />
                </div>
              ))}
            </div>

            {/* Other Group */}
            <div className="flex flex-col gap-3">
              <h1 className="text-green-500">Others</h1>
              {OtherGroup.map((tool, index) => (
                <div key={index} onClick={() => addBlock(tool)}>
                  <ContentTools toolType={tool} className="p-2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  ) : (
    <Sheet open={openBlockDialog} onOpenChange={(e) => setOpenBlockDialog(e)}>
      <SheetTrigger className={cn(className)}>{children}</SheetTrigger>
      <SheetContent className="w-[90%] h-full">
        <div className="h-full overflow-hidden">
          <RecommendedContent />
          <div className="w-full h-full pt-3 pb-[27rem] flex flex-col gap-4 overflow-auto">
            {/* Input Group */}
            <div className="flex flex-col gap-3">
              <h1 className="text-green-500">Input Tools</h1>
              {InputGroup.map((tool, index) => (
                <div key={index} onClick={() => addBlock(tool)}>
                  <ContentTools className="p-2" toolType={tool} />
                </div>
              ))}
            </div>

            {/* Media Group */}
            <div className="flex flex-col gap-3">
              <h1 className="text-green-500">Media Tools</h1>
              {MediaGroup.map((tool, index) => (
                <div key={index} onClick={() => addBlock(tool)}>
                  <ContentTools className="p-2" toolType={tool} />
                </div>
              ))}
            </div>

            {/* Choice Group */}
            <div className="flex flex-col gap-3">
              <h1 className="text-green-500">Choice Group</h1>
              {ChoicesGroup.map((tool, index) => (
                <div key={index} onClick={() => addBlock(tool)}>
                  <ContentTools className="p-2" toolType={tool} />
                </div>
              ))}
            </div>

            {/* Date Group */}
            <div className="flex flex-col gap-3">
              <h1 className="text-green-500">Date Tools</h1>
              {DateGroup.map((tool, index) => (
                <div key={index} onClick={() => addBlock(tool)}>
                  <ContentTools className="p-2" toolType={tool} />
                </div>
              ))}
            </div>

            {/* Screen Group */}
            <div className="flex flex-col gap-3">
              <h1 className="text-green-500">Screens</h1>
              {ScreenGroup.map((tool, index) => (
                <div key={index} onClick={() => addBlock(tool)}>
                  <ContentTools className="p-2" toolType={tool} />
                </div>
              ))}
            </div>

            {/* Contact Group */}
            <div className="flex flex-col gap-3">
              <h1 className="text-green-500">Contact Tools</h1>
              {ContactGroup.map((tool, index) => (
                <div key={index} onClick={() => addBlock(tool)}>
                  <ContentTools className="p-2" toolType={tool} />
                </div>
              ))}
            </div>

            {/* Other Group */}
            <div className="flex flex-col gap-3">
              <h1 className="text-green-500">Others</h1>
              {OtherGroup.map((tool, index) => (
                <div key={index} onClick={() => addBlock(tool)}>
                  <ContentTools className="p-2" toolType={tool} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
