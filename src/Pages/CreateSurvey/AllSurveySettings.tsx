// import React from 'react'

import { FC, useEffect, useState } from "react";
import { Combobox } from "../../components/ComboBox";
import {
  BlockToolProps,
  ISurveyDesign,
  ISurveyFont,
  colorVariant,
  sizeVariant,
} from "../../Types/survey.types";
import {
  app_config,
  combo_box_type,
  uploaderProps,
} from "../../Types/components.types";
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
import { SurveyWorkSpace } from "../../Functions/surveyApis";
import { useSurveyWorkSpace } from "../../provider";
import { errorMessageForToast } from "../../Functions";
import { AxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "../../components/Button";
import { Toggle } from "../../components/Toggle";
import { cn } from "../../lib/utils";
import Hint from "../../components/Hint";

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
    value: "ARIAL",
    label: "Arial",
  },
  {
    value: "FUTURA",
    label: "Futura",
  },
  {
    value: "GARAMOND",
    label: "Garamond",
  },
  {
    value: "HELVETIA",
    label: "Helvetia",
  },
  {
    value: "JOSEFIN_SANS",
    label: "Josefin Sans",
  },
  {
    value: "SYSTEM",
    label: "System Font",
  },
  {
    value: "TIMES_NEW_ROMAN",
    label: "Times New Roman",
  },
];

