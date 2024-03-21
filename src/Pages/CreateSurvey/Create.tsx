// import React from 'react'

import { MoonIcon, PlusIcon, SunIcon } from "lucide-react";
import { ManageAccount } from "../../components/App/ManageAccount";
import { Button } from "../../components/Button";
import { useZStore } from "../../provider";
import { Navbar } from "./Navbar";
import { toggle_modes } from "../../Functions";
import { useLocalStorage, useWindowSize } from "@uidotdev/usehooks";
import { CreateSurveyBtn } from "./CreateSurveyBtn";
import { Description } from "../ExplorePage/QuickQuiz";
import { SurveyListingType } from "./SurveyListingType";
import { SurveyDetails } from "./SurveyDetails";
import queryString from "query-string";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Create = () => {
  const { is_darkmode, setIsDarkMode } = useZStore();
  const { width } = useWindowSize();
  const navigate = useNavigate();
  const location = useLocation();
  const qs = queryString.parse(location.search) as { list: "list" | "grid" };
  const [theme, saveTheme] = useLocalStorage<"dark" | "light" | null>(
    "theme",
    "dark"
  );

  useEffect(() => {
    if (Number(width) > 767) return;

    navigate("?list=grid");
  }, [width]);

  return (
    <div className="bg-gray-50 overflow-auto dark:bg-slate-900 h-screen">
      <Navbar
        title="Survey"
        middleContent={<></>}
        lastContent={
          <div className="flex items-center gap-2">
            <Button
              className="rounded-full"
              onClick={() => toggle_modes({ theme, saveTheme, setIsDarkMode })}
              size="icon"
              variant="secondary"
            >
              {is_darkmode ? <SunIcon size={18} /> : <MoonIcon size={18} />}
            </Button>
            <ManageAccount />
          </div>
        }
      />
      <div className="md:max-w-6xl m-auto pt-20">
        <header className="flex flex-col gap-3 w-full">
          <div className="flex items-center p-1 justify-between w-full">
            <Description className="text-lg" text="No Active Survey" />
            <div className="flex items-center gap-2">
              {width && width > 767 && <SurveyListingType />}
              <CreateSurveyBtn>
                <Button
                  size="sm"
                  className="flex items-center gap-2"
                  variant="base"
                >
                  <PlusIcon size={15} /> Create
                </Button>
              </CreateSurveyBtn>
            </div>
          </div>
          <hr />
        </header>
        <section className="p-2">
          <SurveyDetails
            listtype={typeof qs.list === "undefined" ? "grid" : qs.list}
          />
        </section>
      </div>
    </div>
  );
};

export default Create;
