// import React from 'react'

import { FC, ReactElement } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/AlertModal";
import { ImportIcon, PlusIcon } from "lucide-react";
import { Description } from "../ExplorePage/QuickQuiz";
import { ShadowCard } from "../Quiz/QuizResult";
import { useNavigate } from "react-router-dom";
import queryString from "query-string";
import { errorMessageForToast, generateUUID } from "../../Functions";
import { app_config } from "../../Types/components.types";
import { SurveyWorkSpace } from "../../Functions/surveyApis";
import { toast } from "../../components/use-toaster";
import { AxiosError } from "axios";

export const CreateSurveyBtn: FC<{ children: ReactElement }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const survey = new SurveyWorkSpace();

  const handleClick = async (type: "import" | "scratch") => {
    const id = generateUUID();
    const opend = true;

    if (type === "import") {
      navigate("");
    } else {
      try {
        await survey.createSurvey({
          name: "New Survey WorkSpace",
          id,
        });
        const stratch = queryString.stringify({
          id,
          opend,
        });
        navigate(app_config.survey_workspace + "?" + stratch);
      } catch (error) {
        toast({
          title: "Error",
          description: errorMessageForToast(
            error as AxiosError<{ message: string }>
          ),
          variant: "destructive",
        });
      }
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-green-500">
            Create A New Form
          </AlertDialogTitle>
          <AlertDialogDescription>
            Make your voice heard and influence future decisions.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="w-full flex items-center justify-center gap-3">
          <ShadowCard
            onClick={() => handleClick("scratch")}
            className="w-1/2 dark:hover:border dark:hover:border-green-400 transition-all ease-linear flex items-center flex-col gap-2 hover:shadow-md rounded-md p-3 h-[11rem]"
          >
            <div className="p-2 rounded-md bg-green-100 dark:bg-green-400">
              <PlusIcon />
            </div>
            Start From Stratch
            <Description
              className="text-center"
              text="Jump right into it and build something phenomenal"
            />
          </ShadowCard>
          <ShadowCard className="w-1/2 dark:hover:border dark:hover:border-green-400 transition-all ease-linear flex items-center flex-col gap-2 hover:shadow-md rounded-md p-3 h-[11rem]">
            <div className="p-2 rounded-md bg-green-100 dark:bg-green-400">
              <ImportIcon />
            </div>
            Import Questions
            <Description
              className="text-center"
              text="Import your questions from google form and we will create a form for you right away."
            />
          </ShadowCard>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
