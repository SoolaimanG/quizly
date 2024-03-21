// import React from 'react'

import { FC, useTransition } from "react";
import { cn } from "../../lib/utils";
import { BlockToolProps } from "../../Types/survey.types";
import { Description } from "../ExplorePage/QuickQuiz";
import { ContentTools } from "./ContentTools";
import { toast } from "../../components/use-toaster";
import { handleAddBlock } from "../../Functions";
import { useSurveyWorkSpace } from "../../provider";
import { useQueryClient } from "@tanstack/react-query";

export const RecommendedContent: FC<{ className?: string }> = ({
  className,
}) => {
  const API = [];
  const _recommended: BlockToolProps[] = [
    "Email",
    "PhoneNumber",
    "ShortText",
    "Number",
    "DropDown",
    "YesNo",
    "EndScreen",
    "Date",
  ];
  const [isPending, startTransition] = useTransition();
  const { survey, setAutoSaveUiProps, setOpenBlockDialog } =
    useSurveyWorkSpace();
  const query = useQueryClient();

  const addBlock = async (block_type: BlockToolProps) => {
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

      // setOpen(false);
    });
    await query.invalidateQueries({ queryKey: ["survey", survey?.id] });
    setOpenBlockDialog(false);
  };

  // TODO:Api Call Here
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <Description
        text={!API.length ? "Recommended Tools" : "Last Used Tools"}
      />
      <div className="flex flex-col gap-3">
        {_recommended.map((tool, index) => (
          <div key={index} onClick={() => addBlock(tool)}>
            <ContentTools toolType={tool} className="p-2" />
          </div>
        ))}
      </div>
    </div>
  );
};
