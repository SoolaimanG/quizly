import LightModeImage from "../../assets/herobanner_light.png";
import DarkModeImage from "../../assets/herobanner_dark.png";
import Idea from "../../assets/idea.png";
import Model from "../../assets/herobannerModel.png";
import SponsorOne from "../../assets/airbus_defence_and_space_logo.wine1.png";
import SponsorTwo from "../../assets/amstrad_logo.wine1.png";
import SponsorThree from "../../assets/aveva_logo.wine1.png";
import SponsorFour from "../../assets/biovia_logo.wine1.png";
import SponsorFive from "../../assets/sophos_logo.wine1.png";
import SponsorSix from "../../assets/spacex_logo.wine1.png";
import { useZStore } from "../../provider";
import { Button } from "../../components/Button";
import { Link } from "react-router-dom";
import {
  Calculator,
  MessageCircle,
  MessageSquare,
  UserCircle,
} from "lucide-react";
import Glassmorphism from "../../components/App/Glassmorphism";
import { useWindowSize } from "@uidotdev/usehooks";
import { Variants, motion } from "framer-motion";
import React from "react";
import Fade from "../../Animations/Fade";
import Slide from "../../Animations/Slide";
import Stagger from "../../Animations/Stagger";

const item: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
  },
};
const imgVarient: Variants = {
  hidden: { y: -100, opacity: 0 },
  visible: {
    y: 1,
    opacity: 1,
  },
};

const info = [
  {
    icon: (
      <Button size={"icon"}>
        <Calculator className="text-green-500" />
      </Button>
    ),
    note: "Built-In tools",
    style: "md:top-20 top-0 mt-20 md:m-0 left-5",
  },
  {
    icon: (
      <Button size={"icon"}>
        <MessageSquare className="text-green-500" />
      </Button>
    ),
    note: "Trained Teachers",
    style: "md:top-25 right-0",
  },
  {
    icon: (
      <Button size={"icon"}>
        <UserCircle className="text-green-500" />
      </Button>
    ),
    note: "250K+ Users",
    style: "md:bottom-20 bottom-0 mb-20 md:mb-0 left-0",
  },
];

const sponsors = [
  SponsorOne,
  SponsorTwo,
  SponsorThree,
  SponsorFour,
  SponsorFive,
  SponsorSix,
];

//This Component contents i.e header and ...
const contents = Object.freeze({
  header: "Unleash Your Knowledge, Embark on a Quiz Adventure",
  description:
    " Are you ready to challenge your intellect, dive into a world of trivia,and have a blast with mind-bending questions? Look no further! Welcometo the ultimate destination for quizzing enthusiasts",
});

const Hero = () => {
  const { is_darkmode } = useZStore();
  const { width } = useWindowSize();
  const heroStyle: React.CSSProperties = {
    backgroundImage: `url(${is_darkmode ? DarkModeImage : LightModeImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  const firstFlex = (
    <motion.div className="w-full md:w-1/2 h-full flex items-center justify-center flex-col gap-3">
      <div className="w-full flex items-center justify-center">
        <Slide side="top">
          <Fade delay={0.45}>
            <motion.img src={Idea} alt="ideaIcon" />
          </Fade>
        </Slide>
      </div>
      <Slide d={130} side="left">
        <Fade delay={0.45}>
          <h1
            className={`font-semibold ${
              Number(width) <= 280 ? "text-[35px]" : "text-[45px]"
            }`}
          >
            {contents.header}
          </h1>
        </Fade>
      </Slide>
      <Slide d={130} side="left">
        <Fade delay={0.45}>
          <p className="text-green-800 dark:text-gray-200">
            {contents.description}
          </p>
        </Fade>
      </Slide>
      <Stagger
        variant="scale"
        delay={0.75}
        className="w-full flex gap-2 items-start justify-start"
      >
        <motion.div variants={item}>
          <Link className="" to={"/quizly/home"}>
            <Button
              className="bg-green-500 hover:bg-green-600 dark:bg-primary dark:hover:bg-primary/90"
              size={"lg"}
            >
              Explore App
            </Button>
          </Link>
        </motion.div>
        <motion.a variants={item} href="#contact-us">
          <Button
            variant={"ghost"}
            size={"lg"}
            className="flex items-center gap-1"
          >
            {Number(width) <= 280 ? (
              <>Contact</>
            ) : (
              <>
                <MessageCircle /> I have a question
              </>
            )}
          </Button>
        </motion.a>
      </Stagger>
    </motion.div>
  );
  const secondFlex = (
    <div className="w-full h-full relative flex items-center justify-center md:w-1/2">
      <Fade className="h-full">
        <img
          draggable={false}
          className="h-full shadow-sm w-auto"
          src={Model}
          alt="model"
        />
      </Fade>
      <Stagger delay={0.65} variant="scale" className="w-full absolute">
        {info.map((info, i) => (
          <Glassmorphism
            varient={item}
            blur={9}
            className={
              info.style +
              " " +
              "flex items-center gap-2 rounded-md font-semibold absolute"
            }
            key={i}
          >
            {info.icon} {info.note}
          </Glassmorphism>
        ))}
      </Stagger>
    </div>
  );

  return (
    <React.Fragment>
      <div
        id="home"
        className="w-full md:h-screen h-fit pt-[6rem]"
        style={heroStyle}
      >
        <div className="flex h-full flex-col px-2 md:px-0 m-auto md:max-w-6xl md:flex-row gap-3">
          {firstFlex}
          {secondFlex}
        </div>
      </div>
      <motion.div
        animate="visible"
        initial="hidden"
        variants={{
          hidden: {
            y: 100,
            opacity: 0,
          },
          visible: {
            y: 0,
            opacity: 1,
            transition: {
              staggerChildren: 0.5,
              delay: 0.5,
            },
          },
        }}
        className="overflow-auto md:overflow-hidden flex items-center justify-between border-b m-auto dark:border-gray-200 border-slate-400 md:max-w-6xl"
      >
        {sponsors.map((sponsor, i) => (
          <motion.img
            variants={imgVarient}
            draggable={false}
            className=" h-[5rem]"
            src={sponsor}
            key={i}
            alt={"sponser" + i}
          />
        ))}
      </motion.div>
    </React.Fragment>
  );
};

export default Hero;
