import { surveyResponseTypes } from "./Functions/index";
import { create } from "zustand";
import {
  IUser,
  QuizAction,
  QuizState,
  Zaction,
  Zstate,
  app_config,
  comingSoonProps,
  publicationTypes,
  publishDetails,
} from "./Types/components.types";
import { CommunityStoreProps } from "./Types/community.types";
import { ICustomLogicConditions } from "./Types/survey.types";
import {
  SurveyWorkSpaceAction,
  SurveyWorkSpaceState,
  surveyNavigationProps,
} from "./Types/survey.types";
import {
  errorMessageForToast,
  handleLogic,
  setBlockIdInURL,
} from "./Functions";
import { AxiosError } from "axios";
import { SurveyWorkSpace } from "./Functions/surveyApis";
import { toast } from "./components/use-toaster";

export const useZStore = create<Zstate & Zaction>()((set) => ({
  is_darkmode: false,
  loginAttempt: { attempt: false, fallback: "", note: "" },
  user: null,
  emailVerificationRequired: false,
  openOnboardingModal: {
    open: false,
    fallbackUrl: "/",
  },
  openSettings: false,
  setIsDarkMode: (prop) => set((state) => ({ ...state, is_darkmode: prop })),
  setLoginAttempt(prop) {
    set((state) => ({
      ...state,
      loginAttempt: {
        attempt: prop.attempt,
        fallback: prop.fallback as string,
        note: prop.note,
      },
    }));
  },
  setUser(prop) {
    set((state) => ({
      ...state,
      user: {
        ...(state.user as IUser),
        ...prop,
      },
    }));
  },
  setEmailVerificationRequired(props) {
    set((state) => ({
      ...state,
      emailVerificationRequired: props,
    }));
  },
  setOpenOnboardingModal(props) {
    set((state) => ({
      ...state,
      openOnboardingModal: {
        open: props.open,
        fallbackUrl: props.fallbackUrl,
      },
    }));
  },
  setOpenSettings(prop) {
    set((state) => ({
      ...state,
      openSettings: prop,
    }));
  },
}));

export const useQuizStore = create<QuizState & QuizAction>()((set) => ({
  openDictionary: false,
  openCalculator: false,
  questionIDs: [],
  currentQuizData: null,
  openComment: false,
  questionsAnswered: 0,
  refs: [],
  setOpenDictionary() {
    set((state) => ({
      ...state,
      openDictionary: !state.openDictionary,
    }));
  },
  setOpenCalculator() {
    set((state) => ({
      ...state,
      openCalculator: !state.openCalculator,
    }));
  },
  setQuestionIDs(props) {
    set((state) => ({
      ...state,
      questionIDs: props,
    }));
  },
  setCurrentQuizData(props) {
    set((state) => ({
      ...state,
      currentQuizData: props,
    }));
  },
  setOpenComment(props) {
    set((state) => ({
      ...state,
      openComment: props,
    }));
  },
  setQuestionsAnswered(props) {
    set((state) => ({
      ...state,
      questionsAnswered:
        props === "increment"
          ? state.questionsAnswered + 1
          : state.questionsAnswered - 1,
    }));
  },
  setRefs(props) {
    set((state) => ({
      ...state,
      refs: props,
    }));
  },
  clearQuestionAnswered() {
    set({ questionsAnswered: 0 });
  },
}));

export const useCommunityStore = create<CommunityStoreProps>((set) => ({
  openSearch: false,
  communityDetails: null,
  editCommunityData: {
    quiz_id: undefined,
    caption: "",
    remove_image_len: 0,
    remove_images: [],
    imagesProps: {
      files: [],
      previewUrl: [],
    },
  },
  setOpenSearch() {
    set((state) => ({
      ...state,
      openSearch: !state.openSearch,
    }));
  },
  setCommunityDetails(props) {
    set((state) => ({
      ...state,
      communityDetails: props,
    }));
  },
  setEditCommunity({
    quiz_id,
    caption,
    files,
    previewUrl,
    remove_image_len,
    remove_images,
  }) {
    set((state) => ({
      ...state,
      editCommunityData: {
        quiz_id,
        caption,
        remove_image_len,
        remove_images,
        imagesProps: { files, previewUrl },
      },
    }));
  },
}));

export const useSurveyWorkSpace = create<
  SurveyWorkSpaceState & SurveyWorkSpaceAction
