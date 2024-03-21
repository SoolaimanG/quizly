import NavBar from "./NavBar";
import Background from "../../assets/exploreBackground.svg";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import Illustration from "../../assets/explore_page_svg.svg";
import { useZStore } from "../../provider";
import { capitalize_first_letter } from "../../Functions";
import { Globe } from "lucide-react";
import { CommunityCard } from "../Community/CommunityCard";
import { QuickQuiz } from "./QuickQuiz";
import { Link } from "react-router-dom";
import { ICategory, IQuiz, app_config } from "../../Types/components.types";
import { FilterByCategory } from "../../components/App/FilterByCategory";
import React, { useEffect, useRef, useState } from "react";
import { QuizListUI } from "./QuizListUI";
import { useQuery } from "@tanstack/react-query";
import { fetchCategory, getQuizzesForUser } from "../../Functions/APIqueries";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthentication } from "../../Hooks";
import { Card, CardContent } from "../../components/Card";
import Footer from "../Comps/Footer";
import { AxiosError } from "axios";
import { Img } from "react-image";

const content = Object.freeze({
  subHeader: "Prepared to tackle exciting challenges?",
});
const exploreBG: React.CSSProperties = {
  backgroundImage: `url(${Background})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
};
const num_of_quizly_users = (num: number) => {
  return <span className="text-gray-400 dark:text-gray-300">{num}K</span>;
};

const Explore = () => {
  const { user } = useZStore();
  const { isAuthenticated } = useAuthentication();

  const { isLoading, data, error } = useQuery<{ data: ICategory[] }>({
    queryKey: ["subject_category", isAuthenticated],
    queryFn: fetchCategory,
  });
  const quizList = useQuery<{ data: IQuiz[] }>({
    queryKey: ["quiz_lists"],
    queryFn: () => getQuizzesForUser(10),
  });

  const [quizzes, setQuizzes] = useState<IQuiz[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const ref = useRef<HTMLInputElement | null>(null);

  const handleSearch = (q: string) => {
    console.log(q);
  };

  console.log(quizList.data);

  useEffect(() => {
    quizList.data && setQuizzes(quizList.data?.data);
  }, [quizList.data]);

  useEffect(() => {
    const handleScroll = () => {
      const windowClient = ref.current?.getBoundingClientRect();
      window.scrollY > (windowClient?.y as number)
        ? setShowSearch(true)
        : setShowSearch(false);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const Header = isAuthenticated ? "Recommended Quizzes" : "Trending Quizzes";

  return (
    <React.Fragment>
      <NavBar
        onSubmit={handleSearch}
        navbarText="Explore"
        isAuthenticated={isAuthenticated}
        show_search_bar={showSearch}
      />
      <div className="w-full md:max-w-6xl p-2 m-auto flex flex-col overflow-hidden gap-3 h-full">
        <div
          style={exploreBG}
          className="w-full flex md:flex-row flex-col items-center gap-2 justify-center px-5 py-7 md:py-0 mt-16"
        >
          <div className="md:w-1/2 flex flex-col md:gap-3 gap-5">
            <h1 className="text-2xl text-green-200">
              Welcome{" "}
              {user?.username &&
                capitalize_first_letter(user?.username as string)}{" "}
              ! 👋
            </h1>
            <p className="md:text-7xl text-5xl text-gray-100">
              {content.subHeader}
            </p>
            <form className="flex items-center">
              <Input
                ref={ref}
                placeholder="Find Quiz, Teachers and Surverys"
                className="h-[3rem] rounded-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0 "
              />
              <Button
                variant={"base"}
                size={"lg"}
                className="h-[3rem] rounded-none bg-green-700 hover:bg-green-800"
              >
                Search
              </Button>
            </form>
            <div className="flex items-center gap-1">
              <Button size={"icon"} className="rounded-full bg-green-400">
                <Globe className="text-white" />{" "}
              </Button>
              <h1 className="text-white">
                {" "}
                {num_of_quizly_users(1)} Mentors and {num_of_quizly_users(10)}{" "}
                learners
              </h1>
            </div>
          </div>
          <div className="md:w-1/2">
            <Img src={Illustration} alt="illustrtion" />
          </div>
        </div>
        {/* This is a component that user can use to filter through the subject/category */}
        <FilterByCategory
          isLoading={isLoading}
          error={error as AxiosError<{ message: string }>}
          list={quizList.data?.data || []}
          category={data?.data}
          setData={setQuizzes}
        />
        {/* Rest Component like Quick Quiz,Word Of The Day and sum */}
        <div className="w-full p-3 md:p-0 flex flex-col gap-3">
          <div className="w-full flex items-center justify-between">
            <h1 className="text-xl underline">{Header}</h1>
            <Button variant={"link"} asChild>
              <Link to={app_config.quizzes}>View All</Link>
            </Button>
          </div>
          <div className="overflow-auto w-full">
            <AnimatePresence>
              <motion.div
                layout
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  opacity: { ease: "linear" },
                  layout: { duration: 0.3 },
                }}
                className="w-fit flex gap-5"
              >
                {quizzes?.map((quiz) => (
                  <QuizListUI
                    isLoading={quizList.isLoading}
                    data={quiz}
                    type="large"
                    key={quiz.id}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <div className="flex md:flex-row flex-col gap-3 w-full p-3 md:p-0">
          <Card className="md:h-[35rem] h-[38rem] transition-all delay-75 ease-linear pt-0 pb-6 flex flex-col gap-3 relative rounded-md md:w-[60%] w-full">
            <CardContent className="h-full">
              <QuickQuiz />
            </CardContent>
          </Card>
          <Card className="w-full md:h-[35rem] h-[38rem] md:w-[40%]">
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
