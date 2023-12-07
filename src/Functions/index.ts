//A function to send an email to --->Suleimangee@gmail.com
import { emailJSParams } from "../Types/components.types";
import axios from "axios";

export const sendEmailToDeveloper = async ({
  firstName,
  lastName,
  phoneNumber,
  email,
  message,
}: emailJSParams) => {
  const service_id = import.meta.env.VITE_EmailJSServiceId;
  const template_id = import.meta.env.VITE_EmailJSTemplateId;
  const user_id = import.meta.env.VITE_EmailJSPublicKey;

  //This data is the params to be send to emailJS for processing
  const data = {
    service_id,
    template_id,
    user_id,
    template_params: {
      firstName: firstName || "Unknown",
      lastName: lastName || "Unknown",
      phoneNumber: phoneNumber || "Unknown",
      email,
      message,
    },
  };

  return new Promise(async (resolve, reject) => {
    try {
      const res = await axios.post(
        "https://api.emailjs.com/api/v1.0/email/send",
        data
      );
      return resolve(res.data);
    } catch (error: any) {
      reject(error.message);
    }
  });
};

export const seriliazeParams = (
  data: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
  const { name, value } = data.target;

  return `${name}=${value}`;
};
