import { useLocalStorage } from "@uidotdev/usehooks";
import { edit_profile } from "../../Functions";
import OnboardingNav from "../../components/App/OnboardingNav";
import { Input } from "../../components/Input";
import { Label } from "../../components/Label";
import { content } from "../Onboarding";
import { IUser, onboardingProps } from "../../Types/components.types";
import React, { useEffect, useState } from "react";
import { toast } from "../../components/use-toaster";

const FirstView: React.FC<{ user: IUser | null }> = ({ user }) => {
  const [__, setView] = useLocalStorage<onboardingProps>("view", "DefaultView");
  const [formData, setFormData] = useState<Partial<IUser>>({
    first_name: "",
    last_name: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    setFormData({ first_name: user?.first_name, last_name: user?.last_name });
  }, [user]);

  const submit_form = async () => {
    if (!(formData.first_name && formData.last_name)) {
      return toast({
        title: "Error",
        description: "Please fill the required fields",
        variant: "destructive",
      });
    }

    try {
      await edit_profile(formData);
      setView("SecondView");
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: String(error),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl text-green-500">Identification</h1>
        <p>{content.firstView}</p>
        <Label className="flex mt-3 flex-col gap-2">
          First Name
          <Input
            onChange={handleChange}
            name="first_name"
            value={formData.first_name}
            className="h-[3rem]"
            placeholder="John"
          />
        </Label>
        <Label className="flex flex-col gap-2">
          Last Name
          <Input
            value={formData.last_name}
            name="last_name"
            onChange={handleChange}
            className="h-[3rem]"
            placeholder="Doe"
          />
        </Label>
      </div>
      <div className="mt-10">
        <OnboardingNav
          func={submit_form}
          prevNav="DefaultView"
          havePrev
          tooltip="Next"
        />
      </div>
    </div>
  );
};

export default FirstView;
