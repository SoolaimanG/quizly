import { app_config } from "../../Types/components.types";
import { useZStore } from "../../provider";
import { Button } from "../Button";
import { ManageAccount } from "./ManageAccount";

export const UserAvatar: React.FC<{ isAuthenticated: boolean }> = ({
  isAuthenticated,
}) => {
  const { setLoginAttempt } = useZStore();
  return (
    <div>
      {isAuthenticated ? (
        <ManageAccount />
      ) : (
        <Button
          onClick={() =>
            setLoginAttempt({
              attempt: true,
              fallback: app_config.explore_page,
            })
          }
          className="bg-green-400"
          variant={"base"}
        >
          Login
        </Button>
      )}
    </div>
  );
};
