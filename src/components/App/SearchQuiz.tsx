import { Loader, MoveLeft, MoveRight } from "lucide-react";
import { CalculatorProps, IQuiz } from "../../Types/components.types";
import { Button } from "../Button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../Sheet";
import { Input } from "../Input";
import Glassmorphism from "./Glassmorphism";
import { useState, useTransition } from "react";
import { useSearchParams } from "react-router-dom";
import EmptyState from "./EmptyState";
import { seriliazeParams } from "../../Functions";
import { QuizListUI } from "../../Pages/ExplorePage/QuizListUI";

const SearchQuiz: React.FC<Pick<CalculatorProps, "button">> = ({ button }) => {
  const [results, _] = useState<IQuiz[]>([]);
  const [___, setSearch] = useSearchParams();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seriliazer = seriliazeParams(e);

    setSearch(seriliazer);
  };

  const [_____, __] = useState({
    error: false,
  });
  const [isPending, ____] = useTransition();

  return (
    <Sheet>
      <SheetTrigger>{button}</SheetTrigger>
      <SheetContent className="w-full h-screen overflow-auto p-0 md:w-3/4">
        <SheetHeader className="w-full">
          <Glassmorphism
            blur={"20px"}
            className="w-full fixed flex items-center gap-2 justify-start"
          >
            <SheetClose>
              <Button size={"icon"} variant="ghost">
                <MoveLeft />
              </Button>
            </SheetClose>
            <SheetTitle>Explore Quizly</SheetTitle>
          </Glassmorphism>
        </SheetHeader>
        <div className="pt-14 h-full p-2">
          <form className="flex mt-2 items-center gap-1">
            <Input
              name="search"
              onChange={handleChange}
              className="h-[2.5rem] w-full"
              placeholder="Find quizzes within quizly"
            />
            <Button
              type="submit"
              className="h-[2.5rem]"
              size={"icon"}
              variant={"secondary"}
            >
              <MoveRight />
            </Button>
          </form>
          <h1 className="mt-3">
            {results.length >= 1
              ? "Match Results " + results.length
              : " Discover Quizzes"}
          </h1>
          {isPending ? (
            <div className="w-full h-full flex items-center jus">
              <Loader />
            </div>
          ) : results.length >= 1 ? (
            <div className="w-full overflow-auto flex flex-col gap-2">
              {results.map((quiz) => (
                <QuizListUI isLoading key={quiz.id} data={quiz} type="small" />
              ))}
            </div>
          ) : (
            <EmptyState message="No Quiz Found" state="search" />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SearchQuiz;
