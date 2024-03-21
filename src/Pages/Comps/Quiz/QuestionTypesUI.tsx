import { Check } from "lucide-react";
import { Button } from "../../../components/Button";
import { Textarea } from "../../../components/TextArea";
import React, { useState } from "react";
import { IQuestion } from "../../../Types/components.types";
import { Checkbox } from "../../../components/CheckBox";
import { Label } from "../../../components/Label";
import { capitalize_first_letter } from "../../../Functions";
import { IQuiz, questionUIStateProps } from "../../../Types/components.types";
import { useText } from "../../../Hooks/text";

const ON_COMPLETE = "on_complete";

export const GermanUI: React.FC<{
  disableAnswer: boolean;
  markQuestion: (user_answer: string | string[]) => void;
}> = ({ disableAnswer, markQuestion }) => {
  const [germanAnswer, setGermanAswer] = useState("");
  return (
    <div className="w-full flex p-2 flex-col gap-2">
      <Textarea
        value={germanAnswer}
        onChange={(e) => setGermanAswer(e.target.value)}
        className="resize-none"
        rows={7}
        placeholder="Type in your answer"
      />
      <Button
        disabled={disableAnswer}
        onClick={() => markQuestion(germanAnswer)}
        size={"icon"}
        className="w-full h-[3rem]"
        variant={"base"}
      >
        <Check /> Submit
      </Button>
    </div>
  );
};

export const MultipleChoiceUI: React.FC<{
  data: IQuestion;
  disableAnswer: boolean;
  markQuestion: (user_string: string | string[]) => void;
}> = ({ data, disableAnswer, markQuestion }) => {
  const [multipleAnswers, setMultipleAnswers] = useState<string[]>([]);
  return (
    <div className="w-full flex flex-col gap-2">
      {data?.options?.map((option, i) => (
        <Label key={i} className="flex items-center gap-3 text-lg">
          <Checkbox
            disabled={disableAnswer}
            checked={multipleAnswers.includes(option.body)}
            value={option.body}
            onCheckedChange={() => {
              if (multipleAnswers.includes(option.body)) {
                setMultipleAnswers((prev) =>
                  prev.filter((a) => a !== option.body)
                );
                return;
              }
              const user_answers = [...multipleAnswers, option.body];
              setMultipleAnswers((prev) => [...prev, option.body]);
              if (user_answers.length === data.correct_answer_length) {
                markQuestion(user_answers);
                return;
              }
            }}
            className="data-[state=checked]:bg-green-500 data-[state=checked]:text-white border-green-500"
          />
          {option.body}
        </Label>
      ))}
    </div>
  );
};

export const BooleanUI: React.FC<{
  quiz: IQuiz;
  state: questionUIStateProps;
  disableAnswer: boolean;
  markQuestion: (user_answer: string | string[]) => void;
}> = ({ quiz, state, disableAnswer, markQuestion }) => {
  const bool: ["true", "false"] = ["true", "false"];
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="w-full flex flex-col gap-5">
      {bool.map((b, i) => (
        <Button
          disabled={disableAnswer}
          key={i}
          onClick={() => {
            markQuestion(b);
            setSelected(i);
          }}
          variant={
            quiz?.result_display_type === ON_COMPLETE
              ? state.correct_answer === b
                ? "base"
                : "destructive"
              : selected === i
              ? "base"
              : "outline"
          }
          className="w-full h-[3rem]"
        >
          {capitalize_first_letter(b)}
        </Button>
      ))}
    </div>
  );
};

export const ObjectiveUI: React.FC<{
  data: IQuestion;
  quiz: IQuiz;
  state: questionUIStateProps;
  disableAnswer: boolean;
  markQuestion: (user_answer: string | string[]) => void;
}> = ({ data, quiz, state, disableAnswer, markQuestion }) => {
  const [buttonClicked, setButtonClicked] = useState<boolean>(false);
  const [selected, setSelected] = useState<number | null>(null);
  const { getLetter } = useText();

  return (
    <div>
      <div className="w-full flex flex-col gap-3">
        {data?.options?.map((option, i) => (
          <Button
            disabled={disableAnswer}
            onClick={() => {
              setButtonClicked(true);
              markQuestion(option.body);
              setSelected(i);
            }}
            variant={
              buttonClicked
                ? quiz?.result_display_type === ON_COMPLETE
                  ? state.correct_answer === option.body
                    ? "base"
                    : "destructive"
                  : selected === i
                  ? "base"
                  : "outline"
                : "outline"
            }
            className="w-full items-center p-1 justify-start gap-3 h-[3rem]"
            key={i}
          >
            <Button variant={"base"} size={"icon"}>
              {getLetter(i)}
            </Button>
            {option.body}
          </Button>
        ))}
      </div>
    </div>
  );
};
