// import React from 'react'

import { FC, useEffect, useState } from "react";
import { Combobox } from "../../components/ComboBox";
import { BlockToolProps, ISurveyFont } from "../../Types/survey.types";
import { combo_box_type, uploaderProps } from "../../Types/components.types";
import {
  AddWebsiteSettings,
  ChoicesSettings,
  DateSettings,
  DropDownSettings,
  EmailSettings,
  EndSreenSettings,
  LongTextSettings,
  NumberSettings,
  PhoneNumberSettings,
  PictureChoiceSettings,
  RatingSettings,
  RedirectWithURl,
  ShortTextSettings,
  WelcomeBlockSettings,
  YesOrNoSettings,
} from "./AllBlockSettings";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "../../components/Accordion";
import { AccordionContent } from "../../components/App/Accordion";
import { Label } from "../../components/Label";
import { Color } from "../../components/App/Color";
import ImageUploader from "../../components/App/ImageUploader";
import { ImageIcon } from "lucide-react";
import { useGetCurrentBlock } from "../../Hooks/useSurvey";
import { Description } from "../ExplorePage/QuickQuiz";

const _data: combo_box_type<BlockToolProps>[] = [
  {
    value: "Choices",
    label: "Choices",
  },
  {
    value: "Date",
    label: "Date",
  },
  {
    value: "DropDown",
    label: "Drop Down",
  },
  {
    value: "Email",
    label: "Email",
  },
  {
    value: "EndScreen",
    label: "End Screen",
  },
  {
    value: "LongText",
    label: "Long Text",
  },
  {
    value: "Number",
    label: "Number",
  },
  {
    value: "PhoneNumber",
    label: "Phone Number",
  },
  {
    value: "PictureChoice",
    label: "Picture Choices",
  },
  {
    value: "QuestionGroup",
    label: "Question Group",
  },
  {
    value: "Rating",
    label: "Ratings",
  },
  {
    value: "RedirectToURL",
    label: "Redirect To URL",
  },
  {
    value: "ShortText",
    label: "Short Text",
  },
  {
    value: "Time",
    label: "Time",
  },
  {
    value: "Website",
    label: "Website",
  },
  {
    value: "WelcomeScreen",
    label: "Welcome Screen",
  },
  {
    value: "YesNo",
    label: "Yes or No",
  },
];

const __data: combo_box_type<ISurveyFont>[] = [
  {
    value: "Arial",
    label: "Arial",
  },
  {
    value: "Futura",
    label: "Futura",
  },
  {
    value: "Garamond",
    label: "Garamond",
  },
  {
    value: "Helvetia",
    label: "Helvetia",
  },
  {
    value: "Josefin Sans",
    label: "Josefin Sans",
  },
  {
    value: "System Font",
    label: "System Font",
  },
  {
    value: "Times New Roman",
    label: "Times New Roman",
  },
];

export const SurveyQuestions: FC<{}> = () => {
  const b = useGetCurrentBlock();

  const [value, setValue] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!b) return;

    setValue(b.block_type);
  }, [b]);

  if (!b)
    return <Description text="Add a block to edit." className="text-lg" />;

  const Views = {
    Email: EmailSettings,
    PhoneNumber: PhoneNumberSettings,
    Website: AddWebsiteSettings,
    Choices: ChoicesSettings,
    DropDown: DropDownSettings,
    PictureChoice: PictureChoiceSettings,
    YesNo: YesOrNoSettings,
    Rating: RatingSettings,
    LongText: LongTextSettings,
    ShortText: ShortTextSettings,
    Time: "",
    Date: DateSettings,
    Number: NumberSettings,
    QuestionGroup: "",
    EndScreen: EndSreenSettings,
    RedirectToURL: RedirectWithURl,
    WelcomeScreen: WelcomeBlockSettings,
  }[b.block_type];

  return (
    <div>
      <div className="w-full flex flex-col gap-2">
        <h1>Type</h1>
        <Combobox
          popoverClassName="w-[250px]"
          className="w-full"
          data={_data}
          value={value!}
          setSearch={setSearch}
          title={"Change Block Type"}
          search={search}
          // @ts-ignore
          setValue={setValue}
        />
      </div>
      <hr className="mt-2 w-full" />
      <div className="mt-3">
        <h1>Settings</h1>
        <Views className="mt-5" />
      </div>
    </div>
  );
};

export const Designs: FC<{}> = () => {
  const [value, setValue] = useState("");
  const [search, setSearch] = useState("");
  const [imageData, setImageData] = useState<uploaderProps>({
    files: [],
    previewUrl: [],
  });

  return (
    <div>
      <Accordion type="multiple">
        <AccordionItem value="theme">
          <AccordionTrigger>Theme</AccordionTrigger>
          <AccordionContent>
            <Combobox
              className="w-full"
              value={value}
              setValue={setValue}
              setSearch={setSearch}
              search={search}
              title="Select Font"
              data={__data}
            />
            <hr className="mt-3" />
            <div className="flex flex-col mt-5 gap-3">
              <div className="w-full flex items-center justify-between">
                <Label>Questions</Label>
                <Color className="cursor-pointer" />
              </div>
              <div className="w-full flex items-center justify-between">
                <Label>Answers</Label>
                <Color className="cursor-pointer" />
              </div>
              <div className="w-full flex items-center justify-between">
                <Label>Buttons</Label>
                <Color className="cursor-pointer" />
              </div>
              <div className="w-full flex items-center justify-between">
                <Label>Button Text</Label>
                <Color className="cursor-pointer" />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="design">
          <AccordionTrigger>Design</AccordionTrigger>
          <AccordionContent>
            <div className="w-full flex flex-col gap-2">
              <div className="w-full flex items-center justify-between">
                <Label>Background</Label>
                <Color className="cursor-pointer" />
              </div>
              <div className="w-full flex items-center justify-between">
                <Label>Background Image</Label>
                <ImageUploader
                  className="w-fit"
                  button={<ImageIcon size={25} />}
                  maxSize={3}
                  filesToAccept={[".jpg", ".png"]}
                  setData={setImageData}
                  data={imageData}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
export const Logics: FC<{}> = () => {
  return <div>Logics</div>;
};
export const SurveySettings: FC<{}> = () => {
  return <div>SurveySettings</div>;
};
