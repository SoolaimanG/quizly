import { useGetCurrentBlock } from "../../Hooks/useSurvey";
import { Block } from "./Block";

export const Mobile = () => {
  const qs = useGetCurrentBlock();
  return (
    <div className="md:w-[45%] w-full h-5/6 dark:bg-slate-950 mt-4 p-0">
      {/* <CardContent className="w-full m-auto p-3"> */}
      <Block id={qs?.id ?? ""} mode="DEVELOPMENT" />
    </div>
  );
};
