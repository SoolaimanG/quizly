import { FC, useEffect, useState } from "react";
import { Description } from "../../components/App/Description";
import { ConnectQuizAsAuthUser } from "./ConnectQuizAsAuthUser";
import { Button } from "../../components/Button";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuthentication } from "../../Hooks";
import { getAnonymousID } from "../../Functions";
import { useSessionStorage } from "@uidotdev/usehooks";

export const ConnectAnonymousUserQuizResultToAuthUser: FC<{}> = () => {
  const { isAuthenticated } = useAuthentication();
  const [showModal, setShowModal] = useSessionStorage<boolean>(
    "connect_quiz_modal",
    false
  );

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const anonymous_id = getAnonymousID();

    if (!anonymous_id) {
      return;
    }

    const timer = setTimeout(() => {
      setShowModal(true);
    }, 1000 * 60 * 60);

    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  return (
    <AnimatePresence>
      {true && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed bottom-0 w-full z-30"
        >
          <div className="w-full bg-gray-100 dark:bg-slate-800 p-2 flex flex-col md:flex-row md:items-center md:justify-between gap-2 relative">
            <Button
              variant="outline"
              className="absolute top-1 right-1 h-6 w-6 p-1 block md:hidden"
            >
              <X size={14} />
            </Button>
            <div className="w-full">
              <h1 className="josefin-sans-font">
                Yay! It looks like you are login as SoolaimanG
              </h1>
              <Description text="Connect your account to save your quiz progress, track your performance, and access more features." />
            </div>
            <div className="flex items-center gap-2">
              <ConnectQuizAsAuthUser className="w-fit">
                <Button variant="base">Save Quiz</Button>
              </ConnectQuizAsAuthUser>
              <Button variant="outline" className="md:block hidden">
                Close
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
