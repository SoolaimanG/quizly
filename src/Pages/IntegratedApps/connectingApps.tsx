import { integratedApps } from "../../Functions/surveyApis";
import queryString from "query-string";
import { useLocation } from "react-router-dom";
import { appAccess, apps } from "../../constant";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/Card";
import Hint from "../../components/Hint";
import { Button } from "../../components/Button";
import { CheckIcon, ChevronRight, HelpCircle } from "lucide-react";
import Logo from "../../components/Logo";
import { GoogleDriveIcon } from "../../assets/GoogleDrive";
import { app_config } from "../../Types/components.types";
import { ConnectBtn } from "./ConnectBtn";
import { ExcelIcon } from "../../assets/ExcelIcon";
import { useEffect, useState } from "react";

const ConnectingApps = () => {
  const location = useLocation();
  const qs = queryString.parse(location.search, { parseBooleans: true }) as {
    provider: integratedApps;
    code?: string;
    scopes: string[];
    state: string;
  };
  const [data, setData] = useState({
    connectingAnimation: 0,
  });

  const isConnected = Boolean(qs.code && qs.scopes && qs.state);

  //   This will serve as a connecting indicator if the client is connecting to the server.
  useEffect(() => {
    if (!isConnected || data.connectingAnimation === 4) {
      setData({
        ...data,
        connectingAnimation: 0,
      });
      return;
    }

    const timer = setInterval(() => {
      setData({
        ...data,
        connectingAnimation: data.connectingAnimation++,
      });
    });

    return () => clearInterval(timer);
  }, [isConnected]);

  const classNames = {
    main: "w-full flex flex-col gap-3 mt-3",
    title: "text-center text-lg",
    description: "text-center",
    access: "flex items-center gap-3",
    icon: "p-1 rounded-full bg-green-500 text-green-200",
  };

  //   This is the icon that shows if the client is connecting to the server.
  const connectingSign = (
    <div className="flex items-center gap-2">
      {[...Array(4)].map((_, i) => (
        <ChevronRight className="text-green-200" key={i} size={17 + i} />
      ))}
    </div>
  );

  const header = (icon: React.ReactElement) => {
    return (
      <div className="w-full flex items-center justify-center gap-3">
        <Logo show_word={false} />
        {connectingSign}
        {icon}
      </div>
    );
  };

  const googleDriveIntegration = (
    <div className={classNames.main}>
      {header(<GoogleDriveIcon />)}
      <CardTitle className={classNames.title}>
        Connect {app_config.AppName} to Google Drive
      </CardTitle>
      <CardDescription className={classNames.description}>
        Analyze survey data alongside your existing customer information in
        Google Drive. This lets you see the bigger picture and identify which
        customer needs deserve the most attention.
      </CardDescription>
      <hr />
      <CardDescription className="text-lg text-green-500 font-medium">
        {app_config.AppName} would like to access:
      </CardDescription>
      {appAccess.map((aod, i) => (
        <div className={classNames.access} key={i}>
          <CheckIcon className={classNames.icon} />
          <CardDescription>{aod}</CardDescription>
        </div>
      ))}
      {!isConnected && (
        <ConnectBtn appType="google_drive" className="w-full">
          <Button className="w-full" variant="base">
            Connect
          </Button>
        </ConnectBtn>
      )}
    </div>
  );

  const excelIntegration = (
    <div className={classNames.main}>
      {header(<ExcelIcon />)}
      <CardTitle className={classNames.title}>
        Connect {app_config.AppName} to Excel
      </CardTitle>
      <CardDescription className={classNames.description}>
        Once you have clear insights, use Excel to prioritize tasks and plan
        actions based on your customer feedback. This ensures you're addressing
        the most critical needs first.
      </CardDescription>
      <hr />
      <CardDescription className="text-lg text-green-500 font-medium">
        {app_config.AppName} would like to access:
      </CardDescription>
      {appAccess.map((aod, i) => (
        <div className={classNames.access} key={i}>
          <CheckIcon className={classNames.icon} />
          <CardDescription>{aod}</CardDescription>
        </div>
      ))}
      {!isConnected && (
        <ConnectBtn appType="excel" className="w-full">
          <Button className="w-full" variant="base">
            Connect
          </Button>
        </ConnectBtn>
      )}
    </div>
  );

  if (!qs.provider || !apps.includes(qs.provider)) return <>Nothing to see</>;

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      <Card className="md:w-[40%] w-[85%] p-0 rounded-sm">
        <CardContent className="w-full p-2">
          <CardHeader className="p-0 w-full flex flex-row items-center justify-between">
            <CardDescription className="text-green-500 text-xl">
              Integrated Apps
            </CardDescription>
            <Hint
              element={
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-7 w-7 rounded-full"
                >
                  <HelpCircle size={20} />
                </Button>
              }
              content="How it works!"
            />
          </CardHeader>

          <div className="w-full">
            {qs.provider === "google_drive" && googleDriveIntegration}
            {qs.provider === "excel" && excelIntegration}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConnectingApps;
