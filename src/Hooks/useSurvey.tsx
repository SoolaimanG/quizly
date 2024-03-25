import queryString from "query-string";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ISurveyBlocks } from "../Types/survey.types";
import { useSurveyWorkSpace } from "../provider";

export type current_block_params = {
  id: string;
  block?: string;
  opend: string;
};

export const useGetCurrentBlock = () => {
  const location = useLocation();
  const qs = queryString.parse(location.search) as current_block_params;
  const [block, setBlock] = useState<ISurveyBlocks | null>(null);

  const { survey_blocks } = useSurveyWorkSpace();

  useEffect(() => {
    const currBlock =
      survey_blocks?.find((block) => block.id === qs.block) ??
      survey_blocks?.[0];

    if (currBlock) {
      setBlock(currBlock);
    }
  }, [qs.id, qs.block, survey_blocks]);

  return block;
};
