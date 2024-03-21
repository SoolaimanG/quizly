import Lottie from "lottie-react";
import AnimationData from "../../assets/checkedLottie.json";

export const LottieSuccess = ({
  size = 17,
  className,
  loop,
}: {
  size?: number;
  className?: string;
  loop?: boolean;
}) => {
  return (
    <Lottie
      width={size}
      animationData={AnimationData}
      size={size}
      height={size}
      className={className}
      loop={loop}
    />
  );
};
