export type formType =
  | "contact"
  | "registration"
  | "request"
  | "feedback"
  | "poll";

type deviceViewProps = "desktop" | "mobile";

export interface EndScreenSocialMedia {
  id: string;
  social_media_link: string;
  media_type: socialMediaTypes;
}

export type AutoSaveUi = {
  status: "loading" | "failed" | "success";
  message: string;
  is_visible: boolean;
};

export interface SurveyWorkSpaceState {
  formType: formType;
  deviceView: deviceViewProps;
  collapseSideBar: {
    sideBarOne: boolean;
    sideBarTwo: boolean;
  };
  survey_blocks?: ISurveyBlocks[];
  survey?: ISurvey;
  auto_save_ui_props: AutoSaveUi;
}

export interface SurveyWorkSpaceAction {
  setFormType: (props: formType) => void;
  setCollapseSideBar: (props: {
    sideBarOne: boolean;
    sideBarTwo: boolean;
  }) => void;
  setDeviceView: (props: deviceViewProps) => void;
  setSurvey: (props: ISurvey) => void;
  setSurveyBlocks: (props: ISurveyBlocks[]) => void;
  setAutoSaveUiProps: (props: AutoSaveUi) => void;
}

export type BlockToolProps =
  | "Email"
  | "PhoneNumber"
  | "Website"
  | "Choices"
  | "DropDown"
  | "PictureChoice"
  | "YesNo"
  | "Rating"
  | "LongText"
  | "ShortText"
  | "Time"
  | "Date"
  | "Number"
  | "QuestionGroup"
  | "EndScreen"
  | "RedirectToURL"
  | "WelcomeScreen";

export interface ISurvey {
  id: string;
  name?: string;
  status: "DEVELOPMENT" | "PRODUCTION";
  response_count: number;
  created_at: Date | string;
  updated_at: Date | string;
  host: string;
  show_number_of_submissions: boolean;
  show_time_to_complete: boolean;
}

export interface WelcomeScreenBlock {
  id: number;
  message: string;
  have_continue_button: boolean;
  number: number;
  label: string;
  button_text?: string;
  custom_html: string;
  background?: string;
  background_image?: string;
}

export interface ShortTextBlock {
  id: number;
  max_character: number;
  label?: string;
  number: number;
  background?: string;
  background_image?: string;
  place_holder: string;
}

export interface EndScreen {
  id: number;
  button: boolean;
  button_link: string;
  message: string;
  number: number;
  button_text: string;
  background?: string;
  background_image?: string;
  label: string;
  social_media: EndScreenSocialMedia[];
}

export interface RatingBlock {
  id: number;
  ratings_length: number;
  label?: string;
  number: number;
  background?: string;
  background_image?: string;
}

export interface PhoneNumber {
  check_number: boolean;
  format_number: boolean;
  id: number;
  placeholder: string;
}

export interface PictureChoice {
  id: string;
  label?: string;
  super_size: boolean;
  images: PictureChoiceImages[];
  multiple_selection: boolean;
}

export interface PictureChoiceImages {
  id: string;
  picture?: PictureChoice;
  url: string;
  alt_tag: string;
  name?: string;
  saturation: number;
  contrast: number;
  brightness: number;
  blur: number;
  rotationIndex: number;
  x: number;
  y: number;
  pixelate: number;
  grayscale: number;
  hue: number;
  invert: number;
}

export type dateFormat = "yyyy-MM-dd" | "dd-MM-yyyy" | "MM-yyyy-dd" | "PPP";

interface Date {
  id: number;
  date: string;
  label: string | null;
  seperator: "-" | "/" | ".";
  format: dateFormat;
  number: number;
  background?: string;
  background_image?: string;
}

interface Number {
  id: number;
  min: number | null;
  max: number | null;
  number: number;
  background?: string;
  background_image?: string;
}

interface LongText {
  id: number;
  max_character: number;
  label?: string;
  number: number;
  background?: string;
  background_image?: string;
  place_holder?: string;
}

export interface ChoiceOption {
  option: string;
  id: string;
  created_at: string;
  updated_at: string;
}

interface DropDown {
  id: string;
  label: string;
  alphabetically: boolean;
  multiple_selection: boolean;
  allow_search: boolean;
  options: DropDownOptions[];
}

export interface DropDownOptions {
  id: string;
  drop_down?: number | string;
  body: string;
  created_at: string; // Assuming date format is ISO string
  updated_at: string;
}

interface Email {
  id: string;
  check_email: boolean;
  number: number;
  label?: string;
  background?: string;
  background_image?: string;
}

interface YesNo {
  number: number;
  label?: string;
  background?: string;
  background_image?: string;
}

interface Website {
  accept_url_with?: string;
  number: number;
  label?: string;
  background?: string;
  background_image?: string;
}

interface RedirectWithUrl {
  url: string;
  message: string;
  custom_html: string;
  click_option: boolean;
}

interface Choices {
  id: string;
  multiple_selection: boolean;
  vertical_alignment: boolean;
  label?: string;
  randomize: boolean;
  number: number;
  background?: string;
  background_image?: string;
  options: ChoiceOption[];
}

export interface ISurveyBlocks {
  block_type: BlockToolProps;
  is_required: boolean;
  is_visible: boolean;
  label: string;
  id: string;
  question: string;

  // Blocks
  dropdown: DropDown;
  ratings: RatingBlock;
  email: Email;
  picture_choice: PictureChoice;
  date: Date;
  number: Number;
  short_text: ShortTextBlock;
  long_text: LongText;
  choices: Choices;
  yes_no: YesNo;
  website: Website;
  redirect_with_url: RedirectWithUrl;
  welcome_screen: WelcomeScreenBlock;
  end_screen: EndScreen;
  phone_number: PhoneNumber;

  created_at: Date;
  updated_at: Date;
}

export type socialMediaTypes =
  | "facebook"
  | "instagram"
  | "twitter"
  | "tiktok"
  | "whatsapp"
  | "email";

export type ISurveyFont =
  | "System Font"
  | "Arial"
  | "Futura"
  | "Josefin Sans"
  | "Times New Roman"
  | "Helvetia"
  | "Garamond";

export type workSpaceAction = "ADD" | "DUPLICATE";
