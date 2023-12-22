import { Button } from "./Button";
import GoogleIcon from "../assets/GoogleIcon";
import TwitterIcon from "../assets/TwitterIcon";

import {
  GoogleAuthProvider,
  TwitterAuthProvider,
  User,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../Functions/config";
import { toast } from "./use-toaster";
import { IUser, app_config } from "../Types/components.types";
import axios from "axios";
import Cookies from "js-cookie";
import { useZStore } from "../provider";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./AlertModal";
import { AlertCircle, CheckCircle2, Clipboard } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./Tooltip";
import { Alert, AlertDescription, AlertTitle } from "./Alert";
import { Link } from "react-router-dom";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { useNavigate } from "react-router-dom";

const Oauth: React.FC<{ fallback?: string }> = ({ fallback = "/" }) => {
  const navigate = useNavigate();

  const { setUser } = useZStore();
  const [state, setState] = useState({
    show_user_new_password: false,
    new_user_password: "",
  });

  const twitterProvider = new TwitterAuthProvider();
  const googleProvider = new GoogleAuthProvider();

  const signInWithGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);

      const { displayName, photoURL, email, emailVerified }: User = res.user;

      const payload: Partial<IUser> = {
        username: displayName?.split(" ")[0] as string,
        profile_image: photoURL as string,
        email: email as string,
        email_verified: emailVerified,
        auth_provider: "G",
      };

      const response = await axios.post(
        import.meta.env.VITE_QUIZLY_API_HOST + "/api/v1/auth/",
        {
          ...payload,
          create_new_account: true,
        }
      );

      console.log(response.data.data);
      const new_user: IUser = {
        ...response.data.data,
      };

      setUser(new_user);
      Cookies.set("access_token", response.data.data.access_token);
      response.data.data.password &&
        setState({
          ...state,
          show_user_new_password: true,
          new_user_password: response.data.data.password,
        });
      navigate(fallback);
    } catch (error: any) {
      console.log(error);
      toast({
        title: "Error " + "500",
        description:
          error.response.data.message ||
          error.message ||
          "Something went wrong...",
        variant: "destructive",
      });
    }
  };

  const signInWithTwitter = async () => {
    try {
      const res = await signInWithPopup(auth, twitterProvider);

      const { displayName, photoURL, email, emailVerified }: User = res.user;

      const payload: Partial<IUser> = {
        username: displayName as string,
        profile_image: photoURL as string,
        email: email as string,
        email_verified: emailVerified,
        auth_provider: "T",
      };

      const response = await axios.post(
        import.meta.env.VITE_QUIZLY_API_HOST + "/api/v1/auth/",
        {
          ...payload,
          create_new_account: true,
        }
      );

      const new_user: IUser = {
        ...response.data.data,
      };

      setUser(new_user);
      Cookies.set("access_token", response.data.data.access_token);
      response.data.data.password &&
        setState({
          ...state,
          show_user_new_password: true,
          new_user_password: response.data.data.password,
        });
      navigate(fallback);
    } catch (error: any) {
      console.log(error);
      toast({
        title: "Error " + error?.request?.status || error?.status || "500",
        description:
          error?.response?.data?.message ||
          error?.message ||
          "Internal Server Error",
        variant: "destructive",
      });
    }
  };

  const [_, copy_text] = useCopyToClipboard();

  const new_password_modal = (
    <AlertDialog
      onOpenChange={() =>
        setState({
          ...state,
          show_user_new_password: !state.show_user_new_password,
        })
      }
      open={state.show_user_new_password}
    >
      <AlertDialogContent className="flex flex-col gap-2 items-center justify-center">
        <CheckCircle2 className="text-green-500" size={90} />
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">
            Account Created Successfully
          </AlertDialogTitle>
          <AlertDialogDescription>
            Yay! A quizly account has been assigned to you,
            {" Let's start your onboarding process"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="w-full flex gap-2">
          <code className="p-2 border border-green-500 items-center flex rounded-md w-full">
            {state.new_user_password}
          </code>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  onClick={() => {
                    copy_text(state.new_user_password);
                    toast({
                      title: "Copied",
                      description: "Password has been copied successfully",
                    });
                  }}
                  className="h-[3rem] bg-green-400 hover:bg-green-500 dark:bg-green-500 hover:dark:bg-green-600 w-[3.5rem]"
                  size={"icon"}
                >
                  <Clipboard />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Copy password</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>
            Please make sure your password is kept safe as this will not be
            shown again
          </AlertDescription>
        </Alert>
        <AlertDialogFooter className="w-full flex flex-row items-end justify-end gap-2">
          <Button variant={"secondary"}>
            <Link to={app_config.eplore_page}>Cancel</Link>
          </Button>
          <Button className="bg-green-400 hover:bg-green-500 dark:bg-green-500 hover:dark:bg-green-600 ">
            <Link to={app_config.onboarding_page}>Ok! Start onboarding</Link>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return (
    <div className="flex items-center gap-2">
      {new_password_modal}
      <Button
        onClick={signInWithGoogle}
        className="flex items-center gap-1"
        size={"lg"}
        variant={"outline"}
      >
        <GoogleIcon size={"25"} />
        Google
      </Button>
      <Button
        onClick={signInWithTwitter}
        className="flex items-center gap-1"
        size={"lg"}
        variant={"outline"}
      >
        <TwitterIcon size={35} />
        Twitter
      </Button>
    </div>
  );
};

export default Oauth;
