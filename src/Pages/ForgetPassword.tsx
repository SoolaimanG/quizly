import React, { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { CheckCircle2, Mail } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "../components/AlertModal";
import { useCounter, useLocalStorage } from "@uidotdev/usehooks";
import { AlertDialogTitle } from "@radix-ui/react-alert-dialog";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "../components/DialogModal";
import { toast } from "../components/use-toaster";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

const content = Object.freeze({
  message:
    "No worries! Please enter your username or email associated with your account, and we'll send you a one-time password (OTP) to reset your password securely. Let's get you back on track!",
  email_sent: "You've got mail",
  email_message:
    "We sent the OTP verification code to your email address. Check your email and enter the code below",
  otp_message:
    "Please do well to check your span folder as our emails might be label as spam by your mail provider. Thank you",
  forget_password_message:
    "Choose a secure and unique password for your account, if you forget your password you'll have to repeat this process again",
  reset_successfull:
    "You have successfully reset your account password. Feel free to navigate to the login page",
});

type viewPrps = "request_code" | "verify_code" | "change_password";

const ForgetPassword = () => {
  const [_view, setView] = useLocalStorage<viewPrps>("view");
  const [openModal, setOpenModal] = useState(false);
  const [email, setEmail] = useSearchParams();
  const [timer, setTimer] = useLocalStorage("timer");
  const [_, { set, decrement }] = useCounter(Number(timer) || 0);
  const [params, setParams] = useState({
    email: "",
    otp: "",
    password: "",
    comfirm_password: "",
  });
  const [state, setState] = useState({
    loading: false,
    error: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setParams({ ...params, [name]: value });
  };
  const request_code_func = async (
    e: React.FormEvent<HTMLFormElement | HTMLButtonElement>
  ) => {
    e.preventDefault();

    setState({ ...state, loading: true });

    try {
      const res = await axios.post(
        import.meta.env.VITE_QUIZLY_API_HOST + "/api/v1/auth/forget-password/",
        {
          email: params.email || email.get("email"),
        }
      );

      const next_req_time =
        (new Date(res.data.data.time_uptil).getTime() - Date.now()) / 1000;

      set(Math.ceil(next_req_time));

      setEmail("email=" + params.email);
      setView("verify_code");
      setState({ ...state, loading: false });
    } catch (error: any) {
      console.error(error);
      setView("request_code");
      setState({ ...state, loading: false });
      const status_code = error.status || error.response.status;
      toast({
        title: "Error " + status_code,
        description:
          error.response.data.message ||
          error.message ||
          "Something went wrong...",
        variant: "destructive",
      });
    }
  };
  const verify_otp_func = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState({ ...state, loading: true });
    try {
      const res = await axios.get(
        import.meta.env.VITE_QUIZLY_API_HOST +
          "/api/v1/auth/forget-password/?otp=" +
          params.otp
      );

      console.log(res.data);

      setView("change_password");
      setState({ ...state, loading: false });
    } catch (error: any) {
      setView("request_code");
      setState({ ...state, loading: false });
      toast({
        title: "Error " + error.status,
        description:
          error.response.data.message ||
          error.message ||
          "Something went wrong...",
        variant: "destructive",
      });
    }
  };
  const change_password_func = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { password, comfirm_password } = params;

    if (password && password !== comfirm_password) {
      toast({
        title: "Error 409",
        description: "Password must be matching",
        variant: "destructive",
      });
      return;
    }

    setState({ ...state, loading: true });
    try {
      setParams({
        ...params,
        email: params.email || (email.get("email") as string),
      });

      await axios.patch(
        import.meta.env.VITE_QUIZLY_API_HOST + "/api/v1/auth/forget-password/",
        {
          ...params,
        }
      );

      setOpenModal(true);
      setParams({ otp: "", email: "", password: "", comfirm_password: "" }); //Reseting the form
      setEmail("");
      setState({ ...state, loading: false });
    } catch (error: any) {
      console.error(error);
      setView("request_code");
      setState({ ...state, loading: false });
      toast({
        title: "Error " + error.status,
        description:
          error.response.data.message ||
          error.message ||
          "Something went wrong...",
        variant: "destructive",
      });
    }
  };

  //This is for setting the count down of the next request
  useEffect(() => {
    if (_ <= 0) return;

    const timer = setTimeout(() => {
      decrement();
      setTimer(_ - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [_]);

  const resend_otp = (
    <AlertDialog>
      <AlertDialogTrigger className="underline mt-2">
        {"Didn't receive email?"}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{"Didn't receive email?"}</AlertDialogTitle>
          <AlertDialogDescription>
            {"Don't worry we will send you another one"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div>
          <h1 className="text-5xl text-red-500">
            {_}
            <span className="text-[0.9rem] text-gray-400 dark:text-gray-300">
              sec(s) remaining to request another OTP
            </span>
          </h1>
          <p className="mt-2">{content.otp_message}</p>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={request_code_func} disabled={_ >= 1}>
            Resend
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  const reset_successfull = (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogContent className="w-full flex items-center justify-center flex-col gap-2">
        <CheckCircle2 className="text-green-500" size={70} />
        <DialogTitle>Welcome Back!!</DialogTitle>
        <DialogDescription className="mt-2 text-center">
          {content.reset_successfull}
        </DialogDescription>
        <DialogFooter className="flex flex-col gap-2 w-full mt-2 md:items-end md:justify-end md:gap-2">
          <DialogClose className="w-full md:w-1/5 border border-gray-400 dark:bg-gray-300 rounded-md py-2">
            Close
          </DialogClose>
          <Button className="w-full flex" size={"lg"}>
            Go to login
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  const request_code = (
    <div className="w-full flex flex-col gap-2">
      <h1 className="text-3xl text-green-500">Forgot Password?</h1>
      <p className="text-gray-400 dark:text-gray-300">{content.message}</p>
      <form
        onSubmit={request_code_func}
        className="mt-5 flex flex-col gap-2"
        action=""
      >
        <Input
          value={params.email}
          onChange={handleChange}
          required
          type="text"
          className="w-full h-[3rem]"
          name="email"
          placeholder="Email or username"
        />
        <Button
          type="submit"
          disabled={state.loading}
          className="w-full disabled:bg-green-700 disabled:cursor-not-allowed h-[3rem] bg-green-400 hover:bg-green-500 dark:bg-green-500 hover:dark:bg-green-600 text-white text-xl"
        >
          Continue
        </Button>
      </form>
    </div>
  );
  const verify_code = (
    <div className="w-full flex flex-col gap-2">
      <h1 className="flex text-3xl text-green-500 items-center gap-2">
        {content.email_sent} <Mail size={30} />
      </h1>
      <p className="text-gray-400 dark:text-gray-300">
        {content.email_message}
      </p>
      <form
        onSubmit={verify_otp_func}
        className="mt-5 flex flex-col gap-2"
        action=""
      >
        <Input
          required
          onChange={handleChange}
          name="otp"
          value={params.otp}
          type="text"
          className="w-full h-[3rem]"
          placeholder="Enter the 5-digit OTP"
        />
        <Button
          type="submit"
          className="w-full h-[3rem] bg-green-400 hover:bg-green-500 dark:bg-green-500 hover:dark:bg-green-600 text-white text-xl"
        >
          Verify
        </Button>
      </form>
      {resend_otp}
      {Boolean(_) && (
        <p className="flex items-center justify-center w-full">
          Try resend OTP in {_}secs
        </p>
      )}
    </div>
  );
  const change_password = (
    <div className="w-full flex flex-col gap-2">
      {reset_successfull}
      <h1 className="text-3xl text-green-500">Create a new password</h1>
      <p className="text-gray-400 dark:text-gray-300">
        {content.forget_password_message}
      </p>
      <form
        onSubmit={change_password_func}
        className="mt-5 flex flex-col gap-2"
        action=""
      >
        <Input
          required
          name="password"
          onChange={handleChange}
          value={params.password}
          type="text"
          className="w-full h-[3rem]"
          placeholder="New password"
        />
        <Input
          required
          value={params.comfirm_password}
          onChange={handleChange}
          name="comfirm_password"
          type="text"
          className="w-full h-[3rem]"
          placeholder="Confirm your password"
        />
        <Button
          disabled={state.loading}
          type="submit"
          className="w-full disabled:bg-green-700 disabled:cursor-not-allowed h-[3rem] bg-green-400 hover:bg-green-500 dark:bg-green-500 hover:dark:bg-green-600 text-white text-xl"
        >
          Change
        </Button>
      </form>
    </div>
  );

  const view = {
    request_code: request_code,
    verify_code: verify_code,
    change_password: change_password,
  };

  return <div className="w-full">{view[_view || "request_code"]}</div>;
};

export default ForgetPassword;
