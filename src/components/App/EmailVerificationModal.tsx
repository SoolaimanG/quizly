import { useWindowSize } from "@uidotdev/usehooks";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../AlertModal";
import { useZStore } from "../../provider";
import { VerifyEmail } from "./VerifyEmail";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "../Drawer";
import Hint from "../Hint";
import { Button } from "../Button";
import { X } from "lucide-react";
import { FC } from "react";

const content = Object.freeze({
  description:
    "we have to make sure your email is valid and verify please giving you access to this action.",
  header: "Email Verification Is Required",
});

export const EmailVerificationModal: FC<{}> = () => {
  const { width } = useWindowSize();
  const { emailVerificationRequired, setEmailVerificationRequired, user } =
    useZStore();

  return Number(width) > 770 ? (
    <AlertDialog
      onOpenChange={(e) => setEmailVerificationRequired(e)}
      open={emailVerificationRequired}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-green-500">
            {content.header}
          </AlertDialogTitle>
          <AlertDialogDescription>{content.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <VerifyEmail show_input user_email={user?.email as string} />
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ) : (
    <Drawer
      open={emailVerificationRequired}
      onOpenChange={(e) => setEmailVerificationRequired(e)}
    >
      <DrawerContent className="py-6 p-2">
        <DrawerHeader className="flex flex-col gap-2">
          <DrawerTitle className="text-green-500">{content.header}</DrawerTitle>
          <DrawerDescription>{content.description}</DrawerDescription>
          <DrawerClose>
            <Hint
              element={
                <Button
                  className=" absolute mt-3 mr-3 top-0 w-5 h-5 p-[2px] right-0"
                  variant="outline"
                  size={"icon"}
                >
                  <X />
                </Button>
              }
              content="Close"
            />
          </DrawerClose>
        </DrawerHeader>
        <VerifyEmail show_input user_email={user?.email as string} />
      </DrawerContent>
    </Drawer>
  );
};
