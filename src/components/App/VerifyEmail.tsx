import React from "react";
import { Button } from "../Button";
import { Input } from "../Input";

const VerifyEmail: React.FC<{
  user_email: string;
  show_input?: boolean;
  varient?: "destructive" | "base";
}> = ({ user_email, show_input = false, varient = "base" }) => {
  return (
    <form className="flex flex-col gap-2 w-full" onSubmit={() => {}}>
      {show_input && (
        <Input value={user_email} disabled className="w-full h-[3rem]" />
      )}
      <Button variant={varient} className="w-full h-[3rem]">
        Verify
      </Button>
    </form>
  );
};

export default VerifyEmail;