>((set) => ({
  formType: "feedback",
  survey: undefined,
  survey_blocks: undefined,
  openBlockDialog: false,
  collapseSideBar: {
    sideBarOne: false,
    sideBarTwo: false,
  },
  deviceView: "desktop",
  auto_save_ui_props: {
    status: "loading",
    is_visible: false,
    message: app_config.AppName + " Is AutoSaving your progress",
  },
  surveyDesign: null,
  surveySettings: null,
  surveyLogics: [],
  setFormType(props) {
    set((state) => ({
      ...state,
      formType: props,
    }));
  },
  setOpenBlockDialog(prop) {
    set((state) => ({
      ...state,
      openBlockDialog: prop,
    }));
  },
  setCollapseSideBar({ sideBarOne, sideBarTwo }) {
    set((state) => ({
      ...state,
      collapseSideBar: {
        sideBarOne,
        sideBarTwo,
      },
    }));
  },
  setDeviceView(props) {
    set((state) => ({
      ...state,
      deviceView: props,
    }));
  },
  setSurvey(props) {
    set((state) => ({
      ...state,
      survey: props,
    }));
  },
  setSurveyBlocks(props) {
    set((state) => ({
      ...state,
      survey_blocks: props,
    }));
  },
  setAutoSaveUiProps(props) {
    set((state) => ({
      ...state,
      auto_save_ui_props: props,
    }));
  },
  setSurveyDesign(props) {
    set((state) => ({
      ...state,
      surveyDesign: props,
    }));
  },
  setSurveySettings(props) {
    set((state) => ({
      ...state,
      surveySettings: props,
    }));
  },
  addSurveyLogics(props) {
    set((state) => ({
      ...state,
      surveyLogics: [...state.surveyLogics, props],
    }));
  },
  removeSurveyLogic(id) {
    set((state) => ({
      ...state,
      surveyLogics: state.surveyLogics.filter((logic) => logic.id !== id),
    }));
  },
  editSurveyLogic(prop, id) {
    set((state) => ({
      ...state,
      surveyLogics: state.surveyLogics.map((surveyLogic) => {
        return surveyLogic.id === id
          ? { ...surveyLogic, ...prop }
          : { ...surveyLogic };
      }),
    }));
  },
  addAllLogics(props) {
    set((state) => ({
      ...state,
      surveyLogics: props,
    }));
  },
}));

export const useComingSoonProps = create<comingSoonProps>((set) => ({
  description: "",
  featureName: "Feature is coming soon!",
  joinWaitList: true,
  isVisible: false,
  type: "AI_HELP",

  setDescription(prop) {
    set((state) => ({
      ...state,
      description: prop,
    }));
  },
  setFeatureName(prop) {
    set((state) => ({
      ...state,
      featureName: prop,
    }));
  },
  setJoinWaitList(prop) {
    set((state) => ({
      ...state,
      joinWaitList: prop,
    }));
  },
  setIsVisible(isVisible) {
    set((state) => ({
      ...state,
      isVisible,
    }));
  },
  setType(type) {
    set((state) => ({
      ...state,
      type,
    }));
  },
}));

export const usePublications = create<publicationTypes>((set) => ({
  openPublishModal: false,
  recipients: "",
  isLoading: false,
  error: null,
  isSuccess: false,
  publishDetails: null,
  setOpenPublishModal(prop) {
    set((state) => ({
      ...state,
      openPublishModal: prop,
    }));
  },
  setRecipients(prop) {
    set((state) => ({
      ...state,
      recipients: prop,
    }));
  },
  setPublishDetails(props) {
    set((state) => ({
      ...state,
      publishDetails: props,
    }));
  },
  setIsSuccess(prop) {
    set((state) => ({
      ...state,
      isSuccess: prop,
    }));
  },
  // @ts-ignore
  async onClick(prop, id, password, mode, recipients) {
    const action = new SurveyWorkSpace(id);
    try {
      set((state) => ({
        ...state,
        isLoading: true,
      }));

      let response;
      if (prop === "survey") {
        response = await action.publishSurvey(password, mode, recipients);
        set((state) => ({
          ...state,
          isSuccess: true,
        }));
      }

      if (prop === "quiz") {
        // Add logic for quiz
      }

      set((state) => ({
        ...state,
        isLoading: false,
      }));

      return response as publishDetails;
    } catch (error) {
      toast({
        title: "Error",
        description: errorMessageForToast(
          error as AxiosError<{ message: string }>
        ),
        variant: "destructive",
      });
    } finally {
      set((state) => ({
        ...state,
        isLoading: false,
      }));
    }
  },
}));

export const useSurveyNavigation = create<surveyNavigationProps>((_) => ({
  surveyId: "",
  action: "next",
  disableBtnTimer: 0,
  setDisableBtnTimer(prop) {
    _((state) => ({
      ...state,
      disableBtnTimer: prop,
    }));
  },
  setAction(prop) {
    _((state) => ({
      ...state,
      action: prop,
    }));
  },
  async navigate(
    navigate,
    currentIndex,
    blockList,
    action,
    surveyLogics?: ICustomLogicConditions[],
    userResponse?: surveyResponseTypes
  ) {
    if (currentIndex === -1 || typeof currentIndex === "undefined") {
      return toast({
        title: "Error",
        description:
          "This is where this survey block ends. you can go ahead and submit the survey now.",
        variant: "destructive",
      });
    }

    // If the current block is the last block don't navigate again
    if (action === "next" && blockList.length - 1 === currentIndex) {
      return;
    }

    const payload: surveyResponseTypes = {
      response: [],
      survey: "",
      block: "",
    };

    const data = await handleLogic(
      surveyLogics || [],
      userResponse || payload,
      blockList[currentIndex]
    );

    const nextBlock =
      action === "next"
        ? blockList?.[currentIndex + 1]
        : action === "prev"
        ? blockList?.[currentIndex - 1]
        : "";

    const path = action === "next" ? data?.goTo || nextBlock : nextBlock + "";

    setBlockIdInURL(path, navigate);
  },
}));
