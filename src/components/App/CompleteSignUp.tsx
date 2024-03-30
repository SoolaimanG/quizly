import { FC } from "react";
import {
  Dialog,
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

const _completeSignUpContent = [
  {
    header: "Change your email",
    is_completed: false,
    explanation:
      "When you initially created your account, a temporary email address was assigned. It's recommended to update this to your personal email address for better security and to ensure you receive important account notifications.",
  },
  {
    header: "Confirm your email",
    is_completed: false,
    explanation:
      "After changing your email address, a confirmation link will be sent to your new inbox. Click on this link to verify your ownership of the new email address and ensure it's working correctly.",
  },
  {
    header: "Select your account type",
    is_completed: false,
    explanation:
      "There might be different account types available (e.g., student or tutor). Choose the option that best suits your needs and how you plan to use the platform. This selection may influence the features and functionalities accessible to you.",
  },
];

export const CompleteSignUp: FC<{}> = () => {
  const { openOnboardingModal, setOpenOnboardingModal } = useZStore();
  return (
    <Dialog
      open={openOnboardingModal.open}
      onOpenChange={(e) =>
        setOpenOnboardingModal({ ...openOnboardingModal, open: e })
      }
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-green-500">
            {"Hey don't you think it's a good idea to complete your sign-up"}
          </DialogTitle>
          <DialogDescription>
            Below are some of the steps you need to complete to get your account
            up and ready to access all {app_config.AppName} features.
          </DialogDescription>
        </DialogHeader>
        <div className="bg-gray-100 dark:bg-slate-900 cursor-pointer w-full flex flex-col gap-3 rounded-md p-3">
          {_completeSignUpContent.map((content, index) => (
            <div className="flex gap-2" key={index}>
              <div className="p-1 border md:size-[2rem] size-[2.5rem] flex items-center justify-center border-green-500 rounded-full">
                <p className="text-green-500">{index + 1}</p>
              </div>
              <div className="w-full flex flex-col ">
                <h1>{content.header}</h1>
                <Description className="" text={content.explanation} />
              </div>
            </div>
          ))}
        </div>
        <DialogFooter className="w-full flex gap-3">
          <Button
            asChild
            onClick={() =>
              setOpenOnboardingModal({ ...openOnboardingModal, open: false })
            }
            className="w-full"
            variant={"outline"}
          >
            <Link to={openOnboardingModal.fallbackUrl ?? "/"}>
              Not right now
            </Link>
          </Button>
          <Button className="w-full" asChild variant={"base"}>
            <Link to={app_config.onboarding_page}>{"Let's do this"}</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
