import Hint from "../../components/Hint";
import { Bookmark } from "lucide-react";
import { Button } from "../../components/Button";
import { useWindowSize } from "@uidotdev/usehooks";

export const SaveQuiz = () => {
  const { width } = useWindowSize();
  return (
    <div>
      <Hint
        element={
          <Button variant={"secondary"} className="rounded-full" size={"icon"}>
            <Bookmark />
          </Button>
        }
        content="Save Quiz"
        side={Number(width) > 800 ? "left" : "top"}
      />
    </div>
  );
};
