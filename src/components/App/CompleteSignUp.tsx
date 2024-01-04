import React, { useState } from "react";
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
  const [isOpen, setIsOpen] = useState(open);
  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen((prev) => !prev)}>
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
        <div className="w-full flex gap-3">
          <Button className="w-full" variant={"outline"}>
            <Link to={fallback}>Not right now</Link>
          </Button>
          <Button className="w-full" asChild variant={"base"}>
            <Link to={app_config.onboarding_page}>{"Let's do this"}</Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CompleteSignUp;
