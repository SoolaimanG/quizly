import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import PageLoader from "../components/Loaders/PageLoader";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "../components/Button";

//A function to verify user email
const fetch = async (token?: string) => {
  const res = await axios.get(
    import.meta.env.VITE_QUIZLY_API_HOST +
      "/api/v1/auth/verify-email/?verify_token=" +
      token
  );

  return res.data;
};

const ConfirmEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const { isLoading, error, refetch } = useQuery<any, any, string>({
    queryKey: ["todos"],
    queryFn: () => fetch(token),
    retry: 2,
  });

  if (isLoading) return <PageLoader />;

  if (error)
    return (
      <div className="w-full flex items-center justify-center flex-col gap-2">
        <XCircle className="text-red-500" size={90} />
        <p className="text-lg text-red-300">
          {error.response?.data.message ||
            error.response.details ||
            error.message}
        </p>
        <Button onClick={() => refetch()} size={"lg"} variant={"destructive"}>
          Retry
        </Button>
      </div>
    );

  return (
    <div className="w-full flex flex-col items-center gap-2 justify-center">
      <CheckCircle2 className="text-green-500" size={90} />
      <p className="text-2xl text-green-500">
        Thank you for verifying your email
      </p>
      <span className="text-gray-400 text-base dark:text-gray-300">
        You now have access to all QUIZLY features
      </span>
      <Button
        onClick={() => navigate}
        className="text-lg"
        size={"lg"}
        variant={"link"}
      >
        Continue using app
      </Button>
    </div>
  );
};

export default ConfirmEmail;
