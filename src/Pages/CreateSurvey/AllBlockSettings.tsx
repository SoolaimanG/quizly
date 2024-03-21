import { FC, useEffect, useState } from "react";
import { Label } from "../../components/Label";
import { Switch } from "../../components/Switch";
import { cn } from "../../lib/utils";
import { Input } from "../../components/Input";
import { useGetCurrentBlock } from "../../Hooks/useSurvey";
import { useSurveyWorkSpace } from "../../provider";
import {
  BlockToolProps,
  EndScreenSocialMedia,
  ISurvey,
  ISurveyBlocks,
  dateFormat,
  socialMediaTypes,
} from "../../Types/survey.types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/AlertModal";
import { AlertDescription } from "../../components/Alert";
import { FullTextEditor } from "../../components/App/FullTextEditor";
import { Button } from "../../components/Button";
import { PlusIcon } from "lucide-react";
import { Combobox } from "../../components/ComboBox";
import { app_config, combo_box_type } from "../../Types/components.types";
import Hint from "../../components/Hint";
import { errorMessageForToast, generateUUID } from "../../Functions";
import { Editor } from "@tiptap/react";
import { SurveyWorkSpace } from "../../Functions/surveyApis";
import { AxiosError } from "axios";
import { useDebounce } from "@uidotdev/usehooks";
import { Description } from "../ExplorePage/QuickQuiz";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/DialogModal";

export const WelcomeBlockSettings: FC<{ className?: string }> = ({
  className,
}) => {
  const b = useGetCurrentBlock(); //Current block
  const { setSurveyBlocks, survey_blocks, survey, setSurvey } =
    useSurveyWorkSpace();
  const [custom_html, setCustomHtml] = useState("");

  const handleButtonTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const edittedBlocks = survey_blocks?.map((block) =>
      block.id === b?.id
        ? {
            ...block,
            welcome_screen: {
              ...block.welcome_screen,
              button_text: e.target.value,
            },
          }
        : { ...block }
    );
    setSurveyBlocks(edittedBlocks as ISurveyBlocks[]);
  };
  const handleToggleTimeToComplete = (e: boolean) => {
    setSurvey({
      ...(survey as ISurvey),
      show_time_to_complete: e,
      show_number_of_submissions: false,
    });
  };
  const handleNumberOfSubmission = (e: boolean) => {
    setSurvey({
      ...(survey as ISurvey),
      show_number_of_submissions: e,
      show_time_to_complete: false,
    });
  };

  const handleCustomTextChange = (e: Editor) => {
    setCustomHtml(e.getHTML());
  };

  const saveCustomHtml = () => {
    const data = survey_blocks?.map((block) => {
      return block.id === b?.id
        ? { ...block, welcome_screen: { ...block.welcome_screen, custom_html } }
        : { ...block };
    }) as ISurveyBlocks[];

    setSurveyBlocks(data);
  };

  return (
    <div className={cn("w-full flex flex-col gap-4", className)}>
      <div className="w-full flex items-center justify-between">
        <Label htmlFor="time_to_complete">Time to complete</Label>
        <Switch
          checked={survey?.show_time_to_complete}
          onCheckedChange={handleToggleTimeToComplete}
          id="time_to_complete"
        />
      </div>
      <div className="w-full flex items-center justify-between">
        <Label htmlFor="number_of_submissions">Number of submissions</Label>
        <Switch
          checked={survey?.show_number_of_submissions}
          onCheckedChange={handleNumberOfSubmission}
          id="number_of_submissions"
        />
      </div>
      <div>
        <span>Button Text</span>
        <Input
          value={b?.welcome_screen.button_text ?? "Start Survey"}
          onChange={handleButtonTextChange}
          className="mt-2"
        />
      </div>
      <div className="w-full flex items-center justify-between">
        <h1>Custom Text</h1>
        <AlertDialog>
          <AlertDialogTrigger>
            <Button variant="secondary" className="h-8" size="icon">
              <PlusIcon className="text-green-500" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="md:w-[75%]">
            <AlertDialogHeader>
              <AlertDialogTitle>Write Custom Text</AlertDialogTitle>
              <AlertDescription></AlertDescription>
            </AlertDialogHeader>
            <div className="w-full h-[25rem] overflow-auto">
              <FullTextEditor handleChange={handleCustomTextChange} />
            </div>
            <AlertDialogFooter>
              <AlertDialogAction onClick={saveCustomHtml}>
                Save
              </AlertDialogAction>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export const ShortTextSettings: FC<{}> = () => {
  const b = useGetCurrentBlock();
  const { survey_blocks, setSurveyBlocks } = useSurveyWorkSpace();

  const handleMaxNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const new_data = survey_blocks?.map((block) => {
      return block.id === b?.id
        ? {
            ...block,
            short_text: {
              ...block.short_text,
              max_character: Number(e.target.value),
            },
          }
        : { ...block };
    }) as ISurveyBlocks[];

    setSurveyBlocks(new_data);
  };

  const handlePlaceHolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value: place_holder },
    } = e;
    const new_data = survey_blocks?.map((block) => {
      return block.id === b?.id
        ? {
            ...block,
            short_text: {
              ...block.short_text,
              place_holder,
            },
          }
        : { ...block };
    }) as ISurveyBlocks[];

    setSurveyBlocks(new_data);
  };

  return (
    <div className="w-full flex flex-col gap-2 mt-5">
      <Label>Max Character</Label>
      <Input
        value={b?.short_text.max_character ?? 100}
        onChange={handleMaxNumberChange}
        type="number"
      />
      <Label>Place Holder</Label>
      <Input
        value={b?.short_text.place_holder ?? "PlaceHolder"}
        onChange={handlePlaceHolderChange}
        type="text"
      />
      <ToggleIsRequired id={b?.short_text.id!} type="ShortText" />
    </div>
  );
};

