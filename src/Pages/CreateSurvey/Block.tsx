import { useSurveyWorkSpace } from "../../provider";
import { BlockToolProps } from "../../Types/survey.types";
import { Card, CardContent } from "../../components/Card";
import {
  ChoicesBlockStyle,
  DateBlockStyle,
  DropdownBlockStyle,
  EmailBlockStyle,
  EndScreenBlockStyle,
  LongTextBlockStlye,
  NumberBlockStlye,
  PhoneNumberBlockStyle,
  PictureBlockStlye,
  QuestionGroupBlockStyle,
  RatingsBlockStyle,
  RedirectURLBlockStyle,
  ShortTextBlockStlye,
  TimeBlockStyle,
  WebsiteBlockStyle,
  WelcomeScreenBlockStyle,
  YesNoBlockStyle,
  mode,
} from "./AllSurveyBlocks";
import { BlockNotFound } from "./BlockNotFound";
import { useGetCurrentBlock } from "../../Hooks/useSurvey";
import { FC } from "react";
import { cn } from "../../lib/utils";
import { allStyles } from "../../constant";

// This function is for development mode
// class MicroFunctions {
//   block: ISurveyBlocks;
//   constructor(block: ISurveyBlocks) {
//     this.block = block;
//   }

//   get show_label() {
//     return this.block?.block_type === "WelcomeScreen"
//       ? this.block?.welcome_screen.message
//       : this.block?.block_type === "EndScreen"
//       ? this.block?.end_screen.message
//       : this.block?.label;
//   }
// }

export const Block: FC<{ mode: mode }> = ({ mode }) => {
  const { survey_blocks, surveyDesign } = useSurveyWorkSpace();
  const blocks = useGetCurrentBlock();

  // const _ = block ? new MicroFunctions(data) : null;
  // const showLabel = _?.show_label || "";

  const view: Record<BlockToolProps, any> = {
    WelcomeScreen: WelcomeScreenBlockStyle,
    ShortText: ShortTextBlockStlye,
    LongText: LongTextBlockStlye,
    EndScreen: EndScreenBlockStyle,
    Website: WebsiteBlockStyle,
    QuestionGroup: QuestionGroupBlockStyle,
    Number: NumberBlockStlye,
    YesNo: YesNoBlockStyle,
    PhoneNumber: PhoneNumberBlockStyle,
    Choices: ChoicesBlockStyle,
    Email: EmailBlockStyle,
    DropDown: DropdownBlockStyle,
    PictureChoice: PictureBlockStlye,
    Rating: RatingsBlockStyle,
    RedirectToURL: RedirectURLBlockStyle,
    Time: TimeBlockStyle,
    Date: DateBlockStyle,
  };

  if (!survey_blocks?.length)
    return (
      <BlockNotFound
        title="No Block Available"
        message="Hey! Why don't you start by adding some block to your workspace."
        className="h-full w-full flex justify-center flex-col"
      />
    );

  const View =
    view[blocks?.block_type as BlockToolProps] ?? WelcomeScreenBlockStyle;

  return (
    <Card
      className={cn(
        "p-0 w-full h-full",
        allStyles.border_radius[surveyDesign?.border_radius ?? "MEDIUM"]
      )}
    >
      <CardContent
        className={cn(
          "p-2 w-full flex items-center justify-center h-full",
          allStyles.color[surveyDesign?.color ?? "GREEN"],
          allStyles.font_size[surveyDesign?.font_size ?? "MEDIUM"]
        )}
      >
        {/* <div className="w-full h-full flex gap-2"> */}
        <div className="w-full h-full items-center flex overflow-auto px-5">
          <View mode={mode} />
        </div>
        {/* </div> */}
      </CardContent>
    </Card>
  );
};
