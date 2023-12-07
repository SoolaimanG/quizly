import { Star } from "lucide-react";
import { rating_props } from "../../Types/components.types";

const Rating = ({ rating = 3, setRating }: rating_props) => {
  return (
    <div className="flex cursor-pointer items-center gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          onClick={() => setRating && setRating(i)}
          size={17}
          className={(i < rating && "text-green-500") || ""}
          key={i}
        />
      ))}
    </div>
  );
};

export default Rating;