export const RatingSettings: FC<{}> = () => {
  const { survey_blocks, setSurveyBlocks } = useSurveyWorkSpace();
  const b = useGetCurrentBlock();

  const [value, setValue] = useState("5");
  const [search, setSearch] = useState("");
  const values: combo_box_type<string>[] = [
    {
      value: "1",
      label: "One",
    },
    {
      value: "2",
      label: "Two",
    },
    {
      value: "3",
      label: "Three",
    },
    {
      value: "4",
      label: "Four",
    },
    {
      value: "5",
      label: "Five",
    },
    {
      value: "6",
      label: "Six",
    },
    {
      value: "7",
      label: "Seven",
    },
    {
      value: "8",
      label: "Eight",
    },
  ];

  const handleRatingLengthChange = (e: string) => {
    const value = Number(e);
    const data = survey_blocks?.map((block) => {
      return block.id === b?.id
        ? { ...block, ratings: { ...block.ratings, ratings_length: value } }
        : { ...block };
    }) as ISurveyBlocks[];
    setSurveyBlocks(data);
  };

  const handleRequiredChange = (
    block_id: string,
    surveyBlocks: ISurveyBlocks[],
    e: boolean,
    setSurveyBlocks: (surveyBlocks: ISurveyBlocks[]) => void
  ) => {
    const data = surveyBlocks.map((block) => {
      return block.id === block_id
        ? { ...block, is_required: e }
        : { ...block };
    });
    setSurveyBlocks(data);
  };

  useEffect(() => {
    handleRatingLengthChange(value);
  }, [value]);

  useEffect(() => {
    setValue(b?.ratings.ratings_length ? b.ratings.ratings_length + "" : "5");
  }, []);

  return (
    <div className="w-full flex flex-col gap-2 mt-3">
      <Label className="w-full flex items-center justify-between">
        Required
        <Switch
          checked={b?.is_required}
          onCheckedChange={(e) => {
            handleRequiredChange(
              b?.id ?? "",
              survey_blocks!,
              e,
              setSurveyBlocks
            );
          }}
        />
      </Label>
      <Combobox
        className="mt-2"
        data={values}
        value={value}
        search={search}
        title="Select Rating Length"
        setValue={setValue}
        setSearch={setSearch}
      />
    </div>
  );
};

