import React, { useEffect } from "react";
import { cn } from "../../lib/utils";
import { TimerIcon } from "lucide-react";
import { useCounter, useLocalStorage } from "@uidotdev/usehooks";
import { useQuery } from "@tanstack/react-query";
import { checkTimer } from "../../Functions/APIqueries";
import { localStorageKeys, timerProps } from "../../Types/components.types";
import { Badge } from "../Badge";
import { useTimerColor } from "../../Hooks/quizHooks";
import { toast } from "../use-toaster";
import { errorMessageForToast } from "../../Functions";
import { AxiosError } from "axios";
import { useAuthentication } from "../../Hooks";
import { Description } from "./Description";

export const Timer: React.FC<timerProps> = ({
  quiz_id,
  className,
  initialTime,
  onTimeFinish,
}) => {
  const { loading, isAuthenticated } = useAuthentication();
  const [anonymous_id] = useLocalStorage<string | undefined>(
    localStorageKeys.anonymous_id
  );
  // As component mount send reqyest to server to make sure user is till using the assign time by tutor if not and user is still taking quiz ---> SUBMIT QUIZ
  const { isLoading, data, error } = useQuery<{
    data: { time_remaining: number };
  }>({
    queryKey: ["timer", quiz_id, isAuthenticated],
    queryFn: () => checkTimer({ quiz_id, anonymous_id, isAuthenticated }),
    enabled: !loading,
  });

  // Using this to set and decrement the time
  const [time, { set, decrement }] = useCounter(60, {
    min: 0,
  });

  useEffect(() => {
    if (error) {
      console.log(error);
      toast({
        title: "Error",
        description: errorMessageForToast(
          error as AxiosError<{ message: string }>
        ),
        variant: "destructive",
      });
    }

    set(data?.data?.time_remaining!); //Set the timer from server, convert to secs and mins and start count down.

    // Start decrementing..
    const timer = setInterval(() => {
      decrement();
    }, 1000);

    return () => clearInterval(timer);
  }, [data?.data.time_remaining, error]);

  useEffect(() => {
    time === 0 && onTimeFinish();
  }, [time]);

  const varient = useTimerColor(initialTime, time); // ---> This will return either success, destructive or warning to assign to Badge

  return (
    <Badge
      variant={varient as "success"}
      className={cn(
        "py-[3px] px-4 rounded-sm flex items-center gap-2",
        className,
        (isLoading || loading) && "animate-pulse"
      )}
    >
      <TimerIcon />
      <Description
        className="font-semibold text-white"
        text={`${Math.floor(time / 60)}m ${Math.floor(time % 60)}s`}
      />
    </Badge>
  );
};
