import AnimationJSON from "../../assets/WaitingAnimation.json";
import Lottie from "lottie-react";
import { Description } from "../../components/App/Description";

const content =
  "Congratulations on completing the quiz! Your responses will be carefully reviewed, and you'll receive feedback soon.";

export const WaitingForMarking: React.FC<{ finish_message: string }> = ({
  finish_message,
}) => {
  return (
    <div className="w-full flex md:flex-row items-center justify-center flex-col gap-2">
      <Lottie animationData={AnimationJSON} className="w-[10rem] h-[10rem]" />
      <div className="flex flex-col gap-1">
        <h1 className="text-center">
          Once your quiz has been graded by the instructor, you will receive a
          notification within the platform and an email informing you of your
          results.
        </h1>
        <Description text={finish_message || content} />
      </div>
    </div>
  );
};
