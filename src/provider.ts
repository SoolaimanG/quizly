import { create } from "zustand";
import { IUser, Zaction, Zstate } from "./Types/components.types";

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
