import { AxiosRequestConfig } from "axios";
import {
  BlockToolProps,
  ChoiceOption,
  DropDownOptions,
  ICustomLogicConditions,
  PictureChoiceImages,
  formType,
  workSpaceAction,
} from "../Types/survey.types";
import { api } from "./api";
import Cookies from "js-cookie";
import queryString from "query-string";
import { mode } from "../Pages/CreateSurvey/AllSurveyBlocks";
import { publishDetails } from "../Types/components.types";
import { surveyResponseTypes } from ".";

export type integratedApps = "google_drive" | "excel";

export class SurveyWorkSpace {
  survey_id: string;

  survey_workspace = "/api/v1/surveys";
  access_token = Cookies.get("access_token") ?? "";

  constructor(survey_id: string) {
    this.survey_id = survey_id;
  }

  async getSurveys(size: number) {
    const params = `?size=${size}`;
    const response = await api.get(
      this.survey_workspace + "/survey-workspace/" + params,
      {
        headers: {
          Authorization: "Bearer " + this.access_token,
        },
      }
    );

    return response.data;
  }
  async createSurvey({ name, id }: { name: string; id: string }) {
    const response = await api.post(
      this.survey_workspace + "/survey-workspace/",
      { name, id },
      {
        headers: {
          Authorization: "Bearer " + this.access_token,
        },
      }
    );

    return response.data;
  }
  async generate_survey_form({
    name,
    id,
    survey_type,
  }: {
    name: string;
    survey_type: formType;
    id: string;
  }) {
    const response = await api.post(
      this.survey_workspace + "/generate-workspace-form/",
      { id, survey_type, name },
      {
        headers: {
          Authorization: "Bearer " + this.access_token,
        },
      }
    );

    return response.data;
  }
  async get_survey_details(id: string, user_id?: string) {
    const response = await api.get(
      this.survey_workspace +
        "/survey-blocks/" +
        id +
        "/?surveyUserId=" +
        user_id,
      {
        headers: {
          Authorization: "Bearer " + this.access_token,
        },
      }
    );
    return response.data;
  }
  async deleteSurvey(id: string, name: string) {
    const params = `?id=${id}&name=${name}`;
    const response = await api.delete(
      this.survey_workspace + "/survey-workspace/" + params,
      {
        headers: {
          Authorization: "Bearer " + this.access_token,
        },
      }
    );
    return response.data;
  }
  async modifySurvey(payload: {}) {
    const response = await api.patch(
      this.survey_workspace + "/survey-workspace/",
      { ...payload, survey_id: this.survey_id },
      {
        headers: {
          Authorization: "Bearer " + this.access_token,
        },
      }
    );
    return response.data;
  }
  async removeBlock(block_id: string, block_type: BlockToolProps) {
    const params = queryString.stringify({
      block_id,
      block_type,
      survey_id: this.survey_id,
    });
    const response = await api.delete(
      this.survey_workspace + "/block-actions/?" + params,
      {
        headers: {
          Authorization: "Bearer " + this.access_token,
        },
      }
    );

    return response.data;
  }
  async blockAction({
    survey_id,
    block_type,
    action,
    block_id,
    id,
  }: {
    survey_id: string;
    block_type: BlockToolProps;
    action: workSpaceAction;
    block_id?: string;
    id?: string;
  }) {
    const response = await api.post(
      this.survey_workspace + "/block-actions/",
      { survey_id, block_type, action, block_id, id },
      {
        headers: {
          Authorization: "Bearer " + this.access_token,
        },
      }
    );

    return response.data;
  }
  async modifyBlock(
    sub_block_id: string | number,
    block_type: BlockToolProps,
    rest_block: {},
    is_required?: boolean,
    is_visible?: boolean,
    block_id?: string | number,
    action_type?:
      | "is_required"
      | "is_visible"
      | "header_or_label"
      | "edit_picture_image"
      | "remove_picture_choice"
      | "add_social_media"
      | "edit_social_media"
      | "remove_social_media",
    question?: string,
    label?: string
  ) {
    const response = await api.patch(
      this.survey_workspace + "/block-actions/",
      {
        block_id,
        block_type,
        is_required,
        is_visible,
        survey_id: this.survey_id,
        sub_block_id,
        action_type,
        question,
        label,
        ...rest_block,
      },
      {
        headers: {
          Authorization: "Bearer " + this.access_token,
        },
      }
    );

    return response.data;
  }
  async addChoices(
    choices: ChoiceOption[],
    id: string,
    action: "ADD_CHOICE",
    survey_id: string,
    block_type: BlockToolProps
  ) {
    const response = await api.post(
      this.survey_workspace + "/block-actions/",
      {
        choices,
        id,
        action,
        survey_id,
        block_type,
      },
      {
        headers: {
          Authorization: "Bearer " + this.access_token,
        },
      }
    );
    return response.data;
  }
  async addDropDownOptions(
    dropdown_options: DropDownOptions[],
    id: string,
    action: "ADD_DROPDOWN_OPTIONS",
    survey_id: string,
    block_type: BlockToolProps
  ) {
    const response = await api.post(
      this.survey_workspace + "/block-actions/",
      {
        dropdown_options,
        id,
        action,
        survey_id,
        block_type,
      },
      {
        headers: {
          Authorization: "Bearer " + this.access_token,
        },
      }
    );
    return response.data;
  }
  async removeChoice(
    survey_id: string,
    block_type: BlockToolProps,
    choice_id: string
  ) {
    const response = await api.post(
      this.survey_workspace + "/block-actions/",
      {
        survey_id,
        block_type,
        choice_id,
        action: "REMOVE_CHOICE",
      },
      {
        headers: {
          Authorization: "Bearer " + this.access_token,
        },
      }
    );

    return response.data;
  }
  async addPictureChoice({
    payload: {
      saturation,
      brightness,
      blur,
      id,
      x,
      y,
      contrast,
      rotationIndex,
      alt_tag,
      name,
      pixelate,
      hue,
      grayscale,
    },
    picture_id,
    survey_id,
    block_type,
  }: {
    payload: Omit<PictureChoiceImages, "url">;
    picture_id: string;
    survey_id: string;
    block_type: BlockToolProps;
  }) {
    const payload = {
      saturation,
      brightness,
      blur,
      alt_tag,
      x,
      y,
      contrast,
      rotationIndex,
      picture_id,
      survey_id,
      block_type,
      name,
      action: "ADD_PICTURE_CHOICE",
      id,
      grayscale,
      hue,
      pixelate,
    };

    const response = await api.post(
      this.survey_workspace + "/block-actions/",
      payload,
      {
        headers: {
          Authorization: "Bearer " + this.access_token,
        },
      }
    );

    return response.data;
  }
  async addImageToPictureChoice({
    block_id,
    block_type,
    id,
    url,
    image,
    action_type,
  }: {
    block_id: string;
    block_type: BlockToolProps;
    id: string;
    url: string;
    image: File;
    action_type: "add_image_to_picture_choice";
  }) {
    const formData = new FormData();
    formData.append("block_id", block_id);
    formData.append("survey_id", this.survey_id);
    formData.append("block_type", block_type);
    formData.append("id", id);
    formData.append("url", url);
    formData.append("image", image);
    formData.append("action_type", action_type);

    const response = await api.patch(
      this.survey_workspace + "/block-actions/",
      formData,
      {
        headers: {
          Authorization: "Bearer " + this.access_token,
        },
      }
    );

    return response.data;
  }
  async changeBlockToPreferred({
    old_block,
    new_block,
  }: {
    old_block: { index: number; block_type: BlockToolProps; id: string };
    new_block: { block_type: BlockToolProps };
  }) {
    const response = await api.patch(
      this.survey_workspace +
        "/change-block-to-preferred/" +
        this.survey_id +
        "/",
      { old_block, new_block },
      {
        headers: {
          Authorization: "Bearer " + this.access_token,
        },
      }
    );

    return response.data;
  }
  async editSurveyDesign(id: string, payload: {}) {
    const response = await api.patch(
      this.survey_workspace + "/edit-survey-design/" + this.survey_id + "/",
      {
        id,
        ...payload,
      },
      {
        headers: {
          Authorization: "Bearer " + this.access_token,
        },
      }
    );

    return response.data;
  }
  async editSurveySettings(id: number, payload: {}) {
    const response = await api.patch(
      this.survey_workspace + "/edit-survey-settings/" + this.survey_id + "/",
      {
        id,
        ...payload,
      },
      {
        headers: {
          Authorization: "Bearer " + this.access_token,
        },
      }
    );

    return response.data;
  }
  async addLastUsedBlock(block_type: BlockToolProps) {
    const response = await api.post(
      this.survey_workspace + `/used-block/${this.survey_id}/`,
      {
        block_type,
      },
      {
        headers: {
          Authorization: "Bearer " + this.access_token,
        },
      }
    );

    return response.data;
  }
  async getLastUsedBlocks() {
    const response = await api.get(
      this.survey_workspace + `/used-block/${this.survey_id}/`,
      {
        headers: {
          Authorization: "Bearer " + this.access_token,
        },
      }
    );

    return response.data;
  }
  async saveLogics(logics: ICustomLogicConditions[]) {
    const response = await api.post(
      this.survey_workspace + `/survey-logics/${this.survey_id}/`,
      { logics },
      { headers: { Authorization: "Bearer " + this.access_token } }
    );

    return response.data;
  }
  async deleteLogics(id: string) {
    const params = `?id=${id}`;
    const response = await api.delete(
      this.survey_workspace + `/survey-logics/${this.survey_id}/${params}`,
      { headers: { Authorization: "Bearer " + this.access_token } }
    );

    return response.data;
  }

  async publishSurvey(password: string, mode: mode, recipients?: string[]) {
    const response = await api.post(
      this.survey_workspace + "/publish-survey/" + this.survey_id + "/",
      {
        password,
        mode,
        recipients,
      },
      {
        headers: {
          Authorization: "Bearer " + this.access_token,
        },
      }
    );
    const res: publishDetails = response.data;
    return res;
  }

  async submitSurvey(userResponses: surveyResponseTypes[], userID: string) {
    const response = await api.post(
      this.survey_workspace + "/survey-response/" + this.survey_id + "/",
      { userResponses, userID }
    );

    return response.data;
  }
}

export class ConnectApps {
  survey_workspace = "/api/v1/surveys";
  access_token = Cookies.get("access_token") ?? "";

  async connect_app(type: integratedApps) {
    const config: AxiosRequestConfig<{}> = {
      headers: {
        Authorization: "Bearer " + this.access_token,
      },
    };

    const response = api.post(
      this.survey_workspace + "/connect-apps/" + type + "/",
      {},
      { ...config }
    );
    return (await response).data;
  }
}