export const EndSreenSettings: FC<{}> = () => {
  const b = useGetCurrentBlock();
  const { survey_blocks, setSurveyBlocks } = useSurveyWorkSpace();

  const handleButtonSwitch = (e: boolean) => {
    const data = survey_blocks?.map((block) => {
      return block?.id === b?.id
        ? { ...block, end_screen: { ...block.end_screen, button: e } }
        : { ...block };
    }) as ISurveyBlocks[];

    setSurveyBlocks(data);
  };

  const handleButtonTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    const data = survey_blocks?.map((block) => {
      return block?.id === b?.id
        ? { ...block, end_screen: { ...block.end_screen, button_text: value } }
        : { ...block };
    }) as ISurveyBlocks[];

    setSurveyBlocks(data);
  };

  const handleButtonLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    const data = survey_blocks?.map((block) => {
      return block?.id === b?.id
        ? { ...block, end_screen: { ...block.end_screen, button_link: value } }
        : { ...block };
    }) as ISurveyBlocks[];

    setSurveyBlocks(data);
  };

  const addSocialMedia = () => {
    const socialmedia: socialMediaTypes[] = [
      "email",
      "facebook",
      "instagram",
      "tiktok",
      "twitter",
      "whatsapp",
    ];
    const media_type =
      socialmedia[Math.floor(Math.random() * socialmedia.length)];

    const id = generateUUID();
    const payload: EndScreenSocialMedia = {
      id,
      media_type,
      social_media_link: "",
    };

    const social_media = [...b?.end_screen.social_media!, payload];

    const data = survey_blocks?.map((block) => {
      return block.id === b?.id
        ? {
            ...block,
            end_screen: {
              ...block.end_screen,
              social_media,
            },
          }
        : { ...block };
    }) as ISurveyBlocks[];

    setSurveyBlocks(data);
  };

  return (
    <div className="w-full mt-3 flex flex-col gap-3">
      <div className="w-full flex items-center justify-between">
        <Label>Button</Label>
        <Switch
          checked={b?.end_screen.button ?? false}
          onCheckedChange={handleButtonSwitch}
        />
      </div>
      {b?.end_screen.button && (
        <Input
          maxLength={24}
          placeholder="Button Text"
          value={b?.end_screen.button_text ?? "Button Text"}
          onChange={handleButtonTextChange}
        />
      )}
      {b?.end_screen.button && (
        <Input
          maxLength={24}
          placeholder="Add a link to the button"
          value={b?.end_screen.button_link ?? "https://button-link.com"}
          onChange={handleButtonLinkChange}
        />
      )}
      <div className="w-full flex flex-col mt-3 gap-2">
        <div className="flex items-center justify-between w-full">
          <Label>Add a social media</Label>
          <Hint
            element={
              <Button onClick={addSocialMedia} className="h-7" size="icon">
                <PlusIcon size={17} />
              </Button>
            }
            content="Add a social media"
          />
        </div>
        {b?.end_screen?.social_media?.map((social_media) => (
          <SocialMedias key={social_media.id} {...social_media} />
        ))}
      </div>
    </div>
  );
};

export const PhoneNumberSettings: FC<{}> = () => {
  const b = useGetCurrentBlock();
  const { survey_blocks, setSurveyBlocks } = useSurveyWorkSpace();
  const handleValidateNumber = (e: boolean) => {
    const data = survey_blocks?.map((block) => {
      return block.id === b?.id
        ? { ...block, phone_number: { ...block.phone_number, check_number: e } }
        : { ...block };
    }) as ISurveyBlocks[];

    setSurveyBlocks(data);
  };
  const handleFormatNumber = (e: boolean) => {
    const data = survey_blocks?.map((block) => {
      return block.id === b?.id
        ? {
            ...block,
            phone_number: { ...block.phone_number, format_number: e },
          }
        : { ...block };
    }) as ISurveyBlocks[];

    setSurveyBlocks(data);
  };
  return (
    <div className="w-full flex flex-col gap-4 mt-3">
      <ToggleIsRequired id={b?.phone_number.id!} type="PhoneNumber" />
      <Label className="flex items-center justify-between w-full">
        Validate Number
        <Switch
          onCheckedChange={handleValidateNumber}
          checked={b?.phone_number.check_number}
        />
      </Label>
      <Label className="flex items-center justify-between w-full">
        Format Number
        <Switch
          onCheckedChange={handleFormatNumber}
          checked={b?.phone_number.format_number}
        />
      </Label>
      <Label className="flex flex-col gap-2">
        Place Holder
        <Input
          value={b?.phone_number.placeholder!}
          onChange={(e) => {
            const {
              target: { value: placeholder },
            } = e;
            const data = survey_blocks?.map((block) => {
              return block.id === b?.id
                ? {
                    ...block,
                    phone_number: { ...block.phone_number, placeholder },
                  }
                : { ...block };
            }) as ISurveyBlocks[];

            setSurveyBlocks(data);
          }}
          className="w-full"
        />
      </Label>
    </div>
  );
};

