import { useQuery } from "react-query";
import { axiosSendGraphQlRequest } from "../util/AxiosRequest";

export const useLocationQuery = () => {
  const { data, refetch: LocationRefetch } = useQuery(
    "location datas",
    async () => {
      const {
        data: { parents },
        errors,
      } = await axiosSendGraphQlRequest({
        query: `query parentData {
          parents {
            _id
            userId
            parentName
            parentUser {
              name
            }
          }
      }`,
      });
      return { parents, errors };
    }
  );
  return { data, LocationRefetch };
};

export const useParticularLocationQuery = (locationId) => {
  const { data: SelectedLocation, refetch: SelectedLocationRefetch } = useQuery(
    "selected location",
    async () => {
      if (locationId) {
        const {
          data: { location },
          errors,
        } = await axiosSendGraphQlRequest({
          query: `query locationData($locationId:String!) {
          location(_id : $locationId){
            _id
            placeName
            coordinates
            user {
              name
            }
          }
      }`,
          variables: { locationId },
        });
        return { location, errors };
      }
      return {};
    }
  );
  return { SelectedLocation, SelectedLocationRefetch };
};
