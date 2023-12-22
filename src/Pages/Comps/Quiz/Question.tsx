import React, { useEffect, useState } from "react";
import { useText } from "../../../Hooks/text";
import {
  IQuestion,
  IQuiz,
  app_config,
  localStorageQuestions,
  objectioOptionsProps,
} from "../../../Types/components.types";
import { Button } from "../../../components/Button";
import { QuizNavigation } from "../../../components/App/QuizNavigation";
import { useZStore } from "../../../provider";
import { useMethods } from "../../../Hooks";
import { Check, CheckCircle2, Lightbulb, Volume2, XCircle } from "lucide-react";
import Hint from "../../../components/Hint";
import { mistakes_from_text, readAloud } from "../../../Functions";
import { Checkbox } from "../../../components/CheckBox";
import { Label } from "../../../components/Label";
import { toast } from "../../../components/use-toaster";
import { Textarea } from "../../../components/TextArea";
import { Skeleton } from "../../../components/Loaders/Skeleton";
import { ButtonSkeleton } from "../../../components/App/FilterByCategory";
import { useLocalStorage } from "@uidotdev/usehooks";
import { useQuizHook } from "../../../Hooks/quizHooks";

//Skeleton loading Component
const QuestionLoader = () => {
  return (
    <div className="flex w-full flex-col gap-3">
      <Skeleton className="w-full h-[6.5rem]" />
      <div className="flex w-full flex-col gap-3">
        <ButtonSkeleton className="flex-col" width="w-full" size={4} />
      </div>
    </div>
  );
};

