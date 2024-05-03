import {
  IStudent,
  ITeacher,
  IUser,
  app_config,
  emailJSParams,
  localStorageKeys,
} from "../Types/components.types";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { toast } from "../components/use-toaster";
import { v4 as uuidV4 } from "uuid";
import { SurveyWorkSpace } from "./surveyApis";
import {
  AutoSaveUi,
  BlockToolProps,
  ICustomLogicConditions,
  endFunction,
  operatorTypes,
} from "../Types/survey.types";
import { CSSProperties, SetStateAction } from "react";
import queryString from "query-string";
import { NavigateFunction } from "react-router-dom";

export const sendEmailToDeveloper = async ({
  firstName,
  lastName,
  phoneNumber,
  email,
  message,
}: emailJSParams) => {
  const service_id = import.meta.env.VITE_EmailJSServiceId;
  const template_id = import.meta.env.VITE_EmailJSTemplateId;
  const user_id = import.meta.env.VITE_EmailJSPublicKey;

  //This data is the params to be send to emailJS for processing
  const data = {
    service_id,
    template_id,
    user_id,
    template_params: {
      firstName: firstName || "Unknown",
      lastName: lastName || "Unknown",
      phoneNumber: phoneNumber || "Unknown",
      email,
      message,
    },
  };

  return new Promise((resolve, reject) => {
    try {
      // Synchronous
      axios.post("https://api.emailjs.com/api/v1.0/email/send", data);
      return resolve("Message sent successfully.");
    } catch (error: any) {
      reject(error.message);
    }
  });
};

export const seriliazeParams = (
  data: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
  const { name, value } = data.target;

  return `${name}=${value}`;
};

export const capitalize_first_letter = (word?: string) => {
  if (!word) return;
  return word[0]?.toUpperCase() + word?.substring(1);
};

