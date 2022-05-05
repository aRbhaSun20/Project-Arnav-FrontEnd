import request, { gql } from "graphql-request";
import { useQuery } from "react-query";
import { AXIOS_ACTIONS } from "../util/AxiosRequest";

export const useLoginQuery = (loginData) => {
  return useQuery(
    ["post", loginData],
    async () => {
      if (loginData.status) {
        const { login } = await request(
          AXIOS_ACTIONS.URL,
          gql`
            mutation {
                login(user:"${loginData.name}",password:"${loginData.password}") {
                    _id
                    name
                    email
                    age
                  }
            }
                    `
        );
        return login;
      }
    },
    {
      enabled: !!loginData.name && !!loginData.password,
    }
  );
};
