import { Dispatch, FC, SetStateAction } from "react";
import { cn } from "../../lib/utils";
import { ConnectApps, integratedApps } from "../../Functions/surveyApis";
import { toast } from "../../components/use-toaster";
import { errorMessageForToast } from "../../Functions";
import { AxiosError } from "axios";

export const ConnectBtn: FC<{
  children: React.ReactNode;
  className?: string;
  appType: integratedApps;
  setDisable?: Dispatch<SetStateAction<boolean>>;
}> = ({ children, className, appType, setDisable }) => {
  const integration = new ConnectApps();

  const connectApp = async () => {
    setDisable && setDisable(true);
    try {
      await integration.connect_app(appType);
    } catch (error) {
      toast({
        title: "Error",
        description: errorMessageForToast(
          error as AxiosError<{ message: string }>
        ),
        variant: "destructive",
      });
    } finally {
      setDisable && setDisable(false);
    }
  };

  return (
    <div onClick={connectApp} className={cn("", className)}>
      {children}
    </div>
  );
};