export const SurveyQuestions: FC<{}> = () => {
  const b = useGetCurrentBlock();
  const { survey, setAutoSaveUiProps } = useSurveyWorkSpace();
  const action = new SurveyWorkSpace(survey?.id ?? "");

  const [value, setValue] = useState("");
  const [search, setSearch] = useState("");
  const query = useQueryClient();

  useEffect(() => {
    if (!b) {
      return setValue("");
    }

    setValue(b?.block_type.toLowerCase() as string);

    return () => setValue("");
  }, [b?.block_type]);

  useEffect(() => {
    if (value && b?.block_type.toLowerCase() !== value.toLowerCase()) {
      const _block_type: BlockToolProps[] = [
        "Choices",
        "Date",
        "DropDown",
        "Email",
        "EndScreen",
        "LongText",
        "ShortText",
        "Number",
        "PictureChoice",
        "Rating",
        "QuestionGroup",
        "RedirectToURL",
        "Time",
        "Website",
        "WelcomeScreen",
        "YesNo",
      ];

      const av = _block_type.find(
        (v) => v.toLowerCase() === value.toLowerCase()
      );

      if (!av) return;

      const index = _block_type.indexOf(av);

      const changeBlock = async () => {
        try {
          setAutoSaveUiProps({
            is_visible: true,
            message: "Please wait saving your progress.",
            status: "loading",
          });
          await action.changeBlockToPreferred({
            old_block: {
              index: b?.index ?? 0,
              block_type: b?.block_type as BlockToolProps,
              id: b?.id ?? "",
            },
            new_block: { block_type: _block_type[index] },
          });
          await query.invalidateQueries({ queryKey: ["survey", survey?.id] });
          setAutoSaveUiProps({
            is_visible: true,
            message: app_config.AppName + " has auto-save your progress",
            status: "success",
          });
        } catch (error) {
          setAutoSaveUiProps({
            is_visible: true,
            message: errorMessageForToast(
              error as AxiosError<{ message: string }>
            ),
            status: "failed",
          });
        }
      };

      changeBlock();
    }
  }, [value]);

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
  const borderRadiusSizes: { display_text: string; type: sizeVariant }[] = [
    {
      display_text: "SM",
      type: "SMALL",
    },
    {
      display_text: "MD",
      type: "MEDIUM",
    },
    {
      display_text: "LG",
      type: "LARGE",
    },
  ];
  const colorVariant: {
    color: string;
    type: "GREEN" | "BLUE" | "YELLOW";
  }[] = [
    {
      color: "bg-green-300",

      type: "GREEN",
    },
    {
      color: "bg-yellow-300",

      type: "YELLOW",
    },
    {
      color: "bg-blue-300",

      type: "BLUE",
    },
  ];
  const buttonColorVariant: {
    color: string;
    type: colorVariant;
  }[] = [
    {
      color: "bg-green-300",

      type: "GREEN",
    },
    {
      color: "bg-yellow-300",

      type: "YELLOW",
    },
    {
      color: "bg-blue-300",

      type: "BLUE",
    },
  ];

  const { survey, surveyDesign, setSurveyDesign, setAutoSaveUiProps } =
    useSurveyWorkSpace();
  const action = new SurveyWorkSpace(survey?.id ?? "");
  const [value, setValue] = useState("");
  const [search, setSearch] = useState("");
  const [imageData, setImageData] = useState<uploaderProps>({
    files: [],
    previewUrl: [],
  });

  useEffect(() => {
    if (!surveyDesign?.font_family) {
      return;
    }

    setValue(surveyDesign?.font_family);

    return () => setValue("");
  }, [surveyDesign]);

  const handleBorderRadiusChange = async (prop: sizeVariant) => {
    setAutoSaveUiProps({
      is_visible: true,
      message: "Loading please wait...",
      status: "loading",
    });
    try {
      await action.editSurveyDesign(surveyDesign?.id!, { border_radius: prop });
      setSurveyDesign({
        ...(surveyDesign as ISurveyDesign),
        border_radius: prop,
      });
      setAutoSaveUiProps({
        is_visible: true,
        message: app_config.AppName + " has auto-save your progress.",
        status: "success",
      });
    } catch (error) {
      setAutoSaveUiProps({
        is_visible: true,
        message: errorMessageForToast(error as AxiosError<{ message: string }>),
        status: "failed",
      });
    }
  };
  const handleButtonTextColorChange = async (prop: colorVariant) => {
    setAutoSaveUiProps({
      is_visible: true,
      message: "Loading please wait...",
      status: "loading",
    });
    try {
      await action.editSurveyDesign(surveyDesign?.id!, { button_text: prop });
      setSurveyDesign({
        ...(surveyDesign as ISurveyDesign),
        button_text: prop,
      });
      setAutoSaveUiProps({
        is_visible: true,
        message: app_config.AppName + " has auto-save your progress.",
        status: "success",
      });
    } catch (error) {
      setAutoSaveUiProps({
        is_visible: true,
        message: errorMessageForToast(error as AxiosError<{ message: string }>),
        status: "failed",
      });
    }
  };
  const handleColorChange = async (prop: colorVariant) => {
    setAutoSaveUiProps({
      is_visible: true,
      message: "Loading please wait...",
      status: "loading",
    });
    try {
      await action.editSurveyDesign(surveyDesign?.id!, { color: prop });
      setSurveyDesign({
        ...(surveyDesign as ISurveyDesign),
        color: prop,
      });
      setAutoSaveUiProps({
        is_visible: true,
        message: app_config.AppName + " has auto-save your progress.",
        status: "success",
      });
    } catch (error) {
      setAutoSaveUiProps({
        is_visible: true,
        message: errorMessageForToast(error as AxiosError<{ message: string }>),
        status: "failed",
      });
    }
  };
  const handleButtonColorChange = async (prop: colorVariant) => {
    setAutoSaveUiProps({
      is_visible: true,
      message: "Loading please wait...",
      status: "loading",
    });
    const payload = {
      button: prop,
    };
    try {
      await action.editSurveyDesign(surveyDesign?.id!, payload);
      setSurveyDesign({
        ...(surveyDesign as ISurveyDesign),
        ...payload,
      });
      setAutoSaveUiProps({
        is_visible: true,
        message: app_config.AppName + " has auto-save your progress.",
        status: "success",
      });
    } catch (error) {
      setAutoSaveUiProps({
        is_visible: true,
        message: errorMessageForToast(error as AxiosError<{ message: string }>),
        status: "failed",
      });
    }
  };

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
              <div className="flex flex-col gap-2">
                <Label>Button</Label>
                <div className="flex items-center gap-2">
                  {colorVariant.map((color, index) => (
                    <Hint
                      key={index}
                      element={
                        <Toggle
                          pressed={surveyDesign?.color === color.type}
                          onPressedChange={() =>
                            handleButtonColorChange(color.type)
                          }
                          className={cn(
                            "cursor-pointer hover:bg-current hover:text-accent-foreground h-[2rem] w-[2rem] rounded-full",
                            color.color
                          )}
                          size="sm"
                        />
                      }
                      content={color.type}
                    />
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Button Text</Label>
                <div className="flex items-center gap-2">
                  {buttonColorVariant.map((color, index) => (
                    <Hint
                      key={index}
                      element={
                        <Toggle
                          variant={"outline"}
                          pressed={surveyDesign?.button_text === color.type}
                          onPressedChange={() =>
                            handleButtonTextColorChange(color.type)
                          }
                          className={cn(
                            "cursor-pointer hover:bg-current p-[2px] hover:text-accent-foreground h-[2rem] w-[2rem] rounded-full",
                            color.color
                          )}
                          size="sm"
                        />
                      }
                      content={color.type}
                    />
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Questions</Label>
                <div className="flex items-center gap-2">
                  {colorVariant.map((color, index) => (
                    <Hint
                      key={index}
                      element={
                        <Toggle
                          pressed={surveyDesign?.color === color.type}
                          onPressedChange={() => handleColorChange(color.type)}
                          className={cn(
                            "cursor-pointer hover:bg-current hover:text-accent-foreground h-[2rem] w-[2rem] rounded-full",
                            color.color
                          )}
                          size="sm"
                        />
                      }
                      content={color.type}
                    />
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Border Radius</Label>
                <div className="flex items-center gap-2">
                  {borderRadiusSizes.map((brs, index) => (
                    <Toggle
                      key={index}
                      variant="outline"
                      pressed={surveyDesign?.border_radius === brs.type}
                      onPressedChange={() => handleBorderRadiusChange(brs.type)}
                      className={cn(
                        "",
                        "data-[state=on]:bg-green-200 data-[state=on]:text-green-500"
                      )}
                      size="sm"
                    >
                      {brs.display_text}
                    </Toggle>
                  ))}
                </div>
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
                  button={
                    <Button
                      size="sm"
                      variant="base"
                      className="flex items-center gap-2"
                    >
                      <ImageIcon size={17} />
                      Upload
                    </Button>
                  }
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
