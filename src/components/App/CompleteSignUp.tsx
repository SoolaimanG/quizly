import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  //DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../DialogModal";
import { app_config } from "../../Types/components.types";
import { Button } from "../Button";
import { Link } from "react-router-dom";

const CompleteSignUp: React.FC<{ open: boolean; fallback?: string }> = ({
  open = false,
  fallback = "/",
}) => {
  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Do you want to complete your signup?</DialogTitle>
          <DialogDescription>
            These allow you to access all {app_config.AppName} features
          </DialogDescription>
        </DialogHeader>
        <div>
          <p>
            By doing this you are letting us know what to reccommend for you to
            boost your learning and improve your productivity
          </p>
        </div>
        <div className="w-full flex items-end justify-end gap-3">
          <Button className="w-full md:w-fit" variant={"outline"}>
            <Link to={fallback}>Not right now</Link>
          </Button>
          <Link
            className="p-2 bg-green-400 rounded-md text-white px-4 hover:bg-green-500 dark:bg-green-500 hover:dark:bg-green-600"
            to={app_config.onboarding_page}
          >
            {"Let's do this"}
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CompleteSignUp;