export const LongTextSettings: FC<{}> = () => {
  const b = useGetCurrentBlock();
  const { survey_blocks, survey, setSurveyBlocks, setAutoSaveUiProps } =
    useSurveyWorkSpace();
  const [isFirstMount, setIsFirstMount] = useState(true);
  const action = new SurveyWorkSpace(survey?.id ?? "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const data = survey_blocks?.map((block) => {
      return block.id === b?.id
        ? { ...block, long_text: { ...block.long_text, [name]: value } }
        : { ...block };
    }) as ISurveyBlocks[];

    setSurveyBlocks(data);
  };

  const delayedMaxCharacter = useDebounce(b?.long_text?.max_character!, 3000);
  const delayedPlaceHolder = useDebounce(b?.long_text?.place_holder!, 3000);

  useEffect(() => {
    const handleChangeWithAPI = async () => {
      try {
        if (!b) return;

        const {
          long_text: { max_character, place_holder },
        } = b;

        setAutoSaveUiProps({
          is_visible: true,
          status: "loading",
          message: "",
        });

        await action.modifyBlock(b?.long_text.id!, "LongText", {
          max_character,
          place_holder,
        });
        setAutoSaveUiProps({
          is_visible: true,
          status: "success",
          message: app_config.AppName + "has auto-save your progress.",
        });
      } catch (error) {
        setAutoSaveUiProps({
          is_visible: true,
          status: "failed",
          message: errorMessageForToast(
            error as AxiosError<{ message: string }>
          ),
        });
      }
    };

    if (delayedMaxCharacter && delayedPlaceHolder && isFirstMount) {
      setIsFirstMount(false);
    }

    if (!isFirstMount) {
      handleChangeWithAPI();
    }

    return () => setIsFirstMount(true);
  }, [delayedMaxCharacter, delayedPlaceHolder]);

  return (
    <div className="flex flex-col gap-3">
      <ToggleIsRequired id={b?.id!} type="LongText" />
      <Label className="flex flex-col gap-2">
        Max Characters
        <Input
          name="max_character"
          onChange={handleChange}
          value={b?.long_text.max_character ?? 0}
          className="w-full px-2"
        />
      </Label>
      <Label className="flex flex-col gap-2">
        Placeholder
        <Input
          name="place_holder"
          onChange={handleChange}
          value={b?.long_text.place_holder ?? "Placeholder"}
          className="w-full px-2"
        />
      </Label>
    </div>
  );
};

export const NumberSettings: FC<{}> = () => {
  const { survey_blocks, survey, setSurveyBlocks, setAutoSaveUiProps } =
    useSurveyWorkSpace();
  const action = new SurveyWorkSpace(survey?.id ?? "");
  const b = useGetCurrentBlock();
  const [isFirstMount, setIsFirstMount] = useState(false);

  const delayMAx = useDebounce(b?.number.max, 3000);
  const delayMin = useDebounce(b?.number.min, 3000);

  // This function handles the update of MAX and MIN
  const handleChange = async () => {
    if (!b) return;

    setAutoSaveUiProps({
      is_visible: true,
      status: "loading",
      message: "Loading Please wait...",
    });

    const { max, min } = b?.number;

    const payload = {
      min,
      max,
    };

    try {
      await action.modifyBlock(b.number.id!, "Number", payload);
      setAutoSaveUiProps({
        is_visible: true,
        message: "Changes made and your update is updated.",
        status: "success",
      });
    } catch (error) {
      setAutoSaveUiProps({
        status: "failed",
        message: errorMessageForToast(error as AxiosError<{ message: string }>),
        is_visible: true,
      });
    }

    // If this number changes trigger an update
    const data = survey_blocks?.map((blocks) => {
      return blocks.id === b?.id
        ? { ...blocks, number: { ...blocks.number, ...payload } }
        : { ...blocks };
    }) as ISurveyBlocks[];

    setSurveyBlocks(data);
  };

  const changeMaxAndMin = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const data = survey_blocks?.map((block) => {
      return block.id === b?.id
        ? {
            ...block,
            number: { ...block.number, [name]: value, [name]: value },
          }
        : { ...block };
    }) as ISurveyBlocks[];

    setSurveyBlocks(data);
  };

  // this is to trigger the change the user made but will delay by 3secs
  useEffect(() => {
    if (isFirstMount) {
      setIsFirstMount(false);
    } else {
      handleChange();
    }

    return () => setIsFirstMount(true);
  }, [delayMAx, delayMin]);

  return (
    <div className="w-full flex flex-col gap-5">
      <ToggleIsRequired id={b?.number.id!} type="Number" />
      <Label className="w-full flex flex-col gap-1 px-1">
        Min
        <Input
          value={b?.number.min ?? 0}
          name="min"
          onChange={changeMaxAndMin}
          type="number"
          placeholder="Min Number to Input"
        />
      </Label>
      <Label className="w-full flex flex-col gap-1 px-1">
        Max
        <Input
          value={b?.number.max ?? 0}
          name="max"
          onChange={changeMaxAndMin}
          type="number"
          placeholder="Max Number to Input"
        />
      </Label>
    </div>
  );
};

