import React, { useEffect, useState } from "react";
import { Button } from "../Button";
import { Input } from "../Input";
import { requestEmailVerification } from "../../Functions/APIqueries";
import { toast } from "../use-toaster";
import { errorMessageForToast } from "../../Functions";
import { AxiosError } from "axios";
import { useZStore } from "../../provider";
import { LottieSuccess } from "./LottieSucces";
import { Description } from "../../Pages/ExplorePage/QuickQuiz";

export const VerifyEmail: React.FC<{
  user_email: string;
  show_input?: boolean;
  varient?: "destructive" | "base";
}> = ({ show_input = false, varient = "base" }) => {
  const { user, setUser } = useZStore();
  const [userEmail, setUserEmail] = useState("");
  const [state, setState] = useState<"loading" | "failed" | "success" | null>(
    null
  );

  const handleRequestEmailVerification = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!userEmail) {
      return toast({
        title: "Error",
        description: "Email is required: Please enter your email address",
        variant: "destructive",
      });
    }

    setState("loading");
    try {
      await requestEmailVerification(userEmail);
      user && setUser({ ...user, email: userEmail, email_verified: true });
      setState("success");
    } catch (error) {
      setState("failed");
      toast({
        title: "Error",
        description: errorMessageForToast(
          error as AxiosError<{ message: string }>
        ),
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (!user?.email || user.email === userEmail) {
      return;
    }

    const { email } = user;

    setUserEmail(email);
    // return () => setUserEmail("");
  }, [user?.email]);

  return (
    <div>
      {state === "success" ? (
        <div className="w-full flex items-center justify-center flex-col gap-2">
          <LottieSuccess loop={false} className="w-[5rem] h-[5rem]" />
          <h1 className="text-green-500">Email Sent Successfully</h1>
          <Description
            className="text-center"
            text="Didn't see our email? Please check the spam folder."
          />
        </div>
      ) : (
        <form
          onSubmit={handleRequestEmailVerification}
          className="flex flex-col gap-2 w-full"
        >
          {show_input && (
            <Input
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="w-full h-[3rem]"
            />
          )}
          <Button
            type="submit"
            disabled={state === "loading"}
            variant={varient}
            className="w-full h-[3rem]"
          >
            Verify
          </Button>
        </form>
      )}
    </div>
  );
};
