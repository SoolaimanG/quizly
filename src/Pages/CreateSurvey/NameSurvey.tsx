// import React from 'react'

import { FC, ReactElement, useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/DialogModal";
import { Label } from "../../components/Label";
import { Input } from "../../components/Input";
import { Combobox } from "../../components/ComboBox";
import { useSurveyWorkSpace } from "../../provider";
import { combo_box_type } from "../../Types/components.types";
import { ISurvey, formType } from "../../Types/survey.types";
import { Button } from "../../components/Button";
import { SurveyWorkSpace } from "../../Functions/surveyApis";
import queryString from "query-string";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "../../components/use-toaster";
import { errorMessageForToast } from "../../Functions";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";

const _data: combo_box_type<formType>[] = [
  {
    value: "contact",
    label: "Contact",
  },
  {
    value: "feedback",
    label: "Feedback",
  },
  {
    value: "poll",
    label: "Poll",
  },
  {
    value: "registration",
    label: "Registration",
  },
  {
    value: "request",
    label: "Request",
  },
];

export const NameSurvey: FC<{
  open: boolean;
  children: ReactElement;
  setOpen: () => void;
}> = ({ open, children, setOpen }) => {
  const { survey: s, setSurvey } = useSurveyWorkSpace();
  const location = useLocation();
  const navigate = useNavigate();
  const [survey_type, setSurveyType] = useState<formType>("feedback");
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const survey = new SurveyWorkSpace();

  const qs = queryString.parse(location.search) as { id: string };

  const handleClick = async () => {
    const { id } = qs;
    try {
      await survey.generate_survey_form({
        name: s?.name ?? "New Survey WorkSpace",
        id,
        survey_type,
      });
      const params = `?id=${qs.id}&opend=false`;
      navigate(params);
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-green-500">
            Bring your Quizly form to life
          </DialogTitle>
        </DialogHeader>
        <form className="flex flex-col gap-3" action="">
          <Label className="flex flex-col gap-2" htmlFor="name">
            Give it a name
            <Input
              value={s?.name}
              onChange={(e) => {
                setSurvey({ ...(s as ISurvey), name: e.target.value });
              }}
              id="name"
            />
          </Label>
          <Label className="flex flex-col gap-2">
            What are you creating?
            <Combobox
              popoverClassName="md:w-[25rem] w-[18rem]"
              search={search}
              setSearch={setSearch}
              data={_data}
              value={survey_type}
              // @ts-ignore
              setValue={setSurveyType}
              title="Select Type"
            />
          </Label>
        </form>
        <DialogFooter>
          <Button
            onClick={() =>
              startTransition(() => {
                handleClick();
              })
            }
            variant="base"
          >
            {isPending && <Loader2 size={15} className=" animate-spin" />}{" "}
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