export const edit_profile = async (
  user_data: Partial<IUser>,
  profile_image?: File
) => {
  try {
    const access_token = Cookies.get("access_token");
    const formData = new FormData();

    formData.append("account_type", user_data.account_type || "");
    formData.append("age", user_data.age + "");
    formData.append("auth_provider", user_data.auth_provider || "");
    formData.append("bio", user_data.bio || "");
    formData.append("email", user_data.email || "");
    formData.append("first_name", user_data.first_name || "");
    formData.append("last_name", user_data.last_name || "");
    formData.append("profile_image", profile_image || "");
    formData.append("signup_complete", user_data.signup_complete + "");
    formData.append("points", user_data.points + "");
    formData.append("first_time_login", user_data.first_time_login + "");

    const res = await axios.patch(
      import.meta.env.VITE_QUIZLY_API_HOST + "/api/v1/user/",
      {
        formData,
      },
      {
        headers: {
          Authorization: "Bearer " + access_token,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (res.status !== 200) {
      throw new Error("Something went wrong..");
    }

    return "success";
  } catch (error: any) {
    throw error.response.data.message || error.message;
  }
};

export const request_email_verification = async (email: string) => {
  try {
    const res = await axios.post(
      import.meta.env.VITE_QUIZLY_API_HOST + "/api/v1/auth/verify-email/",
      {
        email: email,
      }
    );

    return res.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};

export const readAloud = async ({
  text,
  pitch = 0.5,
}: {
  text: string | undefined;
  pitch?: number;
}) => {
  if (!text) return;

  const ROBOT = window.speechSynthesis;
  const default_voice = ROBOT.getVoices()[80];

  const utterance = new SpeechSynthesisUtterance(text);

  utterance.voice = default_voice;
  utterance.pitch = pitch;
  utterance.lang = "English";

  if (utterance.onerror) {
    return toast({
      title: "Error",
      description: "Something went with the Speech API",
      variant: "destructive",
    });
  }

  ROBOT.speak(utterance);
};

// export const mistakes_from_text = (
//   user_text: string,
//   original_text: string
// ): number => {
//   if (user_text === original_text) {
//     return 0;
//   }
//   let n = user_text.length,
//     m = original_text.length;
//   if (n === 0 || m === 0) {
//     return n + m;
//   }
//   let x = 0,
//     y,
//     a,
//     b,
//     c,
//     d,
//     g,
//     h;
//   let p = new Uint16Array(n);
//   let u = new Uint32Array(n);
//   for (y = 0; y < n; ) {
//     u[y] = user_text.charCodeAt(y);
//     p[y] = ++y;
//   }

//   for (; x + 3 < m; x += 4) {
//     var e1 = original_text.charCodeAt(x);
//     var e2 = original_text.charCodeAt(x + 1);
//     var e3 = original_text.charCodeAt(x + 2);
//     var e4 = original_text.charCodeAt(x + 3);
//     c = x;
//     b = x + 1;
//     d = x + 2;
//     g = x + 3;
//     h = x + 4;
//     for (y = 0; y < n; y++) {
//       a = p[y];
//       if (a < c || b < c) {
//         c = a > b ? b + 1 : a + 1;
//       } else {
//         if (e1 !== u[y]) {
//           c++;
//         }
//       }

//       if (c < b || d < b) {
//         b = c > d ? d + 1 : c + 1;
//       } else {
//         if (e2 !== u[y]) {
//           b++;
//         }
//       }

//       if (b < d || g < d) {
//         d = b > g ? g + 1 : b + 1;
//       } else {
//         if (e3 !== u[y]) {
//           d++;
//         }
//       }

//       if (d < g || h < g) {
//         g = d > h ? h + 1 : d + 1;
//       } else {
//         if (e4 !== u[y]) {
//           g++;
//         }
//       }
//       p[y] = h = g;
//       g = d;
//       d = b;
//       b = c;
//       c = a;
//     }
//   }

//   for (; x < m; ) {
//     var e = original_text.charCodeAt(x);
//     c = x;
//     d = ++x;
//     for (y = 0; y < n; y++) {
//       a = p[y];
//       if (a < c || d < c) {
//         d = a > d ? d + 1 : a + 1;
//       } else {
//         if (e !== u[y]) {
//           d = c + 1;
//         } else {
//           d = c;
//         }
//       }
//       p[y] = d;
//       c = a;
//     }
//     h = d;
//   }

//   return h as number;
// };

export const isObjectEmpty = (obj?: object) => {
  if (!obj) {
    return false;
  }
  return Object.keys(obj).length === 0;
};
// Function to toggle between dark and light modes
export const toggle_modes = ({
  theme,
  saveTheme,
  setIsDarkMode,
}: {
  theme: "dark" | "light" | null;
  saveTheme: React.Dispatch<React.SetStateAction<"dark" | "light" | null>>;
  setIsDarkMode: (props: boolean) => void;
}) => {
  // Toggle to light mode if the current theme is dark
  if (theme === "dark") {
    saveTheme("light");
    document.documentElement.classList.remove("dark");
    setIsDarkMode(false);
  }

  // Toggle to dark mode if the current theme is light
  if (theme === "light") {
    saveTheme("dark");
    document.documentElement.classList.add("dark");
    setIsDarkMode(true);
  }
};

export const generateUUID = () => {
  return uuidV4();
};

export const shuffleArray = <T>(array: T[]) => {
  return array.sort(() => Math.random() - 0.9);
};

export const handleScrollInView = (ref: React.RefObject<HTMLDivElement>) => {
  ref.current?.scrollIntoView({
    behavior: "smooth",
    inline: "center",
  });
};

export const errorMessageForToast = (
  error: AxiosError<{ message: string }>
) => {
  const message: string =
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong...";
  return message;
};

export const handleAddBlock = async ({
  survey_id,
  block_type,
  setAutoSaveUiProps,
}: {
  survey_id: string;
  block_type: BlockToolProps;
  setAutoSaveUiProps: (props: AutoSaveUi) => void;
}) => {
  const survey = new SurveyWorkSpace(survey_id);

  return new Promise(async (resolve, reject) => {
    try {
      const res = await survey.blockAction({
        survey_id,
        block_type,
        action: "ADD",
      });
      setAutoSaveUiProps({
        status: "success",
        message: block_type + " added to the existing blocks.",
        is_visible: true,
      });
      resolve(res);
    } catch (error) {
      setAutoSaveUiProps({
        status: "failed",
        message: errorMessageForToast(error as AxiosError<{ message: string }>),
        is_visible: true,
      });
      reject(error);
    }
  });
};

export const reorderList = (
  list: any[],
  startIndex: number,
  endIndex: number
) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  console.log({ result, removed });

  return result;
};

export const imageEdittingStyles = ({
  brightness,
  contrast,
  saturation,
  blur,
  rotationIndex,
  x,
  y,
  rotationDeg,
  grayscale,
}: {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  rotationIndex: number;
  x: number;
  y: number;
  hue: number;
  grayscale: number;
  pixelate: number;
  rotationDeg: number[];
  invert: number;
}) => {
  const style: CSSProperties = {
    filter: `
    brightness(${brightness}%)
    contrast(${contrast}%)
    saturate(${saturation}%)
    blur(${blur}px)
    grayscale(${grayscale}%)
    `,
    transform: `rotate(${rotationDeg[rotationIndex]}deg) scaleX(${x}) scaleY(${y})`,
  };

  return style;
};

export const setBlockIdInURL = (
  blockID: string,
  navigate: NavigateFunction
) => {
  const qs = queryString.stringify({
    block: blockID,
  });

  navigate(`?${qs}`);
};

export const createSurveyUserId = () => {
  const user_id = Cookies.get(app_config.surveyUserID);

  const new_user_id = generateUUID();

  if (!user_id) {
    Cookies.set(app_config.surveyUserID, new_user_id);
    return new_user_id;
  }

  return user_id;
};

export type surveyResponseTypes = {
  response: string[];
  survey: string;
  block: string;
};

export const saveAnswerForSurvey = async (
  block: string,
  response: string[],
  survey: string,
  responses: surveyResponseTypes[],
  setResponses: React.Dispatch<SetStateAction<surveyResponseTypes[]>>
) => {
  try {
    const findResponse = responses?.find((res) => res.block === block);

    if (findResponse) {
      const modifiedResponses = responses?.map((res) => {
        return res.block === block
          ? { ...res, block, survey, response }
          : { ...res };
      });
      setResponses(modifiedResponses);
      return;
    }

    console.log("Passed");

    const payload: surveyResponseTypes = {
      block,
      response,
      survey,
    };

    setResponses([...responses, payload]);

    // Check if user has answered the question
  } catch (error) {
    toast({
      title: "Error",
      description: String(error),
      variant: "destructive",
    });
  }
};

export const getSurveyAnswer = (block: string) => {
  const responses = localStorage.getItem(localStorageKeys.surveyResponses);
  const parseData = JSON.parse(responses || "[]") as surveyResponseTypes[];

  const response = parseData.find((res) => res.block === block);

  return response;
};

export const handleLogic = async (
  surveyLogics: ICustomLogicConditions[],
  userResponse: surveyResponseTypes,
  blockId: string
) => {
  const currentLogic = surveyLogics?.find((logic) => logic.field === blockId);
  const response = userResponse.response.map((res) => res.toLowerCase());

  let actionData = {
    disableBtn: 0,
    goTo: "",
  };

  if (!currentLogic) {
    return;
  }

  const { fallBack, endFunction, endValue, value, operator } = currentLogic;

  const actionTypes: Record<operatorTypes, any> = {
    eq: response[0].toLowerCase() === value.toString().toLowerCase(),
    gt: Number(userResponse?.response[0]) > Number(value),
    includes: response.includes((value as string).toLowerCase()),
    lt: Number(userResponse?.response[0]) < Number(value),
    ne:
      userResponse?.response[0].toLowerCase() !==
      value.toString().toLowerCase(),
    not_include: !response.includes((value as string).toLowerCase()),
  };

  const fallAction: Record<endFunction, any> = {
    disable_btn: () => (actionData["disableBtn"] = Number(endValue)),
    goto: () => (actionData["goTo"] = fallBack),
  };

  if (actionTypes[operator]) {
    fallAction[endFunction]();
  }

  return actionData;
};

export function getAnonymousID(isAuthenticated: boolean) {
  if (isAuthenticated) {
    return;
  }

  let anonymousID = sessionStorage.getItem("anonymous_id");

  // If anonymous_id is not found in sessionStorage, generate a new one and save it
  if (!anonymousID) {
    anonymousID = generateUUID();
    sessionStorage.setItem("anonymous_id", anonymousID);
  }

  return anonymousID;
}
