import axios, { AxiosResponse } from "axios";
import Cookies from "js-cookie";
import {
  IStudent,
  ITeacher,
  account_type,
  markQuestionProps,
  startQuizFunctionProps,
} from "../Types/components.types";
import { errorMessageForToast } from ".";
import { toast } from "../components/use-toaster";

const access_token = Cookies.get("access_token");
const api = import.meta.env.VITE_QUIZLY_API_HOST;
const community_api = api + "/api/v1/community/";

export const fetchCategory = async () => {
  const res = await axios.get(api + "/api/v1/subject-categories/");

  return res.data;
};

export const getQuizzesForUser = async () => {
  const res = await axios.get(api + "/api/v1/get-quizzes/");

  return res.data;
};

export const getUser = async (param?: string) => {
  const param_string = param ? `?param=${param}` : "";

  const res = await axios.get(api + "/api/v1/user/" + param_string, {
    headers: {
      Authorization: "Bearer " + access_token,
    },
    withCredentials: true,
  });

  return res.data;
};

export const getTrendingQuiz = async (anonymous_id?: string) => {
  const params = `?anonymous_id=${anonymous_id}`;
  const response = await axios.get(api + "/api/v1/trending-quiz/" + params);

  return response.data;
};

export const getQuizComments = async (quiz_id: string) => {
  const response = await axios.get(
    api + "/api/v1/quiz/comments/" + quiz_id + "/"
  );

  return response.data;
};

export const checkAuthentication = async () => {
  const access_token = Cookies.get("access_token");
  const res = await axios.get(api + "/api/v1/auth/is-authenticated/", {
    headers: {
      Authorization: "Bearer " + access_token,
    },
  });

  return res.data;
};

export const startQuiz = async ({
  quiz_id,
  isAuthenticated,
  access_key,
  anonymous_id,
}: startQuizFunctionProps) => {
  const access_token = Cookies.get("access_token") || "";

  const headers =
    isAuthenticated && access_token
      ? {
          Authorization: "Bearer " + access_token,
        }
      : {};

  const payload: startQuizFunctionProps = {
    quiz_id,
    anonymous_id,
    access_key,
  };

  try {
    const response: AxiosResponse = await axios.post(
      `${api}/api/v1/start-quiz/`,
      { ...payload },
      { headers }
    );

    const rs: { data: { uuids: string[] | null } } = response.data;
    return rs;
  } catch (error: any) {
    const status = error.request.status;
    if (status !== 409 && status !== 404) {
      toast({
        title: "Error",
        description: errorMessageForToast(error),
        variant: "destructive",
      });
    }
    throw status;
  }
};

export const create_student_or_teacher_account = async ({
  account_type,
  data,
}: {
  account_type: account_type;
  data?:
    | Pick<IStudent, "difficulty">
    | Pick<
        ITeacher,
        "address" | "phone_num" | "educational_level" | "whatsapp_link"
      >;
}) => {
  const access_token = Cookies.get("access_token") || "";

  const payload = {
    account_type,
    ...data,
  };

  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post(
        api + "/api/v1/auth/create-student-or-teacher/",
        { ...payload },
        {
          headers: {
            Authorization: "Bearer " + access_token,
          },
        }
      );

      resolve(response);
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message ||
          error.response.data.message ||
          "Something went wrong",
        variant: "destructive",
      });
      reject(error);
    }
  });
};

export const get_question = async (question_id: string) => {
  const headers: Record<string, string> = {};

  if (!question_id) return;

  const response: AxiosResponse = await axios.get(
    `${api}/api/v1/get-single-question/${question_id}/`,
    { headers }
  );

  return response?.data;
};

export const nextQuestion = async ({
  user_answer,
  question_id,
  quiz_id,
  isAuthenticated,
  anonymous_id,
  mark_question,
  ip_address,
  access_token,
}: {
  user_answer: string | string[];
  question_id: string;
  quiz_id: string;
  isAuthenticated: boolean;
  anonymous_id: string;
  mark_question?: boolean;
  ip_address?: string;
  access_token?: string;
}) => {
  const headers =
    isAuthenticated && access_token
      ? {
          Authorization: "Bearer " + access_token,
        }
      : {};

  const payload = {
    user_answer,
    question_id,
    quiz_id,
    anonymous_id,
    mark_question,
    ip_address,
    access_token,
  };
  try {
    const response = await axios.post(
      api + "/api/v1/get-next-question/",
      {
        ...payload,
      },
      { headers }
    );

    const rs: { data: { id: string } } = response.data;
    return rs;
  } catch (error) {
    toast({
      title: "Error",
      description: errorMessageForToast(error),
      variant: "destructive",
    });
    throw error;
  }
};

