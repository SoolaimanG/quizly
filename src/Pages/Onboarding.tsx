import background from "../assets/complete_auth_human_with_people_illustration.png";
import { app_config } from "../Types/components.types";
import { ChangeName } from "./Comps/ChangeName";
import { ChangeEmail } from "./Comps/ChangeEmail";
// import ThirdView from "./Comps/ThirdView";
// import FourthView from "./Comps/FourthView";
import { FC } from "react";
import { AccountType } from "./Comps/AccountType";
import { SelectCategoryComp } from "./Comps/SelectCategories";

export type onboardingViewTypes =
  | "CHANGE-EMAIL"
  | "CHANGE-NAME"
  | "ACCOUNT-TYPE"
  | "SELECT-CATEGORIES";

export const content = Object.freeze({
  header: `Welcome to ${app_config.AppName}`,
  description: `Get ready for a journey of knowledge and insights! ${app_config.AppName} is your hub for captivating quizzes and surveys. Dive into a world of questions that challenge and inspire. Whether you're here to test your knowledge or share your opinions, we've got something for everyone. Let the exploration begin!`,
  firstView:
    "Hello👋, I guess you are new here. Let's start by knowing who you are",
  secondView:
    "To get access to all " +
    app_config.AppName +
    " Features add your real email and verify your email address.",
  thirdView: "More About You",
  thirdDesc:
    "Tell us more about you, so we can recommend you quizzes that suit you",
  fourthView: "One Last Step",
  fourthDesc: "We are done after this, select your favorite subjects.",
});

const Onboarding: FC<{ view: onboardingViewTypes }> = ({ view }) => {
  const AllViews: Record<onboardingViewTypes, any> = {
    "CHANGE-EMAIL": <ChangeEmail />,
    "CHANGE-NAME": <ChangeName />,
    "ACCOUNT-TYPE": <AccountType />,
    "SELECT-CATEGORIES": <SelectCategoryComp />,
  };

  return (
    <div className="w-full h-screen overflow-hidden flex md:flex-row flex-col-reverse">
      <div className="md:w-[35%] overflow-auto p-2 md:h-full h-[70%] w-full">
        {AllViews[view]}
      </div>
      <img
        loading="lazy"
        src={background}
        alt="banner"
        className="md:w-[65%] h-[40%] md:h-full w-full"
      />
    </div>
  );
};

export default Onboarding;
