import { ICategory, app_config, subjects } from "../../Types/components.types";
import { Skeleton } from "../Loaders/Skeleton";
import { useQuizHook } from "../../Hooks/quizHooks";
import { Button } from "../Button";
import qs from "query-string";
import { useNavigate } from "react-router-dom";
import { isObjectEmpty } from "../../Functions";
import { cn } from "../../lib/utils";
import { useExplorePageProvider } from "../../provider";
import { useQuery } from "@tanstack/react-query";
import { fetchCategory } from "../../Functions/APIqueries";

// Incase the category do not load from the server.
const fallBackCategories: ICategory[] = [
  {
    body: "Agriculture",
  },
  {
    body: "Biology",
  },
  {
    body: "Chemistry",
  },
  {
    body: "Computer",
  },
  {
    body: "Economics",
  },
  {
    body: "Electronics",
  },
  {
    body: "English",
  },
  {
    body: "Science",
  },
  {
    body: "Mathematics",
  },
  {
    body: "Physics",
  },
];

export const FilterByCategory: React.FC<{}> = () => {
  const { recommendedQuizzes, setFilterRecommendedQuiz } =
    useExplorePageProvider();
  const { assignIconToCategory } = useQuizHook();
  const navigate = useNavigate();

  const { isLoading, data } = useQuery<{ data: ICategory[] }>({
    queryKey: ["category"],
    queryFn: fetchCategory,
  });

  // FUNCTIONS
  const filter_by_category = async (category: subjects) => {
    const url = qs.stringifyUrl({
      url: app_config.explore_page + "/",
      query: { category },
    });

    const filtered_data = recommendedQuizzes.filter(
      (q) => q.category.toLowerCase() === category.toLowerCase()
    );

    setFilterRecommendedQuiz(filtered_data);
    navigate(url); //Filter
  };
  const activeTab = () => {
    const category = qs.parseUrl(location.href);

    if (isObjectEmpty(category.query as object)) {
      return "All";
    }

    return category.query.category as subjects;
  };

  return (
    <div className="w-full p-3 md:p-0 overflow-auto flex items-center gap-2">
      <Button
        onClick={() => {
          navigate(app_config.explore_page);
          setFilterRecommendedQuiz(recommendedQuizzes);
        }}
        variant={activeTab() === "All" ? "base" : "secondary"}
      >
        <p>All</p>
      </Button>
      {isLoading ? (
        <ButtonSkeleton size={8} />
      ) : (
        (data?.data || fallBackCategories)?.map((category, i) => (
          <Button
            onClick={() => filter_by_category(category.body)}
            variant={activeTab() === category.body ? "base" : "secondary"}
            className="flex items-center gap-2"
            key={i}
          >
            <div className="p-2 rounded-full">
              {assignIconToCategory(category.body)}
            </div>

            <p>{category.body}</p>
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
