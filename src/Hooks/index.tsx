import { useZStore } from "../provider";

export const useMethods = () => {
  const { user, setLoginAttempt, setEmailVerificationRequired } = useZStore();

  const isAuthenticated = () => {
    return user?.id;
  };

  const isTeacher = () => {
    return user?.account_type === "T";
  };

  const login_required = () => {
    new Promise((resolve, reject) => {
      if (!user?.id) {
        setLoginAttempt({ attempt: true });
        reject("Authentication required");
      }

      resolve("OK");
    });
  };

  const email_verification_required = () => {
    new Promise((resolve, reject) => {
      if (!user?.email_verified) {
        setEmailVerificationRequired(true);
        reject("Please verify your email before accessing this");
      }

      resolve("OK");
    });
  };

  return {
    isAuthenticated,
    isTeacher,
    login_required,
    email_verification_required,
  };
};
