import { OnboardingNav } from "../../components/App/OnboardingNav";
import { Input } from "../../components/Input";
import { Label } from "../../components/Label";
import { content } from "../Onboarding";
import { IUser, app_config } from "../../Types/components.types";
import { FC, useEffect, useState } from "react";
import { toast } from "../../components/use-toaster";
import { useRegex } from "../../Hooks/regex";
import { useZStore } from "../../provider";
import { useNavigate } from "react-router-dom";
import { requestEmailVerification } from "../../Functions/APIqueries";
import { errorMessageForToast } from "../../Functions";
import { AxiosError } from "axios";

export const ChangeEmail: FC<{}> = () => {
  const { user, setUser } = useZStore();
  const { emailVerifier } = useRegex();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Partial<IUser>>({
    email: "",
  });

  useEffect(() => {
    user && setFormData({ email: user.email });
    return () => setFormData({ email: "" });
  }, [user]);

  const submitForm = async () => {
    if (user?.email_verified) {
      navigate(app_config.change_account_type);
      return;
    }

    if (!emailVerifier(formData.email!)) {
      toast({
        title: "Error",
        description: "Use a valid email",
        variant: "destructive",
      });
      return;
    }

    try {
      await requestEmailVerification(formData.email!);
      user && setUser({ ...user, email: formData?.email! });
      toast({
        title: "Verification Requested",
        description:
          "An instructions has been sent to the email provided and your email has been updated to the one you provided.",
      });
      navigate(app_config.change_account_type);
    } catch (error) {
      toast({
        title: "Error",
        description: errorMessageForToast(
          error as AxiosError<{ message: string }>
        ),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full h-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl text-green-500">Add your email address</h1>
        <p>{content.secondView}</p>
      </div>
      <div className="w-full flex flex-col mt-5 gap-2">
        <Label className="flex flex-col gap-2" htmlFor="email">
          <Input
            onChange={(e) => setFormData({ email: e.target.value })}
            value={formData.email}
            id="email"
            className="h-[3rem]"
            type="email"
            placeholder="Johndoe@gmail.com"
          />
        </Label>
      </div>
      <div className="mt-10">
        <OnboardingNav
          func={submitForm}
          tooltip="Go to account-selection"
          prevNav="ACCOUNT-TYPE"
        />
      </div>
    </div>
  );
};
