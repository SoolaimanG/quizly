import { AxiosError } from "axios";
import {
  ICategory,
  IQuiz,
  app_config,
  subjects,
} from "../../Types/components.types";
import { Skeleton } from "../Loaders/Skeleton";
import { useQuizHook } from "../../Hooks/quizHooks";
import { Button } from "../Button";
import qs from "query-string";
import { useNavigate } from "react-router-dom";
import { isObjectEmpty } from "../../Functions";
import { SetStateAction } from "react";
import { cn } from "../../lib/utils";

export const FilterByCategory: React.FC<{
  category?: ICategory[];
  isLoading: boolean;
  error?: AxiosError;
  setData: React.Dispatch<SetStateAction<IQuiz[]>>;
  list: IQuiz[];
}> = ({ category, isLoading, setData, list }) => {
  const { assignIconToCategory } = useQuizHook();
  const navigate = useNavigate();

  const filter_by_category = async (category: subjects) => {
    const url = qs.stringifyUrl({
      url: app_config.explore_page + "/",
      query: { category },
    });

    const filtered_data = list.filter(
      (q) => q.category.toLowerCase() === category.toLowerCase()
    );

    setData(filtered_data);
    navigate(url); //Filter
  };

  //Using this to get the active state by return the value of the query parameter
  const activeTab = () => {
    const category = qs.parseUrl(location.href);

    if (isObjectEmpty(category.query as object)) return "All";

    return category.query.category as subjects;
  };

  return (
    <div className="w-full p-3 md:p-0 overflow-auto flex items-center gap-2">
      <Button
        onClick={() => {
          navigate(app_config.explore_page);
          setData(list);
        }}
        variant={activeTab() === "All" ? "base" : "secondary"}
      >
        <p>All</p>
      </Button>
      {isLoading ? (
        <ButtonSkeleton size={8} />
      ) : (
        category?.map((cat, i) => (
          <Button
            onClick={() => filter_by_category(cat.body)}
            variant={activeTab() === cat.body ? "base" : "secondary"}
            className="flex items-center gap-2"
            key={i}
          >
            <div className="p-2 rounded-full">
              {assignIconToCategory(cat.body)}
            </div>

            <p>{cat.body}</p>
          </Button>
        ))
      )}
    </div>
  );
};

export const ButtonSkeleton = ({
  size,
  className,
  width = "w-[150px]",
  height,
}: {
  size: number;
  className?: string;
  width?: "w-full" | "w-[150px]";
  height?: string;
}) => {
  return (
    <div className={cn("flex items-center gap-5", className)}>
      {[...Array(size)].map((_, i) => (
        <Skeleton
          key={i}
          className={cn("w-[150px] h-[40px] rounded-md", width, height)}
        />
      ))}
    </div>
  );
};
