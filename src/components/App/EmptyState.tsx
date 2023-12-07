import ImageOne from "../../assets/ImgOne.png";
import ImageTwo from "../../assets/ImgTwo.png";
import ImageThree from "../../assets/ImgThree.png";

const EmptyState = ({
  message,
  state = "search",
}: {
  message: string;
  state: "search" | "empty" | "list";
}) => {
  const image = {
    list: ImageTwo,
    empty: ImageOne,
    search: ImageThree,
  };

  return (
    <div className="flex w-full h-full items-center justify-center flex-col gap-2">
      <img className="" src={image[state]} alt={state} />
      <h1 className="text-green-500 text-2xl">{message}</h1>
    </div>
  );
};

export default EmptyState;
