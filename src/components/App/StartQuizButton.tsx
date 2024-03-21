import { useLocalStorage, useSessionStorage } from "@uidotdev/usehooks";
import React, { useState, useTransition } from "react";
import { generateUUID } from "../../Functions";
import { startQuiz } from "../../Functions/APIqueries";
import {
  localStorageKeys,
  startQuizButtonProps,
} from "../../Types/components.types";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "../DialogModal";
import { StudentVerification } from "./StudentVerification";
import { Button } from "../Button";
import { toast } from "../use-toaster";
import { Restricted } from "./Restricted";
import { Input } from "../Input";
import { useQuizStore } from "../../provider";
import { Loader2 } from "lucide-react";

export const StartQuizButton: React.FC<startQuizButtonProps> = ({
  id,
  isAuthenticated,
  button_text = "Start Quiz",
  haveExternalFunction,
  onQuizStart,
}) => {
  //---------->HOOKS<--------
  const [anonymousID, setAnoymousID] = useLocalStorage<string>("anonymousID");
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();
  const { setQuestionIDs } = useQuizStore();
  const [_, setQuestionUUIDs] = useSessionStorage<string[]>(
    localStorageKeys.questionUUIDs,
    []
  );

  //----------->STATES<--------------
  const [access_token, setAccessToken] = useState("");
  const [states, setStates] = useState<{ status: "404" | "409" | "000" }>({
    status: "000",
  });

  //-------------->FUNCTIONS<-----------
  const startForUsers = async () => {
    try {
      if (!id)
        return toast({
          title: "Error",
          description: "Unable to identify quiz. Please try again",
          variant: "destructive",
        });
      //Get ID from data.data object
      const uuid = generateUUID();

      const res = await startQuiz({
        quiz_id: id,
        isAuthenticated,
        anonymous_id: anonymousID || uuid,
        access_key: access_token,
      });

      if (!res.data.uuids?.length) return;

      //const questionID = res.data.id
      setAnoymousID(anonymousID || uuid); //Saving the ID to local storage for further identification
      const firstQuestion = res?.data?.uuids[0];
      //Add question to storage
      haveExternalFunction && setQuestionUUIDs(res.data.uuids);

      !haveExternalFunction
        ? navigate(
            `?questionid=${firstQuestion}${
              access_token ? `&access_key=${access_token}` : ""
            }#question`
          )
        : onQuizStart();
      haveExternalFunction && setQuestionIDs(res.data.uuids);
    } catch (error: any) {
      const status = String(error) as "000";
      setStates({ ...states, status });
    } finally {
      setAccessToken("");
    }
  };

  const start_quiz = async (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e?.preventDefault();
    startTransition(() => {
      startForUsers();
    });
  };

  const closeModal = () => setStates({ ...states, status: "000" });

  if (states.status === "409")
    return (
      <Dialog open={states.status === "409"} onOpenChange={closeModal}>
        <DialogContent>
          <StudentVerification closeFunction={closeModal} />
        </DialogContent>
      </Dialog>
    );

  if (states.status === "404")
    return (
      <Dialog open={states.status === "404"} onOpenChange={closeModal}>
        <DialogContent>
          <Restricted message="Access token is required for this Quiz" />
          <form onSubmit={start_quiz} className="flex flex-col gap-3" action="">
            <Input
              required
              value={access_token}
              onChange={(e) => setAccessToken(e.target.value)}
              className="h-[3rem]"
              placeholder="Access Token (Example -- Q53jL9K)"
            />
            <Button type="submit" className="h-[3rem]" variant={"destructive"}>
              Join Quiz
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    );

  return (
    <Button
      disabled={isPending}
      onClick={start_quiz}
      variant={"base"}
      className="w-full h-[3rem] flex items-center gap-1"
    >
      {isPending && <Loader2 className="animate-spin" size={30} />}
      {button_text}
    </Button>
  );
};
