import { FC } from "react";
import { ISurvey } from "../../Types/survey.types";
import { Description } from "../ExplorePage/QuickQuiz";
import { Button } from "../../components/Button";
import { MoreButtonSurvey } from "./MoreButtonSurvey";

export const SurveyList: FC<ISurvey> = ({
  id,
  name,
  created_at,
  response_count,
  updated_at,
}) => {
  console.log({ created_at });
  return (
    <div className="p-3 rounded-md flex items-center justify-between gap-2 dark:bg-slate-950 bg-white">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 border rounded-md" />
        <div>
          <h2>{name}</h2>
          <Description text={("Created: " + created_at) as string} />
        </div>
      </div>
      <div className="flex items-center gap-14 mr-16">
        <Button className="hidden" variant="secondary" size="sm">
          Edit
        </Button>
        <Description text="1" />
        <Description text={response_count + ""} />
        <Description text={response_count + ""} />
        <h3>{updated_at as string}</h3>
      </div>
      <MoreButtonSurvey
        id={id}
        status="DEVELOPMENT"
        name={name!}
        participants={response_count}
      />
    </div>
  );
};
