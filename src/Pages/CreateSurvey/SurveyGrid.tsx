import { FC } from "react";
import { ISurvey } from "../../Types/survey.types";
import { Description } from "../ExplorePage/QuickQuiz";
import { MoreButtonSurvey } from "./MoreButtonSurvey";
import { Link } from "react-router-dom";
import { app_config } from "../../Types/components.types";

export const SurveyGrid: FC<ISurvey> = ({
  id,
  name,
  response_count,
  status,
}) => {
  return (
    <div className="dark:bg-slate-950 h-full relative bg-white rounded-md">
      <span
        className={`absolute top-2 right-2 ${
          status === "DEVELOPMENT" ? "text-yellow-400" : "text-green-400"
        }`}
      >
        {status}
      </span>
      <Link
        to={app_config.survey_workspace + "?id=" + id}
        className="h-[8rem] flex items-center justify-center"
      >
        <h1>{name}</h1>
      </Link>
      <hr />
      <div className="p-2 flex items-center justify-between">
        <Description
          className="text-lg"
          text={
            Boolean(response_count)
              ? `${response_count} Responses`
              : "No Responses"
          }
        />
        <MoreButtonSurvey
          id={id}
          status={status}
          name={name!}
          participants={response_count}
        />
      </div>
    </div>
  );
};