export const ChoicesSettings: FC<{}> = () => {
  const b = useGetCurrentBlock();
  const { survey_blocks, survey, setSurveyBlocks, setAutoSaveUiProps } =
    useSurveyWorkSpace();
  const action = new SurveyWorkSpace(survey?.id ?? "");
  const className = "w-full flex items-center justify-between";

  const handleChanges = async (
    e: boolean,
    name: "randomize" | "multiple_selection" | "vertical_alignment"
  ) => {
    setAutoSaveUiProps({
      is_visible: true,
      status: "loading",
      message: "Applying changes please wait...",
    });

    const data = survey_blocks?.map((block) => {
      return block.id === b?.id
        ? { ...block, choices: { ...block.choices, [name]: e } }
        : { ...block };
    }) as ISurveyBlocks[];

    const payload = {
      [name]: e,
    };

    try {
      setSurveyBlocks(data);
      await action.modifyBlock(b?.choices.id!, "Choices", payload);
      setAutoSaveUiProps({
        is_visible: true,
        status: "success",
        message: "Changes applied",
      });
    } catch (error) {
      setAutoSaveUiProps({
        is_visible: true,
        status: "failed",
        message: errorMessageForToast(error as AxiosError<{ message: string }>),
      });
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <ToggleIsRequired id={b?.choices.id!} type="Choices" />
      <Label className={cn("", className)}>
        Multiple Selection
        <Switch
          checked={b?.choices.multiple_selection}
          onCheckedChange={(e) => handleChanges(e, "multiple_selection")}
        />
      </Label>
      <Label className={cn("", className)}>
        Randomize Choices
        <Switch
          checked={b?.choices.randomize}
          onCheckedChange={(e) => handleChanges(e, "randomize")}
        />
      </Label>
      <Label className={cn("", className)}>
        Align Vertically
        <Switch
          checked={b?.choices.vertical_alignment}
          onCheckedChange={(e) => handleChanges(e, "vertical_alignment")}
        />
      </Label>
    </div>
  );
};

export const EmailSettings: FC<{}> = () => {
  const { setAutoSaveUiProps } = useSurveyWorkSpace();
  const b = useGetCurrentBlock();
  const { survey_blocks, survey, setSurveyBlocks } = useSurveyWorkSpace();

  const actions = new SurveyWorkSpace(survey?.id ?? "");
  const handleCheckEmailChange = async (e: boolean) => {
    const data = survey_blocks?.map((block) => {
      return block.id === b?.id
        ? { ...block, email: { ...block.email, check_email: e } }
        : { ...block };
    }) as ISurveyBlocks[];

    try {
      setAutoSaveUiProps({
        is_visible: true,
        status: "loading",
        message: app_config.AppName + " is auto-saving your progress.",
      });

      await actions.modifyBlock(b?.email.id!, "Email", { check_email: e });

      setAutoSaveUiProps({
        is_visible: true,
        status: "success",
        message: e ? "Email will be validated before submitting" : "Saved.",
      });
    } catch (error) {
      setAutoSaveUiProps({
        is_visible: true,
        status: "failed",
        message: errorMessageForToast(error as AxiosError<{ message: string }>),
      });
    }

    setSurveyBlocks(data);
  };

  return (
    <div className="w-full flex flex-col gap-3">
      <ToggleIsRequired id={b?.email.id!} type="Email" />
      <Label className="w-full flex items-center justify-between">
        Check Email
        <Switch
          checked={b?.email.check_email}
          onCheckedChange={handleCheckEmailChange}
        />
      </Label>
    </div>
  );
};

export const DateSettings: FC<{}> = () => {
  const b = useGetCurrentBlock();
  const { setSurveyBlocks, survey, survey_blocks, setAutoSaveUiProps } =
    useSurveyWorkSpace();
  const action = new SurveyWorkSpace(survey?.id ?? "");
  const [isFirstMount, setIsFirstMount] = useState(true);

  const data: combo_box_type<dateFormat>[] = [
    {
      value: "MM-yyyy-dd",
      label: "Month First",
    },
    {
      value: "dd-MM-yyyy",
      label: "Day First",
    },
    {
      value: "yyyy-MM-dd",
      label: "Year First",
    },
    {
      value: "PPP",
      label: "Default",
    },
  ];
  const [value, setValue] = useState("ppp");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (b) {
      setValue(b.date.format);
      setIsFirstMount(false);
    }

    return () => {
      setIsFirstMount(true);
      setValue("");
    };
  }, [b]);

  useEffect(() => {
    const handleFormatChange = async () => {
      setAutoSaveUiProps({
        is_visible: true,
        status: "loading",
        message: "Please wait while we save your progress.",
      });

      const format =
        data.find((v) => v.value.toLowerCase() === value.toLowerCase())
          ?.value ?? "PPP";

      try {
        await action.modifyBlock(b?.date.id!, "Date", {
          format,
        });

        setAutoSaveUiProps({
          is_visible: true,
          status: "success",
          message: app_config.AppName + " has auto-save your progress.",
        });

        const d = survey_blocks?.map((block) => {
          return block.id === b?.id
            ? { ...block, date: { ...block.date, format: value as dateFormat } }
            : { ...block };
        }) as ISurveyBlocks[];

        setSurveyBlocks(d);
      } catch (error) {
        setAutoSaveUiProps({
          is_visible: true,
          status: "failed",
          message: errorMessageForToast(
            error as AxiosError<{ message: string }>
          ),
        });
      }
    };

    if (!isFirstMount && value.toLowerCase() !== b?.date.format.toLowerCase()) {
      handleFormatChange();
    }
  }, [value]);

  return (
    <div className="flex flex-col gap-2">
      <ToggleIsRequired id={b?.id!} type="Date" />
      <Combobox
        data={data}
        value={value}
        setValue={setValue}
        search={search}
        setSearch={setSearch}
        title="Choose date format."
      />
    </div>
  );
};

