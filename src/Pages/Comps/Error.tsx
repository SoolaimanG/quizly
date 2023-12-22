import React from "react";
import { errorPageProps } from "../../Types/components.types";
import { Button } from "../../components/Button";
import { XCircle } from "lucide-react";

const Error: React.FC<errorPageProps> = ({
  errorMessage = "Something went wrong...",
  retry_function,
}) => {
  return (
    <div className="w-full h-full flex items-center justify-center flex-col gap-3">
      <XCircle size={75} className="text-red-500" />
      <p className="text-red-400 text-base">{errorMessage}</p>
      <Button onClick={retry_function} size={"lg"} variant={"destructive"}>
        Retry This
      </Button>
    </div>
  );
};

export default Error;
