import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  BlockToolProps,
  ChoiceOption,
  DropDownOptions,
  ISurveyBlocks,
  PictureChoiceImages,
  WelcomeScreenBlock,
  socialMediaTypes,
} from "../../Types/survey.types";
import { Input, InputProps } from "../../components/Input";
import { useGetCurrentBlock } from "../../Hooks/useSurvey";
import { useSurveyNavigation, useSurveyWorkSpace } from "../../provider";
import { cn } from "../../lib/utils";
import {
  AsteriskIcon,
  Check,
  Clock10Icon,
  EditIcon,
  ImagePlusIcon,
  MailIcon,
  PlusIcon,
  Trash2Icon,
  Users2Icon,
} from "lucide-react";
import { Button } from "../../components/Button";
import Rating from "../../components/App/Rating";
import { Description } from "../ExplorePage/QuickQuiz";
import { TikTokIcon } from "../../assets/TikTokIcon";
import { InstagramIcon } from "../../assets/InstagramIcon";
import { TwitterIcon } from "../../assets/TwitterIcon";
import { FaceBookIcon } from "../../assets/FaceBookIcon";
import { WhatsAppIcon } from "../../assets/WhatsAppIcon";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import { E164Number } from "libphonenumber-js/core";
import "react-phone-number-input/style.css";
import {
  errorMessageForToast,
  generateUUID,
  getSurveyAnswer,
  handleLogic,
  imageEdittingStyles,
  saveAnswerForSurvey,
  shuffleArray,
  surveyResponseTypes,
} from "../../Functions";
import { AxiosError } from "axios";
import { SurveyWorkSpace } from "../../Functions/surveyApis";
import { useDebounce, useLocalStorage } from "@uidotdev/usehooks";
import { Textarea } from "../../components/TextArea";
import { DatePicker } from "../../components/DatePicker";
import { useText } from "../../Hooks/text";
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
import { GripVerticalIcon } from "lucide-react";
import { DropDownComponent } from "../../components/App/DropDown";
import {
  app_config,
  localStorageKeys,
  uploaderProps,
} from "../../Types/components.types";
import ImageUploader from "../../components/App/ImageUploader";
import { Img } from "react-image";
import { X } from "lucide-react";
import Hint from "../../components/Hint";
import {
  EditImage,
  imageEditorProps,
  transformImageProps,
} from "../../components/App/EditImage";
import DOMPurify from "dompurify";
import { allStyles } from "../../constant";
import { Reorder } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";
import { toast } from "../../components/use-toaster";
import { useRegex } from "../../Hooks/regex";

export type mode = "DEVELOPMENT" | "PRODUCTION" | "PREVIEW";

