import { Link } from "react-router-dom";
import { useText } from "../../Hooks/text";
import { IQuiz, app_config } from "../../Types/components.types";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/Avatar";
import { Description } from "./QuickQuiz";
import Hint from "../../components/Hint";
import { Button } from "../../components/Button";
import { PhoneCall } from "lucide-react";
import { MessageCircle } from "lucide-react";
import { Badge } from "../../components/Badge";
import Rating from "../../components/App/Rating";
import { Tabs } from "../../components/App/Tabs";
import { Comments } from "../../components/App/Comments";
import { StartQuizButton } from "../../components/App/StartQuizButton";
import { useAuthentication } from "../../Hooks";
import { useState } from "react";

export const QuizStartView = ({ data }: { data: IQuiz }) => {
  const { truncateWord, getFirstLetterAndCapitalize } = useText();
  const [textToShow, setTextToShow] = useState(150);
  const { isAuthenticated } = useAuthentication();

  const accountDetails = (
    <div className="flex flex-col md:h-[15rem] h-[18rem] gap-5">
      <h3 className="text-lg">About Quiz</h3>
      <Description text={truncateWord(data.descriptions, textToShow)} />
      {data.descriptions.length > textToShow && (
        <Button
          className="p-0 w-fit h-fit"
          onClick={() =>
            setTextToShow((prev) =>
              prev === data.descriptions.length
                ? 150
                : data?.descriptions?.length
            )
          }
          variant={"link"}
        >
          {textToShow === data.descriptions.length ? "Show Less" : "Show More"}
        </Button>
      )}
      <div className="flex mt-4 flex-col gap-2">
        <h3 className="">Tutor</h3>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center  gap-1">
            <Avatar className="w-[3rem] h-[3rem] rounded-full flex items-center justify-center">
              <AvatarImage src={data?.host?.profile_image as string} />
              <AvatarFallback>
                {getFirstLetterAndCapitalize(data?.host?.username)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <Link
                to={app_config.user + data?.host?.username}
                className="text-lg underline"
              >
                {data?.host.username}
              </Link>
              <Description text={truncateWord(data?.host?.bio, 40)} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            {data?.host.phone_num && (
              <a href={`tel:${data?.host?.phone_num}`}>
                <Hint
                  element={
                    <Button size={"icon"}>
                      <PhoneCall size={15} />
                    </Button>
                  }
                  content={`Call ${data?.host?.username}`}
                />
              </a>
            )}
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
    </div>
  );

  return (
    <div className="w-full h-full relative pb-8">
      <div className="mt-3 flex flex-col gap-2">
        <div className="w-full flex items-center justify-between">
          <div className="flex gap-2 items-center">
            <Badge variant={"friendly"}>{data?.category}</Badge>
            {data.time_limit && (
              <Description text={`Time limit ${data.time_limit}Mins`} />
            )}
          </div>
          <div>
            <Rating rating={data?.rating} />
          </div>
        </div>
        <h1>{data?.title}</h1>
        <Description text={truncateWord(data?.instructions, 150)} />

        <Tabs
          header={["account", `comments (${data?.comments_count})`]}
          elements={[accountDetails, <Comments quiz_id={data?.id} />]}
        />
      </div>
      <div className="w-full flex items-center justify-center gap-2 absolute bottom-4">
        <StartQuizButton
          id={data?.id}
          isAuthenticated={isAuthenticated}
          button_text={
            !data?.has_user_started_quiz ? "Start Quiz" : "Continue Quiz"
          }
        />
      </div>
    </div>
  );
};
