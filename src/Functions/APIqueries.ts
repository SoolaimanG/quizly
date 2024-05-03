import { questionUIStateProps, subjects } from "./../Types/components.types";
import axios, { AxiosError, AxiosResponse } from "axios";
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
import { createCommunityApiProps } from "../Types/community.types";
import queryString from "query-string";
import { featureWaitListProps } from "../components/App/ComingSoon";

const access_token = Cookies.get("access_token");
const api = import.meta.env.VITE_QUIZLY_API_HOST;
const community_api = api + "/api/v1/community/";

export const fetchCategory = async () => {
  const res = await axios.get(api + "/api/v1/categories/");

  return res.data;
};

export const getStudentDetails = async () => {
  const response = await axios.get(api + "/api/v1/student/", {
    headers: { Authorization: "Bearer " + access_token },
  });
  return response.data;
};

export const setUserSubjectPrefrence = async (favourites: subjects[]) => {
  const response = await axios.post(
    api + "/api/v1/categories/",
    {
      favourites,
    },
    { headers: { Authorization: "Bearer " + access_token } }
  );

  return response.data;
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

export const getTutorDetails = async () => {
  const response = await axios.get(api + "/api/v1/tutor/", {
    headers: {
      Authorization: "Bearer " + access_token,
    },
  });

  return response.data;
};

export const editTutorProfile = async (tutor_data: Partial<ITeacher>) => {
  const response = await axios.patch(
    api + "/api/v1/tutor/",
    { ...tutor_data },
    { headers: { Authorization: "Bearer " + access_token } }
  );
  return response.data;
};

export const requestEmailVerification = async (email: string) => {
  const response = await axios.post(
    api + "/api/v1/auth/verify-email/",
    {
      email,
    },
    { headers: { Authorization: "Bearer " + access_token } }
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
  const headers = isAuthenticated
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

  return new Promise((resolve, reject) => {
    try {
      axios.post(
        api + "/api/v1/auth/create-student-or-teacher/",
        { ...payload },
        {
          headers: {
            Authorization: "Bearer " + access_token,
          },
        }
      );

      resolve("OK");
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
      description: errorMessageForToast(
        error as AxiosError<{ message: string }>
      ),
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
    data: questionUIStateProps;
  } = response.data;
  return rs;
};

export const getQuizResult = async ({
  isAuthenticated,
  anonymous_id,
  quiz_id,
  ip_address,
}: {
  isAuthenticated: boolean;
  anonymous_id?: string;
  quiz_id: string;
  ip_address?: string;
}) => {
  const headers = isAuthenticated
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
      description: errorMessageForToast(
        error as AxiosError<{ message: string }>
      ),
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

export const checkTimer = async ({
  quiz_id,
  anonymous_id,
  isAuthenticated,
}: {
  quiz_id: string;
  isAuthenticated: boolean;
  anonymous_id?: string;
}) => {
  const headers = isAuthenticated
    ? {
        Authorization: "Bearer " + access_token,
      }
    : {};

  const params = anonymous_id ? `?anonymous_id=${anonymous_id}` : "";

  const response = await axios.get(
    api + `/api/v1/check-timer/${quiz_id}/` + params,
    { headers }
  );
  return response.data;
};

export const getQuizDetails = async (
  id: string,
  anonymous_id: string,
  isAuthenticated: boolean
) => {
  const headers = isAuthenticated
    ? {
        Authorization: "Bearer " + access_token,
      }
    : {};

  const params = `?anonymous_id=${anonymous_id}`;
  const response = await axios.get(
    api + "/api/v1/get-quiz-details/" + id + "/" + params,
    { headers }
  );
  return response.data;
};

export const isQuizSaved = async (quiz_id: string) => {
  const params = `?quiz_id=${quiz_id}`;
  const response = await axios.get(api + "/api/v1/saved-quiz/" + params, {
    headers: {
      Authorization: "Bearer " + access_token,
    },
  });

  return response.data;
};

export const savedAndRemoveQuiz = async (quiz_id: string) => {
  const response = await axios.post(
    api + "/api/v1/saved-quiz/",
    {
      quiz_id,
    },
    { headers: { Authorization: "Bearer " + access_token } }
  );

  return response.data;
};

export const hasRated = async (id: string, action: "quiz" | "teacher") => {
  const params = `?id=${id}&action=${action}`;
  const response = await axios.get(api + "/api/v1/ratings/" + params, {
    headers: { Authorization: "Bearer " + access_token },
  });

  return response.data;
};

export const rateAndUnRate = async (id: string, action: "quiz" | "teacher") => {
  const response = await axios.post(
    api + "/api/v1/ratings/",
    {
      id,
      action,
    },
    { headers: { Authorization: "Bearer " + access_token } }
  );

  return response.data;
};

export const getQuizQuestions = async ({
  quiz_id,
  isAuthenticated,
  anonymous_id,
}: {
  quiz_id: string;
  isAuthenticated: boolean;
  anonymous_id: string;
}) => {
  const headers =
    isAuthenticated && access_token
      ? {
          Authorization: "Bearer " + access_token,
        }
      : {};

  const params = `/?anonymous_id=${anonymous_id}`;
  const response = await axios.get(
    api + "/api/v1/get-all-question/" + quiz_id + params,
    { headers }
  );

  return response.data;
};

export const reportQuestion = async ({
  question_id,
  quiz_id,
  issue,
}: {
  question_id: string;
  quiz_id: string;
  issue: string;
}) => {
  const response = await axios.post(
    api + "/api/v1/report-question/",
    { quiz_id, question_id, issue },
    { headers: { Authorization: "Bearer " + access_token } }
  );
  return response.data;
};

export const isCommentLiked = async (comment_id: number) => {
  const params = `?comment_id=${comment_id}`;
  const response = await axios.get(api + "/api/v1/comment/" + params, {
    headers: {
      Authorization: "Bearer " + access_token,
    },
  });

  return response.data;
};

export const likeAndUnlikeComment = async (comment_id: number) => {
  const response = await axios.post(
    api + "/api/v1/comment/",
    {
      comment_id,
    },
    { headers: { Authorization: "Bearer " + access_token } }
  );

  return response.data;
};

export const getRelatedQuiz = async (keyword: string) => {
  const params = `?keyword=${keyword}`;
  const response = await axios.get(api + "/api/v1/get_related_quiz/" + params, {
    headers: {
      Authorization: "Bearer " + access_token,
    },
  });
  return response.data;
};

export const createCommunity = async ({
  allow_categories,
  display_image,
  description,
  name,
  join_with_request,
}: createCommunityApiProps) => {
  try {
    const formData = new FormData();
    formData.append("allow_categories", allow_categories.toString());
    formData.append("display_image", display_image);
    formData.append("description", description as string);
    formData.append("name", name);
    formData.append("join_with_request", String(join_with_request));

    if (!name) throw new Error("Name is required.");

    if (!display_image) throw new Error("No display image");

    if (!allow_categories.length)
      throw new Error("Select a subject that can be posted on this community.");

    const response = await axios.post(
      community_api + "create-community/",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + access_token,
        },
      }
    );

    const rs: { data: null; message: string } = response.data;
    return rs;
  } catch (error) {
    console.log(error);
    toast({
      title: "Error",
      description: errorMessageForToast(
        error as AxiosError<{ message: string }>
      ),
      variant: "destructive",
    });
  }
};

//CLASS METHODS
export class CommunityApiCalls {
  id: string;
  constructor(id: string) {
    this.id = id;
  }

  async searchCommunity(search: string) {
    const params = `?search=${search}`;
    const response = await axios.get(
      community_api + `search-community/${this.id}/` + params
    );

    return response.data;
  }

  async accept_or_reject_request(
    type: "accept" | "reject" | "accept_all",
    user_id: string
  ) {
    const response = await axios.post(
      community_api + `accept_or_reject/${this.id}/`,
      { type, user_id },
      {
        headers: {
          Authorization: "Bearer " + access_token,
        },
      }
    );

    return response.data;
  }

  async getCommunityPost({}: { size?: number }) {
    const params = `/?type=post`;
    const response = await axios.get(
      community_api + "my-community/" + this.id + params
    );
    return response.data;
  }

  async getCommunityMembers({
    pageParam,
    sort,
  }: {
    pageParam: number;
    sort: boolean;
  }) {
    const params = `/?type=members&pageParams=${pageParam}&sort=${sort}`;
    const response = await axios.get(
      community_api + "my-community/" + this.id + params
    );
    return response.data;
  }

  async getCommunityRequests(pageParam: number) {
    const params = `/?type=requests&pageParams=${pageParam}`;
    const response = await axios.get(
      community_api + "my-community/" + this.id + params
    );
    return response.data;
  }

  async getCommunityDetails({
    filter_type = "popular",
  }: {
    filter_type: "popular" | "newest";
  }) {
    const params = `/?type=details&filter_type=${filter_type}`;
    const response = await axios.get(
      community_api + "my-community/" + this.id + params
    );
    return response.data;
  }

  async has_user_like_post(id: string) {
    const params = `/?type=is_liked&post_id=${id}`;
    const response = await axios.get(
      community_api + "my-community/" + this.id + params,
      {
        headers: {
          Authorization: "Bearer " + access_token,
        },
      }
    );
    return response.data;
  }

  async getPostComments(post_id: string, size?: number) {
    const params = `/?type=comments&post_id=${post_id}&size=${size ?? 10}`;
    const response = await axios.get(
      community_api + "my-community/" + this.id + params
    );
    return response.data;
  }

  async likePost(id: string) {
    const response = await axios.post(
      community_api + "community-action/" + id + "/",
      { type: "like" },
      {
        headers: {
          Authorization: "Bearer " + access_token,
        },
      }
    );

    return response.data;
  }

  async addComment(id: string, comment: string) {
    const response = await axios.post(
      community_api + "community-action/" + id + "/",
      { type: "comment", comment },
      {
        headers: {
          Authorization: "Bearer " + access_token,
        },
      }
    );

    return response.data;
  }

  async getMyCommunities(id: string) {
    const params = `/?type=my_communities`;
    const response = await axios.get(
      community_api + "my-community/" + id + params,
      {
        headers: {
          Authorization: "Bearer " + access_token,
        },
      }
    );
    return response.data;
  }

  async addAPost({
    images,
    caption,
    quiz_id,
  }: {
    images: File[];
    caption: string;
    quiz_id?: string;
  }) {
    const formData = new FormData();

    images.forEach((image, index) => {
      formData.append(`image${index}`, image);
    });
    formData.append("images_length", images.length + "");
    formData.append("caption", caption);
    formData.append("quiz_id", quiz_id ?? "");
    const response = await axios.post(
      community_api + "my-community/" + this.id + "/",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + access_token,
        },
      }
    );

    return response.data;
  }

  async editPost({
    quiz_id,
    post_id,
    caption,
    more_images,
    more_images_len,
    remove_image_len,
    remove_images,
    images_to_update_len,
  }: {
    post_id: string;
    caption: string;
    quiz_id?: string;
    images_to_update_len?: {
      old_image: string[];
      new_image: File[];
      len: number;
    };
    more_images?: File[];
    more_images_len: number;
    remove_image_len: number;
    remove_images: string[];
  }) {
    const formData = new FormData();
    formData.append("quiz_id", quiz_id!);
    formData.append("post_id", post_id);
    formData.append("caption", caption);
    formData.append("more_images_len", more_images_len + "");
    formData.append("images_to_update_len", images_to_update_len?.len + "");
    more_images?.forEach((_, i) => {
      formData.append(`add_image_${i}`, _);
    });
    formData.append("images_to_remove_len", remove_image_len + "");
    // If there are images to be removed
    remove_images?.forEach((_, i) => {
      formData.append(`remove_img_${i}`, _);
    });
    images_to_update_len?.old_image?.forEach((_, i) => {
      formData.append(`old_image_${i}`, _);
    });
    images_to_update_len?.new_image?.forEach((_, i) => {
      formData.append(`new_image_${i}`, _);
    });
    const response = await axios.patch(
      community_api + "my-community/" + this.id + "/",
      formData,
      { headers: { Authorization: "Bearer " + access_token } }
    );
    return response.data;
  }

  async editCommunity({
    join_with_request,
    name,
    display_picture,
    allow_categories,
  }: {
    join_with_request: boolean;
    name: string;
    display_picture: File;
    allow_categories: string[];
  }) {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("join_with_request", join_with_request + "");
    formData.append("display_picture", display_picture);
    formData.append("allow_categories", allow_categories.toString());
    formData.append("type", "community");
    const response = await axios.patch(
      community_api + "my-community/" + this.id + "/",
      formData,
      {
        headers: {
          Authorization: "Bearer " + access_token,
        },
      }
    );

    return response.data;
  }

  async deletePost(
    username: string,
    type: "members" | "post" = "post",
    _?: string,
    community_id?: string,
    user_id?: string
  ) {
    const params = queryString.stringify({
      community_id,
      user_id,
      type,
      username,
    });

    const response = await axios.delete(
      community_api + "my-community/" + this.id + "/" + "?" + params,
      {
        headers: { Authorization: "Bearer " + access_token },
      }
    );
    return response.data;
  }
}

export class FeatureWaitList {
  async is_user_on_wait_list(feature_name: featureWaitListProps) {
    const params = `?feature_name=${feature_name}`;
    const res = await axios.get(api + "/api/v1/feature-wait-list/" + params, {
      headers: {
        Authorization: "Bearer " + access_token,
      },
    });
    return res.data;
  }

  async join_wait_list(feature_name: featureWaitListProps) {
    const res = await axios.post(
      api + "/api/v1/feature-wait-list/",
      {
        feature_name,
      },
      {
        headers: {
          Authorization: "Bearer " + access_token,
        },
      }
    );
    return res.data;
  }
}
