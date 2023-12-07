import axios from "axios";
import { useZStore } from "../provider";
import Cookies from "js-cookie";
import { IUser } from "../Types/components.types";
import { useEffect } from "react";

export const useMethods = () => {
  const { user, setUser, setLoginAttempt } = useZStore();
  const access_token = Cookies.get("access_token");

  const isAuthenticated = () => {
    return user?.id ? true : false;
  };

  const isTeacher = () => {
    return user?.account_type === "T" ? true : false;
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

  const get_user = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_QUIZLY_API_HOST}/api/v1/user/`,
        {
          headers: {
            Authorization: "Bearer " + access_token,
          },
          withCredentials: true,
        }
      );

      const _: IUser = {
        ...res.data.data,
      };
      setUser(_);
    } catch (error: any) {
      setUser(null);
      console.error(error);
    }
  };

  const email_verification_required = () => {
    new Promise((resolve, reject) => {
      if (!user?.email_verified) {
        reject("Please verify your email before accessing this");
      }

      resolve("OK");
    });
  };

  useEffect(() => {
    get_user();
  }, []);

  return {
    isAuthenticated,
    isTeacher,
    login_required,
    get_user,
    email_verification_required,
  };
};
