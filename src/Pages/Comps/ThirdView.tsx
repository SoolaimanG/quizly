import { useEffect, useState } from "react";
import OnboardingNav from "../../components/App/OnboardingNav";
import { Input } from "../../components/Input";
import { Label } from "../../components/Label";
import { content } from "../Onboarding";
import { Textarea } from "../../components/TextArea";
import { CheckCircle2, Circle, GraduationCap, User } from "lucide-react";
import { useLocalStorage } from "@uidotdev/usehooks";
import { IUser, onboardingProps } from "../../Types/components.types";
import { edit_profile } from "../../Functions";
import { toast } from "../../components/use-toaster";

const accountTypeContent = [
  {
    title: "Student",
    desc: "Welcome to the student portal. Explore your courses and assignments here.",
    icon: <User size={85} />,
    type: "S",
  },
  {
    title: "Teacher",
    desc: " Manage your classes, create assignments and track student progress effortlessly.",
    icon: <GraduationCap size={85} />,
    type: "T",
  },
];

const ThirdView: React.FC<{ user: IUser | null }> = ({ user }) => {
  const [__, setView] = useLocalStorage<onboardingProps>("view", "DefaultView");
  const [formData, setFormData] = useState<Partial<IUser>>({
    age: 10,
    bio: "",
    account_type: "S",
  });

  useEffect(() => {
    setFormData({
      age: user?.age,
      account_type: user?.account_type,
      bio: user?.bio,
    });
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const submit_form = async () => {
    try {
      await edit_profile(formData);
      setView("FourthView");
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
    <div>
      <div className="flex flex-col gap-2">
        <h1 className="text-xl text-green-500">{content.thirdView}</h1>
        <p>{content.thirdDesc}</p>
      </div>
      <Label htmlFor="age" className="flex flex-col gap-2 mt-3 text-lg">
        How old are you?
        <Input
          id="age"
          name="age"
          value={formData.age}
          placeholder="10-60 (Years)"
          onChange={handleChange}
          type="number"
          min={10}
          max={60}
        />
      </Label>
      <Label className="flex flex-col gap-2 mt-3 text-lg" htmlFor="bio">
        Enter your bio
        <Textarea
          value={formData.bio}
          id="bio"
          name="bio"
          onChange={handleChange}
          placeholder="Add a bio (Optional)"
        />
      </Label>
      <h1 className="mt-3 text-lg">Account Type</h1>
      <div className="w-full flex gap-3">
        {accountTypeContent.map((accountType, i) => (
          <div
            key={i}
            onClick={() =>
              setFormData({
                ...formData,
                account_type: accountType.type as "S",
              })
            }
            className={`w-full overflow-hidden relative cursor-pointer border border-green-200 hover:bg-green-700 hover:text-white transition-all delay-75 ease-linear p-2 rounded-md ${
              accountType.type === formData.account_type &&
              "bg-green-700 text-white"
            } `}
          >
            <div className="absolute opacity-50 top-0 left-0 -ml-10 -mt-5">
              {accountType.icon}
            </div>
            <div className="absolute top-0 right-0 mt-2 mr-2">
              {formData.account_type === accountType.type ? (
                <CheckCircle2 size={15} />
              ) : (
                <Circle size={15} />
              )}
            </div>

            <h1>{accountType.title}</h1>
            <p>{accountType.desc}</p>
          </div>
        ))}
      </div>
      <div className="mt-5">
        <OnboardingNav
          func={submit_form}
          tooltip="Next"
          havePrev
          prevNav="SecondView"
        />
      </div>
    </div>
  );
};

export default ThirdView;
