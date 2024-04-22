import { Star } from "lucide-react";
import { rating_props } from "../../Types/components.types";
import { cn } from "../../lib/utils";
import Hint from "../Hint";

const Rating = ({
  rating = 3,
  className,
  rating_length = 5,
  size = 17,
  color,
  onRatingSelect,
}: rating_props) => {
  const content = [
    "Terrible",
    "Poor",
    "Fair",
    "Average",
    "Satisfactory",
    "Above Average",
    "Excellent",
    "Outstanding",
    "Exceptional",
    "Superb",
    "Magnificent",
    "Phenomenal",
    "Top-notch",
    "Incredible",
    "Fantastic",
    "Amazing",
    "Wonderful",
    "Splendid",
    "Brilliant",
    "Impressive",
    "Spectacular",
    "Marvelous",
    "Fabulous",
    "Extraordinary",
    "Stellar",
    "Unbelievable",
    "Remarkable",
    "Awesome",
    "Incomparable",
    "Perfect",
  ];

  const colorCode = {
    GREEN: {
      fill: "#22c55e",
      text: "text-green-500",
    },
    BLUE: {
      fill: "#3b82f6",
      text: "text-blue-500",
    },
    YELLOW: {
      fill: "#eab308",
      text: "text-yellow-500",
    },
  };

  return (
    <div className={cn("flex cursor-pointer items-center gap-1", className)}>
      {Array.from({ length: rating_length }, (_, i) => (
        <Hint
          key={i}
          element={
            <Star
              onClick={() => onRatingSelect(i + 1)}
              size={size}
              className={cn(colorCode[color ?? "GREEN"]?.text)}
              fill={i < rating ? colorCode[color ?? "GREEN"]?.fill : ""}
            />
          }
          content={content[i]}
          delay={700}
        />
      ))}
    </div>
  );
};

export default Rating;
