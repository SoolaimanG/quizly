import React, { useEffect, useRef, useState } from "react";
import { useZStore } from "../../provider";
import { capitalize_first_letter } from "../../Functions";
import Background from "../../assets/exploreBackground.svg";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import Illustration from "../../assets/explore_page_svg.svg";
import { Globe } from "lucide-react";
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

export const Banner = () => {
  const { user } = useZStore();
  const ref = useRef<HTMLInputElement | null>(null);
  const [_, setShowSearch] = useState(false);

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

  const num_of_quizly_users = (num: number) => {
    return <span className="text-gray-400 dark:text-gray-300">{num}K</span>;
  };

  return (
    <div
      style={exploreBG}
      className="w-full flex md:flex-row flex-col items-center gap-2 justify-center px-5 py-7 md:py-0 mt-16"
    >
      <div className="md:w-1/2 flex flex-col md:gap-3 gap-5">
        <h1 className="text-2xl text-green-200">
          Welcome{" "}
          {user?.username && capitalize_first_letter(user?.username as string)}{" "}
          ! 👋
        </h1>
        <p className="md:text-7xl text-5xl text-gray-100">
          {content.subHeader}
        </p>
        <form className="flex items-center">
          <Input
            ref={ref}
            placeholder="Find Quiz, Teachers and Surveys"
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
  );
};
