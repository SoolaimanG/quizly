import { useLocalStorage } from "@uidotdev/usehooks";
import OnboardingNav from "../../components/App/OnboardingNav";
import { content } from "../Onboarding";
import { onboardingProps } from "../../Types/components.types";

const DefaultView = () => {
  const [__, setView] = useLocalStorage<onboardingProps>("view", "DefaultView");
  return (
    <div className="w-full h-full flex flex-col gap-3">
      <h1 className="text-center text-green-500 text-4xl">{content.header}</h1>
      <p className="text-center text-lg text-gray-400 dark:text-gray-300">
        {content.description}
      </p>
      <OnboardingNav
        havePrev={false}
        prevNav="DefaultView"
        func={() => setView("FirstView")}
        tooltip="Start Onboarding"
      />
    </div>
  );
};

export default DefaultView;
