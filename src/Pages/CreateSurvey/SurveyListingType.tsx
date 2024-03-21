import { Button } from "../../components/Button";
import { GridIcon, ListIcon } from "lucide-react";
import queryString from "query-string";
import { useLocation, useNavigate } from "react-router-dom";

export const SurveyListingType = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const listType = queryString.parse(location.search) as {
    list: "grid" | "list" | undefined;
  };

  return (
    <div className="dark:bg-slate-700 flex items-center bg-white p-1 rounded-md">
      <Button
        onClick={() => navigate("?list=list")}
        size="icon"
        className="rounded-sm h-6"
        variant={
          typeof listType.list === "undefined" || listType.list === "list"
            ? "base"
            : "ghost"
        }
      >
        <ListIcon size={14} />
      </Button>
      <Button
        onClick={() => navigate("?list=grid")}
        size="icon"
        className="rounded-sm h-6"
        variant={listType.list === "grid" ? "base" : "ghost"}
      >
        <GridIcon size={14} />
      </Button>
    </div>
  );
};
