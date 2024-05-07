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

  async getQuickQuiz(anonymous_id?: string) {
    const headers =
      this.isAuthenticated && this.access_token
        ? {
            Authorization: "Bearer " + this.access_token,
          }
        : {};

    return (
      await api.get(quiz_api + `quick-quiz/?anonymous_id=${anonymous_id}`, {
        headers,
      })
    ).data;
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
    unanswered_questions,
  }: {
    quiz_id: string;
    access_token?: string;
    ip_address?: string;
    anonymous_id?: string;
    unanswered_questions?: boolean;
  }) {
    const headers =
      this.isAuthenticated && this.access_token
        ? {
            Authorization: "Bearer " + this.access_token,
          }
        : {};

    const res = await api.post(
      this.quiz_api + "start-quiz/" + quiz_id + "/",
      { access_token, ip_address, anonymous_id, unanswered_questions },
      { headers }
    );

    return res.data;
  }

  async getQuestion(question_id: string, anonymous_id?: string) {
    const headers =
      this.isAuthenticated && this.access_token
        ? {
            Authorization: "Bearer " + this.access_token,
          }
        : {};

    const params = queryString.stringify({
      anonymous_id,
    });

    const res = await api.get(
      this.quiz_api + `question/${question_id}/?${params}`,
      {
        headers,
      }
    );

    return res.data;
  }

  async checkUserAnswer({
    questionID,
    user_answer,
    access_token,
    anonymous_id,
  }: {
    questionID: string;
    user_answer: (string | boolean)[];
    access_token?: string;
    anonymous_id?: string;
  }) {
    const headers =
      this.isAuthenticated && this.access_token
        ? {
            Authorization: "Bearer " + this.access_token,
          }
        : {};

    const params = {
      access_token,
      user_answer,
      anonymous_id,
    };

    const response = await api.post(
      this.quiz_api + `mark-question/${questionID}/`,
      { ...params },
      { headers }
    );

    return response.data;
  }

  async reportQuestion(
    question_id: string,
    report: string,
    access_token?: string
  ) {
    const response = await api.post(
      this.quiz_api + `report-question/${question_id}/`,
      { access_token, report },
      { headers: { Authorization: "Bearer " + this.access_token } }
    );
    return response.data;
  }

  async submitQuiz(
    quiz_id: string,
    access_token?: string,
    anonymous_id?: string
  ) {
    const headers =
      this.isAuthenticated && this.access_token
        ? {
            Authorization: "Bearer " + this.access_token,
          }
        : {};

    const response = await api.post(
      this.quiz_api + `quiz-result/${quiz_id}/`,
      { access_token, anonymous_id },
      { headers }
    );
    return response.data;
  }

  async getQuizResult(
    quiz_id: string,
    access_token?: string,
    anonymous_id?: string
  ) {
    const headers =
      this.isAuthenticated && this.access_token
        ? {
            Authorization: "Bearer " + this.access_token,
          }
        : {};

    const params = queryString.stringify({ access_token, anonymous_id });

    const response = await api.get(
      this.quiz_api + `quiz-result/${quiz_id}/?${params}`,
      { headers }
    );

    return response.data;
  }
}
