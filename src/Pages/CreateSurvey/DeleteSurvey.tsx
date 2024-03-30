import { FC, ReactElement, useState, useTransition } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/AlertModal";
import { Input } from "../../components/Input";
import { SurveyWorkSpace } from "../../Functions/surveyApis";
import { Loader2 } from "lucide-react";
import { toast } from "../../components/use-toaster";
import { errorMessageForToast } from "../../Functions";
import { AxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "../../lib/utils";

export const DeleteSurvey: FC<{
  children: ReactElement;
  id: string;
  participants: number;
  name: string;
  className?: string;
  onDelete?: () => void;
}> = ({
  participants,
  children,
  id,
  name: survey_name,
  className,
  onDelete,
}) => {
  const survey = new SurveyWorkSpace(id);
  const [isDeleting, startDelete] = useTransition();
  const [name, setName] = useState("");
  const query = useQueryClient();

  const handleDelete = async () => {
    if (!name || survey_name.toLowerCase() !== name.toLowerCase())
      return toast({
        title: "Error",
        description:
          "Something went wrong!! Enter the name of this survey to delete",
        variant: "destructive",
      });

    try {
      await survey.deleteSurvey(id, name);
      query.invalidateQueries({ queryKey: ["surveys"] });
      toast({
        title: "Success",
        description: name + " Deleted successfully",
      });
      onDelete && onDelete();
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
    <AlertDialog>
      <AlertDialogTrigger className={cn("w-full", className)}>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-500">
            Delete Survey?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Deleting this survey is permanent and its valuable data, including
            responses from {participants} participants, will be irretrievably
            lost. Consider exporting the data before proceeding.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <p>
          Type <b>{survey_name}</b>{" "}
        </p>
        <form
          onSubmit={() =>
            startDelete(() => {
              handleDelete();
            })
          }
          className="w-full"
          action=""
        >
          <Input
            onChange={(e) => setName(e.target.value)}
            value={name}
            placeholder={
              "Type '" + survey_name + "' and click the delete button"
            }
            className="w-full"
          />
        </form>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-400 text-white hover:bg-red-500"
          >
            {isDeleting && <Loader2 className="animate-spin" size={20} />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
