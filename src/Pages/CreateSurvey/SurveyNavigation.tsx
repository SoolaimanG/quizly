import { FC, SetStateAction, useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import { Button } from "../../components/Button";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import Hint from "../../components/Hint";
import { useSurveyNavigation, useSurveyWorkSpace } from "../../provider";
import { allStyles } from "../../constant";
import { useGetCurrentBlock } from "../../Hooks/useSurvey";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import queryString from "query-string";
import { getSurveyAnswer } from "../../Functions";
import { toast } from "../../components/use-toaster";
import { endFunction, operatorTypes } from "../../Types/survey.types";

export const SurveyNavigation: FC<{
  className?: string;
  setIsLastBlock: React.Dispatch<SetStateAction<boolean>>;
}> = ({ className, setIsLastBlock }) => {
  const { id } = useParams() as { id: string };
  const { surveyDesign, survey_blocks, surveyLogics } = useSurveyWorkSpace();
  const navigate = useNavigate();
  const location = useLocation();
  const { navigate: navigateToBlock, setAction } = useSurveyNavigation();
  const isRequired = useGetCurrentBlock()?.is_required;
  const blockID = useGetCurrentBlock()?.id;

  const qs = queryString.parse(location.search) as { block: string };

  const blockList = survey_blocks?.map((block) => block.id) ?? [];
  const currentID = useGetCurrentBlock()?.id ?? blockList?.[0] ?? "";
  const currentBlockIndex = blockList?.indexOf(currentID);
  const userResponse = getSurveyAnswer(blockID ?? "");
  const [logicData, setLogicData] = useState({
    disableBtn: 0,
    goTo: "",
  });

  useEffect(() => {
    const currentLogic = surveyLogics?.find((logic) => logic.field === blockID);

    if (!currentLogic) {
      return;
    }

    const { fallBack, endFunction, endValue, value, operator } = currentLogic;

    const actionTypes: Record<operatorTypes, any> = {
      eq: userResponse?.response[0] === value,
      gt: Number(userResponse?.response[0]) > Number(value),
      includes: userResponse?.response.includes(value as string),
      lt: Number(userResponse?.response[0]) < Number(value),
      ne: userResponse?.response[0] !== value,
      not_include: !userResponse?.response.includes(value as string),
    };

    const fallAction: Record<endFunction, any> = {
      disable_btn: setLogicData({ ...logicData, disableBtn: Number(endValue) }),
      goto: setLogicData({ ...logicData, goTo: fallBack }),
    };

    if (!actionTypes[operator]) {
      fallAction[endFunction];
      return;
    }

    return () => setLogicData({ disableBtn: 0, goTo: "" });
  }, [userResponse?.response]);

  useEffect(() => {
    setIsLastBlock(blockList?.[blockList?.length - 1] === qs.block);

    return () => setIsLastBlock(false);
  }, [qs.block]);

  return (
    <div className={cn(className, "flex items-center")}>
      <Hint
        element={
          <Button
            disabled={currentBlockIndex === 0}
            onClick={() => {
              setAction("prev");
              navigateToBlock(
                navigate,
                currentBlockIndex as number,
                id,
                blockList,
                "prev"
              );
            }}
            className={cn(
              "rounded-tr-none rounded-br-none rounded-none rounded-tl-sm rounded-bl-sm",
              allStyles.button[surveyDesign?.button ?? "GREEN"]
            )}
            size="sm"
          >
            <ChevronUpIcon size={18} />
          </Button>
        }
        content="Prev Page"
      />
      <Hint
        element={
          <Button
            onClick={() => {
              if (
                isRequired &&
                !getSurveyAnswer(blockID ?? "")?.response.length
              ) {
                return toast({
                  title: "Error",
                  description:
                    "This question is required, therefore it has to be answered before proceeding.",
                  variant: "destructive",
                });
              }

              navigateToBlock(
                navigate,
                currentBlockIndex as number,
                id,
                blockList,
                "next"
              );
              setAction("next");
            }}
            className={cn(
              "rounded-tl-none rounded-bl-none rounded-tr-sm rounded-br-sm",
              allStyles.button[surveyDesign?.button ?? "GREEN"]
            )}
            size="sm"
            // variant="base"
          >
            <ChevronDownIcon size={18} />
          </Button>
        }
        content="Next Page"
      />
    </div>
  );
};
