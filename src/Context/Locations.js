import { useQuery } from "react-query";
import { axiosSendGraphQlRequest } from "../util/AxiosRequest";

export const useParentQuery = () => {
  const { data, refetch: ParentRefetch } = useQuery(
    "parent datas",
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
            parentImageUrl
          }
      }`,
      });
      return { parents, errors };
    }
  );
  return { data, ParentRefetch };
};

export const useNodeQuery = () => {
  const { data, refetch: NodeRefetch } = useQuery(
    "node datas",
    async () => {
      const {
        data: { nodes },
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
      return { nodes, errors };
    }
  );
  return { data, NodeRefetch };
};

export const useLocationQuery = () => {
  const { data, refetch: LocationRefetch } = useQuery(
    "location datas",
    async () => {
      const {
        data: { locations },
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
      return { locations, errors };
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
