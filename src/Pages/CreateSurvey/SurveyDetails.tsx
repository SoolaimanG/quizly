// import React from 'react'

import { FC } from "react";
import EmptyState from "../../components/App/EmptyState";
import { Description } from "../ExplorePage/QuickQuiz";
import { CreateSurveyBtn } from "./CreateSurveyBtn";
import { Button } from "../../components/Button";
import { useInfiniteQuery } from "@tanstack/react-query";
import { SurveyWorkSpace } from "../../Functions/surveyApis";
import { Skeleton } from "../../components/Loaders/Skeleton";
import Error from "../Comps/Error";
import { errorMessageForToast } from "../../Functions";
import { AxiosError } from "axios";
import { ISurvey } from "../../Types/survey.types";
import { cn } from "../../lib/utils";
import { SurveyGrid } from "./SurveyGrid";
import { SurveyList } from "./SurveyList";
import Logo from "../../components/Logo";
export const SurveyDetails: FC<{ listtype: "list" | "grid" }> = ({
  listtype,
}) => {
  const survey = new SurveyWorkSpace("");
  const { isLoading, data, error, refetch } = useInfiniteQuery<{
    data: ISurvey[];
  }>({
    queryKey: ["surveys"],
    queryFn: ({ pageParam = 5 }) => survey.getSurveys(pageParam as number),
    initialPageParam: 5,
    getNextPageParam: (lastPage, _, lastPageParams) => {
      if (0 === 0) return undefined;

      return (lastPageParams as number) + 1;
    },
  });

  if (isLoading)
    return (
      <div
        className={cn(
          "w-full gap-5",
          listtype === "grid" && "grid md:grid-cols-3 grid-cols-1",
          listtype === "list" && "flex flex-col"
        )}
      >
        {[...Array(6)].map((_, i) => (
          <Skeleton
            key={i}
            className={cn(
              "w-full dark:bg-primary-foreground bg-white",
              listtype === "grid" ? "h-[10rem]" : "h-[6rem]"
            )}
          />
        ))}
      </div>
    );

  if (error)
    return (
      <Error
        retry_function={refetch}
        errorMessage={errorMessageForToast(
          error as AxiosError<{ message: string }>
        )}
      />
    );

  if (!data?.pages[0].data.length)
    return (
      <div className="mt-5">
        <EmptyState
          imageClassName="md:w-[20rem] w-[17rem] h-auto"
          state="add_a_note"
          message=""
        />
        <Description className="w-full flex items-center justify-center">
          <p className="flex items-center text-center flex-wrap justify-center gap-1">
            Create a survey. Seek all the answers you are looking for by start
            adding good questions. Start by Clicking{" "}
            <CreateSurveyBtn>
              <Button variant="link" className="text-green-500 p-0">
                here.
              </Button>
            </CreateSurveyBtn>
          </p>
        </Description>
      </div>
    );

  return (
    <div
      className={cn(
        "w-full gap-5",
        listtype === "grid" && "grid md:grid-cols-3 grid-cols-1",
        listtype === "list" && "flex flex-col"
      )}
    >
      {listtype === "list" && (
        <div className="p-3 rounded-md flex items-center justify-between gap-2 dark:bg-slate-950 bg-white">
          <Logo size="sm" style="italic" color />
          <div className="flex items-center gap-4">
            <Description text="Questions" />
            <Description text="Total Response" />
            <Description text="Updated At" />
          </div>
          <Description text="More" />
        </div>
      )}
      {data.pages.map((pg) =>
        pg.data.map((survey) =>
          listtype === "list" ? (
            <SurveyList key={survey.id} {...survey} />
          ) : (
            <SurveyGrid key={survey.id} {...survey} />
          )
        )
      )}
    </div>
  );
};
