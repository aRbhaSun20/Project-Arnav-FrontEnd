import { useQuery } from "react-query";
import { axiosSendGraphQlRequest } from "../util/AxiosRequest";

export const useParentQuery = () => {
  const { data: ParentData, refetch: ParentRefetch } = useQuery(
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
            fileName
          }
      }`,
      });
      return { parents, errors };
    }
  );
  return { ParentData, ParentRefetch };
};

export const useNodeQuery = () => {
  const { data: NodeData, refetch: NodeRefetch } = useQuery(
    "node datas",
    async () => {
      const {
        data: { nodes },
        errors,
      } = await axiosSendGraphQlRequest({
        query: `query nodesData{
          nodes{
            _id
            imageUrl
            user{
              _id
              name
            }
            placeName
            coordinates
            userId
            fileName
          }
        }`,
      });
      return { nodes, errors };
    }
  );
  return { NodeData, NodeRefetch };
};

export const useLocationQuery = () => {
  const { data: LocationData, refetch: LocationRefetch } = useQuery(
    "location datas",
    async () => {
      const {
        data: { locations },
        errors,
      } = await axiosSendGraphQlRequest({
        query: `{
          locations {
            _id
            user{
              name
            }
            imageUrl
            source{
              placeName
            }
            parent {
              parentName
              parentUser {
                name
                _id
              }
            }
            parentId
            fileName
          }
        }`,
      });
      return { locations, errors };
    }
  );
  return { LocationData, LocationRefetch };
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
