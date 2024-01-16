import {
  AlertTriangle,
  ChevronUp,
  Divide,
  Dot,
  Equal,
  Eraser,
  Minus,
  Plus,
  Asterisk,
} from "lucide-react";
import { CalculatorProps } from "../../Types/components.types";
import { Alert, AlertDescription, AlertTitle } from "../Alert";
import { Button } from "../Button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../Sheet";
import { useState } from "react";
import { evaluate } from "mathjs";
import { useQuizStore } from "../../provider";

const calculator_btns = [
  {
    btn: "C",
    haveFunction: true,
    function: "clear",
    style: "",
    value: "",
  },
  {
    btn: <Eraser />,
    haveFunction: true,
    function: "clean",
    style: "",
    value: "",
  },
  {
    btn: <Divide />,
    haveFunction: false,
    function: null,
    style: "bg-green-500 text-white hover:bg-green-600",
    value: "/",
  },
  {
    btn: <Asterisk />,
    haveFunction: false,
    function: null,
    style: "bg-green-500 text-white hover:bg-green-600",
    value: "*",
  },
  {
    btn: "7",
    haveFunction: false,
    function: null,
    style: "",
    value: "7",
  },
  {
    btn: "8",
    haveFunction: false,
    function: null,
    style: "",
    value: "8",
  },
  {
    btn: "9",
    haveFunction: false,
    function: null,
    style: "",
    value: "9",
  },
  {
    btn: <Minus />,
    haveFunction: false,
    function: null,
    style: "bg-green-500 text-white hover:bg-green-600",
    value: "-",
  },
  {
    btn: "4",
    haveFunction: false,
    function: null,
    style: "",
    value: "4",
  },
  {
    btn: "5",
    haveFunction: false,
    function: null,
    style: "",
    value: "5",
  },
  {
    btn: "6",
    haveFunction: false,
    function: null,
    style: "",
    value: "6",
  },
  {
    btn: <Plus />,
    haveFunction: false,
    function: null,
    style: "bg-green-500 text-white hover:bg-green-600 ",
    value: "+",
  },
  {
    btn: "3",
    haveFunction: false,
    function: null,
    style: "",
    value: "3",
  },
  {
    btn: "2",
    haveFunction: false,
    function: null,
    style: "",
    value: "2",
  },
  {
    btn: "1",
    haveFunction: false,
    function: null,
    style: "",
    value: "1",
  },
  {
    btn: <Equal />,
    haveFunction: true,
    function: "equalTo",
    style: "bg-green-500 text-white hover:bg-green-600 row-span-2 ",
    value: "=",
  },
  {
    btn: "0",
    haveFunction: false,
    function: null,
    style: "",
    value: "0",
  },
  {
    btn: <Dot />,
    haveFunction: false,
    function: null,
    style: "",
    value: ".",
  },
  {
    btn: <ChevronUp />,
    haveFunction: false,
    function: null,
    style: "",
    value: "^",
  },
];

const Calculator = ({ button, answer, setAnswer }: CalculatorProps) => {
  const { openCalculator, setOpenCalculator } = useQuizStore();
  const [math, setMath] = useState("");
  const calculator_operations = (
    type: "clear" | "clean" | "equalTo" | null | string
  ) => {
    switch (type) {
      case "clean":
        setMath((prev) => {
          const arr = prev.split("").shift();

          return arr as string;
        });
        break;
      case "clear":
        setMath("");
        setAnswer("");
        break;
      case "equalTo":
        try {
          const answer = evaluate(math);
          setAnswer(answer);
          setMath(answer);
        } catch (error) {
          // Handle invalid expressions
          setMath("SYNTAX_ERROR_OR_MATH_ERROR");
        }
        break;
      default:
        break;
    }
  };

  return (
    <Sheet open={openCalculator} onOpenChange={setOpenCalculator}>
      <SheetTrigger className="w-full">{button}</SheetTrigger>
      <SheetContent className="flex flex-col gap-4">
        <SheetHeader className="w-full flex items-center justify-center">
          <SheetClose className="absolute top-3 left-3">
            <Button variant={"secondary"}>Close</Button>
          </SheetClose>
          <SheetTitle className="text-center">Calculator</SheetTitle>
        </SheetHeader>
        <Alert className="p-2 cursor-pointer">
          <AlertTriangle />
          <AlertTitle className="ml-3">Message</AlertTitle>
          <AlertDescription className="ml-3">
            This is not a scientific calculator
          </AlertDescription>
        </Alert>
        {/* Calculator Screen */}
        <div className="w-full h-[6rem] rounded-sm dark:bg-slate-800 bg-green-50">
          <p className="text-lg p-2">{math}</p>
          {answer && (
            <p className="text-3xl text-green-400 w-full mt-3 flex items-end p-1 justify-end">
              {answer}
            </p>
          )}
        </div>
        <div className="grid w-full grid-cols-4 gap-3 grid-rows-5">
          {calculator_btns.map((btn, i) => (
            <Button
              variant={"secondary"}
              onClick={() => {
                btn.haveFunction && calculator_operations(btn.function);
                !btn.haveFunction && setMath((prev) => `${prev}${btn.value}`);
              }}
              className={`w-full h-12 text-lg ${btn.style}`}
              key={i}
              size={"icon"}
            >
              {btn.btn}
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Calculator;
