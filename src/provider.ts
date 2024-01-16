import { create } from "zustand";
import {
  IUser,
  QuizAction,
  QuizState,
  SideBarAction,
  SideBarState,
  Zaction,
  Zstate,
} from "./Types/components.types";

export const useZStore = create<Zstate & Zaction>()((set) => ({
  is_darkmode: false,
  loginAttempt: { attempt: false, fallback: "" },
  user: null,
  emailVerificationRequired: false,
  setIsDarkMode: (prop) => set((state) => ({ ...state, is_darkmode: prop })),
  setLoginAttempt(prop) {
    set((state) => ({
      ...state,
      loginAttempt: {
        ...prop,
        attempt: prop.attempt,
        fallback: prop.fallback as string,
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
}));

export const useQuizStore = create<QuizState & QuizAction>()((set) => ({
  openDictionary: false,
  openCalculator: false,
  questionIDs: [],
  currentQuizData: null,
  openComment: false,
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
}));

export const useSiderBar = create<SideBarState & SideBarAction>()((set) => ({
  isNavOpen: false,
  isCollapsed: false,
  toggleSideBar(props) {
    set((state) => ({
      ...state,
      isNavOpen: props,
    }));
  },
  setCollapseSidebar(props) {
    set((state) => ({
      ...state,
      isCollapsed: props,
    }));
  },
}));
