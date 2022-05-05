import axios from "axios";

export const AXIOS_ACTIONS = {
  GET: "GET",
  POST: "POST",
  DELETE: "DELETE",
  URL: "https://arnav-backend.herokuapp.com/graphql",
  HEADERS: {
    "Content-Type": "application/json",
  },
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
  REGISTER: "REGISTER",
  START_JOB: "start_job",
  STOP_JOB: "stop_job",

  UPLOAD_DOC: "upload_doc",
  GOOGLE_CLIENT_ID:
    "1046727487005-m1obhsf9u8earvlrd8reamicfirq09id.apps.googleusercontent.com",
  DELETE_USER: "delete_user",
  APPS_ACTIONS: "app_Actions",
};

export const MAILING_ACIONS = {
  USER_ID: "user_e0SxWGpxrSPuSO18sM4vS",
  TEMPLATE_ID: "template_m5x0ym7",
  SERVICE_ID: "service_z9mkz5i",
};

export const axiosSendRequest = async (type, sendData, url) => {
//   let config = {};

  switch (type) {
    case AXIOS_ACTIONS.GET:
    //   config = {
    //     method: "get",
    //     url: `${AXIOS_ACTIONS.URL}`,
    //   };
      break;

    case AXIOS_ACTIONS.POST:
    //   config = {
    //     method: "post",
    //     url: `${AXIOS_ACTIONS.URL}`,
    //     headers: AXIOS_ACTIONS.HEADERS,
    //     data: sendData,
    //   };
      break;

    case AXIOS_ACTIONS.DELETE:
      let formDelete = new FormData();
      formDelete.append("user_id", sendData.user_id);
      formDelete.append("token", sendData.token);
      formDelete.append("name", sendData.name);
    //   config = {
    //     method: "post",
    //     url: `${AXIOS_ACTIONS.URL}`,
    //     data: formDelete,
    //   };
      break;

    default:
      return null;
  }

  const { data } = await axios
    .post(AXIOS_ACTIONS.URL, sendData, AXIOS_ACTIONS.HEADERS)
    .catch((e) => console.error(e));

  return data;
};
