import { Button } from "../../components/Button";
import { useSurveyWorkSpace } from "../../provider";

export const ToggleDeviceView = () => {
  const { deviceView, setDeviceView } = useSurveyWorkSpace();

  return (
    <div className="p-1 bg-gray-200 dark:bg-slate-950 rounded-md flex gap-2 items-center">
      <Button
        onClick={() => setDeviceView("desktop")}
        variant={deviceView === "desktop" ? "secondary" : "ghost"}
        className="h-6 p-1"
      >
        Desktop
      </Button>
      <Button
        onClick={() => setDeviceView("mobile")}
        variant={deviceView === "mobile" ? "secondary" : "ghost"}
        className="h-6 p-1"
      >
        Mobile
      </Button>
    </div>
  );
};
