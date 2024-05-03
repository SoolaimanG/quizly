import ImageOne from "../../assets/ImgOne.png";
import ImageTwo from "../../assets/ImgTwo.png";
import ImageThree from "../../assets/ImgThree.png";
import ImageFour from "../../assets/undraw_add_notes_re_ln36.svg";
import { cn } from "../../lib/utils";
import { Img } from "react-image";
import { Loader2 } from "lucide-react";
import { Description } from "./Description";

const EmptyState = ({
  message,
  state = "search",
  className,
  imageClassName,
}: {
  message: string;
  state?: "search" | "empty" | "list" | "add_a_note";
  className?: string;
  imageClassName?: string;
}) => {
  const image = {
    list: ImageTwo,
    empty: ImageOne,
    search: ImageThree,
    add_a_note: ImageFour,
  };

  return (
    <div className="flex w-full h-full items-center justify-center flex-col gap-2">
      <Img
        className={imageClassName}
        loader={<Loader2 className="animate-spin" />}
        src={image[state]}
        alt={state}
      />
      <Description
        text={message}
        className={cn("text-green-500 text-center text-xl", className)}
      />
    </div>
  );
};

export default EmptyState;
