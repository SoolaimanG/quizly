import { Star } from "lucide-react";
import { IRate } from "../../Types/components.types";
import { Button } from "../Button";
import Glassmorphism from "./Glassmorphism";
import Hint from "../Hint";
import { useTransition } from "react";
import { cn } from "../../lib/utils";
import { useMethods } from "../../Hooks";

export const Rate = ({ rate }: IRate) => {
  const [_, startTransition] = useTransition();
  const { login_required } = useMethods();

  const action = {
    quiz: async () => {
      startTransition(() => {
        if (!login_required()) return;
      });
    },
    tutor: async () => {
      startTransition(() => {
        if (!login_required()) return;
      });
    },
  };

  const alreadyRated = () => {
    return true;
  };

  const content = alreadyRated() ? "Unrate Quiz" : "Rate Quiz";

  return (
    <Hint
      element={
        <Button
          onClick={action[rate]}
          className={cn("rounded-full", alreadyRated() && "text-green-500")}
          size={"icon"}
          variant="secondary"
        >
          <Star />
        </Button>
      }
      content={content}
      side="left"
    />
  );
};
