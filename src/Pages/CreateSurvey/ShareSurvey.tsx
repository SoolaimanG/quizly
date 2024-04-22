import { useWindowSize } from "@uidotdev/usehooks";
import queryString from "query-string";
import { FC, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import { MessageCircleIcon, Send } from "lucide-react";
import { Twitter } from "lucide-react";
import { InstagramIcon } from "lucide-react";
import { Mail } from "lucide-react";
import { Share2Icon } from "lucide-react";
import { Button } from "../../components/Button";
import { Description } from "../ExplorePage/QuickQuiz";
import { Copy } from "../../components/Copy";
import { useSurveyWorkSpace } from "../../provider";

export const ShareSurvey: FC<{}> = ({}) => {
  const { survey } = useSurveyWorkSpace();
  const { width } = useWindowSize();
  const location = useLocation();
  const navigate = useNavigate();
  const qs = queryString.parse(location.search, { parseBooleans: true }) as {
    id: string;
    block: string;
    opend?: boolean;
    share?: boolean;
    connect?: boolean;
  };

  const closeModal = (e: boolean) => {
    navigate(`?id=${qs.id}&block=${qs.block}&connect=${false}&share=${e}`);
  };

  const socialMedias = [
    {
      icon: <MessageCircleIcon size={Number(width) > 767 ? 20 : 18} />,
      title: "Whatsapp",
    },
    {
      icon: <Send size={Number(width) > 767 ? 20 : 18} />,
      title: "Telegram",
    },
    {
      icon: <Twitter size={Number(width) > 767 ? 20 : 18} />,
      title: "Twitter",
    },
    {
      icon: <InstagramIcon size={Number(width) > 767 ? 20 : 18} />,
      title: "Instagram",
    },
    {
      icon: <Mail size={Number(width) > 767 ? 20 : 18} />,
      title: "E-mail",
    },
    {
      icon: <Share2Icon size={Number(width) > 767 ? 20 : 18} />,
      title: "More",
    },
  ];

  const surveyPath = import.meta.env.VITE_QUIZLY_HOST + "/survey/" + survey?.id;

  const ModalUI = {
    header: {
      title: "Share Your Survey.",
      description:
        "Spread the word about your survey and gather valuable insights from your audience.",
    },
    content: {
      note: "Share with",
      className: "p-2 flex flex-col gap-2",
      socialMedia: (
        <div className="flex items-center justify-between">
          {socialMedias.map((socialMedia, i) => (
            <div className="flex group flex-col gap-[3px] items-center" key={i}>
              <Button
                className="rounded-full group-hover:bg-green-200 md:w-16 md:h-16 w-12 h-12 hover:text-green-500 transition-all ease-linear"
                variant="secondary"
                size="icon"
              >
                {socialMedia.icon}
              </Button>
              <Description
                className=" group-hover:text-green-500"
                text={socialMedia.title}
              />
            </div>
          ))}
        </div>
      ),
      alt: "Or share with link",
    },
    link: (
      <div className="border border-green-500 px-2 py-3 rounded-md backdrop-blur-sm">
        <pre className="text-[12px] md:text-sm">{surveyPath}</pre>
      </div>
    ),
  };

  return (
    <>
      {Number(width) > 767 ? (
        <Dialog open={qs.share} onOpenChange={(e) => closeModal(e)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{ModalUI.header.title}</DialogTitle>
              <DialogDescription>
                {ModalUI.header.description}
              </DialogDescription>
            </DialogHeader>
            <div className={ModalUI.content.className}>
              <DialogDescription>{ModalUI.content.note}</DialogDescription>
              {ModalUI.content.socialMedia}
              <DialogDescription className="text-center mt-2">
                {ModalUI.content.alt}
              </DialogDescription>
              {ModalUI.link}
            </div>
            <DialogFooter>
              <DialogClose>
                <Copy text={surveyPath} variant="base" className="w-full" />
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={qs.share} onOpenChange={(e) => closeModal(e)}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>{ModalUI.header.title}</DrawerTitle>
              <DrawerDescription>
                {ModalUI.header.description}
              </DrawerDescription>
            </DrawerHeader>
            <div className={ModalUI.content.className}>
              <DrawerDescription>{ModalUI.content.note}</DrawerDescription>
              {ModalUI.content.socialMedia}
              <DrawerDescription className="text-center mt-2">
                {ModalUI.content.alt}
              </DrawerDescription>
              {ModalUI.link}
            </div>
            <DrawerFooter>
              <DrawerClose>
                <Copy text={surveyPath} variant="base" className="w-full" />
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};
