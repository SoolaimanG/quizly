import { useState, useTransition } from "react";
import {
  dictionaryProps,
  dictionaryResultProps,
} from "../../Types/components.types";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger,
} from "../AlertModal";
import { Button } from "../Button";
import { Input } from "../Input";
import EmptyState from "./EmptyState";
import PageLoader from "../Loaders/PageLoader";
import axios from "axios";
import { WholeWordIcon, X } from "lucide-react";
import { Volume1 } from "lucide-react";
import { capitalize_first_letter, readAloud } from "../../Functions";
import Hint from "../Hint";
import { DictionaryUI } from "./DictionaryUI";
import { useQuizStore } from "../../provider";

export const Dictionary: React.FC<dictionaryProps> = ({ children }) => {
  const { openDictionary, setOpenDictionary } = useQuizStore();

  const [isPending, startTransition] = useTransition();
  const [reading, startReading] = useTransition();
  const [word, setWord] = useState("");
  const [data, setData] = useState<dictionaryResultProps[]>([]);

  const searchWord = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await axios.get(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );
    const result: dictionaryResultProps[] = response.data;
    setData(result);
  };

  const readText = async (text: string) => {
    await readAloud({ text });
  };

  return (
    <AlertDialog open={openDictionary} onOpenChange={setOpenDictionary}>
      <AlertDialogTrigger>{children}</AlertDialogTrigger>
      <AlertDialogContent className="h-[30rem] overflow-auto">
        <AlertDialogCancel className="absolute top-2 right-2">
          <X />
        </AlertDialogCancel>
        <header className="flex w-full items-center gap-1">
          {" "}
          <WholeWordIcon />
          Dictionary
        </header>
        <hr />
        <form
          onSubmit={(e) => {
            startTransition(() => {
              searchWord(e);
            });
          }}
          className="flex items-center gap-2"
          action=""
        >
          <Input
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder="Enter a word to find its meaning"
          />
          <Button>Search</Button>
        </form>

        <div>
          {isPending ? (
            <PageLoader text="Searching.." size={90} />
          ) : !!data.length ? (
            <div>
              <div className="flex items-center gap-2">
                <h1>{capitalize_first_letter(data[0].word)}</h1>
                <Hint
                  element={
                    <Button
                      onClick={() =>
                        startReading(() => {
                          readText(data[0].word);
                        })
                      }
                      variant={"ghost"}
                      size={"icon"}
                      className="rounded-full"
                    >
                      <Volume1 className={reading ? "text-green-500" : ""} />
                    </Button>
                  }
                  content="Read"
                />
              </div>
              {data.map((d, i) => (
                <DictionaryUI key={i} {...d} />
              ))}
            </div>
          ) : (
            <EmptyState state="search" message="Search a word" />
          )}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
