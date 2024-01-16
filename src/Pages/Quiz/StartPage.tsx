import { Img } from "react-image";
import { QuickActions } from "./QuickActions";
import Illustration from "../../assets/undraw_reading_list_re_bk72.svg";
import { Loader2 } from "lucide-react";
import { Description } from "../ExplorePage/QuickQuiz";
import { IQuiz } from "../../Types/components.types";
import { StartQuizButton } from "../../components/App/StartQuizButton";

export const StartPage: React.FC<{ data: IQuiz }> = ({
  data: { instructions },
}) => {
  return (
    <div className="w-full h-full pt-10 px-3 pb-1 flex flex-col gap-3 relative">
      {/* Start Quiz Content */}
      <div className="md:max-w-4xl md:m-auto flex items-center justify-center flex-col gap-4">
        <Img
          className="w-1/2 h-1/2"
          src={Illustration}
          loader={<Loader2 className="animate-spin" />}
        />
        <h1 className="text-2xl">Your Quiz Is Ready</h1>
        <Description className="text-center w-full" text={instructions} />
        <StartQuizButton button_text="Let's Go" isAuthenticated />
      </div>
      <QuickActions className="items-center justify-center md:justify-normal md:absolute md:top-36 md:right-5 md:flex-col flex-row" />
    </div>
  );
};
