import { AlertDialog } from "@radix-ui/react-alert-dialog";
import { FC, useEffect, useState } from "react";
import {
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/AlertModal";
import { LottieSuccess } from "../../components/App/LottieSucces";
import { usePublications, useSurveyWorkSpace } from "../../provider";
import { Copy } from "../../components/Copy";

export const SurveyPublishSuccess: FC<{}> = () => {
  const [isCopied, setIsCopied] = useState(false);
  const survey = useSurveyWorkSpace()?.survey;
  const { isSuccess, setIsSuccess } = usePublications();

  useEffect(() => {
    if (!isCopied) {
      return;
    }

    const timer = setTimeout(() => {
      setIsCopied(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [isCopied]);

  const surveyPath = import.meta.env.VITE_QUIZLY_HOST + "/survey/" + survey?.id;

  return (
    <AlertDialog open={isSuccess} onOpenChange={setIsSuccess}>
      <AlertDialogContent className="">
        <AlertDialogHeader className="flex items-center justify-center flex-col">
          <LottieSuccess className="w-[7rem]" loop={false} />
          <AlertDialogTitle className="text-green-500 italic">
            Publication Successful
          </AlertDialogTitle>
          <AlertDialogDescription>
            Your content has been successfully published. You can now share it
            with your audience and stakeholders. This marks an important
            milestone in your project journey, and we congratulate you on this
            achievement.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogDescription className="text-yellow-500">
          Link to your survey.
        </AlertDialogDescription>
        <div className="w-full flex h-[3rem] overflow-auto cursor-pointer items-center border border-gray-400 py-1 pl-2 pr-1 rounded-md">
          <pre className="w-full text-sm">{surveyPath}</pre>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
          {/* <Button asChild onClick={handleCopy} variant="base"> */}

          <div onClick={() => setIsSuccess(false)}>
            <Copy
              variant="base"
              text={surveyPath}
              disable={survey?.status === "DEVELOPMENT"}
            />
          </div>
          {/* {isCopied ? "Link Copied" : "Copy Link"} */}

          {/* </Button> */}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
