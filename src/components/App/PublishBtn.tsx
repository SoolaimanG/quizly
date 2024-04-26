import { FC, ReactElement, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../AlertModal";
import { Img } from "react-image";
import RocketImage from "../../assets/rocketIcon.png";
import { Button } from "../Button";
import { Description } from "../../Pages/ExplorePage/QuickQuiz";
import { DatePicker } from "../DatePicker";
import { Loader2 } from "lucide-react";
import { Textarea } from "../TextArea";
import { usePublications, useSurveyWorkSpace } from "../../provider";
import { Input } from "../Input";
import { capitalize_first_letter, errorMessageForToast } from "../../Functions";
import { Badge } from "../Badge";
import { toast } from "../use-toaster";
import { AxiosError } from "axios";
import { SurveyWorkSpace } from "../../Functions/surveyApis";

export type publishBtnTypes = {
  children: ReactElement;
  note: string;
  extraChildren?: ReactElement;
  publishComplete: boolean;
  publicationType?: "survey" | "quiz";
};

export const PublishBtn: FC<publishBtnTypes> = ({
  children,
  publicationType = "survey",
}) => {
  const {
    recipients,
    setRecipients,
    openPublishModal,
    isLoading,
    setOpenPublishModal,
    setIsSuccess,
  } = usePublications();
  const { survey, setSurvey } = useSurveyWorkSpace();
  const action = new SurveyWorkSpace(survey?.id || "");
  const [date, setDate] = useState<Date | undefined>();
  const [password, setPassword] = useState("");

  const handlePublication = async () => {
    try {
      await action.publishSurvey(
        password,
        "PRODUCTION",
        recipients.split(/[,.]/)
      );
      survey && setSurvey({ ...survey, status: "PRODUCTION" });
      setPassword("");
      setIsSuccess(true);
    } catch (error) {
      toast({
        title: "Error",
        description: errorMessageForToast(
          error as AxiosError<{ message: string }>
        ),
        variant: "destructive",
      });
    }
  };

  const UIs = {
    header:
      publicationType === "quiz"
        ? "Publish Your Quiz and Engage Your Audience"
        : "Launch Your Survey and Gather Valuable Insights",
    description:
      publicationType === "quiz"
        ? "Optionally, you can integrate lead capture forms with your quiz, allowing you to collect valuable contact information from participants."
        : "Use the insights gleaned from your surveys to inform your marketing strategies, product development, and overall business decisions.",
    scheduleLaunch: (
      <div className="w-full flex flex-col gap-1">
        <Description
          className="text-yellow-500"
          text="All Schedule Launch Will Start At Exactly 12:00am"
        />
        <div className="flex items-center gap-1">
          <DatePicker
            className="w-full"
            format="PPP"
            date={date}
            setDate={setDate}
          />
          <Button variant="base" disabled>
            Schedule
          </Button>
        </div>
      </div>
    ),
    featureUpdate:
      publicationType === "quiz" ? (
        <div></div>
      ) : (
        <Textarea
          value={recipients}
          onChange={(e) => setRecipients(e.target.value)}
          placeholder="Enter email addresses separated by comma or full-stop."
        />
      ),
  };

  return (
    <AlertDialog open={openPublishModal} onOpenChange={setOpenPublishModal}>
      <AlertDialogTrigger>{children}</AlertDialogTrigger>
      <AlertDialogContent className="py-2">
        {survey?.status === "PRODUCTION" && (
          <Badge variant="success" className="rounded-sm">
            {survey.name?.toUpperCase() +
              " is already in production.".toUpperCase()}
          </Badge>
        )}
        <div className="w-full flex items-center justify-center">
          <Img
            loader={<Loader2 size={18} className="animate-spin" />}
            className="w-[7rem] h-[7rem]"
            src={RocketImage}
            alt="Rocket Image"
          />
        </div>

        <AlertDialogTitle className="text-green-500">
          {UIs.header}
        </AlertDialogTitle>
        <AlertDialogDescription className="mt-0">
          {UIs.description}
        </AlertDialogDescription>
        <div className="flex flex-col gap-2">
          {UIs.scheduleLaunch}
          {UIs.featureUpdate}
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder={`Enter Password To Publish ${capitalize_first_letter(
              publicationType
            )}`}
            className="h-[3rem]"
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            disabled={
              password.length < 8 &&
              !isLoading &&
              survey?.status === "PRODUCTION"
            }
            onClick={handlePublication}
            asChild
            variant="base"
          >
            <AlertDialogAction>Publish</AlertDialogAction>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
