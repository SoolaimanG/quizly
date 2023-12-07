import { redirect, useParams, useNavigate, Link } from "react-router-dom";
import FirstViewImage from "../../assets/complete_auth_human_illustration.png";
import SecondViewImage from "../../assets/complete_auth_human_with_people_illustration.png";
import DefaultViewImage from "../../assets/complete_auth_default_view.png";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { Award, MoveRight } from "lucide-react";
import { User } from "lucide-react";
import { IUser, app_config } from "../../Types/components.types";
import { useState } from "react";

const content = Object.freeze({
  student_acct_desc: "Participate in quizzes and more",
  teacher_acct_desc: "Create and manage quizzes and more",
});

const Onboarding = () => {
  const { view } = useParams<{
    view: "firstView" | "secondView";
  }>();

  const navigate = useNavigate();
  if (!view) return redirect("/");

  const [formData, setFormData] = useState<
    Pick<
      IUser,
      | "first_name"
      | "last_name"
      | "email"
      | "username"
      | "account_type"
      | "password"
    >
  >({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    account_type: "S",
    password: "",
  });

  const backgrounds = {
    firstView: FirstViewImage,
    secondView: SecondViewImage,
  };

  const first_onboading_view = (
    <div className="w-full flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl">Complete your signup</h1>
        <p className="text-sm">
          Hey {"Guest!, "}Did you know you can still change your initial details
          use for signup?
        </p>
      </div>
      <form className="flex flex-col gap-2 mt-2" action="">
        <Input required className="w-full h-[3rem]" placeholder="Email" />
        <Input
          required
          className="w-full h-[3rem]"
          placeholder="Full Name (First Name and Second Name)"
        />
      </form>
      <div className="w-full flex items-end justify-end">
        <Button
          onClick={() => navigate("/quizly-onboarding/secondView")}
          size={"lg"}
          className="bg-green-400 flex text-white gap-2 hover:bg-green-500 dark:bg-green-500 hover:dark:bg-green-600 disabled:bg-green-700"
        >
          Next <MoveRight />
        </Button>
      </div>
    </div>
  );
  //
  const second_onboading_view = (
    <div className="w-full flex flex-col gap-3">
      <div>
        <h1 className="text-3xl">
          What type of account did you want to create
        </h1>
        <p>This helps us personalize your experience on our app</p>
      </div>
      <div className="flex w-full mt-2 flex-col gap-3">
        <div
          onClick={() => setFormData({ ...formData, account_type: "S" })}
          className={`w-full ${
            formData.account_type === "S" && "bg-green-500 text-white"
          } overflow-hidden h-fit text-3xl p-3 rounded-md relative hover:bg-green-500 hover:text-white transition-all delay-75 ease-linear border border-green-400 items-start flex flex-col justify-start`}
        >
          <Award
            size={60}
            className="-mt-5 -ml-5 absolute top-0 left-0 opacity-50"
          />
          Student
          <p className="text-base">{content.student_acct_desc}</p>
        </div>
        <div
          onClick={() => setFormData({ ...formData, account_type: "T" })}
          className={`w-full ${
            formData.account_type === "T" && "bg-green-500 text-white"
          } overflow-hidden h-fit border border-green-400 text-3xl p-3 rounded-md hover:bg-green-500 transition-all delay-75 ease-linear hover:text-white flex flex-col items-start relative justify-start`}
        >
          <User
            size={60}
            className="-mt-5 -ml-5 absolute top-0 left-0 opacity-50"
          />
          Teacher
          <p className="text-base">{content.teacher_acct_desc}</p>
        </div>
      </div>
      <div className="w-full flex items-end justify-end">
        <Button
          onClick={() => navigate("/quizly-onboarding/secondView")}
          size={"lg"}
          className="bg-green-400 flex text-white gap-2 hover:bg-green-500 dark:bg-green-500 hover:dark:bg-green-600 disabled:bg-green-700"
        >
          Complete <MoveRight />
        </Button>
      </div>
    </div>
  );

  const default_view = (
    <div className="w-full flex items-center justify-center flex-col gap-3">
      <h1 className="text-4xl text-center">
        Get Ready to complete your sign up with {app_config.AppName}
      </h1>
      <div className="w-full">
        <p className="text-center text-xl text-green-500">
          Why you should do this!
        </p>
        <ul className="list-disc pl-6">
          <li>
            Personalized Experience: Completing the onboarding process allows us
            to tailor your quiz experience based on your preferences and
            interests.
          </li>
          <li>
            Custom Recommendations: Receive personalized quiz recommendations
            and content suggestions to match your areas of interest and
            expertise.
          </li>
          <li>
            Community Engagement: Unlock features to connect with other users,
            join communities, and participate in discussions around your
            favorite quiz topics.
          </li>
        </ul>
      </div>
      <Button
        onClick={() => navigate("/quizly-onboarding/firstView")}
        className="mt-3"
        size={"lg"}
        variant={"secondary"}
      >
        Get Started
      </Button>
    </div>
  );

  const element = {
    firstView: first_onboading_view,
    secondView: second_onboading_view,
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-[40%] flex items-center p-2 h-full relative">
        <Link
          to={"/home"}
          className="absolute text-green-500 top-0 text-lg font-semibold right-0 mt-3 mr-3"
        >
          Skip
        </Link>
        {element[view] || default_view}
      </div>
      <img
        className="w-[60%] h-full"
        src={backgrounds[view] || DefaultViewImage}
      />
    </div>
  );
};

export default Onboarding;
