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

  const login_required = () => {
    if (!user?.id) {
      setLoginAttempt({ attempt: true });
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
  const [is_authenticated, setIsAuthenticated] = useState(false);
  const { user } = useZStore();
  const { refetch, isSuccess } = useQuery<{ data: IUser }>({
    queryKey: ["is_authenticated"],
    queryFn: () => checkAuthentication(),
    enabled: Boolean(user),
  });

  useEffect(() => {
    refetch(); //Refresh when user changes i.e if logout or login
    //data?.data && setUser(data.data);
    isSuccess && setIsAuthenticated(true);
  }, [user, isSuccess]);

  return is_authenticated;
};
