// import React from 'react'

import { FC, useEffect, useState, useTransition } from "react";
import { Combobox } from "../../components/ComboBox";
import {
  BlockToolProps,
  ICustomLogicConditions,
  ISurveyDesign,
  ISurveyFont,
  ISurveySettings,
  background_pattern,
  colorVariant,
  endFunction,
  operatorTypes,
  sizeVariant,
} from "../../Types/survey.types";
import { app_config, combo_box_type } from "../../Types/components.types";
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
import { useGetCurrentBlock } from "../../Hooks/useSurvey";
import { Description } from "../ExplorePage/QuickQuiz";
import { SurveyWorkSpace } from "../../Functions/surveyApis";
import { useComingSoonProps, useSurveyWorkSpace } from "../../provider";
import { errorMessageForToast, generateUUID } from "../../Functions";
import { AxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { Toggle } from "../../components/Toggle";
import { cn } from "../../lib/utils";
import Hint from "../../components/Hint";
import { allStyles, backgroundPatterns } from "../../constant";
import { Img } from "react-image";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/DialogModal";
import {
  AlertCircleIcon,
  ChevronRightIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../../components/Alert";
import { Switch } from "../../components/Switch";
import { Badge } from "../../components/Badge";
import { Button } from "../../components/Button";
import { DatePicker } from "../../components/DatePicker";
import { Textarea } from "../../components/TextArea";
import { DeleteSurvey } from "./DeleteSurvey";
import { useNavigate } from "react-router-dom";
import { Input } from "../../components/Input";
import { useDebounce, useWindowSize } from "@uidotdev/usehooks";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../../components/Drawer";
import EmptyState from "../../components/App/EmptyState";
import Image from "../../assets/logicBlocks.svg";
import { toast } from "../../components/use-toaster";

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
    value: "HELVETICA",
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

  console.log(surveyDesign);

  useEffect(() => {
    if (!surveyDesign?.font_family) {
      return;
    }

    setValue(surveyDesign?.font_family);

    return () => setValue("");
  }, [surveyDesign?.font_family]);

  useEffect(() => {
    if (!value) {
      return;
    }

    if (value.toUpperCase() === surveyDesign?.font_family) {
      return;
    }

    const fonts: ISurveyFont[] = [
      "ARIAL",
      "FUTURA",
      "GARAMOND",
      "HELVETICA",
      "JOSEFIN_SANS",
      "SYSTEM",
      "TIMES_NEW_ROMAN",
    ];
    const index = fonts.indexOf(value.toUpperCase() as ISurveyFont);

    const payload: { font_family: ISurveyFont } = {
      font_family: fonts[index],
    };

    const changeFont = async () => {
      setAutoSaveUiProps({
        is_visible: true,
        message: "Loading please wait...",
        status: "loading",
      });
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
          message: errorMessageForToast(
            error as AxiosError<{ message: string }>
          ),
          status: "failed",
        });
      }
    };
    changeFont();
  }, [value]);

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
  const handleChange = async (
    prop: colorVariant | background_pattern,
    type:
      | "color"
      | "button_text"
      | "button"
      | "background_color"
      | "background_pattern"
  ) => {
    setAutoSaveUiProps({
      is_visible: true,
      message: "Loading please wait...",
      status: "loading",
    });

    try {
      await action.editSurveyDesign(surveyDesign?.id!, { [type]: prop });
      setSurveyDesign({
        ...(surveyDesign as ISurveyDesign),
        [type]: prop,
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
                            handleChange(color.type, "button")
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
                  {[
                    ...buttonColorVariant,
                    { color: "bg-white", type: "WHITE" },
                  ].map((color, index) => (
                    <Hint
                      key={index}
                      element={
                        <Toggle
                          variant={"outline"}
                          pressed={surveyDesign?.button_text === color.type}
                          onPressedChange={() =>
                            handleChange(
                              color.type as colorVariant,
                              "button_text"
                            )
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
                  {[
                    ...colorVariant,
                    { color: allStyles.color.WHITE, type: "WHITE" },
                  ].map((color, index) => (
                    <Hint
                      key={index}
                      element={
                        <Toggle
                          variant="outline"
                          pressed={surveyDesign?.color === color.type}
                          onPressedChange={() =>
                            handleChange(color.type as colorVariant, "color")
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
              <div className="flex flex-col gap-2">
                <Label>Background Color</Label>
                <div className="flex items-center gap-2">
                  {[...colorVariant, { color: "bg-white", type: "WHITE" }].map(
                    (color, index) => (
                      <Hint
                        key={index}
                        element={
                          <Toggle
                            variant="outline"
                            pressed={
                              surveyDesign?.background_color === color.type
                            }
                            onPressedChange={() =>
                              handleChange(
                                color.type as colorVariant,
                                "background_color"
                              )
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
                    )
                  )}
                </div>
              </div>
              <div className="w-full flex flex-col gap-2">
                <Label className="">Background Patterns</Label>
                <div className="grid w-full grid-cols-2 gap-2">
                  {backgroundPatterns.map((bg) => (
                    <div
                      onClick={() => handleChange(bg.id, "background_pattern")}
                      className={cn(
                        "w-full hover:border-[2px] cursor-pointer hover:rounded-md hover:border-green-300 hover:p-1 transition-all ease-linear",
                        bg.id === surveyDesign?.background_pattern &&
                          "border-green-300 border-[2px] p-1"
                      )}
                      key={bg.id}
                    >
                      <Img className="w-full h-full" src={bg.image} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export const Logics: FC<{}> = () => {
  const {
    survey,
    survey_blocks,
    setAutoSaveUiProps,
    surveyLogics,
    addSurveyLogics,
  } = useSurveyWorkSpace();
  const action = new SurveyWorkSpace(survey?.id ?? "");
  const [openCustomLogic, setCustomLogic] = useState(false);
  const { width } = useWindowSize();
  const [isPending, startTransition] = useTransition();
  const query = useQueryClient();

  const handleAddLogic = async () => {
    const _id = generateUUID();
    const payload: ICustomLogicConditions = {
      field: "",
      operator: "includes",
      value: "",
      endValue: "",
      endFunction: "disable_btn",
      fallBack: "",
      id: _id,
    };

    if (
      !survey_blocks?.length ||
      surveyLogics.length >= survey_blocks?.length
    ) {
      return setAutoSaveUiProps({
        is_visible: true,
        message: "You cannot add any more logics",
        status: "failed",
      });
    }

    addSurveyLogics(payload);
  };

  const saveLogics = async () => {
    if (!surveyLogics.length) {
      return;
    }

    setAutoSaveUiProps({
      is_visible: true,
      message: "Loading please wait ...",
      status: "loading",
    });

    try {
      await action.saveLogics(surveyLogics);
      await query.invalidateQueries({ queryKey: ["survey", survey?.id] });
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

  const modalUis = {
    classNames: {
      height:
        "h-[17rem] md:h-[14rem] flex flex-col p-2 md:p-0 gap-3 overflow-auto",
      title: "text-green-500",
    },
    buttonTrigger: (
      <Button variant="base" className="w-full">
        Add Custom Logics
      </Button>
    ),
    header: {
      title: "Conditional Logic Builder",
      description:
        "Define rules that control how your survey behaves based on user responses. Show/hide questions, pre-populate answers, and create a dynamic survey experience.",
    },
    Btn: {
      closeBtn: (
        <Button
          disabled={isPending}
          onClick={() =>
            startTransition(() => {
              saveLogics();
            })
          }
          className="w-full h-[3rem]"
          variant="base"
        >
          Save
        </Button>
      ),
      addLogic: (
        <Button
          onClick={handleAddLogic}
          className="flex text-green-500 py-3 hover:bg-green-100 hover:text-green-500 items-center gap-1 w-fit"
          size="sm"
          variant="ghost"
        >
          <PlusIcon size={17} />
          Add Logic
        </Button>
      ),
    },
  };

  return (
    <div className="flex flex-col md:mt-5 mt-9 items-center gap-3 w-full">
      <Img
        alt="Logic Blocks"
        src={Image}
        className="w-[80%] md:h-auto h-[15rem]"
      />
      {/* Desktop Dialog */}
      {Number(width) > 767 ? (
        <Dialog open={openCustomLogic} onOpenChange={(e) => setCustomLogic(e)}>
          <DialogTrigger className="md:flex hidden w-full">
            {modalUis.buttonTrigger}
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className={modalUis.classNames.title}>
                {modalUis.header.title}
              </DialogTitle>
              <DialogDescription>
                {modalUis.header.description}
              </DialogDescription>
            </DialogHeader>
            <div className={modalUis.classNames.height}>
              {!surveyLogics.length ? (
                <EmptyState
                  imageClassName="w-[8rem]"
                  state="add_a_note"
                  message=""
                />
              ) : (
                surveyLogics.map((logic) => (
                  <LogicUI key={logic.id} {...logic} />
                ))
              )}
              {modalUis.Btn.addLogic}
            </div>
            <DialogFooter>
              <DialogClose asChild>{modalUis.Btn.closeBtn}</DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={openCustomLogic} onOpenChange={(e) => setCustomLogic(e)}>
          <DrawerTrigger className="md:hidden flex w-full">
            {modalUis.buttonTrigger}
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle className={modalUis.classNames.title}>
                {modalUis.header.title}
              </DrawerTitle>
              <DrawerDescription>
                {modalUis.header.description}
              </DrawerDescription>
            </DrawerHeader>
            <div className={modalUis.classNames.height}>
              {!surveyLogics.length ? (
                <EmptyState
                  imageClassName="w-[8rem]"
                  state="add_a_note"
                  message=""
                />
              ) : (
                surveyLogics.map((logic) => (
                  <LogicUI key={logic.id} {...logic} />
                ))
              )}
              {modalUis.Btn.addLogic}
            </div>
            <DrawerFooter>
              <DrawerClose asChild>{modalUis.Btn.closeBtn}</DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}

      {/* A drawer on mobile */}
    </div>
  );
};

export const LogicUI: FC<ICustomLogicConditions> = ({
  field,
  operator,
  endValue,
  value: v,
  endFunction,
  id,
}) => {
  const {
    survey,
    survey_blocks,
    removeSurveyLogic,
    editSurveyLogic,
    setAutoSaveUiProps,
  } = useSurveyWorkSpace();
  const [block_id, setBlock_id] = useState(field);
  const action = new SurveyWorkSpace(survey?.id ?? "");
  const [condition, setCondition] = useState<operatorTypes>(operator);
  const [fallbackBlock, setFallBackBlock] = useState<string>("");
  const [functionName, setFunctionName] = useState<endFunction>(endFunction);

  // This handles the input change of the user i.e value or endValue
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value: v } = e.target;
    editSurveyLogic({ [name]: v }, id);
  };

  /* The above code is using TypeScript and React to create an array of objects based on the
`survey_blocks` array. It is mapping over each `block` in the `survey_blocks` array and creating a
new object for each block with a `value` property set to the `id` of the block and a `label`
property set to a combination of the `block_type` and `index` of the block. The resulting array is
then cast as `combo_box_type<string>[]`. */
  const fields = survey_blocks?.map((block) => ({
    value: block.id,
    label: block.block_type + " " + block.index,
  })) as combo_box_type<string>[];

  const conditions: combo_box_type<operatorTypes>[] = [
    {
      value: "eq",
      label: "Equal",
    },
    {
      value: "gt",
      label: "Greater than",
    },
    {
      value: "includes",
      label: "Includes",
    },
    {
      value: "lt",
      label: "Less than",
    },
    {
      value: "ne",
      label: "Not equal to",
    },
  ];

  const conditionFunctions: combo_box_type<endFunction>[] = [
    {
      value: "disable_btn",
      label: "Disable button for",
    },
    {
      value: "goto",
      label: "Go to",
    },
  ];

  /* The above code is defining an object `functionReturn` with two properties: `goto` and
  `disable_btn`. Each property contains an element (a React component) with specific props such as
  `Combobox` and `Input`. The `Combobox` component is used for selecting a block to return to, while
  the `Input` component is used for inputting seconds to disable a button for. */
  const functionReturn: Record<endFunction, any> = {
    goto: {
      element: (
        <Combobox
          className="w-[42%]"
          popoverClassName="w-[180px]"
          data={fields}
          title="Select Block to return to"
          value={fallbackBlock}
          setValue={setFallBackBlock}
          search=""
          setSearch={() => {}}
        />
      ),
    },
    disable_btn: {
      element: (
        <Input
          value={endValue}
          name="endValue"
          onChange={handleChange}
          placeholder="Input seconds to disable button for"
          className="w-[42%]"
        />
      ),
    },
  };

  /**
   * The `handleRemoveLogic` function calls the `removeSurveyLogic` function with the `id` parameter.
   */
  const handleRemoveLogic = async () => {
    try {
      await action.deleteLogics(id);
      removeSurveyLogic(id);
    } catch (error) {
      setAutoSaveUiProps({
        is_visible: true,
        message: errorMessageForToast(error as AxiosError<{ message: string }>),
        status: "failed",
      });
    }
  };

  /* The above code is a `useEffect` hook in a TypeScript React component. It runs a function
  `editSurveyLogic` when any of the dependencies (`functionName`, `fallbackBlock`, `condition`,
  `block_id`) change. It first checks if all the dependencies are of type string, and if not, it
  returns early. If all dependencies are strings, it calls `editSurveyLogic` with specific
  parameters based on the values of `functionName`, `fallbackBlock`, `condition`, `block_id`, and
  `id`. */
  useEffect(() => {
    const all = functionName && fallbackBlock && condition && block_id;

    if (typeof all !== "string") {
      return;
    }

    editSurveyLogic(
      {
        endFunction: functionName,
        operator: condition,
        field: block_id,
        fallBack: fallbackBlock,
      },
      id
    );
  }, [functionName, fallbackBlock, condition, block_id]);

  return (
    <div className="w-full flex flex-col gap-2 bg-gray-200 dark:bg-slate-900 rounded-md p-2">
      <div className="w-full flex items-center gap-2">
        {/* Block type */}
        <Combobox
          className="w-[33%]"
          popoverClassName="w-[180px]"
          data={fields}
          title="Select Field"
          value={block_id}
          setValue={setBlock_id}
          search=""
          setSearch={() => {}}
        />
        {/* The condition the admin wants to check with. */}
        <Combobox
          className="w-[33%]"
          popoverClassName="w-[180px]"
          title="Select Condition"
          data={conditions}
          value={condition}
          // @ts-ignore
          setValue={setCondition}
          search=""
          setSearch={() => {}}
        />
        <Input
          placeholder="Expected User Input"
          value={v}
          name="value"
          onChange={handleChange}
          className="w-[33%]"
        />
      </div>
      <div className="w-full flex gap-2">
        <Combobox
          className="w-[50%]"
          popoverClassName="w-[230px]"
          title="Select Function"
          data={conditionFunctions}
          value={functionName}
          // @ts-ignore
          setValue={setFunctionName}
          search=""
          setSearch={() => {}}
        />
        {functionReturn[functionName]?.element ??
          functionReturn["goto"].element}
        <Button
          onClick={handleRemoveLogic}
          variant="destructive"
          className="w-[8%]"
        >
          <Trash2Icon size={18} />
        </Button>
      </div>
    </div>
  );
};

export const SurveySettings: FC<{}> = () => {
  const {
    setDescription,
    setFeatureName,
    setIsVisible,
    setJoinWaitList,
    setType,
  } = useComingSoonProps();
  const {
    survey,
    surveySettings,
    setSurveySettings,
    setAutoSaveUiProps,
    setSurvey,
  } = useSurveyWorkSpace();
  const [date, setDate] = useState<Date | undefined>();
  const [password, setPassword] = useState("");
  const action = new SurveyWorkSpace(survey?.id ?? "");
  const [surveyName, setSurveyName] = useState("");
  const delaySurveyName = useDebounce(surveyName, 3000);
  const navigate = useNavigate();
  const [accessAndSchedulingData, setAccessAndSchedulingData] = useState({
    show_progress_bar: false,
    show_question_number: false,
    free_form_navigation: true,
    schedule_close_date: false,
    set_response_limit: false,
    set_close_message: false,
    close_message: "",
  });
  const accessAndScheduling = [
    {
      id: 1,
      display_text: "Schedule Close Date",
      isAvailable: true,
      type: "schedule_close_date",
    },
    {
      id: 2,
      display_text: "Set a response limit",
      isAvailable: false,
      type: "set_response_limit",
    },
    {
      id: 3,
      display_text: "Show Custom Close Message",
      isAvailable: true,
      type: "set_close_message",
    },
  ];
  const [isCopied, setIsCopied] = useState(false);

  const surveyPath = import.meta.env.VITE_QUIZLY_HOST + "/survey/" + survey?.id;

  const handleCopy = () => {
    if (survey?.status === "DEVELOPMENT") {
      return;
    }

    navigator.clipboard.writeText(surveyPath).then(() => {
      setIsCopied(true);
      toast({
        title: "Success",
        description: "Your link has been copied",
      });
    });
  };

  const changeSurveyStatus = async () => {
    if (!password) {
      return setAutoSaveUiProps({
        is_visible: true,
        message: "Input your password before changing the survey status.",
        status: "failed",
      });
    }

    if (survey?.status === "DEVELOPMENT") {
      return setAutoSaveUiProps({
        is_visible: true,
        message: "This survey is already in DEVELOPMENT",
        status: "failed",
      });
    }

    try {
      await action.publishSurvey(password, "DEVELOPMENT");
      survey && setSurvey({ ...survey, status: "DEVELOPMENT" });
      setAutoSaveUiProps({
        is_visible: true,
        message: survey?.name + " status has been changed.",
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

  const handleSave = async () => {
    const payload: Partial<ISurveySettings> = {
      set_response_limit: accessAndSchedulingData?.set_response_limit,
      set_close_message: accessAndSchedulingData?.set_close_message,
      schedule_close_date: accessAndSchedulingData?.schedule_close_date,
      close_message: accessAndSchedulingData.close_message,
      // @ts-ignore
      close_date: null ?? date,
    };

    try {
      await action.editSurveySettings(surveySettings?.id ?? 0, payload);
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

  const handleChange = async (
    e: boolean,
    type:
      | "show_progress_bar"
      | "show_question_number"
      | "free_form_navigation"
      | "schedule_close_date"
      | "set_response_limit"
      | "set_close_message"
  ) => {
    if (type === "set_response_limit" && e) {
      setDescription(
        "This feature will allow you to set the number of response you need on a survey after the response has been satisfied no response will be store again."
      );
      setFeatureName("Set Response Limit For Survey");
      setJoinWaitList(true);
      setIsVisible(true);
      setType("SET_RESPONSE_LIMIT");

      return;
    }

    if (!surveySettings) {
      return setAutoSaveUiProps({
        is_visible: true,
        message: "Something went wrong please try again",
        status: "failed",
      });
    }

    const payload = {
      [type]: e,
    };

    setSurveySettings({
      ...surveySettings,
      ...payload,
    });

    if (
      type === "set_response_limit" ||
      type === "schedule_close_date" ||
      type === "set_close_message"
    ) {
      return;
    }

    setAutoSaveUiProps({
      is_visible: true,
      message: "Loading please wait...",
      status: "loading",
    });

    try {
      await action.editSurveySettings(surveySettings.id, payload);
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

  const handleNavigationAfterDelete = () => {
    navigate(app_config.create_survey);
  };

  useEffect(() => {
    if (delaySurveyName === survey?.name || !delaySurveyName) {
      return;
    }

    const handleNameChange = async () => {
      setAutoSaveUiProps({
        is_visible: true,
        message: "",
        status: "loading",
      });

      if (!survey) {
        return setAutoSaveUiProps({
          is_visible: true,
          message: "Something went wrong please try again.",
          status: "failed",
        });
      }

      try {
        await action.modifySurvey({ name: delaySurveyName });
        setSurvey({
          ...survey,
          name: delaySurveyName,
        });
        setAutoSaveUiProps({
          is_visible: true,
          message: app_config.AppName + " has auto-save your progress.",
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

    handleNameChange();
  }, [delaySurveyName]);

  useEffect(() => {
    if (!surveySettings) {
      return;
    }

    const {
      show_progress_bar,
      show_question_number,
      set_close_message,
      set_response_limit,
      schedule_close_date,
      free_form_navigation,
      close_message,
      close_date,
    } = surveySettings;

    setAccessAndSchedulingData({
      ...accessAndSchedulingData,
      free_form_navigation,
      set_close_message,
      schedule_close_date,
      set_response_limit,
      show_progress_bar,
      show_question_number,
      close_message: close_message as string,
    });

    // @ts-ignore
    setDate(close_date);

    return () => {
      setAccessAndSchedulingData({
        ...accessAndSchedulingData,
        show_progress_bar: false,
        show_question_number: false,
        free_form_navigation: true,
        schedule_close_date: false,
        set_response_limit: false,
        set_close_message: false,
        close_message: "",
      });
      setDate(undefined);
    };
  }, [surveySettings]);

  useEffect(() => {
    survey?.name && setSurveyName(survey.name);

    return () => setSurveyName("");
  }, [survey]);
  return (
    <div className="mt-5 pb-16 flex flex-col gap-5 w-full">
      <Dialog>
        <DialogTrigger className="w-full flex items-center justify-between">
          <h1 className="hover:text-green-500">Access & Schedule</h1>
          <ChevronRightIcon className="text-green-500" />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-green-500">
              Access and Scheduling
            </DialogTitle>
            <Alert className="mt-5">
              <AlertCircleIcon className="text-yellow-500" />
              <AlertTitle className="text-left">Important</AlertTitle>
              <AlertDescription className="text-left">
                Please note that not all the features are below are available
                yet.
              </AlertDescription>
            </Alert>
          </DialogHeader>
          <div className="w-full flex flex-col gap-4">
            {accessAndScheduling.map((as) => (
              <div key={as.id} className="flex flex-col gap-2">
                <div className="flex items-center shadow-sm px-2 rounded-md cursor-pointer py-4 hover:shadow-md transition-all justify-between w-full">
                  <div className="flex items-center gap-2">
                    <Label htmlFor={as.type}>{as.display_text}</Label>
                    {!as.isAvailable && (
                      <Badge variant="warning">Unavailable</Badge>
                    )}
                  </div>
                  <Switch
                    checked={
                      accessAndSchedulingData[as.type as "set_response_limit"]
                    }
                    onCheckedChange={(e) =>
                      handleChange(e, as.type as "set_response_limit")
                    }
                    id={as.type}
                  />
                </div>
                {accessAndSchedulingData.schedule_close_date &&
                  as.type === "schedule_close_date" && (
                    <DatePicker
                      className="w-full h-[3rem]"
                      // @ts-ignore
                      date={new Date(date)}
                      setDate={setDate}
                      format="PPP"
                    />
                  )}
                {accessAndSchedulingData.set_close_message &&
                  as.type === "set_close_message" && (
                    <div className="flex w-full flex-col gap-2">
                      <Textarea
                        value={accessAndSchedulingData.close_message}
                        onChange={(e) =>
                          setAccessAndSchedulingData({
                            ...accessAndSchedulingData,
                            close_message: e.target.value,
                          })
                        }
                        className="w-full resize-none"
                      />
                      <Description
                        text="You can use <b>, <strong>, <h1> and <p> tag here."
                        className=""
                      />
                    </div>
                  )}
              </div>
            ))}
          </div>
          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button onClick={handleSave} variant="base">
                Save
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="w-full flex items-center justify-between">
        <Label>Show Progress Bar</Label>
        <Switch
          checked={accessAndSchedulingData.show_progress_bar}
          onCheckedChange={(e) => handleChange(e, "show_progress_bar")}
        />
      </div>
      <div className="w-full flex items-center justify-between">
        <Label>Free Form Navigation</Label>
        <Switch
          checked={accessAndSchedulingData.free_form_navigation}
          onCheckedChange={(e) => handleChange(e, "free_form_navigation")}
        />
      </div>
      <div className="w-full flex items-center justify-between">
        <Label>Question Number</Label>
        <Switch
          checked={accessAndSchedulingData.show_question_number}
          onCheckedChange={(e) => handleChange(e, "show_question_number")}
        />
      </div>
      <Input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        type="password"
        className="h-[3rem]"
      />
      <div className="w-full flex items-center justify-between">
        <Label>Back To DEVELOPMENT</Label>
        <Switch
          checked={survey?.status === "PRODUCTION"}
          onCheckedChange={changeSurveyStatus}
        />
      </div>
      <Input
        value={surveyName}
        onChange={(e) => setSurveyName(e.target.value)}
        placeholder="Change Survey Name"
        className="w-full h-[3rem]"
      />
      <Button
        disabled={survey?.status === "DEVELOPMENT"}
        onClick={handleCopy}
        variant="base"
        className="w-full h-[3rem]"
      >
        {isCopied ? "Link Copied" : "Copy Survey Link"}
      </Button>
      <DeleteSurvey
        className="w-full"
        participants={survey?.response_count ?? 0}
        id={survey?.id ?? ""}
        name={survey?.name ?? ""}
        onDelete={handleNavigationAfterDelete}
      >
        <Button className="h-[3rem] w-full" variant="destructive">
          Delete
        </Button>
      </DeleteSurvey>
    </div>
  );
};