export const markQuestion = async ({
  isAuthenticated,
  anonymous_id,
  user_answer,
  question_id,
  is_completed,
}: markQuestionProps) => {
  const access_token = Cookies.get("access_token") || "";

  const headers =
    isAuthenticated && access_token
      ? {
          Authorization: "Bearer " + access_token,
        }
      : {};

  const payload: Omit<markQuestionProps, "isAuthenticated"> = {
    anonymous_id,
    user_answer,
    question_id,
    is_completed,
  };
  const response = await axios.post(
    api + "/api/v1/check-answer/",
    {
      ...payload,
    },
    { headers }
  );
  const rs: {
    data: {
      is_correct?: boolean;
      show_answer?: boolean;
      question_type: string;
      correct_answer: string;
      user_answer: string | string[];
    };
  } = response.data;
  return rs;
};

export const getQuizResult = async ({
  isAuthenticated,
  anonymous_id,
  quiz_id,
  ip_address,
  access_token,
}: {
  isAuthenticated: boolean;
  anonymous_id?: string;
  quiz_id: string;
  ip_address?: string;
  access_token?: string;
}) => {
  const headers =
    isAuthenticated && access_token
      ? {
          Authorization: "Bearer " + access_token,
        }
      : {};

  const params = `?quiz_id=${quiz_id}&anonymous_id=${anonymous_id}&ip_address=${ip_address}`;

  const response = await axios.get(api + "/api/v1/get-quiz-result/" + params, {
    headers,
  });

  return response.data;
};

export const retakeAQuiz = async ({
  isAuthenticated,
  quiz_id,
  anonymous_id,
}: {
  isAuthenticated: boolean;
  quiz_id: string;
  anonymous_id: string;
}) => {
  const headers =
    isAuthenticated && access_token
      ? {
          Authorization: "Bearer " + access_token,
        }
      : {};

  try {
    const payload = {
      quiz_id,
      anonymous_id,
    };

    const response = await axios.post(
      api + "/api/v1/retake-quiz/",
      { ...payload },
      { headers }
    );

    return response.data;
  } catch (error) {
    console.log(error);
    toast({
      title: "Error",
      description: errorMessageForToast(error),
      variant: "destructive",
    });
  }
};

export const addCommentFuncton = async ({
  comment,
  quiz_id,
}: {
  comment: string;
  quiz_id: string;
}) => {
  const payload = {
    comment,
    quiz_id,
  };

  const response = await axios.post(
    api + "/api/v1/add-comment/",
    { ...payload },
    { headers: { Authorization: "Bearer " + access_token } }
  );

  return response.data;
};

export const get_trending_communities = async ({
  size,
  get_popular = true,
  isAuthenticated,
}: {
  size: number;
  get_popular?: boolean;
  isAuthenticated: boolean;
}) => {
  const headers =
    isAuthenticated && access_token
      ? {
          Authorization: "Bearer " + access_token,
        }
      : {};
  const params = `?popular=${get_popular}`;

  const response = await axios.get(
    community_api + "get-communities/" + size + "/" + params + "/",
    { headers }
  );

  return response.data;
};

export const join_or_leave_community = async (
  community_id: string,
  isAuthenticated: boolean
) => {
  const headers =
    isAuthenticated && access_token
      ? {
          Authorization: "Bearer " + access_token,
        }
      : {};

  const params = `?community_id=${community_id}`;
  const response = await axios.get(
    community_api + "join-or-leave-community/" + params,
    { headers }
  );

  return response.data;
};

export const checkForMembership = async (
  community_id: string,
  isAuthenticated: boolean
) => {
  const headers =
    isAuthenticated && access_token
      ? {
          Authorization: "Bearer " + access_token,
        }
      : {};
  ///api/v1/community/am-i-a-member/?community_id=102cc5d6-1bc1-499e-991b-325cd21602bf
  const params = `?community_id=${community_id}`;
  const response = await axios.get(community_api + "am-i-a-member/" + params, {
    headers,
  });

  return response.data;
};

//CLASS METHODS
