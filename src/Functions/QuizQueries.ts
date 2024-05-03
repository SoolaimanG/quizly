import queryString from "query-string";
import { api } from "./api";
import Cookies from "js-cookie";

const quiz_api = "/api/v1/quiz/";

export class QuizQueries {
  isAuthenticated?: boolean;
  anonymous_id: string = JSON.parse(
    sessionStorage.getItem("anonymous_id") || ""
  );
  access_token = Cookies.get("access_token");
  quiz_api = "/api/v1/quiz/";

  constructor(isAuthenticated?: boolean) {
    this.isAuthenticated = isAuthenticated;
  }

  async getTrendingQuiz(isAuthenticated: boolean, pages = 10) {
    const headers =
      isAuthenticated && this.access_token
        ? {
            Authorization: "Bearer " + this.access_token,
          }
        : {};

    const param = queryString.stringify({
      anonymous_id: this.anonymous_id,
      pages: pages,
    });

    return (
      await api.get(quiz_api + `recommended-quizzes/?${param}`, { headers })
    ).data;
  }

  async getQuickQuiz() {
    const headers =
      this.isAuthenticated && this.access_token
        ? {
            Authorization: "Bearer " + this.access_token,
          }
        : {};

    return (await api.get(quiz_api + `quick-quiz/`, { headers })).data;
  }

  async getQuizComment(quizId: string, pages = 10) {
    const qs = queryString.stringify({
      pages,
    });
    return (
      await api.get(this.quiz_api + "quiz-comments/" + quizId + "/" + "?" + qs)
    ).data;
  }

  async startQuiz({
    quiz_id,
    access_token,
    ip_address,
    anonymous_id,
  }: {
    quiz_id: string;
    access_token?: string;
    ip_address?: string;
    anonymous_id?: string;
  }) {
    const headers =
      this.isAuthenticated && this.access_token
        ? {
            Authorization: "Bearer " + this.access_token,
          }
        : {};

    return await api.post(
      this.quiz_api + "start-quiz/" + quiz_id,
      { access_token, ip_address, anonymous_id },
      { headers }
    );
  }
}
