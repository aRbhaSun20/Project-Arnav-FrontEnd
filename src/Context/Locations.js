import { useQuery } from "react-query";
import { axiosSendGraphQlRequest } from "../util/AxiosRequest";

export const useLocationQuery = () => {
  const { data, refetch: LocationRefetch } = useQuery(
    "location datas",
    async () => {
      const {
        data: { locations },
        errors,
      } = await axiosSendGraphQlRequest({
        query: `query locationData {
          locations{
            _id
            placeName
            coordinates
            userId
          }
      }`,
      });
      return { locations, errors };
    }
  );
  return { data, LocationRefetch };
};
