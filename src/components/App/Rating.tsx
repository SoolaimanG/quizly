import { Star } from "lucide-react";
import { rating_props } from "../../Types/components.types";
import { cn } from "../../lib/utils";
import Hint from "../Hint";

const Rating = ({ rating = 3 }: rating_props) => {
  const _RATING_LENGTH = 5;

  const content = ["Bad", "Not Bad", "Good", "Very Good", "The Best"];

  return (
    <div className="flex cursor-pointer items-center gap-1">
      {Array.from({ length: _RATING_LENGTH }, (_, i) => (
        <Hint
          key={i}
          element={
            <Star size={17} className={cn(i < rating && "text-green-500")} />
          }
          content={content[i]}
          delay={700}
        />
      ))}
    </div>
  );
};

export default Rating;
