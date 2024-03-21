import {
  BlockToolProps,
  ChoiceOption,
  DropDownOptions,
  PictureChoiceImages,
  formType,
  workSpaceAction,
} from "../Types/survey.types";
import { api } from "./api";
import Cookies from "js-cookie";
import queryString from "query-string";

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
  async get_survey_details(id: string) {
    const response = await api.get(
      this.survey_workspace + "/survey-blocks/" + id + "/",
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
  async removeBlock(
    survey_id: string,
    block_id: string,
    block_type: BlockToolProps
  ) {
    const params = queryString.stringify({
      block_id,
      block_type,
      survey_id,
    });
    const response = await api.delete(
      this.survey_workspace + "/block-actions?" + params,
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
  }: {
    survey_id: string;
    block_type: BlockToolProps;
    action: workSpaceAction;
    block_id?: string;
  }) {
    const response = await api.post(
      this.survey_workspace + "/block-actions",
      { survey_id, block_type, action, block_id },
      {
        headers: {
          Authorization: "Bearer " + this.access_token,
        },
      }
    );

    return response.data;
  }
  async editBlock(
    block_id: string | number,
    block_type: BlockToolProps,
    rest_block: {},
    is_required?: boolean,
    is_visible?: boolean,
    action_type?:
      | "is_required"
      | "is_visible"
      | "header_or_label"
      | "edit_picture_image"
      | "remove_picture_choice",
    question?: string,
    label?: string
  ) {
    const response = await api.patch(
      this.survey_workspace + "/block-actions",
      {
        block_id,
        block_type,
        is_required,
        is_visible,
        survey_block_id: this.survey_id,
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
      this.survey_workspace + "/block-actions",
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
      this.survey_workspace + "/block-actions",
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
      this.survey_workspace + "/block-actions",
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
      this.survey_workspace + "/block-actions",
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
    formData.append("block_type", block_type);
    formData.append("id", id);
    formData.append("url", url);
    formData.append("image", image);
    formData.append("action_type", action_type);

    const response = await api.patch(
      this.survey_workspace + "/block-actions",
      formData,
      {
        headers: {
          Authorization: "Bearer " + this.access_token,
        },
      }
    );

    return response.data;
  }
}
