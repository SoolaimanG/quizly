import { api } from "./api";
import Cookies from "js-cookie";

const access_token = Cookies.get("access_token") ?? "";

export class NotificationsApi {
  async get_notifications() {
    const response = await api.get("/api/v1/notifications/", {
      headers: {
        Authorization: "Bearer " + access_token,
      },
    });

    return response.data;
  }

  async mark_notification_as_read(id: string) {
    const response = await api.patch(
      "/api/v1/notifications/",
      { id },
      { headers: { Authorization: "Bearer " + access_token } }
    );

    return response.data;
  }

  async mark_all_as_read() {
    const response = await api.post(
      "/api/v1/notifications/",
      {},
      { headers: { Authorization: "Bearer " + access_token } }
    );

    return response.data;
  }
}
