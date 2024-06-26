// import React from 'react'

import { FC } from "react";
import { cn } from "../../lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useSurveyWorkSpace } from "../../provider";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/App/TabUi";
import { SettingsIcon } from "lucide-react";
import {
  Designs,
  Logics,
  SurveyQuestions,
  SurveySettings,
} from "./AllSurveySettings";
import EmptyState from "../../components/App/EmptyState";

export const WorkSpaceSettings: FC<{ className?: string; width?: string }> = ({
  className,
  width,
}) => {
  const {
    collapseSideBar: { sideBarTwo },
    survey_blocks,
  } = useSurveyWorkSpace();
  return (
    <AnimatePresence>
      {!sideBarTwo && (
        <motion.div
          initial={{ opacity: 0, width: "0%" }}
          animate={{ opacity: 1, width: width || "35%" }}
          exit={{ opacity: 0, width: "0%" }}
          className={cn(
            "dark:bg-slate-950 bg-white h-full p-2 overflow-auto w-full",
            className
          )}
        >
          <Tabs className="h-full pb-5" defaultValue="questions">
            <TabsList className="overflow-auto w-full px-1">
              <TabsTrigger value="questions">Questions</TabsTrigger>
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="logics">Logics</TabsTrigger>
              <TabsTrigger value="settings">
                <SettingsIcon className="hidden md:block" size={15} />
                <p className="md:hidden block">Settings</p>
              </TabsTrigger>
            </TabsList>
            {survey_blocks?.length ? (
              <div className="h-full">
                <TabsContent value="questions">
                  <SurveyQuestions />
                </TabsContent>
                <TabsContent value="design">
                  <Designs />
                </TabsContent>
                <TabsContent value="logics">
                  <Logics />
                </TabsContent>
                <TabsContent value="settings">
                  <SurveySettings />
                </TabsContent>
              </div>
            ) : (
              <EmptyState
                message="No Blocks Available"
                state="empty"
                className="mt-5"
              />
            )}
          </Tabs>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
