import { edit_profile } from "../../Functions";
import { OnboardingNav } from "../../components/App/OnboardingNav";
import { Input } from "../../components/Input";
import { Label } from "../../components/Label";
import { content } from "../Onboarding";
import { IUser, app_config } from "../../Types/components.types";
import React, { useEffect, useState } from "react";
import { toast } from "../../components/use-toaster";
import { useZStore } from "../../provider";
import { useNavigate } from "react-router-dom";

export const ChangeName = () => {
  const { user, setUser } = useZStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<IUser>>({
    first_name: "",
    last_name: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    if (!user) {
      return;
    }

    setFormData({ first_name: user?.first_name, last_name: user?.last_name });

    return () => setFormData({ ...formData, first_name: "", last_name: "" });
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
      const { first_name, last_name } = formData;
      user && setUser({ ...user, first_name, last_name });
      navigate(app_config.change_email);
    } catch (error) {
      toast({
        title: "Error",
        description: String(error),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={submit_form} className="flex flex-col gap-2">
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
      </form>
      <div className="mt-10">
        <OnboardingNav
          func={submit_form}
          tooltip="Proceed to your change your email."
        />
      </div>
    </div>
  );
};
