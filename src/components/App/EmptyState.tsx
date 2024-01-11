import ImageOne from "../../assets/ImgOne.png";
import ImageTwo from "../../assets/ImgTwo.png";
import ImageThree from "../../assets/ImgThree.png";
import { cn } from "../../lib/utils";
import { Description } from "../../Pages/ExplorePage/QuickQuiz";

const EmptyState = ({
  message,
  state = "search",
  className,
}: {
  message: string;
  state: "search" | "empty" | "list";
  className?: string;
}) => {
  const image = {
    list: ImageTwo,
    empty: ImageOne,
    search: ImageThree,
  };

  return (
    <div className="flex w-full h-full items-center justify-center flex-col gap-2">
      <img className="" src={image[state]} alt={state} />
      <Description
        text={message}
        className={cn("text-green-500 text-xl", className)}
      />
    </div>
  );
};

export default EmptyState;