export const SocialMedias: FC<EndScreenSocialMedia> = ({ media_type, id }) => {
  const _socialMedias: combo_box_type<socialMediaTypes>[] = [
    {
      value: "facebook",
      label: "FaceBook",
    },
    {
      value: "email",
      label: "Email",
    },
    {
      value: "instagram",
      label: "Instagram",
    },
    {
      value: "tiktok",
      label: "TikTok",
    },
    {
      value: "twitter",
      label: "Twitter",
    },
    {
      value: "whatsapp",
      label: "WhatsApp",
    },
  ];

  const { survey_blocks, setSurveyBlocks } = useSurveyWorkSpace();
  const b = useGetCurrentBlock();

  const [value, setValue] = useState(media_type);
  const [search, setSearch] = useState("");
  const [link, setLink] = useState("");

  useEffect(() => {
    if (!value) {
      const data = survey_blocks?.map((block) => {
        return block?.id === b?.id
          ? {
              ...block,
              end_screen: {
                ...block.end_screen,
                social_media: block.end_screen.social_media.filter(
                  (social_media) => social_media.id !== id
                ),
              },
            }
          : { ...block };
      }) as ISurveyBlocks[];

      setSurveyBlocks(data);
      return;
    }

    const data = survey_blocks?.map((block) => {
      return block.id === b?.id
        ? {
            ...block,
            end_screen: {
              ...block.end_screen,
              social_media: block.end_screen.social_media.map((sm) =>
                sm.id === id ? { ...sm, media_type: value } : { ...sm }
              ),
            },
          }
        : { ...block };
    }) as ISurveyBlocks[];

    setSurveyBlocks(data);
  }, [value]);

  return (
    <div className="w-full flex flex-col gap-2">
      <Combobox
        className="w-full"
        popoverClassName="w-[250px]"
        data={_socialMedias}
        value={value}
        search={search}
        // @ts-ignore
        setValue={setValue}
        setSearch={setSearch}
      />
      {value && (
        <Input
          value={link}
          onChange={(e) => {
            const data = survey_blocks?.map((block) => {
              return block.id === b?.id
                ? {
                    ...block,
                    end_screen: {
                      ...block.end_screen,
                      social_media: block.end_screen.social_media.map((sm) =>
                        sm.id === id
                          ? { ...sm, social_media_link: e.target.value }
                          : { ...sm }
                      ),
                    },
                  }
                : { ...block };
            }) as ISurveyBlocks[];

            setSurveyBlocks(data);
            setLink(e.target.value);
          }}
          type={value === "email" ? value : "url"}
          placeholder="Enter social media link"
        />
      )}
    </div>
  );
};

export const YesOrNoSettings: FC<{}> = () => {
  const b = useGetCurrentBlock();
  return (
    <div>
      <ToggleIsRequired id={b?.id!} type="YesNo" />
    </div>
  );
};

