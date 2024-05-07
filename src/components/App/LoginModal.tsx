import { useWindowSize } from "@uidotdev/usehooks";
import { Drawer, DrawerClose, DrawerContent, DrawerHeader } from "../Drawer";
import Hint from "../Hint";
import { Button } from "../Button";
import Login from "../../Pages/Login";
import { useZStore } from "../../provider";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
} from "../AlertModal";
import { X } from "lucide-react";

export const LoginModal = () => {
  const { width } = useWindowSize();
  const { loginAttempt, setLoginAttempt } = useZStore();

  return Number(width) > 770 ? (
    <AlertDialog
      onOpenChange={(e) => setLoginAttempt({ attempt: e })}
      open={loginAttempt.attempt}
    >
      <AlertDialogContent>
        <Login
          fallback={loginAttempt.fallback}
          title="First things first login!"
          description="Just login need for you to access this action/page"
          isPopup
        />
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ) : (
    <Drawer
      shouldScaleBackground={false}
      onOpenChange={(e) => setLoginAttempt({ attempt: e })}
      open={loginAttempt.attempt}
    >
      <DrawerContent className="py-3 p-2">
        <DrawerHeader>
          <DrawerClose>
            <Hint
              element={
                <Button
                  className=" absolute h-7 w-7 mt-3 mr-3 top-0 right-0"
                  variant={"ghost"}
                  size={"icon"}
                >
                  <X size={15} />
                </Button>
              }
              content="Close"
            />
          </DrawerClose>
        </DrawerHeader>
        <Login
          fallback={loginAttempt.fallback}
          title="First things first login!"
          description={
            loginAttempt.note ||
            "Just login need for you to access this action/page"
          }
          isPopup
        />
      </DrawerContent>
    </Drawer>
  );
};
