import { NavBar } from "./NavBar";
import { Button } from "../../components/Button";
import { CommunityCard } from "../Community/CommunityCard";
import { QuickQuiz } from "./QuickQuiz";
import { Link } from "react-router-dom";
import { app_config } from "../../Types/components.types";
import { FilterByCategory } from "../../components/App/FilterByCategory";
import React, { useState } from "react";
import { useAuthentication } from "../../Hooks";
import { Card, CardContent } from "../../components/Card";
import Footer from "../Comps/Footer";
import { useDocumentTitle } from "@uidotdev/usehooks";
import { Banner } from "./Banner";
import { RecommendedQuiz } from "./RecommendedQuiz";

const Explore = () => {
  const { isAuthenticated } = useAuthentication();

  useDocumentTitle(app_config.AppName + " | Explore");

  const [showSearch] = useState(false);

  const handleSearch = (q: string) => {
    console.log(q);
  };

  const Header = isAuthenticated ? "Recommended Quizzes" : "Trending Quizzes";

  return (
    <React.Fragment>
      <NavBar
        onSubmit={handleSearch}
        navbarText="Explore"
        show_search_bar={showSearch}
      />
      <div className="w-full md:max-w-6xl p-2 m-auto flex flex-col overflow-hidden gap-3 h-full">
        {/* HERO SECTION OF EXPLORE PAGE */}
        <Banner />
        {/* This is a component that user can use to filter through the subject/category */}
        <FilterByCategory />

        {/* HEADER FOR RECOMMENDED QUIZ */}
        <div className="w-full p-3 md:p-0 flex flex-col gap-3">
          <div className="w-full flex items-center justify-between">
            <h1 className="underline">{Header}</h1>
            <Button variant={"link"} asChild>
              <Link to={app_config.more_quizzes}>View All</Link>
            </Button>
          </div>
          <div className="w-full flex gap-3 overflow-auto">
            <RecommendedQuiz />
          </div>
        </div>

        {/* APPs -{To take fast quiz and to join or create a community} */}
        <div className="flex md:flex-row flex-col gap-3 w-full p-1 md:p-0">
          <Card className="md:h-[35rem] h-[40rem] transition-all delay-75 ease-linear pb-6 flex flex-col gap-3 relative rounded-md md:w-[60%] w-full">
            <CardContent className="h-full md:p-3 p-2 ">
              <QuickQuiz />
            </CardContent>
          </Card>
          <Card className="w-full rounded-md md:h-[35rem] h-[38rem] md:w-[40%]">
            <CardContent className="p-1 h-full">
              <CommunityCard />
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
};

export default Explore;