export const SurveyInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const { surveyDesign } = useSurveyWorkSpace();
    return (
      <Input
        type={type}
        className={cn(
          "mt-3 flex h-10 w-full text-xl rounded-none placeholder:text-xl border-t-0 border-x-0 bg-transparent px-1 py-2 ring-offset-background file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none border-b-2 focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
          allStyles.border[surveyDesign?.color ?? "GREEN"]
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

// Contacts
export const EmailBlockStyle: FC<{ mode: mode }> = ({ mode }) => {
  const b = useGetCurrentBlock();
  const surveyId = useSurveyWorkSpace()?.survey?.id ?? "";
  const { emailVerifier } = useRegex();
  const [userResponse, setUserResponse] = useState("");
  const [responses, setResponses] = useLocalStorage<surveyResponseTypes[]>(
    localStorageKeys.surveyResponses,
    []
  );

  const onOKClick = () => {
    if (b?.is_required && !userResponse) {
      return toast({
        title: "Error",
        description:
          "This question is required, therefore it has to be answered before proceeding.",
        variant: "destructive",
      });
    }

    if (b?.email?.check_email && !emailVerifier(userResponse)) {
      return toast({
        title: "Error",
        description: "Please use a valid email address before proceeding.",
        variant: "destructive",
      });
    }

    saveAnswerForSurvey(
      b?.id ?? "",
      [userResponse],
      surveyId,
      responses,
      setResponses
    );
  };

  useEffect(() => {
    if (!b && mode === "DEVELOPMENT") {
      return;
    }

    const userResponse = getSurveyAnswer(b?.id ?? "");

    setUserResponse(userResponse?.response[0] ?? "");
  }, [b]);

  return (
    <div className="w-full flex flex-col gap-2">
      <SurveyQuestions question={b?.question!} label={b?.label!} mode={mode} />
      <SurveyInput
        value={userResponse}
        onChange={(e) => setUserResponse(e.target.value)}
        placeholder="name@email.com"
      />
      <SurveyOKButton
        mode={mode}
        onClick={() => {
          onOKClick();
          return [userResponse];
        }}
      />
    </div>
  );
};

export const PhoneNumberBlockStyle: FC<{ mode: mode }> = ({ mode }) => {
  const b = useGetCurrentBlock();
  const [value, setValue] = useState<E164Number>();
  const surveyId = useSurveyWorkSpace()?.survey?.id ?? "";
  const [responses, setResponses] = useLocalStorage<surveyResponseTypes[]>(
    localStorageKeys.surveyResponses,
    []
  );

  const onOKClick = () => {
    if (b?.is_required && !value) {
      return toast({
        title: "Error",
        description:
          "This question is required, therefore it has to be answered before proceeding.",
        variant: "destructive",
      });
    }

    if (
      b?.phone_number?.check_number &&
      !isValidPhoneNumber(value?.toString() ?? "")
    ) {
      return toast({
        title: "Error",
        description: "Please use a valid phone-number before proceeding.",
        variant: "destructive",
      });
    }

    saveAnswerForSurvey(
      b?.id ?? "",
      [value?.toString() ?? ""],
      surveyId,
      responses,
      setResponses
    );
  };

  useEffect(() => {
    if (!b && mode === "DEVELOPMENT") {
      return;
    }

    const userResponse = getSurveyAnswer(b?.id ?? "");

    setValue(userResponse?.response[0] ?? "");
  }, [b]);

  return (
    <div className="w-full flex flex-col gap-2">
      <SurveyQuestions question={b?.question!} label={b?.label!} mode={mode} />

      <PhoneInput
        value={value}
        onChange={(e) => setValue(e)}
        placeholder={b?.phone_number?.placeholder}
        flags={flags}
        className="p-1 w-full border-x-0 border-t-0 border-b-[1.5px] border-b-green-300 mt-4 hover:border-b-green-500"
      />
      <SurveyOKButton
        mode={mode}
        onClick={() => {
          onOKClick();
          return [value?.toString() || ""];
        }}
      />
    </div>
  );
};

// Input Group
export const LongTextBlockStlye: FC<{ mode: mode }> = ({ mode }) => {
  const b = useGetCurrentBlock();
  const surveyId = useSurveyWorkSpace()?.survey?.id ?? "";
  const [userResponse, setUserResponse] = useState("");
  const [responses, setResponses] = useLocalStorage<surveyResponseTypes[]>(
    localStorageKeys.surveyResponses,
    []
  );

  const onOKClick = () => {
    if (b?.is_required && !userResponse) {
      return toast({
        title: "Error",
        description:
          "This question is required, therefore it has to be answered before proceeding.",
        variant: "destructive",
      });
    }

    saveAnswerForSurvey(
      b?.id ?? "",
      [userResponse],
      surveyId,
      responses,
      setResponses
    );
  };

  useEffect(() => {
    if (!b && mode === "DEVELOPMENT") {
      return;
    }

    const userResponse = getSurveyAnswer(b?.id ?? "");

    setUserResponse(userResponse?.response[0] ?? "");
  }, [b]);

  return (
    <div className="w-full flex flex-col">
      <SurveyQuestions mode={mode} question={b?.question!} label={b?.label!} />
      <Textarea
        onChange={(e) => setUserResponse(e.target.value)}
        value={userResponse}
        maxLength={b?.long_text.max_character}
        placeholder={b?.long_text.place_holder ?? "Type a placeholder here.."}
        className="mt-2 placeholder:italic resize-none min-h-0 flex w-full rounded-none border-b-green-300 focus:border-b-green-500 border-t-0 border-x-0 bg-background px-1 py-0 text-sm ring-offset-background file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none border-b-2 focus-visible:ring-0 placeholder:text-xl focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
      />
      <Description text="Click Enter to break line and click the OK button to submit." />
      <SurveyOKButton
        mode={mode}
        onClick={() => {
          onOKClick();
          return [userResponse];
        }}
      />
    </div>
  );
};

export const ShortTextBlockStlye: FC<{
  mode: mode;
}> = ({ mode }) => {
  const b = useGetCurrentBlock();
  const surveyId = useSurveyWorkSpace()?.survey?.id ?? "";
  const [userResponse, setUserResponse] = useState("");
  const [responses, setResponses] = useLocalStorage<surveyResponseTypes[]>(
    localStorageKeys.surveyResponses,
    []
  );

  const onOKClick = () => {
    if (b?.is_required && !userResponse) {
      return toast({
        title: "Error",
        description:
          "This question is required, therefore it has to be answered before proceeding.",
        variant: "destructive",
      });
    }

    saveAnswerForSurvey(
      b?.id ?? "",
      [userResponse],
      surveyId,
      responses,
      setResponses
    );
  };

  useEffect(() => {
    if (!b && mode === "DEVELOPMENT") {
      return;
    }

    const userResponse = getSurveyAnswer(b?.id ?? "");

    setUserResponse(userResponse?.response[0] ?? "");
  }, [b]);

  return (
    <div className="flex flex-col w-full items-start justify-start gap-1">
      <SurveyQuestions question={b?.question!} label={b?.label!} mode={mode} />
      <SurveyInput
        placeholder={b?.short_text?.place_holder ?? "Enter your data"}
        value={userResponse}
        onChange={(e) => setUserResponse(e.target.value)}
        maxLength={b?.short_text?.max_character}
      />
      <SurveyOKButton
        mode={mode}
        onClick={() => {
          onOKClick();
          return [userResponse];
        }}
      />
    </div>
  );
};

export const NumberBlockStlye: FC<{ mode: mode }> = ({ mode }) => {
  const b = useGetCurrentBlock();
  const surveyID = useSurveyWorkSpace()?.survey?.id ?? "";
  const [responses, setResponses] = useLocalStorage<surveyResponseTypes[]>(
    localStorageKeys.surveyResponses,
    []
  );

  const [userResponse, setUserResponse] = useState(0);

  const onOKClick = () => {
    if (b?.is_required && Boolean(userResponse)) {
      return toast({
        title: "Error",
        description:
          "This question is required, therefore it has to be answered before proceeding.",
        variant: "destructive",
      });
    }

    saveAnswerForSurvey(
      b?.id ?? "",
      [userResponse + ""],
      surveyID,
      responses,
      setResponses
    );
  };

  useEffect(() => {
    if (!b && mode !== "PRODUCTION") {
      return;
    }

    const userResponse = getSurveyAnswer(b?.id + "");

    setUserResponse(
      typeof Number(userResponse?.response[0]) === "number"
        ? Number(userResponse?.response[0])
        : 0
    );
  }, [b]);

  return (
    <div className="w-full flex flex-col gap-2">
      <SurveyQuestions question={b?.question!} label={b?.label!} mode={mode} />
      <SurveyInput
        value={userResponse}
        onChange={(e) => setUserResponse(e.target.valueAsNumber)}
        min={b?.number?.min as number}
        max={b?.number?.max as number}
        disabled={mode === "DEVELOPMENT"}
        placeholder="Enter a number."
        type="number"
      />
      <SurveyOKButton
        mode={mode}
        onClick={() => {
          onOKClick();

          return [userResponse + ""];
        }}
      />
    </div>
  );
};

// Media Group
export const PictureBlockStlye: FC<{ mode: mode }> = ({ mode }) => {
  const b = useGetCurrentBlock();
  const [userResponse, setUserResponse] = useState<string[]>([]);
  /* The above code snippet is using TypeScript with React. It is destructuring values from the
  `useSurveyWorkSpace` hook, including `survey`, `survey_blocks`, `setSurveyBlocks`,
  `setAutoSaveUiProps`, and `surveyDesign`. These values are likely being used to manage and
  interact with survey-related data and UI elements within a workspace component. */
  const {
    survey,
    survey_blocks,
    setSurveyBlocks,
    setAutoSaveUiProps,
    surveyDesign,
  } = useSurveyWorkSpace();
  const action = new SurveyWorkSpace(survey?.id ?? "");
  const [responses, setResponses] = useLocalStorage<surveyResponseTypes[]>(
    localStorageKeys.surveyResponses,
    []
  );

  // This is for the development
  const handleAddImage = async () => {
    if (mode === "PREVIEW") {
      return;
    }

    /* The above code snippet is performing the following tasks: */
    const newImage: PictureChoiceImages = {
      id: generateUUID(),
      url: "",
      alt_tag: "",
      saturation: 0,
      brightness: 100,
      blur: 0,
      x: 1,
      y: 1,
      rotationIndex: 0,
      contrast: 100,
      name: "",
      grayscale: 0,
      hue: 0,
      pixelate: 0,
      invert: 0,
    };

    setAutoSaveUiProps({
      is_visible: true,
      status: "loading",
      message: "Please wait while we try to save your progress.",
    });

    const images = [...(b?.picture_choice?.images ?? []), newImage];
    const data = survey_blocks?.map((block) => {
      return block.id === b?.id
        ? { ...block, picture_choice: { ...block.picture_choice, images } }
        : { ...block };
    }) as ISurveyBlocks[];

    const {
      saturation,
      blur,
      brightness,
      contrast,
      rotationIndex,
      x,
      y,
      alt_tag,
      id,
      name,
      pixelate,
      grayscale,
      hue,
      invert,
    } = newImage;

    try {
      setSurveyBlocks(data);
      await action.addPictureChoice({
        payload: {
          saturation,
          blur,
          brightness,
          x,
          y,
          alt_tag,
          rotationIndex,
          contrast,
          id,
          name,
          pixelate,
          grayscale,
          hue,
          invert,
        },
        picture_id: b?.picture_choice.id ?? "",
        survey_id: survey?.id ?? "",
        block_type: "PictureChoice",
      });
      setAutoSaveUiProps({
        is_visible: true,
        status: "success",
        message: app_config.AppName + " has auto-save your progress.",
      });
    } catch (error) {
      setAutoSaveUiProps({
        is_visible: true,
        status: "failed",
        message: errorMessageForToast(error as AxiosError<{ message: string }>),
      });
    }
  };

  // This is for production
  const _ = (imageID: string) => {
    const image = userResponse?.find((id) => id === imageID);

    if (image) {
      setUserResponse((prev) => prev.filter((id) => id !== imageID));
      return;
    }
    setUserResponse((prev) =>
      b?.picture_choice?.multiple_selection ? [...prev, imageID] : [imageID]
    );
  };

  const onOKClick = () => {
    if (b?.is_required && !Boolean(userResponse.length)) {
      return toast({
        title: "Error",
        description:
          "This question is required, therefore it has to be answered before proceeding.",
        variant: "destructive",
      });
    }

    saveAnswerForSurvey(
      b?.id ?? "",
      userResponse,
      survey?.id ?? "",
      responses,
      setResponses
    );
  };

  useEffect(() => {
    if (!b && mode !== "DEVELOPMENT") {
      return;
    }

    const userResponse = getSurveyAnswer(b?.id + "");
    setUserResponse(userResponse?.response ?? []);
  }, [b]);

  const addImageButton = (
    <div
      title="Add A New Choice"
      onClick={handleAddImage}
      className={cn(
        "w-full flex items-center justify-center h-[10rem] border cursor-pointer rounded-sm ",
        allStyles.light_background_color[surveyDesign?.button ?? "GREEN"]
      )}
    >
      <PlusIcon />
    </div>
  );

  return (
    <div className="flex flex-col gap-2 w-full justify-center h-full">
      <SurveyQuestions mode={mode} label={b?.label!} question={b?.question!} />
      <div
        className={cn(
          "grid w-full gap-2 h-[50%] overflow-auto",
          b?.picture_choice?.super_size
            ? "md:grid-cols-2 grid-cols-1"
            : "md:grid-cols-4 grid-cols-2"
        )}
      >
        {b?.picture_choice?.images?.length
          ? b?.picture_choice?.images?.map((image, i) => (
              <div className="" onClick={() => _(image.id)} key={image.id}>
                <PictureViews
                  isSelected={userResponse.includes(image.id)}
                  pictures={image}
                  index={i}
                  mode={mode}
                />
              </div>
            ))
          : ""}
        {mode === "DEVELOPMENT" && addImageButton}
      </div>
      <SurveyOKButton
        mode={mode}
        onClick={() => {
          onOKClick();
          return userResponse;
        }}
      />
    </div>
  );
};

//   Choices Group
export const DropdownBlockStyle: FC<{ mode: mode }> = ({ mode }) => {
  const b = useGetCurrentBlock();
  const [value, setValue] = useState("");
  const [dropDownOptions, setDropDownOptions] = useState<DropDownOptions[]>([]);
  const {
    survey_blocks,
    setSurveyBlocks,
    setAutoSaveUiProps,
    survey,
    surveyDesign,
  } = useSurveyWorkSpace();
  const action = new SurveyWorkSpace(survey?.id ?? "");
  const [responses, setResponses] = useLocalStorage<surveyResponseTypes[]>(
    localStorageKeys.surveyResponses,
    []
  );
  const [userResponse, setUserResponse] = useState<string[]>([]);

  const onOKClick = () => {
    if (b?.is_required && !Boolean(userResponse?.length)) {
      return toast({
        title: "Error",
        description:
          "This question is required, therefore it has to be answered before proceeding.",
        variant: "destructive",
      });
    }

    saveAnswerForSurvey(
      b?.id ?? "",
      userResponse,
      survey?.id ?? "",
      responses,
      setResponses
    );
  };

  useEffect(() => {
    if (!b?.dropdown?.options) {
      // setDropDownOptions(b?.dropdown.options)
      return;
    }

    setDropDownOptions(b.dropdown.options);
    setValue(b.dropdown.options.map((option) => option.body).join(","));
    setUserResponse(getSurveyAnswer(b?.id)?.response ?? []);

    return () => {
      setDropDownOptions([]);
      setValue("");
    };
  }, [b?.dropdown?.options]);

  useEffect(() => {
    if (!b?.dropdown?.alphabetically) {
      return;
    }

    const sortedData = b.dropdown.options.map((option) => option.body).sort();
    const data: DropDownOptions[] = sortedData.map((option) => ({
      body: option,
      id: dropDownOptions.find(
        (opt) => opt.body.toLowerCase() === option.toLowerCase()
      )?.id!,
      created_at: dropDownOptions.find(
        (opt) => opt.body.toLowerCase() === option.toLowerCase()
      )?.created_at!,
      updated_at: dropDownOptions.find(
        (opt) => opt.body.toLowerCase() === option.toLowerCase()
      )?.updated_at!,
    }));

    setDropDownOptions(data);
  }, [b?.dropdown?.alphabetically]);

  const convertOptionsToArray = async () => {
    const option = value.split(/[,.]/);
    // Adding ID and Dates to the existing list
    const options: DropDownOptions[] = option?.map((body) => ({
      body,
      created_at: new Date().toUTCString(),
      updated_at: new Date().toUTCString(),
      id: generateUUID(),
    }));

    setAutoSaveUiProps({
      message: "Please wait saving your progress...",
      status: "loading",
      is_visible: true,
    });

    // If options does not exist!
    if (!options?.length) {
      return;
    }

    const data = survey_blocks?.map((block) => {
      return block.id === b?.id
        ? { ...block, dropdown: { ...block.dropdown, options } }
        : { ...block };
    }) as ISurveyBlocks[];

    try {
      // Add Choices To Database
      await action.addDropDownOptions(
        options,
        b?.dropdown.id!,
        "ADD_DROPDOWN_OPTIONS",
        survey?.id!,
        "DropDown"
      );
      setAutoSaveUiProps({
        message: app_config.AppName + " has auto-saved your your progress.",
        status: "success",
        is_visible: true,
      });
    } catch (error) {
      setAutoSaveUiProps({
        message: errorMessageForToast(error as AxiosError<{ message: string }>),
        status: "failed",
        is_visible: true,
      });
    }

    setSurveyBlocks(data);
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <SurveyQuestions question={b?.question!} label={b?.label!} mode={mode} />
      <DropDownComponent
        allowMultipleSelection={b?.dropdown?.multiple_selection}
        placeHolder="Select your choice."
        className="w-[400px] h-[4rem]"
        extraClassName="w-[350px] h-[10rem]"
        dropDownOptions={dropDownOptions.map((option) => option.body)}
        color={surveyDesign?.button}
        list={userResponse}
        setList={setUserResponse}
      />
      {mode === "DEVELOPMENT" && (
        <AddOptions
          className="w-fit"
          value={value}
          setValue={setValue}
          header="Add DropDown Options"
          description="Start to add all the options you want the user to choose from separate your options with Comma(,) or Period(.)."
          convertToOptions={convertOptionsToArray}
          choices={b?.dropdown?.options.map((option) => option.body)}
        >
          <Button className="p-0 text-gray-400" variant="link">
            Add Dropdown Options
          </Button>
        </AddOptions>
      )}
      <SurveyOKButton
        mode={mode}
        onClick={() => {
          onOKClick();
          return userResponse;
        }}
      />
    </div>
  );
};

export const ChoicesBlockStyle: FC<{ mode: mode }> = ({ mode }) => {
  const b = useGetCurrentBlock();
  const {
    survey,
    survey_blocks,
    surveyDesign,
    setSurveyBlocks,
    setAutoSaveUiProps,
  } = useSurveyWorkSpace();
  const action = new SurveyWorkSpace(survey?.id ?? "");
  const { getLetter } = useText();
  const [responses, setResponses] = useLocalStorage<surveyResponseTypes[]>(
    localStorageKeys.surveyResponses,
    []
  );

  const [value, setValue] = useState("");

  const [userSelection, setUserSelection] = useState<string[]>([]);

  const buttonClass = "flex justify-start";
  const [userChoice, setUserChoice] = useState<ChoiceOption[]>([]);

  const onOKClick = () => {
    if (b?.is_required && !Boolean(userSelection.length)) {
      return toast({
        title: "Error",
        description:
          "This question is required, therefore it has to be answered before proceeding.",
        variant: "destructive",
      });
    }

    saveAnswerForSurvey(
      b?.id ?? "",
      userSelection,
      survey?.id ?? "",
      responses,
      setResponses
    );
  };

  const handleChoiceSelection = (e: string) => {
    if (mode === "DEVELOPMENT") {
      return;
    }

    if (userSelection.includes(e)) {
      setUserSelection((prev) => prev.filter((r) => r !== e));
    } else {
      setUserSelection((prev) =>
        b?.choices?.multiple_selection ? [...prev, e] : [e]
      );
    }
  };

  useEffect(() => {
    const choicesPlaceholder: ChoiceOption[] = [
      {
        id: "1",
        option: "First Choice",
        updated_at: "",
        created_at: "",
      },
      {
        id: "2",
        option: "Second Choice",
        updated_at: "",
        created_at: "",
      },
      {
        id: "3",
        option: "Third Choice",
        updated_at: "",
        created_at: "",
      },
      {
        id: "4",
        option: "Fourth Choice",
        updated_at: "",
        created_at: "",
      },
      {
        id: "5",
        option: "Fifth Choice",
        updated_at: "",
        created_at: "",
      },
    ];

    if (mode !== "DEVELOPMENT") {
      return;
    }

    setUserChoice(b?.choices?.options || choicesPlaceholder);
  }, [b?.choices?.options]);

  // This handles the shuffling of the list
  useEffect(() => {
    if (!b?.choices?.randomize) {
      setUserChoice(b?.choices?.options as ChoiceOption[]);
      return;
    }

    const randomChoice = shuffleArray(b?.choices?.options);

    setUserChoice(randomChoice);

    return () => setUserChoice([]);
  }, [b?.choices?.randomize]);

  useEffect(() => {
    if (!b?.choices?.options?.length) {
      return;
    }

    setValue(b.choices.options.map((option) => option.option).join(","));

    const responses = getSurveyAnswer(b?.id ?? "");

    if (responses) {
      setUserSelection(responses.response);
    }

    return () => setValue("");
  }, [b?.choices?.options]);

  // Convert the option user types to an array.
  const convertOptionsToArray = async () => {
    const option = value.split(/[,.]/);
    // Adding ID and Dates to the existing list
    const options = option?.map((option) => ({
      option,
      created_at: new Date().toUTCString(),
      updated_at: new Date().toUTCString(),
      id: generateUUID(),
    }));

    // If options does not exist!
    if (!options?.length) {
      return;
    }

    const data = survey_blocks?.map((block) => {
      return block.id === b?.id
        ? { ...block, choices: { ...block.choices, options } }
        : { ...block };
    }) as ISurveyBlocks[];

    try {
      // Add Choices To Database
      await action.addChoices(
        options,
        b?.choices.id!,
        "ADD_CHOICE",
        survey?.id!,
        "Choices"
      );
    } catch (error) {
      setAutoSaveUiProps({
        message: errorMessageForToast(error as AxiosError<{ message: string }>),
        status: "failed",
        is_visible: true,
      });
    }

    setSurveyBlocks(data);
  };

  // This is remove the unwanted options for the user.
  const deleteOption = async (id: string) => {
    const data = survey_blocks?.map((block) => {
      return block.id === b?.id
        ? {
            ...block,
            choices: {
              ...block.choices,
              options: block.choices.options.filter(
                (b) => b.id !== id.toLowerCase()
              ),
            },
          }
        : { ...block };
    }) as ISurveyBlocks[];

    try {
      setSurveyBlocks(data);
      await action.removeChoice(survey?.id!, "Choices", id);
    } catch (error) {
      setAutoSaveUiProps({
        message: errorMessageForToast(error as AxiosError<{ message: string }>),
        status: "failed",
        is_visible: true,
      });
    }
  };

  const choicesOptions = (
    <Reorder.Group
      onReorder={() => {}}
      values={[]}
      axis="y"
      className={cn(
        "flex flex-col gap-2 w-full",
        b?.choices?.vertical_alignment ? "flex-row flex-wrap" : "flex-col"
      )}
    >
      {userChoice?.map((d, i) => (
        <Reorder.Item
          value={[]}
          key={d.id}
          className="w-[250px] group flex items-center gap-1"
        >
          <Button
            variant="outline"
            className={cn(
              "flex items-center gap-2 w-full p-0 px-[2px] relative transition-all ease-in delay-75",
              buttonClass,
              allStyles.border[surveyDesign?.button ?? "GREEN"]
            )}
          >
            <Button
              className={cn(
                "",
                allStyles.button[surveyDesign?.button ?? "GREEN"],
                allStyles.button_text[surveyDesign?.button_text ?? "WHITE"]
              )}
              size="sm"
            >
              {getLetter(i)}
            </Button>
            {d.option}
            <GripVerticalIcon
              size={16}
              className="absolute right-1 hidden group-hover:block transition-all ease-linear cursor-move"
            />
          </Button>
          <Trash2Icon
            onClick={() => deleteOption(d.id)}
            className=" hidden text-red-400 cursor-pointer hover:text-red-600 group-hover:block"
            size={17}
          />
        </Reorder.Item>
      ))}
    </Reorder.Group>
  );

  return (
    <div className="flex flex-col gap-2 w-full">
      <SurveyQuestions mode={mode} question={b?.question!} label={b?.label!} />
      {mode === "DEVELOPMENT"
        ? choicesOptions
        : userChoice?.map((choice, i) => (
            <Button
              key={i}
              variant="outline"
              onClick={() => handleChoiceSelection(choice.option)}
              className={cn(
                "flex items-center gap-2 md:w-1/2 w-full p-0 px-[2px] relative transition-all ease-in delay-75",
                buttonClass,
                allStyles.border[surveyDesign?.button ?? "GREEN"],
                userSelection.includes(choice.option) &&
                  allStyles.light_background_color[
                    surveyDesign?.button ?? "GREEN"
                  ]
              )}
            >
              <Button
                className={cn(
                  "",
                  allStyles.button[surveyDesign?.button ?? "GREEN"],
                  allStyles.button_text[surveyDesign?.button_text ?? "WHITE"]
                )}
                size="sm"
              >
                {getLetter(i)}
              </Button>
              {choice.option}
            </Button>
          ))}
      {mode === "DEVELOPMENT" && (
        <AddOptions
          convertToOptions={convertOptionsToArray}
          choices={userChoice?.map((block) => block.option)}
          className="w-fit"
          value={value}
          setValue={setValue}
        >
          <Button className="p-0 text-gray-400" variant="link">
            Add Choices
          </Button>
        </AddOptions>
      )}
      <SurveyOKButton
        mode={mode}
        onClick={() => {
          onOKClick();
          return userSelection;
        }}
      />
    </div>
  );
};

export const RatingsBlockStyle: FC<{
  mode: mode;
}> = ({ mode }) => {
  const b = useGetCurrentBlock();
  const { surveyDesign, survey } = useSurveyWorkSpace();
  const [rating, setRating] = useState<number>(0);
  const [responses, setResponses] = useLocalStorage<surveyResponseTypes[]>(
    localStorageKeys.surveyResponses,
    []
  );

  const handleSelectRating = (rate: number) => {
    setRating(rate);
  };

  const onOKClick = () => {
    if (b?.is_required && !Boolean(rating)) {
      return toast({
        title: "Error",
        description:
          "This question is required, therefore it has to be answered before proceeding.",
        variant: "destructive",
      });
    }

    saveAnswerForSurvey(
      b?.id ?? "",
      [rating + ""],
      survey?.id ?? "",
      responses,
      setResponses
    );
  };

  useEffect(() => {
    if (!b && mode !== "PRODUCTION") {
      return;
    }

    const userResponse = getSurveyAnswer(b?.id + "");

    setRating(
      typeof Number(userResponse?.response[0]) === "number"
        ? Number(userResponse?.response[0])
        : 0
    );
  }, [b]);

  return (
    <div className="flex flex-col gap-2">
      <SurveyQuestions question={b?.question!} label={b?.label!} mode={mode} />
      <div>
        <Rating
          onRatingSelect={handleSelectRating}
          rating_length={b?.ratings?.ratings_length}
          className="mt-3"
          rating={rating}
          size={30}
          color={surveyDesign?.button ?? "GREEN"}
        />
      </div>
      <SurveyOKButton
        mode={mode}
        onClick={() => {
          onOKClick();
          return [rating + ""];
        }}
      />
    </div>
  );
};

export const YesNoBlockStyle: FC<{ mode: mode }> = ({ mode }) => {
  const b = useGetCurrentBlock();
  const { surveyDesign } = useSurveyWorkSpace();

  const buttons = ["YES", "NO"];

  const surveyId = useSurveyWorkSpace()?.survey?.id ?? "";
  const [userResponse, setUserResponse] = useState("");
  const [responses, setResponses] = useLocalStorage<surveyResponseTypes[]>(
    localStorageKeys.surveyResponses,
    []
  );

  const onOKClick = () => {
    if (b?.is_required && !userResponse) {
      return toast({
        title: "Error",
        description:
          "This question is required, therefore it has to be answered before proceeding.",
        variant: "destructive",
      });
    }

    saveAnswerForSurvey(
      b?.id ?? "",
      [userResponse],
      surveyId,
      responses,
      setResponses
    );
  };

  useEffect(() => {
    if (!b && mode === "DEVELOPMENT") {
      return;
    }

    const userResponse = getSurveyAnswer(b?.id ?? "");

    setUserResponse(userResponse?.response[0] ?? "");
  }, [b]);

  return (
    <div className="flex flex-col gap-1 w-full">
      <SurveyQuestions question={b?.question!} label={b?.label!} mode={mode} />
      <div className="w-1/2 flex flex-col gap-2">
        {buttons.map((button, index) => (
          <Button
            key={index}
            onClick={() => setUserResponse(button)}
            className={cn(
              "w-full rounded-sm flex items-start justify-start",
              userResponse === button
                ? allStyles?.dark_background_color[
                    surveyDesign?.button ?? "GREEN"
                  ]
                : allStyles.button[surveyDesign?.button ?? "GREEN"],
              allStyles.button_text[surveyDesign?.button_text ?? "WHITE"]
            )}
            variant="outline"
          >
            {button}
          </Button>
        ))}
      </div>
      <SurveyOKButton
        mode={mode}
        onClick={() => {
          onOKClick();
          return [userResponse];
        }}
      />
    </div>
  );
};

// Date Group
export const DateBlockStyle: FC<{ mode: mode }> = ({ mode }) => {
  const b = useGetCurrentBlock();
  const { surveyDesign, survey } = useSurveyWorkSpace();
  const [date, setDate] = useState<Date>();
  const [responses, setResponses] = useLocalStorage<surveyResponseTypes[]>(
    localStorageKeys.surveyResponses,
    []
  );

  const onOKClick = () => {
    if (b?.is_required && !date) {
      return toast({
        title: "Error",
        description:
          "This question is required, therefore it has to be answered before proceeding.",
        variant: "destructive",
      });
    }

    saveAnswerForSurvey(
      b?.date?.id + "",
      [date?.toUTCString() ?? ""],
      survey?.id ?? "",
      responses,
      setResponses
    );
  };

  useEffect(() => {
    if (!b) {
      return;
    }

    const userResponse = getSurveyAnswer(b?.date?.id + "" ?? "");

    setDate(userResponse ? new Date(userResponse.response[0]) : undefined);
  }, [b]);

  return (
    <div className="flex w-full flex-col gap-2">
      <SurveyQuestions mode={mode} question={b?.question!} label={b?.label!} />
      <DatePicker
        format={b?.date?.format ?? "PPP"}
        date={date}
        setDate={setDate}
        className={cn(allStyles.border[surveyDesign?.color ?? "GREEN"])}
      />
      <SurveyOKButton
        mode={mode}
        onClick={() => {
          onOKClick();
          return [date?.toUTCString() ?? ""];
        }}
      />
    </div>
  );
};

export const TimeBlockStyle: FC<{}> = () => {
  return <div> Time</div>;
};

// End Screen
export const EndScreenBlockStyle: FC<{ mode: mode }> = ({ mode }) => {
  const b = useGetCurrentBlock();
  const { surveyDesign, survey, setAutoSaveUiProps } = useSurveyWorkSpace();
  const socialMediaIcons: Record<socialMediaTypes, any> = {
    email: <MailIcon size={35} />,
    facebook: <FaceBookIcon size={35} />,
    instagram: <InstagramIcon size={35} />,
    tiktok: <TikTokIcon size={35} />,
    twitter: <TwitterIcon size={35} />,
    whatsapp: <WhatsAppIcon size={35} />,
  };
  const [endScreenHeader, setEndScreenHeader] = useState("");
  const delayEndScreenHeader = useDebounce(endScreenHeader, 3000);

  const action = new SurveyWorkSpace(survey?.id ?? "");

  useEffect(() => {
    if (
      b?.end_screen.message === delayEndScreenHeader ||
      !delayEndScreenHeader
    ) {
      return;
    }

    const handleChange = async () => {
      try {
        setAutoSaveUiProps({
          is_visible: true,
          message: "Saving your progress please wait...",
          status: "loading",
        });
        await action.modifyBlock(b?.end_screen.id ?? "", "EndScreen", {
          message: delayEndScreenHeader,
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

    handleChange();
  }, [delayEndScreenHeader]);

  useEffect(() => {
    if (!b?.end_screen) {
      return;
    }

    const { message } = b.end_screen;
    setEndScreenHeader(message);

    return () => setEndScreenHeader("");
  }, [b?.end_screen]);

  return (
    <div className="w-full flex items-center justify-center flex-col gap-3">
      {mode === "DEVELOPMENT" ? (
        <Input
          value={endScreenHeader}
          onChange={(e) => setEndScreenHeader(e.target.value)}
          className="flex w-full text-center bg-transparent flex-grow font-semibold rounded-none h-auto text-xl px-0 py-0 border-y-0 border-x-0 ring-offset-background file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
        />
      ) : (
        <h1>{b?.end_screen?.message}</h1>
      )}

      <div className="w-full flex items-center gap-2 justify-center">
        {b?.end_screen?.social_media.map((sm) => {
          // const Icon = socialMediaIcons[sm.media_type];
          return (
            <a key={sm.id} href={sm.social_media_link}>
              {socialMediaIcons[sm.media_type]}
            </a>
          );
        })}
      </div>

      {b?.end_screen?.button && (
        <Button
          className={allStyles.button[surveyDesign?.button ?? "GREEN"]}
          asChild
          size="sm"
        >
          <a target="__blank" href={b.end_screen.button_link}>
            {b.end_screen?.button_text}
          </a>
        </Button>
      )}
    </div>
  );
};

export const WelcomeScreenBlockStyle: FC<{
  data: WelcomeScreenBlock;
  mode: mode;
}> = ({ mode }) => {
  const b = useGetCurrentBlock();
  const { survey, surveyDesign, setAutoSaveUiProps, survey_blocks } =
    useSurveyWorkSpace();
  const navigate = useNavigate();
  const { navigate: n } = useSurveyNavigation();
  const action = new SurveyWorkSpace(survey?.id ?? "");
  const [header, setHeader] = useState("");

  const delayHeader = useDebounce(header, 3000);
  const blockList = survey_blocks?.map((sb) => sb.id);
  const currentIndex = blockList?.indexOf(b?.id ?? "");

  useEffect(() => {
    if (!b?.welcome_screen) {
      return;
    }

    setHeader(b.welcome_screen.message);

    return () => setHeader("");
  }, [b?.welcome_screen]);

  useEffect(() => {
    if (b?.welcome_screen?.message === delayHeader || !delayHeader) {
      return;
    }

    const handleChange = async () => {
      setAutoSaveUiProps({
        is_visible: true,
        message: "Loading please wait...",
        status: "loading",
      });
      try {
        await action.modifyBlock(b?.welcome_screen.id!, "WelcomeScreen", {
          message: header,
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

    handleChange();
  }, [delayHeader]);

  const handleStartSurvey = () => {
    n(navigate, currentIndex ?? 0, blockList || [], "next");
  };

  return (
    <div
      className={cn(
        "w-full bg-[url] flex flex-col gap-1 items-center justify-center",
        `bg-[${b?.welcome_screen?.background}]`
      )}
    >
      {mode === "DEVELOPMENT" ? (
        <Input
          value={header}
          onChange={(e) => setHeader(e.target.value)}
          className="flex w-full text-center flex-grow font-semibold rounded-none h-auto text-xl px-0 py-0 border-y-0 border-x-0 bg-transparent ring-offset-background file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
        />
      ) : (
        b?.welcome_screen?.message && <h1>{b?.welcome_screen?.message}</h1>
      )}
      {b?.welcome_screen?.custom_html && (
        <div
          className="text-center"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(b?.welcome_screen?.custom_html),
          }}
        />
      )}
      {b?.welcome_screen?.have_continue_button && (
        <Button
          disabled={mode === "DEVELOPMENT"}
          onClick={handleStartSurvey}
          className={cn(
            "rounded-sm mt-2",
            allStyles.button[surveyDesign?.button ?? "GREEN"]
          )}
          size="sm"
        >
          {b?.welcome_screen?.button_text || "Start Survey"}
        </Button>
      )}
      <div>
        {survey?.show_time_to_complete && (
          <div className="flex items-center gap-1">
            <Clock10Icon size={12} />
            <p className="text-[12px]">
              Takes {mode === "DEVELOPMENT" ? "X" : survey?.submission_time}{" "}
              minutes
            </p>
          </div>
        )}
        {survey?.show_number_of_submissions && (
          <p className="flex items-center gap-1 text-[12px]">
            <Users2Icon size={12} /> {survey.response_count} people have filled
            this out
          </p>
        )}
      </div>
    </div>
  );
};

// Other Groups
export const RedirectURLBlockStyle: FC<{ mode: mode }> = ({ mode }) => {
  const b = useGetCurrentBlock();
  const { surveyDesign } = useSurveyWorkSpace();
  const ref = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    if (!b?.redirect_with_url) {
      return;
    }

    const timer = setTimeout(() => {
      ref.current?.click();
    }, 2000);

    return () => clearTimeout(timer);
  }, [b?.redirect_with_url]);

  return (
    <div className="flex flex-col gap-3 items-center w-full">
      <h1>{b?.redirect_with_url?.message ?? "Redirect With URL"}</h1>
      {b?.redirect_with_url?.custom_html && (
        <div
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(
              b?.redirect_with_url?.custom_html as string,
              { USE_PROFILES: { html: true } }
            ),
          }}
        />
      )}
      {b?.redirect_with_url?.click_option && (
        <Button
          asChild
          disabled={mode === "DEVELOPMENT"}
          className={cn(
            allStyles.button[surveyDesign?.button ?? "GREEN"],
            "text-white"
          )}
          size="sm"
        >
          <Link ref={ref} to={b?.redirect_with_url?.url}>
            {b.redirect_with_url?.button_text}
          </Link>
        </Button>
      )}
    </div>
  );
};

export const QuestionGroupBlockStyle: FC<{}> = () => {
  return <div>Redirect</div>;
};

export const WebsiteBlockStyle: FC<{ mode: mode }> = ({ mode }) => {
  const b = useGetCurrentBlock();
  const { survey } = useSurveyWorkSpace();
  const [responses, setResponses] = useLocalStorage<surveyResponseTypes[]>(
    localStorageKeys.surveyResponses,
    []
  );
  const [userResponse, setUserResponse] = useState("");

  const onOKClick = () => {
    if (b?.is_required && "") {
      return toast({
        title: "Error",
        description:
          "This question is required, therefore it has to be answered before proceeding.",
        variant: "destructive",
      });
    }

    saveAnswerForSurvey(
      b?.id || "",
      [userResponse],
      survey?.id || "",
      responses,
      setResponses
    );
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <SurveyQuestions
        label={b?.label ?? ""}
        question={b?.question ?? ""}
        mode={mode}
      />
      <SurveyInput
        value={userResponse}
        onChange={(e) => setUserResponse(e.target.value)}
        disabled={mode === "DEVELOPMENT"}
        placeholder="http://"
      />
      <SurveyOKButton
        mode={mode}
        onClick={() => {
          onOKClick();
          return [userResponse];
        }}
      />
    </div>
  );
};

export const PictureViews: FC<{
  mode: mode;
  pictures: PictureChoiceImages;
  className?: string;
  index: number;
  isSelected?: boolean;
}> = ({
  mode,
  pictures: {
    url,
    alt_tag,
    id,
    name,
    blur,
    brightness,
    saturation,
    contrast,
    rotationIndex,
    x,
    y,
    grayscale,
    pixelate,
    hue,
    invert,
  },
  className,
  index,
  isSelected,
}) => {
  const { getLetter } = useText();
  const {
    survey,
    survey_blocks,
    setSurveyBlocks,
    setAutoSaveUiProps,
    surveyDesign,
  } = useSurveyWorkSpace();
  const action = new SurveyWorkSpace(survey?.id ?? "");
  const b = useGetCurrentBlock();
  const rotationDeg = [0, 90, 180, 270];
  const [props, setProps] = useState({
    name: "",
  });
  const delayName = useDebounce(props.name, 3000);
  const [data, setData] = useState<uploaderProps>({
    files: [],
    previewUrl: [],
  });
  const [colorFilter, setColorFilter] = useState<imageEditorProps>({
    saturation: 0,
    brightness: 100,
    contrast: 100,
    blur: 0,
    grayscale: 0,
    hue: 0,
    pixelate: 0,
    invert: 0,
  });
  const [transformImage, setTransformImage] = useState<transformImageProps>({
    rotationIndex: 0,
    flipIndex: {
      x: 1,
      y: 1,
    },
  });

  console.log(isSelected);

  const handleRemoveImage = async () => {
    setAutoSaveUiProps({
      is_visible: true,
      message: "Saving your progress...",
      status: "loading",
    });
    const data = survey_blocks?.map((block) => {
      return block.id === b?.id
        ? {
            ...block,
            picture_choice: {
              ...block.picture_choice,
              images: block.picture_choice.images.filter((image) => {
                return image.id !== id;
              }),
            },
          }
        : { ...block };
    }) as ISurveyBlocks[];

    setSurveyBlocks(data);
    try {
      await action.modifyBlock(
        b?.picture_choice.id ?? "",
        "PictureChoice",
        { id },
        undefined,
        undefined,
        undefined,
        "remove_picture_choice"
      );
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

  const applyEdittingChanges = async () => {
    // Start Loading...
    setAutoSaveUiProps({
      is_visible: true,
      message: "Saving your progress...",
      status: "loading",
    });
    const { saturation, contrast, blur, brightness } = colorFilter;
    const {
      rotationIndex,
      flipIndex: { x, y },
    } = transformImage;

    const data = survey_blocks?.map((block) => {
      return block.id === b?.id
        ? {
            ...block,
            picture_choice: {
              ...block.picture_choice,
              images: block.picture_choice.images.map((image) => {
                return image.id === id
                  ? {
                      ...image,
                      brightness,
                      blur,
                      contrast,
                      saturation,
                      rotationIndex,
                      y,
                      x,
                    }
                  : { ...image };
              }),
            },
          }
        : { ...block };
    }) as ISurveyBlocks[];

    setSurveyBlocks(data);

    try {
      await action.modifyBlock(
        b?.picture_choice.id ?? "",
        "PictureChoice",
        { saturation, contrast, blur, brightness, x, y, rotationIndex, id },
        undefined,
        undefined,
        undefined,
        "edit_picture_image"
      );
      setAutoSaveUiProps({
        is_visible: true,
        message: "Changes has been applied successfully.",
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

  const handleNameChange = async () => {
    setAutoSaveUiProps({
      is_visible: true,
      message: "Saving your progress...",
      status: "loading",
    });
    try {
      const data = survey_blocks?.map((block) => {
        return block.id === b?.id
          ? {
              ...block,
              picture_choice: {
                ...block.picture_choice,
                name: props.name,
              },
            }
          : { ...block };
      }) as ISurveyBlocks[];

      setSurveyBlocks(data);

      await action.modifyBlock(
        b?.picture_choice.id ?? "",
        "PictureChoice",
        { id, name: props.name },
        undefined,
        undefined,
        undefined,
        "edit_picture_image"
      );
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

  const handleImageUpload = async () => {
    const _d = survey_blocks?.map((block) => {
      return block.id === b?.id
        ? {
            ...block,
            picture_choice: {
              ...block.picture_choice,
              images: block.picture_choice.images.map((image) => {
                return image.id === id
                  ? {
                      ...image,
                      url: data?.previewUrl?.[0] ?? "",
                      alt_tag: data.files[0].name,
                    }
                  : { ...image };
              }),
            },
          }
        : { ...block };
    }) as ISurveyBlocks[];
    setSurveyBlocks(_d);

    try {
      const action_type = "add_image_to_picture_choice";
      const image = data.files[0];
      const block_id = b?.id ?? "";
      const block_type: BlockToolProps = "PictureChoice";

      setAutoSaveUiProps({
        is_visible: true,
        message: "Saving your progress...",
        status: "loading",
      });

      await action.addImageToPictureChoice({
        block_id,
        block_type,
        url,
        image,
        id,
        action_type,
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

  useEffect(() => {
    name && setProps({ ...props, name });
    b?.picture_choice &&
      setColorFilter({
        brightness,
        blur,
        contrast,
        saturation,
        grayscale,
        hue,
        pixelate,
        invert,
      });
    b?.picture_choice &&
      setTransformImage({
        rotationIndex,
        flipIndex: {
          x,
          y,
        },
      });
    !!b?.picture_choice.images &&
      setData({
        files: [],
        previewUrl: url ? [url] : [],
      });

    //When the component unmount reset the values
    return () => {
      setColorFilter({
        saturation: 0,
        blur: 0,
        brightness: 0,
        contrast: 0,
        pixelate: 0,
        grayscale: 0,
        hue: 0,
        invert,
      });
      setTransformImage({
        flipIndex: {
          x: 1,
          y: 1,
        },
        rotationIndex: 0,
      });
    };
  }, [name, b?.picture_choice]);

  useEffect(() => {
    if (delayName === name || !delayName) {
      return;
    }

    handleNameChange();
  }, [delayName]);

  useEffect(() => {
    if (!data.files.length || !data.previewUrl?.length) {
      return;
    }

    handleImageUpload();
  }, [data]);

  const Image = (
    <Img
      style={imageEdittingStyles({
        brightness,
        blur,
        contrast,
        rotationDeg,
        rotationIndex,
        saturation,
        x,
        y,
        hue,
        grayscale,
        pixelate,
        invert,
      })}
      className="w-full h-full"
      src={url}
      alt={alt_tag}
    />
  );

  const URLUnavailable = (
    <div
      className={cn(
        " w-full h-full flex items-center justify-center",
        allStyles.dark_background_color[surveyDesign?.button ?? "GREEN"]
      )}
    >
      <ImagePlusIcon className="" />
    </div>
  );

  const DEVELOPMENT = (
    <div className="h-full w-full relative">
      <ImageUploader
        multiples={1}
        maxSize={3}
        data={data}
        setData={setData}
        filesToAccept={[".jpeg", ".png", ".svg"]}
        className="h-full"
        button={url ? Image : URLUnavailable}
      />
      {/* Edit and Change Existing Image */}
      {url && (
        <div className="absolute group-hover:flex hidden items-center gap-1 top-1 right-1">
          <EditImage
            className="w-5 h-5"
            onApplyChanges={applyEdittingChanges}
            transform={transformImage}
            setTransformImage={setTransformImage}
            colorFilter={colorFilter}
            setColorFilter={setColorFilter}
            imageUrl={url}
          >
            <Hint
              element={
                <Button
                  className="w-5 rounded-sm h-5 p-[3px]"
                  variant="secondary"
                >
                  <EditIcon />
                </Button>
              }
              content="Edit Image"
            />
          </EditImage>
        </div>
      )}
    </div>
  );

  const PRODUCTION = Image;

  // Depends on the mode the user is in either DEV or PROD
  const imageView: Record<mode, any> = {
    DEVELOPMENT,
    PRODUCTION,
    PREVIEW: PRODUCTION,
  };

  return (
    <div
      className={cn(
        "h-[10rem] w-full flex flex-col gap-1 border group relative cursor-pointer rounded-sm p-2",
        className,
        isSelected
          ? allStyles.dark_background_color[surveyDesign?.button ?? "GREEN"]
          : allStyles.light_background_color[surveyDesign?.button ?? "GREEN"]
      )}
    >
      <div className="h-[85%] w-full rounded-sm">{imageView[mode]}</div>
      <div className="w-full h-[15%] flex items-center gap-1">
        <Button
          className="w-8 h-full rounded-sm p-[3px] text-sm"
          variant="outline"
        >
          {getLetter(index)}
        </Button>
        <div
          className={
            allStyles.button_text[surveyDesign?.button_text ?? "GREEN"]
          }
        >
          {mode === "DEVELOPMENT" ? (
            <Input
              value={props.name}
              onChange={(e) => setProps({ ...props, name: e.target.value })}
              className="h-full placeholder:text-green-700 focus-visible:ring-0 px-[2px] focus-visible:ring-offset-0 border-none bg-transparent outline-none focus:outline-none rounded-none focus:ring-0"
              placeholder="Choice"
            />
          ) : (
            <Description text={name} />
          )}
        </div>
      </div>
      {/* Remove Image visible only in DEV MODE */}
      {mode === "DEVELOPMENT" && (
        <Hint
          element={
            <Button
              onClick={handleRemoveImage}
              className="w-4 h-4 items-center justify-center hidden group-hover:flex absolute top-0 -mt-1 -mr-1 right-0 p-[2px] rounded-full"
              variant="default"
            >
              <X size={15} />
            </Button>
          }
          content="Remove image"
        />
      )}
    </div>
  );
};

export const RequiredDot: FC<{}> = () => {
  return <AsteriskIcon className=" text-red-500" size={12} />;
};

export const SurveyQuestions: FC<{
  mode: mode;
  question: string;
  label: string;
}> = ({ mode, question, label }) => {
  const b = useGetCurrentBlock();
  const { survey, survey_blocks, setSurveyBlocks, setAutoSaveUiProps } =
    useSurveyWorkSpace();
  const action = new SurveyWorkSpace(survey?.id ?? "");

  const [isFirstMount, setIsFirstMount] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const data = survey_blocks?.map((block) => {
      return block.id === b?.id ? { ...block, [name]: value } : { ...block };
    }) as ISurveyBlocks[];

    setSurveyBlocks(data);
  };

  const delayHeaderChange = useDebounce(b?.question, 3000);
  const delayLabelChange = useDebounce(b?.label, 3000);

  useEffect(() => {
    if (!b) return;

    if (delayHeaderChange && delayLabelChange) {
      setIsFirstMount(false);
    }
  }, [b]);

  useEffect(() => {
    if (isFirstMount) {
      return;
    }

    setAutoSaveUiProps({
      is_visible: true,
      message: "Please wait while we save your progress.",
      status: "loading",
    });

    // API LOGIC HERE!
    const handleSaving = async () => {
      try {
        await action.modifyBlock(
          0,
          "Choices",
          {},
          b?.is_required,
          b?.is_visible,
          b?.id,
          "header_or_label",
          delayHeaderChange,
          delayLabelChange
        );

        setAutoSaveUiProps({
          is_visible: true,
          message: "Changes applied successfully.",
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

    handleSaving();

    return () => setIsFirstMount(true);
  }, [delayHeaderChange, delayLabelChange]);

  return (
    <div className="w-full">
      <div className="flex gap-1">
        {b?.is_required && <RequiredDot />}
        {mode === "DEVELOPMENT" ? (
          <Input
            name="question"
            onChange={handleChange}
            value={b?.question}
            placeholder="This a Question placeholder!!"
            className="flex w-full flex-grow font-semibold rounded-none h-auto text-xl px-0 py-0 border-y-0 border-x-0 bg-transparent ring-offset-background file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
          />
        ) : (
          question && <h1 className="break-words">{question}</h1>
        )}
      </div>
      {mode === "DEVELOPMENT" ? (
        <Input
          name="label"
          onChange={handleChange}
          value={b?.label}
          placeholder="This a Label placeholder!!"
          className="flex w-full flex-grow italic text-sm rounded-none h-auto px-0 py-0 border-y-0 border-x-0 bg-transparent ring-offset-background file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
        />
      ) : (
        label && <Description text={label} />
      )}
    </div>
  );
};

export const SurveyOKButton: FC<{ onClick: () => string[]; mode: mode }> = ({
  mode,
  onClick: _,
}) => {
  const { surveyDesign, survey_blocks, survey, surveyLogics } =
    useSurveyWorkSpace();
  const {
    navigate: surveyNavigator,
    setDisableBtnTimer,
    disableBtnTimer,
  } = useSurveyNavigation();
  const navigate = useNavigate();
  const location = useLocation();
  const b = useGetCurrentBlock();

  const qs = queryString.parse(location.search, { parseBooleans: true }) as {
    block: string;
  };

  useEffect(() => {
    if (!disableBtnTimer) {
      return;
    }

    const timer = setTimeout(() => {
      setDisableBtnTimer(0);
    }, disableBtnTimer * 1000);

    return () => clearTimeout(timer);
  }, [disableBtnTimer]);

  const blockList = survey_blocks?.map((block) => block.id) ?? [];
  const currentIndex = blockList.indexOf(qs.block ?? "");

  const handleClick = async () => {
    if (mode === "DEVELOPMENT") {
      return;
    }
    const userResponse = _();

    const payload: surveyResponseTypes = {
      response: userResponse,
      survey: survey?.id || "",
      block: b?.id || "",
    };

    const logic = await handleLogic(surveyLogics, payload, b?.id + "");

    setDisableBtnTimer(logic?.disableBtn || 0);

    if (logic?.disableBtn) {
      return;
    }

    if (logic?.goTo) {
      navigate(`?block=${logic.goTo}`);
      return;
    }

    if (b?.is_required && !getSurveyAnswer(b?.id + "")?.response.length) {
      return toast({
        title: "Error",
        description:
          "This question is required, therefore it has to be answered before proceeding.",
        variant: "destructive",
      });
    }

    // After everything
    surveyNavigator(navigate, currentIndex, blockList, "next");
  };

  return (
    <Button
      disabled={Boolean(disableBtnTimer)}
      onClick={handleClick}
      className={cn(
        "h-7 px-3 w-fit flex items-center gap-1 rounded-sm",
        allStyles.button[surveyDesign?.button ?? "GREEN"],
        allStyles.button_text[surveyDesign?.button_text ?? "GREEN"]
      )}
      size="sm"
    >
      <Check size={15} />
      OK
    </Button>
  );
};

export const AddOptions: FC<{
  children: React.ReactNode;
  header?: string;
  convertToOptions: () => void;
  description?: string;
  className?: string;
  choices?: string[];
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
}> = ({
  children,
  className,
  convertToOptions,
  header = "Add The Options You Want To See",
  description = "Start typing your choices below and make sure you separate them with either comma (,) or period(.).",
  value,
  setValue,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={(e) => setOpen(e)}>
      <DialogTrigger className={cn("", className)}>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{header}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Textarea
          name="choices"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full h-[10rem] resize-none"
        />
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          <Button
            onClick={() => {
              convertToOptions();
              setOpen(false);
            }}
            variant="base"
            size="sm"
          >
            Add Choices
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
