import { useQuery } from "@tanstack/react-query";
import {
  ICategory,
  selectionToolsProps,
  subjects,
} from "../../Types/components.types";
import { fetchCategory } from "../../Functions/APIqueries";
import { Button } from "../Button";
import Error from "../../Pages/Comps/Error";
import PageLoader from "../Loaders/PageLoader";
import { toast } from "../use-toaster";
import { cn } from "../../lib/utils";

export const SelectCategory: React.FC<selectionToolsProps> = ({
  categories,
  setCategories,
  className,
  maxSelect = 5,
}) => {
  const { isLoading, data, error, refetch } = useQuery<{ data: ICategory[] }>({
    queryKey: ["category"],
    queryFn: fetchCategory,
    retry: 2,
  });

  const selection = (subject: subjects) => {
    const find_selected = categories.find((s) => s === subject);

    if (find_selected) {
      return setCategories(categories?.filter((s) => s !== subject));
    }

    if ((categories?.length as number) >= maxSelect) {
      return toast({
        title: "Error",
        description: "Maximum selection is " + maxSelect,
        variant: "destructive",
      });
    }

    setCategories((prev) => [...prev, subject]);
  };

  if (isLoading) return <PageLoader text="Loading Categories..." size={50} />;

  if (error) return <Error retry_function={() => refetch()} />;

  return (
    <div className={cn("w-full gap-2 gap-y-4 grid grid-cols-2", className)}>
      {data?.data?.map((subject, i) => (
        <Button
          variant={categories.includes(subject?.body) ? "base" : "secondary"}
          onClick={() => selection(subject?.body)}
          size={"lg"}
          className={`w-full`}
          key={i}
        >
          {subject.body}
        </Button>
      ))}
    </div>
  );
};
