import { useLocation } from "react-router-dom";
import { paginationNavProps } from "../../Types/components.types";
import { cn } from "../../lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../Pagination";
import queryString from "query-string";

export function PaginationNavigation({
  className,
  length,
}: paginationNavProps) {
  const location = useLocation();

  const query = queryString.parse(location.search) as { page?: string };

  return (
    <Pagination className={cn(className)}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className=" cursor-pointer"
            onClick={() => window.history.back()}
          />
        </PaginationItem>
        {Array.from({ length }).map((_, i) => (
          <PaginationItem key={i}>
            <PaginationLink
              href={`?page=${i + 1}`}
              isActive={Number(query.page) === i + 1}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        {length > 3 && <PaginationEllipsis />}
        {length > 1 && (
          <PaginationItem>
            <PaginationNext
              href={`?page=${
                Number(query.page) >= length
                  ? Number(query.page)
                  : Number(query.page) + 1
              }`}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
