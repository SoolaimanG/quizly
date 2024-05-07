import { useZStore } from "../provider";
import { useQuery } from "@tanstack/react-query";
import { checkAuthentication } from "../Functions/APIqueries";
import { useEffect, useState } from "react";
import { IUser } from "../Types/components.types";

export const useMethods = () => {
  const { user, setLoginAttempt, setEmailVerificationRequired } = useZStore();

  const isTeacher = () => {
    return user?.account_type === "T";
  };

  const login_required = (note?: string) => {
    if (!user?.id) {
      setLoginAttempt({ attempt: true, note });
      return false;
    }

    return true;
  };

  const email_verification_required = () => {
    if (!user?.email_verified) {
      setEmailVerificationRequired(true);
      return false;
    }

    return true;
  };

  return {
    isTeacher,
    login_required,
    email_verification_required,
  };
};

export const useAuthentication = () => {
  const [state, setState] = useState({
    isAuthenticated: false,
    loading: false,
    error: false,
  });
  const { isSuccess, isError, isLoading } = useQuery<{ data: IUser }>({
    queryKey: ["is_authenticated"],
    queryFn: () => checkAuthentication(),
  });

  useEffect(() => {
    setState({
      isAuthenticated: isSuccess,
      loading: isLoading,
      error: isError,
    });
  }, []);

  return state;
};
