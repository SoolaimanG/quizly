import { FC, SetStateAction, useEffect } from "react";
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

export const SurveyNavigation: FC<{
  className?: string;
  setIsLastBlock: React.Dispatch<SetStateAction<boolean>>;
}> = ({ className, setIsLastBlock }) => {
  const { id } = useParams() as { id: string };
  const { surveyDesign, survey_blocks } = useSurveyWorkSpace();
  const navigate = useNavigate();
  const location = useLocation();
  const { navigate: navigateToBlock, setAction } = useSurveyNavigation();
  const isRequired = useGetCurrentBlock()?.is_required;
  const blockID = useGetCurrentBlock()?.id;

  const qs = queryString.parse(location.search) as { block: string };

  const blockList = survey_blocks?.map((block) => block.id) ?? [];
  const currentID = useGetCurrentBlock()?.id ?? blockList?.[0] ?? "";
  const currentBlockIndex = blockList?.indexOf(currentID);

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
