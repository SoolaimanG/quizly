import { Sparkles } from "lucide-react";
import { app_config, loginProps } from "../Types/components.types";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import React, { useState, useTransition } from "react";
import { toast } from "../components/use-toaster";
import axios, { AxiosError } from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Oauth from "../components/Oauth";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/AlertModal";

import DoesNotExist from "../assets/imgTwo.png";
import { useZStore } from "../provider";
import queryString from "query-string";
import { errorMessageForToast } from "../Functions";

const Login = ({
  title,
  description,
  isPopup = false,
  fallback = "/",
}: loginProps) => {
  const [isPending, startTransition] = useTransition();
  const location = useLocation();
  const fallBackURL = queryString.parse(location.search) as {
    fallbackUrl: string;
  };
  const router = useNavigate();
  const [state, setState] = useState({
    navigate_to_onboarding: false,
    error: "",
    account_does_not_exist: false,
  });
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const { setLoginAttempt, setUser, setOpenOnboardingModal } = useZStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  const loginWithPassword = async (
    e: React.FormEvent<HTMLFormElement | HTMLButtonElement>,
    create_new_account?: boolean
  ) => {
    e.preventDefault();
    const { username, password } = formData;
    try {
      if (!(username && password)) {
        return toast({
          title: "Error 404",
          description: "Provide username and password",
          variant: "destructive",
        });
      }

      if (username.length <= 3 || password.length <= 6) {
        return toast({
          title: "Error 400",
          description: "Invalid username or password",
          variant: "destructive",
        });
      }

      const res = await axios.post(
        `${import.meta.env.VITE_QUIZLY_API_HOST}/api/v1/auth/`,
        {
          ...formData,
          create_new_account: create_new_account,
          auth_provider: "L",
        }
      );

      const _user = {
        ...res.data.data,
      };

      setUser(_user);
      Cookies.set("access_token", res.data.data.access_token); //Setting the user access token using the cookies

      if (!_user.signup_complete) {
        setOpenOnboardingModal({
          fallbackUrl: fallBackURL.fallbackUrl,
          open: true,
        });
        return;
      }

      isPopup && setLoginAttempt({ attempt: false });
      isPopup && window.location.reload();
      router(fallBackURL.fallbackUrl ?? fallback);
    } catch (error: AxiosError | any) {
      toast({
        title: "ERROR " + error.response.status,
        description:
          error.response.data.message ||
          error.response.data.detail ||
          "Something went wrong...",
        variant: "destructive",
      });
      setState({
        ...state,
        error: errorMessageForToast(error as AxiosError<{ message: string }>),
        account_does_not_exist: Boolean(error.response.status === 404),
      });
    }
  };

  const account_does_not_exist = (
    <AlertDialog
      onOpenChange={() =>
        setState({
          ...state,
          account_does_not_exist: !state.account_does_not_exist,
        })
      }
      open={state.account_does_not_exist}
    >
      <AlertDialogContent className="flex-col gap-3 flex items-center justify-center">
        <img className="aspect-auto" src={DoesNotExist} alt="" />
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-400">
            Oops😢, Account not found
          </AlertDialogTitle>
          <AlertDialogDescription>
            We look our database and there was not an account related to the
            name you provided. However you can create one now!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="w-full flex md:flex-row flex-col items-end justify-end gap-2">
          <AlertDialogCancel className="w-full md:w-fit">
            Cancel
          </AlertDialogCancel>
          <AlertDialogTrigger
            onClick={async (e) => {
              await loginWithPassword(e, true);
              setState({ ...state, account_does_not_exist: false });
            }}
            className="bg-green-400 h-[2.5rem] md:w-fit px-4 text-white rounded-md w-full hover:bg-green-500 dark:bg-green-500 hover:dark:bg-green-600 disabled:bg-green-700"
          >
            Create Account
          </AlertDialogTrigger>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return (
    <div className="flex w-full flex-col gap-3">
      {account_does_not_exist}
      <div className="flex flex-col">
        <Sparkles className="text-green-500" size={30} />
        <h1 className="text-2xl text-green-500 md:text-3xl">{title}</h1>
        <p className="text-gray-400 dark:text-gray-300">{description}</p>
      </div>
      <form
        onSubmit={(e) =>
          startTransition(() => {
            loginWithPassword(e);
          })
        }
        className="flex w-full flex-col gap-2"
        action=""
      >
        <Input
          name="username"
          onChange={handleChange}
          className="w-full h-[3rem]"
          placeholder="Username"
        />
        <Input
          name="password"
          type="password"
          onChange={handleChange}
          className="w-full h-[3rem]"
          placeholder="Password"
        />
        {state.error.toLowerCase() === "incorrect password" && (
          <Link
            to={app_config.forgetPassword}
            className="underline text-green-500 w-full flex items-end justify-end"
          >
            Forget password?
          </Link>
        )}
        <Button
          disabled={isPending}
          type="submit"
          className="w-full text-white font-semibold h-[3rem] bg-green-400 hover:bg-green-500 dark:bg-green-500 dark:hover:bg-green-600 disabled:bg-green-900"
        >
          Login
        </Button>
      </form>
      <div className="w-full flex gap-1 items-center">
        <p
          className={`text-gray-400 md:w-[33%] w-full dark:text-gray-300 ${
            isPopup && "text-center"
          }`}
        >
          Or Continue with
        </p>{" "}
        {!isPopup && <div className="w-[67%] h-[1.5px] bg-gray-400" />}
      </div>
      <Oauth />
    </div>
  );
};

export default Login;
