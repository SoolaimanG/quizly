import { useTransition } from "react";
import { Button } from "../Button";
import { DialogDescription, DialogFooter, DialogTitle } from "../DialogModal";
import { create_student_or_teacher_account } from "../../Functions/APIqueries";
import { toast } from "../use-toaster";

export const StudentVerification = ({
  closeFunction,
}: {
  closeFunction: () => void;
}) => {
  const [isPending, startTransition] = useTransition();

  const createStudentAccount = async () => {
    await create_student_or_teacher_account({
      account_type: "S",
      data: {
        difficulty: "easy",
      },
    });
    closeFunction();

    toast({
      title: "Success",
      description: "You can now start your quiz",
    });
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <DialogTitle>Student Verification</DialogTitle>
      <DialogDescription>
        You are currently viewing this message because your account is not
        registered as a student. Access to quizzes is available exclusively for
        users with a student account.
      </DialogDescription>
      <p className="text-green-500">
        Don't worry! You can easily create a student account right now by
        clicking the "Start Quiz" button. We'll take care of the rest!
      </p>
      <DialogFooter>
        <Button
          onClick={() =>
            startTransition(() => {
              createStudentAccount();
            })
          }
          variant={"base"}
          size="lg"
          disabled={isPending}
        >
          Start Quiz
        </Button>
      </DialogFooter>
    </div>
  );
};
