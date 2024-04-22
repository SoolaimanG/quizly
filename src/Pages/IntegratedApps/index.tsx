import { useWindowSize } from "@uidotdev/usehooks";
import { FC, useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/DialogModal";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../../components/Drawer";
import queryString from "query-string";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../../components/BreadCrumb";
import { GoogleDriveIcon } from "../../assets/GoogleDrive";
import { Description } from "../ExplorePage/QuickQuiz";
import { app_config } from "../../Types/components.types";
import { ExcelIcon } from "../../assets/ExcelIcon";
import { ConnectApps } from "../../Functions/surveyApis";
import { toast } from "../../components/use-toaster";
import { errorMessageForToast } from "../../Functions";
import { AxiosError } from "axios";
import { apps } from "../../constant";
import { useComingSoonProps } from "../../provider";

const refLinks = [
  "https://support.microsoft.com/en-gb/office/surveys-in-excel-hosted-on-the-web-5fafd054-19f8-474c-97ec-b606fcda0ff9#:~:text=Sign%20in%20to%20Microsoft%20365,more%20about%20Microsoft%20365%20groups.",
  "https://www.linkedin.com/pulse/how-google-drive-can-help-you-store-access-your-important-fekadu/",
];

export const IntegrateApps: FC<{}> = () => {
  const { width } = useWindowSize();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeState, setActiveState] = useState(0);
  const connect = new ConnectApps();
  const { setIsVisible, setDescription, setFeatureName, setJoinWaitList } =
    useComingSoonProps();
  const qs = queryString.parse(location.search, { parseBooleans: true }) as {
    id: string;
    block?: string;
    connect: boolean;
    opend?: boolean;
  };

  const [open, setOpen] = useState(false);

  const connectApp = async () => {
    try {
      if (activeState === 1) {
        setIsVisible(true);
        setDescription(
          `By integrating ${app_config.AppName} with Microsoft Excel, you gain a centralized and highly customizable platform for analyzing your survey responses. This empowers you to extract valuable insights, identify patterns, and make data-driven decisions with unparalleled control.`
        );
        setFeatureName("Excel Integration");
        setJoinWaitList(false);
        return;
      }

      await connect.connect_app(apps[activeState]);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessageForToast(
          error as AxiosError<{ message: string }>
        ),
      });
    }
  };

  useEffect(() => {
    setOpen(qs?.connect);

    return () => setOpen(false);
  }, [qs.connect]);

  const closeModal = () => {
    navigate(
      `?id=${qs.id}${qs.block ? `&block=${qs.block}` : ""}&connect=false`
    );
  };

  const breadCrumb = (path: string) => {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>Connect</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>App Integration</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem className="font-semibold text-green-500">
            {path}
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  };

  const integrationsUis = {
    excel: (
      <div>
        {breadCrumb("Excel")}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mt-4">
            <ExcelIcon />
            <h1>Excel</h1>
          </div>
          <Description className="text-lg" text="App Integration" />
          <Description
            className="mt-4"
            text={`By integrating ${app_config.AppName} with Microsoft Excel, you gain a centralized and highly customizable platform for analyzing your survey responses. This empowers you to extract valuable insights, identify patterns, and make data-driven decisions with unparalleled control.`}
          />
          <div className="flex w-full items-end justify-end">
            <Button asChild variant="outline">
              <a href={refLinks[0]}>Read More</a>
            </Button>
          </div>
        </div>
      </div>
    ),
    google: (
      <div className="px-1">
        {breadCrumb("Google Drive")}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mt-4">
            <GoogleDriveIcon />
            <h1>Google Drive</h1>
          </div>
          <Description className="text-lg" text="App Integration" />
          <Description
            className="mt-4"
            text={`By integrating ${app_config.AppName} with Google Drive, you gain a centralized and organized repository for your survey results. This unlocks a world of possibilities for analyzing trends, identifying patterns, and making data-driven decisions.`}
          />
          <div className="flex w-full items-end justify-end">
            <Button asChild variant="outline">
              <a target="__blank" href={refLinks[1]}>
                Read More
              </a>
            </Button>
          </div>
        </div>
      </div>
    ),
  };

  const ModalUIs = {
    header: {
      title: "Connect Powerful Tools",
      description:
        "Make your surveys smarter by connecting them with other helpful apps. Imagine your survey working seamlessly with familiar tools you already use!",
    },
    styles: {
      title: "text-green-500",
      swiper: "md:h-[17rem] h-[18rem] w-full",
    },
    availableIntegrations: [integrationsUis.google, integrationsUis.excel],
    buttons: {
      close_btn: (
        <Button onClick={connectApp} className="w-full" variant="base">
          Connect
        </Button>
      ),
    },
  };

  return Number(width) > 767 ? (
    <Dialog open={qs.connect} onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className={ModalUIs.styles.title}>
            {ModalUIs.header.title}
          </DialogTitle>
          <DialogDescription>{ModalUIs.header.description}</DialogDescription>
        </DialogHeader>
        <Swiper
          pagination={true}
          modules={[Pagination]}
          className={ModalUIs.styles.swiper}
          onSlideChange={({ activeIndex }) => setActiveState(activeIndex)}
        >
          {ModalUIs.availableIntegrations.map((ui, index) => (
            <SwiperSlide key={index}>{ui}</SwiperSlide>
          ))}
        </Swiper>
        <DialogFooter>
          <DialogClose>{ModalUIs.buttons.close_btn}</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ) : (
    <Drawer
      open={open}
      onOpenChange={(e) => {
        setOpen(e);
        !e && closeModal();
      }}
    >
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className={ModalUIs.styles.title}>
            {ModalUIs.header.title}
          </DrawerTitle>
          <DrawerDescription>{ModalUIs.header.description}</DrawerDescription>
        </DrawerHeader>
        <div className="p-2">
          <Swiper
            pagination={true}
            modules={[Pagination]}
            className={ModalUIs.styles.swiper}
            onSlideChange={({ activeIndex }) => setActiveState(activeIndex)}
          >
            {ModalUIs.availableIntegrations.map((ui, index) => (
              <SwiperSlide key={index}>{ui}</SwiperSlide>
            ))}
          </Swiper>
        </div>
        <DrawerFooter>
          <DrawerClose className="w-full">
            {ModalUIs.buttons.close_btn}
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
