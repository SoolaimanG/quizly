// import React from 'react'

import { FC } from "react";
import { BlockToolProps } from "../../Types/survey.types";
import {
  ChoicesBlock,
  DateBlock,
  DropDownBlock,
  EmailBlock,
  EndScreenBlock,
  LongTextBlock,
  NumberBlock,
  PhoneNumberBlock,
  PictureBlock,
  QuestionGroupBlock,
  RatingBlock,
  RedirectToURLBlock,
  ShortTextBlock,
  TimeBlock,
  WebsiteBlock,
  WelcomeScreenBlock,
  YesNoBlock,
} from "./AllSurveyBlockTools";

export const ContentTools: FC<{
  toolType: BlockToolProps;
  index?: number;
  size?: number;
  hideName?: boolean;
  className?: string;
}> = ({
  toolType: block_type,
  index = 0,
  size = 20,
  hideName = false,
  className,
}) => {
  const _blockTools: Record<BlockToolProps, any> = {
    Email: EmailBlock,
    PhoneNumber: PhoneNumberBlock,
    Website: WebsiteBlock,
    Choices: ChoicesBlock,
    DropDown: DropDownBlock,
    PictureChoice: PictureBlock,
    YesNo: YesNoBlock,
    Rating: RatingBlock,
    LongText: LongTextBlock,
    ShortText: ShortTextBlock,
    Time: TimeBlock,
    Date: DateBlock,
    Number: NumberBlock,
    QuestionGroup: QuestionGroupBlock,
    EndScreen: EndScreenBlock,
    RedirectToURL: RedirectToURLBlock,
    WelcomeScreen: WelcomeScreenBlock,
  };

  const View = _blockTools[block_type];

  return (
    <View index={index} size={size} hideName={hideName} className={className} />
  );
};