export const DropDownSettings: FC<{}> = () => {
  const b = useGetCurrentBlock();
  const { survey, survey_blocks, setSurveyBlocks, setAutoSaveUiProps } =
    useSurveyWorkSpace();

  // This changes
  const handleChange = async (
    e: boolean,
    type: "allow_search" | "alphabetically" | "multiple_selection"
  ) => {
    const action = new SurveyWorkSpace(survey?.id ?? "");
    const payload = {
      [type]: e,
    };

    setAutoSaveUiProps({
      is_visible: true,
      message: "Please wait saving your progress.",
      status: "loading",
    });

    const data = survey_blocks?.map((block) => {
      return block?.id === b?.id
        ? { ...block, dropdown: { ...block.dropdown, ...payload } }
        : { ...block };
    }) as ISurveyBlocks[];

    try {
      setSurveyBlocks(data);
      await action.modifyBlock(b?.dropdown.id!, "DropDown", payload);

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
    <div className="flex flex-col gap-3">
      <ToggleIsRequired id={b?.dropdown?.id!} type="DropDown" />
      <Label className="flex items-center justify-between w-full">
        Allow Multiple Selection
        <Switch
          checked={b?.dropdown.multiple_selection}
          onCheckedChange={(e) => handleChange(e, "multiple_selection")}
        />
      </Label>
      <Label className="flex items-center justify-between w-full">
        Alphabetical Order
        <Switch
          checked={b?.dropdown.alphabetically}
          onCheckedChange={(e) => handleChange(e, "alphabetically")}
        />
      </Label>
    </div>
  );
};

export const PictureChoiceSettings: FC<{}> = () => {
  const b = useGetCurrentBlock();
  const { survey_blocks, survey, setSurveyBlocks, setAutoSaveUiProps } =
    useSurveyWorkSpace();
  const action = new SurveyWorkSpace(survey?.id ?? "");

  // Handle The Change
  const handleChange = async (
    e: boolean,
    type: "multiple_selection" | "super_size"
  ) => {
    setAutoSaveUiProps({
      is_visible: true,
      message: "Please wait while we save your progress.",
      status: "loading",
    });
    const data = survey_blocks?.map((block) => {
      return block.id === b?.id
        ? {
            ...block,
            picture_choice: { ...block.picture_choice, [type]: e },
          }
        : { ...block };
    }) as ISurveyBlocks[];

    setSurveyBlocks(data);

    try {
      await action.modifyBlock(b?.picture_choice.id ?? "", "PictureChoice", {
        multiple_selection: e,
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
    <div className="w-full flex flex-col gap-3">
      <ToggleIsRequired id={b?.id ?? ""} type="PictureChoice" />
      <Label className="flex items-center justify-between w-full">
        Multiple Selection
        <Switch
          checked={b?.picture_choice.multiple_selection}
          onCheckedChange={(e) => handleChange(e, "multiple_selection")}
        />
      </Label>
      <Label className="flex items-center justify-between w-full">
        Super Size
        <Switch
          checked={b?.picture_choice.super_size}
          onCheckedChange={(e) => handleChange(e, "super_size")}
        />
      </Label>
    </div>
  );
};

export const RedirectWithURl: FC<{}> = () => {
  const { survey, survey_blocks, setSurveyBlocks, setAutoSaveUiProps } =
    useSurveyWorkSpace();
  const action = new SurveyWorkSpace(survey?.id ?? "");
  const [isFirstMount, setIsFirstMount] = useState(true);
  const b = useGetCurrentBlock();
  const [values, setValues] = useState({
    message: "",
    url: "",
    button_text: "",
    custom_html: "",
  });
  // Input Change
  const handleChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const delayValues = useDebounce(
    {
      button_text: values.button_text,
      url: values.url,
      message: values.message,
      custom_html: values.custom_html,
    },
    3000
  );

  useEffect(() => {
    if (
      isFirstMount ||
      (values.button_text === b?.redirect_with_url.button_text &&
        values.message === b?.redirect_with_url.message &&
        values.url === b?.redirect_with_url.url)
    ) {
      return;
    }

    const makeChangesInTheAPi = async () => {
      const { message, url, button_text } = values;
      setAutoSaveUiProps({
        is_visible: true,
        message: "Please wait while we save your progress.",
        status: "loading",
      });

      // Optimistic Update
      const data = survey_blocks?.map((block) => {
        return block.id === b?.id
          ? {
              ...block,
              redirect_with_url: {
                ...block.redirect_with_url,
                url: delayValues.url,
                message: delayValues.message,
                button_text: delayValues.button_text,
              },
            }
          : { ...block };
      }) as ISurveyBlocks[];
      setSurveyBlocks(data);

      try {
        await action.modifyBlock(b?.redirect_with_url.id!, "RedirectToURL", {
          message,
          url,
          button_text,
        });
        setAutoSaveUiProps({
          is_visible: true,
          message: "Please wait while we save your progress.",
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

    makeChangesInTheAPi();
  }, [delayValues]);

  useEffect(() => {
    if (!b?.redirect_with_url) {
      return;
    }

    const { message, url, button_text, custom_html } = b.redirect_with_url;

    setValues({ ...values, message, url, button_text, custom_html });
    setIsFirstMount(false);

    return () => {
      setIsFirstMount(true);
      setValues({
        message: "",
        url: "",
        button_text: "",
        custom_html: "",
      });
    };
  }, [b]);

  const addHtmlToBlock = async () => {
    setAutoSaveUiProps({
      is_visible: true,
      message: "Please wait while we save your progress.",
      status: "loading",
    });

    // Optimistic Update
    const data = survey_blocks?.map((block) => {
      return block.id === b?.id
        ? {
            ...block,
            redirect_with_url: {
              ...block.redirect_with_url,
              custom_html: values.custom_html,
            },
          }
        : { ...block };
    }) as ISurveyBlocks[];
    setSurveyBlocks(data);

    try {
      await action.modifyBlock(b?.redirect_with_url.id!, "RedirectToURL", {
        custom_html: values.custom_html,
      });
      setAutoSaveUiProps({
        is_visible: true,
        message: "Please wait while we save your progress.",
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
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1 w-full">
        <Description text="Message" />
        <Input
          value={values.message}
          onChange={handleChanges}
          name="message"
          className="w-full"
        />
      </div>
      <div className="flex flex-col gap-1 w-full">
        <Description text="URL for redirect" />
        <Input
          value={values.url}
          onChange={handleChanges}
          name="url"
          className="w-full"
        />
      </div>
      <div className="flex flex-col gap-1 w-full">
        <Description text="Button Text" />
        <Input
          onChange={handleChanges}
          value={values.button_text}
          name="button_text"
          className="w-full"
        />
      </div>
      <Dialog>
        <DialogTrigger>
          <Button size="sm" variant="base" className="w-full">
            Add Custom HTML
          </Button>
        </DialogTrigger>
        <DialogContent className="md:w-[90%] w-[90%]">
          <DialogHeader>
            <DialogTitle className="text-green-500">
              Add Your Custom HTML.
            </DialogTitle>
          </DialogHeader>
          <FullTextEditor
            html={values.custom_html}
            show_divider
            handleChange={(e) =>
              setValues({ ...values, custom_html: e.getHTML() })
            }
          />
          <DialogFooter>
            <DialogClose>
              <Hint
                element={
                  <Button onClick={addHtmlToBlock} variant="base" size="sm">
                    Save
                  </Button>
                }
                content="Save HTML"
              />
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export const AddWebsiteSettings: FC<{}> = ({}) => {
  return (
    <div>
      <ToggleIsRequired id={""} type="Website" />
    </div>
  );
};

export const ToggleIsRequired: FC<{
  id: string | number;
  type: BlockToolProps;
}> = ({ id, type }) => {
  const b = useGetCurrentBlock();
  const { survey, survey_blocks, setAutoSaveUiProps, setSurveyBlocks } =
    useSurveyWorkSpace();

  const actions = new SurveyWorkSpace(survey?.id ?? "");

  const handleRequiredChange = async (e: boolean) => {
    const data = survey_blocks?.map((block) => {
      return block.id === b?.id ? { ...block, is_required: e } : { ...block };
    }) as ISurveyBlocks[];

    try {
      setAutoSaveUiProps({
        is_visible: true,
        status: "loading",
        message: app_config.AppName + " is auto-saving your progress.",
      });

      await actions.modifyBlock(
        "",
        type,
        {},
        e,
        undefined,
        b?.id,
        "is_required"
      );

      setAutoSaveUiProps({
        is_visible: true,
        status: "success",
        message: "This block is now " + (e ? "Required" : "Not Required"),
      });
    } catch (error) {
      setAutoSaveUiProps({
        is_visible: true,
        status: "failed",
        message: errorMessageForToast(error as AxiosError<{ message: string }>),
      });
    }

    setSurveyBlocks(data);
  };

  return (
    <Label className="w-full flex items-center justify-between">
      Required
      <Switch onCheckedChange={handleRequiredChange} checked={b?.is_required} />
    </Label>
  );
};
