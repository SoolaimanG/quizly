import { FC } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../DialogModal";
import { app_config } from "../../Types/components.types";
import { Button } from "../Button";
import { Link } from "react-router-dom";
import { Description } from "../../Pages/ExplorePage/QuickQuiz";
import { useZStore } from "../../provider";
import { useWindowSize } from "@uidotdev/usehooks";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../Drawer";
import { Check } from "lucide-react";

export const CompleteSignUp: FC<{}> = () => {
  const { width } = useWindowSize();
  const { openOnboardingModal, setOpenOnboardingModal, user } = useZStore();
  const _completeSignUpContent = [
    {
      header: "Add your information",
      is_completed: user?.first_name && user?.last_name,
      explanation:
        "Add your first name and last name so people can easily identify you.",
    },
    {
      header: "Add and verify your email",
      is_completed: user?.email_verified,
      explanation:
        "After adding a new email, please verify it using the sent verification link.",
    },
    {
      header: "Select your account type",
      is_completed: user?.signup_complete,
      explanation:
        "Choose the account type that best fits your usage. It may affect your platform access.",
    },
  ];

  const path =
    !user?.first_name && !user?.last_name
      ? app_config.change_name
      : !user?.email_verified
      ? app_config.change_email
      : app_config.change_account_type;

  const ModalUI = {
    header: {
      title: "Complete your profile",
      description:
        "Please complete your profile base on your information so that we can personalize your experience.",
    },
    content: (
      <div className="p-2 flex flex-col gap-3">
        {_completeSignUpContent.map((content, index) => (
          <div className="flex items-center gap-2 w-full" key={index}>
            {content.is_completed ? (
              <div className="bg-green-500 text-white p-1 rounded-full cursor-pointer">
                <Check />{" "}
              </div>
            ) : (
              <div className="border border-green-500 rounded-full w-[2.08rem] h-[2.08rem] flex items-center justify-center">
                {index + 1}
              </div>
            )}
            <div className="w-[90%]">
              <h1 className="text-green-500">{content.header}</h1>
              <Description text={content.explanation} />
            </div>
          </div>
        ))}
      </div>
    ),
  };

  return Number(width) > 767 ? (
    <Dialog
      open={openOnboardingModal.open}
      onOpenChange={(open) => {
        setOpenOnboardingModal({ ...openOnboardingModal, open });
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-green-500">
            {ModalUI.header.title}
          </DialogTitle>
          <DialogDescription>{ModalUI.header.description}</DialogDescription>
        </DialogHeader>
        {ModalUI.content}
        <DialogFooter className="w-full flex gap-3">
          <Button asChild className="w-full" variant={"outline"}>
            <DialogClose asChild>
              <Link to={openOnboardingModal.fallbackUrl ?? "/"}>
                Not right now
              </Link>
            </DialogClose>
          </Button>
          <Button
            onClick={() =>
              setOpenOnboardingModal({ ...openOnboardingModal, open: false })
            }
            className="w-full"
            asChild
            variant={"base"}
          >
            <Link to={path}>{"Let's do this"}</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ) : (
    <Drawer
      open={openOnboardingModal.open}
      onOpenChange={(open) =>
        setOpenOnboardingModal({ ...openOnboardingModal, open })
      }
    >
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-green-500">
            {ModalUI.header.title}
          </DrawerTitle>
          <DrawerDescription>{ModalUI.header.description}</DrawerDescription>
        </DrawerHeader>
        {ModalUI.content}
        <DrawerFooter>
          <Button asChild variant="outline">
            <DrawerClose asChild>
              <Link to={openOnboardingModal.fallbackUrl || "/"}>Not Now</Link>
            </DrawerClose>
          </Button>
          <Button
            onClick={() =>
              setOpenOnboardingModal({ ...openOnboardingModal, open: false })
            }
            variant="base"
          >
            <Link to={path}>Continue</Link>
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
