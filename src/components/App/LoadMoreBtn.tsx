import { FC } from "react";
import { Button } from "../Button";

export const LoadMoreBtn: FC<{
  btnText?: string;
  isFetching: boolean;
  endOfPages: boolean;
  hasNextPage: boolean;
  loadingText?: string;
  onClick: () => void;
}> = ({
  hasNextPage,
  btnText = "Load more",
  loadingText = "Getting more data",
  isFetching,
  onClick,
}) => {
  const handleFetchMore = () => {
    if (!hasNextPage) return;
    onClick();
  };

  return (
    <Button
      onClick={handleFetchMore}
      className="w-full flex items-center justify-center"
      variant="link"
    >
      {hasNextPage && (isFetching ? loadingText : btnText)}
      {!hasNextPage && "End of data"}
    </Button>
  );
};