export const Question: React.FC<{
  questionData: IQuestion;
  teacher_rules: Pick<IQuiz, "allow_robot_read">;
  state: "loading" | "error" | "success";
  navigationFunc: (navigate: "prev" | "next") => void;
}> = ({ questionData, teacher_rules, state, navigationFunc }) => {
  const { allow_robot_read } = teacher_rules;
  const { setLoginAttempt } = useZStore();
  const { isAuthenticated } = useMethods();
  const { calculate_score } = useQuizHook();
  const [question, setQuestion] = useLocalStorage<localStorageQuestions>(
    "questions",
    { score: 0, answered_question: [] }
  );

  const { getLetter, removeWhiteSpace } = useText();
  const [answerState, setAnswerState] = useState<{
    correct_answer: string;
    is_correct: boolean;
    multipleAnswers: objectioOptionsProps[];
  }>({
    correct_answer: "",
    is_correct: false,
    multipleAnswers: [],
  });

  const [germanAnswer, setGermanAswer] = useState("");

  const cannot_answer_twice = () => {
    if (question.answered_question.includes(questionData?.id)) {
      toast({
        title: "Error",
        description: "Question has already been answered",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const add_question_to_storage = (
    is_correct: boolean,
    question_point: number
  ) => {
    if (question.answered_question.includes(questionData.id)) return;

    setQuestion({
      //Setting the questions answered by the user
      ...question,
      answered_question: [...question.answered_question, questionData.id],
      score: calculate_score(is_correct, question_point),
    });
  };

  const selectionOBJ = (option: objectioOptionsProps) => {
    //Check If the user already select an option to avoid change of mind of user
    if (!cannot_answer_twice()) return;

    if (isAuthenticated()) return;

    //First find the correct answer from the options above
    const correct_answer = questionData?.options?.find(
      (option) => option.is_correct_answer
    );

    setAnswerState({
      ...answerState,
      is_correct: correct_answer?.body === option.body,
      correct_answer: correct_answer?.body as string,
    });

    //Handles if user choose the correct option
    if (correct_answer?.body === option.body) {
      calculate_score(true, questionData.question_point);
    } else {
      // Do Something
    }

    add_question_to_storage(
      correct_answer?.body === option.body,
      questionData.question_point
    ); //Adding the question answered by the non-authenticated user to LocalStorage
  };
  const booleanSelection = (value: "true" | "false") => {
    if (!cannot_answer_twice()) return;

    if (isAuthenticated()) {
      return;
    }

    const correctAnswer = String(questionData?.booleanOption);

    setAnswerState({
      ...answerState,
      is_correct: correctAnswer === value,
      correct_answer: correctAnswer as string,
    });

    if (answerState.is_correct) {
      calculate_score(true, questionData.question_point);
    } else {
      //Do Something
    }

    add_question_to_storage(
      correctAnswer === value,
      questionData.question_point
    );
  };
  const multipleChoiceOption = (option: objectioOptionsProps) => {
    if (isAuthenticated()) {
      // For Authenticated users
      return;
    }

    const optionsToChoose = questionData?.options?.filter(
      (opt) => opt.is_correct_answer
    );
    const maxAnswers = optionsToChoose?.length as number;

    if (answerState.multipleAnswers.length >= maxAnswers) return; //If user has already choose their answer no need to rechoose

    const isOptionSelected = answerState.multipleAnswers.some(
      (opt) => opt.body === option.body
    );

    if (isOptionSelected) {
      setAnswerState({
        ...answerState,
        multipleAnswers: answerState.multipleAnswers.filter(
          (opt) => opt.body !== option.body
        ),
      });
    } else {
      if (answerState.multipleAnswers.length >= maxAnswers) {
        toast({
          title: "Error",
          description: `You can only select ${maxAnswers} options`,
          variant: "destructive",
        });
      } else {
        setAnswerState({
          ...answerState,
          multipleAnswers: [...answerState.multipleAnswers, option],
        });
      }
    }

    //add_question_to_storage();
  };
  const germanAnswerCheck = () => {
    if (!germanAnswer) return;

    if (!cannot_answer_twice()) return;

    if (isAuthenticated()) {
      //For Authenticated Users
    }

    if (questionData?.is_strict) {
      setAnswerState({
        ...answerState,
        correct_answer: removeWhiteSpace(questionData?.answer) as string,
        is_correct:
          removeWhiteSpace(germanAnswer) ===
          removeWhiteSpace(questionData?.answer),
      });
      removeWhiteSpace(germanAnswer) ===
        removeWhiteSpace(questionData.answer) &&
        calculate_score(true, questionData.question_point);
      return;
    }

    const mistakes = mistakes_from_text(
      germanAnswer,
      questionData?.answer as string
    );

    if (mistakes > (questionData?.mistakesToIgnore as number)) {
      setAnswerState({
        ...answerState,
        correct_answer: removeWhiteSpace(questionData?.answer) as string,
        is_correct: false,
      });
      return;
    }

    if (mistakes <= Number(questionData?.mistakesToIgnore)) {
      calculate_score(true, questionData.question_point);
      setAnswerState({
        ...answerState,
        correct_answer: removeWhiteSpace(questionData?.answer) as string,
        is_correct: true,
      });
      return;
    }

    //add_question_to_storage();
  };
  //This will br comparing the user answers for multiple selections due to react asyncrous issues
  useEffect(() => {
    //This will only run for unauthenticated users
    if (!isAuthenticated()) {
      const optionsToChoose = questionData?.options?.filter(
        (opt) => opt.is_correct_answer
      );
      const maxAnswers = optionsToChoose?.length as number;

      if (answerState.multipleAnswers.length === maxAnswers) {
        setAnswerState({
          ...answerState,
          correct_answer: answerState.multipleAnswers[0].body,
          is_correct: answerState.multipleAnswers.every(
            (opt) => opt.is_correct_answer
          ),
        });
      }
    }
  }, [answerState.multipleAnswers]);

  useEffect(() => {
    //Clearing all states as the quiz ID changes
    setAnswerState({
      correct_answer: "",
      is_correct: false,
      multipleAnswers: [],
    });
    setGermanAswer("");
  }, [questionData?.id]);

  //The UI to render if the question type is Objective i.e A,B,C,D
  const objectiveUI = (
    <div className="w-full flex flex-col gap-3">
      {questionData?.options?.map((option, i) => (
        <Button
          onClick={() => selectionOBJ(option)}
          variant={
            answerState.correct_answer
              ? answerState.correct_answer === option.body
                ? "base"
                : "destructive"
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
  );

  const booleanUI = (
    <div className="w-full flex flex-col gap-3">
      <Button
        onClick={() => booleanSelection("true")}
        value={"true"}
        variant={"base"}
        className="w-full h-[3rem]"
      >
        True
      </Button>
      <Button
        onClick={() => booleanSelection("false")}
        value={"false"}
        variant={"destructive"}
        className="w-full h-[3rem]"
      >
        False
      </Button>
    </div>
  );

  const multipleChoiceUI = (
    <div className="w-full flex flex-col gap-2">
      {questionData?.options?.map((option, i) => (
        <Label key={i} className="flex items-center gap-3 text-lg">
          <Checkbox
            checked={answerState.multipleAnswers?.includes(option)}
            value={option.body}
            onCheckedChange={() => multipleChoiceOption(option)}
            className="data-[state=checked]:bg-green-500 data-[state=checked]:text-white border-green-500"
          />
          {option.body}
        </Label>
      ))}
    </div>
  );

  const germanUI = (
    <div className="w-full flex flex-col gap-2">
      <Textarea
        value={germanAnswer}
        onChange={(e) => setGermanAswer(e.target.value)}
        className="resize-none"
        rows={7}
        placeholder="Type in your answer"
      />
      <Button
        onClick={germanAnswerCheck}
        size={"icon"}
        className="w-full h-[3rem]"
        variant={"base"}
      >
        <Check /> Submit
      </Button>
    </div>
  );

  const questionType = {
    german: germanUI,
    objective: objectiveUI,
    multiple_choice: multipleChoiceUI,
    true_or_false: booleanUI,
  };

  return (
    <React.Fragment>
      {state === "loading" ? (
        <QuestionLoader />
      ) : state === "error" ? (
        <div>Something went wrong....</div> //TODO:Create a better error comp
      ) : (
        <div className="mb-10 flex flex-col gap-2">
          <div className="flex items-center justify-between w-full">
            <pre className="underline">
              Question {questionData?.question_number}
            </pre>
            {allow_robot_read && (
              <Hint
                element={
                  <Button
                    onClick={() =>
                      readAloud({ text: questionData?.question_body })
                    }
                    size={"icon"}
                    variant={"secondary"}
                    className="p-1 rounded-full bg-transparent"
                  >
                    <Volume2 />
                  </Button>
                }
                content="Read question"
              />
            )}
          </div>
          <div className="w-full flex text-green-600 dark:text-green-500 flex-col gap-2 rounded-sm  h-fit p-3">
            <p className="text-xl text-center">{questionData?.question_body}</p>
            {questionData?.question_image && (
              <img
                className="h-[15rem]"
                src={questionData?.question_image}
                alt="question_img"
              />
            )}
          </div>
          {/* If the options is Objective */}
          <div className="w-full border border-green-600 p-2 rounded-md mt-3">
            {questionType[questionData?.question_type]}
          </div>
          {questionData?.hint && (
            <div className="w-full flex items-end justify-end">
              <Hint
                element={
                  <Button size={"icon"} variant={"secondary"} className="py-0">
                    <Lightbulb />
                  </Button>
                }
                content="Get Hint"
                delay={500}
              />
            </div>
          )}
          {answerState.correct_answer &&
            questionData?.correct_answer_explanation && (
              <div className="w-full mt-3 flex items-center justify-center flex-col gap-2">
                {answerState.is_correct ? (
                  <div className="flex text-green-500 items-center gap-2">
                    <CheckCircle2 size={20} />
                    <p className="font-semibold">Correct Answer</p>
                  </div>
                ) : (
                  <div className="flex text-red-400 items-center gap-2">
                    <XCircle size={20} />
                    <p className="font-semibold">Wrong Answer</p>
                  </div>
                )}
                {/*</div>*/}
                <i className="text-lg text-center w-full">
                  {'"" ' + questionData?.correct_answer_explanation + ' ""'}
                </i>
              </div>
            )}
          <div className="absolute bottom-3 w-full p-1 gap-3 flex items-center justify-between right-3">
            {!isAuthenticated() && (
              <Button
                onClick={() =>
                  setLoginAttempt({
                    attempt: true,
                    fallback: app_config.explore_page,
                  })
                }
                variant={"link"}
              >
                Create Account
              </Button>
            )}
            <QuizNavigation
              prevFunction={() => navigationFunc("prev")}
              havePrev
              nextFunction={() => navigationFunc("next")}
            />
          </div>
        </div>
      )}
    </React.Fragment>
  );
};
