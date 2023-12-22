import { useLocalStorage } from "@uidotdev/usehooks";
import OnboardingNav from "../../components/App/OnboardingNav";
import { Input } from "../../components/Input";
import { Label } from "../../components/Label";
import { content } from "../Onboarding";
import { IUser, onboardingProps } from "../../Types/components.types";
import { edit_profile } from "../../Functions";
import React, { useEffect, useState } from "react";
import { toast } from "../../components/use-toaster";
import { useRegex } from "../../Hooks/regex";
import { Button } from "../../components/Button";

const SecondView: React.FC<{ user: IUser | null }> = ({ user }) => {
  const { emailVerifier } = useRegex();
  const [___, setView] = useLocalStorage<onboardingProps>(
    "view",
    "DefaultView"
  );
  const [states, setStates] = useState({
    error: false,
  });

  const [formData, setFormData] = useState<Partial<IUser>>({
    email: "",
  });

  useEffect(() => {
    setFormData({ email: user?.email });
  }, [user]);

  const submitForm = async () => {
    if (!emailVerifier(formData.email as string)) {
      toast({
        title: "Error",
        description: "Use a valid email",
        variant: "destructive",
      });
      return;
    }

    try {
      await edit_profile(formData);
      toast({
        title: "Verification Requested",
        description: "An instructions has been sent to the email provided",
      });
      setView("ThirdView");
    } catch (error) {
      setStates({ error: true });
      toast({
        title: "Error",
        description: String(error),
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
        {states.error && (
          <Button
            onClick={() => setView("ThirdView")}
            variant={"destructive"}
            className="w-full text-white h-[3rem]"
          >
            Proceed
          </Button>
        )}
      </div>
      <div className="mt-10">
        <OnboardingNav
          func={submitForm}
          tooltip="Goto Next"
          havePrev
          prevNav="FirstView"
        />
      </div>
    </div>
  );
};

export default SecondView;
