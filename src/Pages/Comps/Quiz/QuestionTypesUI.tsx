import { Check, Loader2Icon } from "lucide-react";
import { Button } from "../../../components/Button";
import { Textarea } from "../../../components/TextArea";
import React, { useEffect, useState, useTransition } from "react";
import { Checkbox } from "../../../components/CheckBox";
import { Label } from "../../../components/Label";
import { capitalize_first_letter } from "../../../Functions";
import { useText } from "../../../Hooks/text";
import { IQuiz, userResponseProps, IQuestion } from "../../../Types/quiz.types";
import { cn } from "../../../lib/utils";

export const OpenEndedUI: React.FC<{
  disableAnswer: boolean;
  state: userResponseProps;
  markQuestion: (user_answer: string[]) => void;
}> = ({ disableAnswer, state, markQuestion }) => {
  const [openEnded, setOpenEnded] = useState("");
  const [isPending, startTransition] = useTransition();

  const submitResponse = () => {
    markQuestion([openEnded]);
  };

  useEffect(() => {
    setOpenEnded(state.open_ended_response || "");
  }, [state.open_ended_response]);

  const textAreaClassName =
    state.show_answer && state.is_correct
      ? "border-green-500 bg-green-100 text-green-500"
      : "border-red-500 bg-red-100 text-red-500";

  return (
    <div className="w-full flex p-2 flex-col gap-2">
      <Textarea
        value={openEnded}
        onChange={(e) => setOpenEnded(e.target.value)}
        className={cn("resize-none border-2", textAreaClassName)}
        rows={4}
        placeholder="Type in your answer"
      />
      <Button
        disabled={disableAnswer || isPending}
        onClick={() =>
          startTransition(() => {
            submitResponse();
          })
        }
        size={"icon"}
        className="w-full h-[3rem] flex gap-1 items-center"
        variant={"base"}
      >
        {isPending ? (
          <Loader2Icon className="animate-spin" size={17} />
        ) : (
          <Check size={17} />
        )}{" "}
        <h1 className="josefin-sans-font">Submit</h1>
      </Button>
    </div>
  );
};

export const MultipleChoiceUI: React.FC<{
  data: IQuestion;
  disableAnswer: boolean;
  state: userResponseProps;
  markQuestion: (user_string: string[]) => void;
}> = ({ data, disableAnswer, state, markQuestion }) => {
  const [userResponse, setUserResponse] = useState<string[]>([]);

  const onCheckChange = (user_answer: string) => {
    if (userResponse.includes(user_answer)) {
      setUserResponse((prev) => prev.filter((a) => a !== user_answer));
      return;
    }
    const user_answers = [...userResponse, user_answer];
    setUserResponse((prev) => [...prev, user_answer]);
    if (user_answers.length === data.multiple_answer_length) {
      markQuestion(user_answers);
      return;
    }
  };

  useEffect(() => {
    setUserResponse(state.user_answer?.length ? state.user_answer : []);
  }, [state]);

  return (
    <div className="w-full flex flex-col gap-2">
      {data?.options?.map((option, i) => (
        <Label key={i} className="flex items-center gap-3 text-lg">
          <Checkbox
            disabled={disableAnswer}
            checked={userResponse.includes(option.body)}
            value={option.body}
            onCheckedChange={() => onCheckChange(option.body)}
            className={cn(
              `${
                state.show_answer
                  ? state.is_correct
                    ? "data-[state=checked]:bg-green-500 border-green-500"
                    : "data-[state=checked]:bg-red-500 border-red-500"
                  : "data-[state=checked]:bg-green-500 border-green-500"
              }`,
              "data-[state=checked]:text-white"
            )}
          />
          {option.body}
        </Label>
      ))}
    </div>
  );
};

export const BooleanUI: React.FC<{
  quiz: IQuiz;
  state: userResponseProps;
  disableAnswer: boolean;
  markQuestion: (user_answer: boolean[]) => void;
}> = ({ quiz, state, disableAnswer, markQuestion }) => {
  const booleanOptions = [
    {
      context: "True",
      value: true,
    },
    {
      context: "False",
      value: false,
    },
  ];
  const [selected, setSelected] = useState<number | null>(null);

  const userResponse = (userResponse: boolean, i: number) => {
    markQuestion([userResponse]);
    setSelected(i);
  };

  const buttonVariant = (b: string, i: number) => {
    if (quiz?.result_display_type === "on_complete") {
      return state.correct_answer + "" === b.toLowerCase()
        ? "base"
        : "destructive";
    } else {
      return selected === i ? "base" : "outline";
    }
  };

  return (
    <div className="w-full flex flex-col gap-5">
      {booleanOptions.map((b, i) => (
        <Button
          disabled={disableAnswer}
          key={i}
          onClick={() => userResponse(b.value, i)}
          variant={buttonVariant(b.context, i)}
          className="w-full h-[3rem]"
        >
          {capitalize_first_letter(b.context)}
        </Button>
      ))}
    </div>
  );
};

export const ObjectiveUI: React.FC<{
  data: IQuestion;
  quiz: IQuiz;
  state: userResponseProps;
  disableAnswer: boolean;
  markQuestion: (user_answer: string[]) => void;
}> = ({ data, quiz, state, disableAnswer, markQuestion }) => {
  const [buttonClicked, setButtonClicked] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const { getLetter } = useText();
  //
  const getButtonClass = (i: number) => {
    if (buttonClicked || state.show_answer) {
      if (
        quiz?.result_display_type === "on_complete" &&
        state.correct_answer[0] === data?.options?.[i].body
      ) {
        return "base";
      } else {
        return "destructive";
      }
    } else {
      return selected === i ? "base" : "outline";
    }
  };
  const userResponse = (i: number, userResponse: string) => {
    setButtonClicked(true);
    markQuestion([userResponse]);
    setSelected(i);
  };

  return (
    <div className="w-full flex flex-col gap-3">
      {data?.options?.map((option, i) => (
        <Button
          disabled={disableAnswer}
          onClick={() => userResponse(i, option.body)}
          variant={getButtonClass(i)}
          className={cn("w-full items-center p-1 justify-start gap-3 h-[3rem]")}
          key={i}
        >
          <Button variant={"base"} size={"icon"}>
            {getLetter(i)}
          </Button>
          {option.body}
        </Button>
      ))}
    </div>
  );
};
