import { useLocalStorage } from "@uidotdev/usehooks";
import background from "../assets/complete_auth_human_with_people_illustration.png";
import { app_config, onboardingProps } from "../Types/components.types";
import DefaultView from "./Comps/DefaultView";
import FirstView from "./Comps/FirstView";
import SecondView from "./Comps/SecondView";
import ThirdView from "./Comps/ThirdView";
import FourthView from "./Comps/FourthView";
import { useZStore } from "../provider";

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

const Onboarding = () => {
  const [views, __] = useLocalStorage<onboardingProps>("view", "DefaultView");
  const { user } = useZStore();

  const AllViews = {
    DefaultView: <DefaultView />,
    FirstView: <FirstView user={user} />,
    SecondView: <SecondView user={user} />,
    ThirdView: <ThirdView user={user} />,
    FourthView: <FourthView />,
  };

  return (
    <div className="w-full h-screen overflow-hidden flex md:flex-row flex-col-reverse">
      <div className="md:w-[35%] overflow-auto p-2 md:h-full h-[70%] w-full">
        {AllViews[views]}
      </div>
      <img
        loading="lazy"
        src={background}
        alt="banner"
        className="md:w-[65%] h-[30%] md:h-full w-full"
      />
    </div>
  );
};

export default Onboarding;
