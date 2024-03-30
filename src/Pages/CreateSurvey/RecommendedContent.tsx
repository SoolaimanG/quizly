// import React from 'react'

import { FC, useTransition } from "react";
import { cn } from "../../lib/utils";
import { BlockToolProps } from "../../Types/survey.types";
import { Description } from "../ExplorePage/QuickQuiz";
import { ContentTools } from "./ContentTools";
import { toast } from "../../components/use-toaster";
import { handleAddBlock } from "../../Functions";
import { useSurveyWorkSpace } from "../../provider";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SurveyWorkSpace } from "../../Functions/surveyApis";

export const RecommendedContent: FC<{ className?: string }> = ({
  className,
}) => {
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
  const { survey, setAutoSaveUiProps, setOpenBlockDialog, openBlockDialog } =
    useSurveyWorkSpace();
  const action = new SurveyWorkSpace(survey?.id ?? "");
  const query = useQueryClient();

  const { isLoading, data } = useQuery<{
    data: { block_type: BlockToolProps }[];
  }>({
    queryKey: ["last_used_blocks"],
    queryFn: () => action.getLastUsedBlocks(),
    enabled: openBlockDialog,
  });

  console.log(data?.data);

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

    await action.addLastUsedBlock(block_type);

    await query.invalidateQueries({ queryKey: ["last_used_blocks"] });
    await query.invalidateQueries({ queryKey: ["survey", survey?.id] });
    setOpenBlockDialog(false);
  };

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <Description
        text={!data?.data.length ? "Recommended Tools" : "Last Used Tools"}
      />
      <div className="flex flex-col gap-3">
        {isLoading || !data?.data.length
          ? _recommended.map((tool, index) => (
              <div key={index} onClick={() => addBlock(tool)}>
                <ContentTools toolType={tool} className="p-2" />
              </div>
            ))
          : data.data.map((b, index) => (
              <div key={index} onClick={() => addBlock(b.block_type)}>
                <ContentTools toolType={b.block_type} className="p-2" />
              </div>
            ))}
      </div>
    </div>
  );
};
