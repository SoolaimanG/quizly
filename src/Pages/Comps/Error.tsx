import React, { useTransition } from "react";
import { errorPageProps } from "../../Types/components.types";
import { Button } from "../../components/Button";
import { XCircle } from "lucide-react";
import { cn } from "../../lib/utils";
import PageLoader from "../../components/Loaders/PageLoader";

const Error: React.FC<errorPageProps> = ({
  errorMessage = "Something went wrong...",
  retry_function,
  className,
}) => {
  const [isPending, startTransition] = useTransition();

  if (isPending)
    return <PageLoader className="mt-5 gap-5" size={30} text="Retrying" />;

  return (
    <div
      className={cn(
        "w-full h-full flex items-center justify-center flex-col gap-3",
        className
      )}
    >
      <XCircle size={75} className="text-red-500" />
      <p className="text-red-400 text-base">{errorMessage}</p>
      <Button
        onClick={() => {
          startTransition(() => {
            retry_function();
          });
        }}
        size={"lg"}
        variant={"destructive"}
      >
        Retry This
      </Button>
    </div>
  );
};

export default Error;
