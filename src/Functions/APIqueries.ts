import axios from "axios";
import Cookies from "js-cookie";

export const fetchCategory = async () => {
  const res = await axios.get(
    import.meta.env.VITE_QUIZLY_API_HOST + "/api/v1/subject-categories/"
  );

  return res.data;
};

export const getQuizzesForUser = async () => {
  const res = await axios.get(
    import.meta.env.VITE_QUIZLY_API_HOST + "/api/v1/get-quizzes/"
  );

  return res.data;
};

export const getUser = async (param?: string) => {
  const access_token = Cookies.get("access_token");

  const param_string = param ? `?param=${param}` : "";

  const res = await axios.get(
    import.meta.env.VITE_QUIZLY_API_HOST + "/api/v1/user/" + param_string,
    {
      headers: {
        Authorization: "Bearer " + access_token,
      },
      withCredentials: true,
    }
  );

  return res.data;
};

export const getQuickQuiz = async (is_authenticated: boolean) => {
  const access_token = Cookies.get("access_token") || ""; //If the user is authenticated

  let res;

  if (!is_authenticated) {
    const response = await axios.get(
      import.meta.env.VITE_QUIZLY_API_HOST + "/api/v1/quick_quiz/"
    );
    res = response.data;
  } else {
    const response = await axios.get(
      import.meta.env.VITE_QUIZLY_API_HOST + "/api/v1/quick_quiz/",
      {
        headers: {
          Authorization: "Bearer " + access_token,
        },
      }
    );
    res = response.data;
  }

  return res;
};
