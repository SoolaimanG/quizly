import { FC, ReactElement } from "react";

export const RetakeQuiz: FC<{
  children: ReactElement;
  onRestart?: () => void;
}> = ({ children, onRestart }) => {
  const restartQuiz = () => {
    onRestart && onRestart();
  };
  return (
    <div onClick={restartQuiz} className="w-full">
      {children}
    </div>
  );
};
