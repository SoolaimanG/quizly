import { Link } from "react-router-dom";
import { useText } from "../../Hooks/text";
import { app_config } from "../../Types/components.types";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/Avatar";
import Hint from "../../components/Hint";
import { Button } from "../../components/Button";
import { MessageCircle, SparkleIcon, ZapIcon } from "lucide-react";
import { Badge } from "../../components/Badge";
import Rating from "../../components/App/Rating";
import { Tabs } from "../../components/App/Tabs";
import { Comments } from "../../components/App/Comments";
import { StartQuizButton } from "../../components/App/StartQuizButton";
import { useState } from "react";
import { IQuiz, userQuizStatus } from "../../Types/quiz.types";
import Waiting from "../../assets/WaitingAnimation.json";
import Lottie from "lottie-react";
import { AllowQuizTools } from "../Quiz/AllowQuizTools";
import { Description } from "../../components/App/Description";
import Glassmorphism from "../../components/App/Glassmorphism";
import { format } from "date-fns";

export const QuizStartView = ({ data }: { data: IQuiz | undefined }) => {
  const { truncateWord, getFirstLetterAndCapitalize } = useText();
  const [textToShow, setTextToShow] = useState(150);

  const startQuizButtonText: Record<userQuizStatus, any> = {
    "start-quiz": "Start Quiz",
    "continue-quiz": "Continue Quiz",
    "is-completed": "You Have Completed This Quiz",
  };

  if (!data)
    return (
      <div className="flex flex-col h-full w-full justify-center items-center gap-2">
        <Lottie className="w-[10rem] h-[10rem]" animationData={Waiting} loop />
        <h1 className="josefin-sans-font text-center">
          Please take a brief pause. We will be ready for you again shortly.
        </h1>
      </div>
    );

  // This is the fist tab of the start quiz - VIEW
  const accountDetails = (
    <div className="flex flex-col h-full gap-2 relative">
      <h3 className="text-lg josefin-sans-font">About Quiz</h3>
      <Description text={truncateWord(data?.descriptions || "", textToShow)} />
      {data?.descriptions?.length >= textToShow && (
        <Button
          className="p-0 w-fit h-fit"
          onClick={() =>
            setTextToShow((prev) =>
              prev >= data.descriptions.length
                ? 150
                : data?.descriptions?.length
            )
          }
          variant={"link"}
        >
          {data.descriptions.length > textToShow ? "Show More" : "Show Less"}
        </Button>
      )}
      <h1 className="josefin-sans-font underline">Allows Tools</h1>
      <AllowQuizTools
        {...{
          allow_calculator: data.allow_calculator,
          allow_retake: data.allow_retake,
          allow_robot_read: data.allow_robot_read,
          allow_word_search: data.allow_word_search,
        }}
      />

      {/* Indicate that this quiz qas create by a tutor */}
      {data.host && (
        <div className="flex mt-4 flex-col gap-2">
          <h3 className="">Tutor</h3>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center  gap-1">
              <Avatar className="w-[3rem] h-[3rem] rounded-full flex items-center justify-center">
                <AvatarImage src={data?.host?.profile_image as string} />
                <AvatarFallback>
                  {getFirstLetterAndCapitalize(data?.host?.username + "")}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <Link
                  to={app_config.user + data?.host?.username}
                  className="text-lg underline"
                >
                  {data?.host?.username}
                </Link>
                <Description text={truncateWord(data?.host?.bio, 40)} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* {data?.host?.phone_num && (
              <a href={`tel:${data?.host?.phone_num + ''}`}>
                <Hint
                  element={
                    <Button size={"icon"}>
                      <PhoneCall size={15} />
                    </Button>
                  }
                  content={`Call ${data?.host?.username}`}
                />
              </a>
            )} */}
              <Hint
                element={
                  <Button size={"icon"}>
                    <MessageCircle size={15} />
                  </Button>
                }
                content={`Chat ${data?.host?.username}`}
              />
            </div>
          </div>
        </div>
      )}

      {/* Indicate that this quiz was created by Quizly AI */}
      {data.is_ai_generated && (
        <div className="flex items-center gap-1 mt-3">
          <Glassmorphism className="h-[2.5rem] w-[2.5rem] rounded-full flex items-center justify-center">
            <SparkleIcon className="text-green-500" />
          </Glassmorphism>
          <div className="flex flex-col">
            <h1 className="josefin-sans-font">
              Created by {app_config.AppName} AI.
            </h1>
            <Description text={format(new Date(data.created_at), "PPP")} />
          </div>
        </div>
      )}
      <StartQuizButton
        button_text={startQuizButtonText[data.user_status || "start-quiz"]}
        className="absolute md:bottom-14 bottom-20"
        quiz={data!}
      />
    </div>
  );

  return (
    <div className="w-full h-full relative">
      <div className=" flex flex-col h-full gap-1">
        <div className="w-full flex md:flex-row flex-col-reverse gap-1 flex-wrap md:items-center md:justify-between">
          <div className="flex gap-2 items-center">
            <Badge className="rounded-sm" variant={"friendly"}>
              {data?.category}
            </Badge>
            <Badge variant="success" className="rounded-sm">
              {Boolean(data?.time_limit)
                ? data?.time_limit + " Mins"
                : "Unlimited Time"}
            </Badge>
            <Badge
              variant="success"
              className="rounded-sm flex items-start gap-1"
            >
              <ZapIcon size={16} /> <p>{data.expected_xp}</p>
            </Badge>
          </div>
          <Rating
            rating_length={5}
            onRatingSelect={() => {}}
            rating={data?.rating}
          />
        </div>
        <h1 className="josefin-sans-font">{data?.title}</h1>
        <Description text={truncateWord(data?.instructions, 150)} />
        <Tabs
          className="h-full"
          header={["Details", `comments (${data?.comments_count})`]}
          elements={[accountDetails, <Comments quiz_id={data?.id} />]}
        />
      </div>
    </div>
  );
};
