import { useQuery } from "react-query";
import { useSelector } from "react-redux";
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

export const useNodeParentQuery = () => {
  const location = useSelector((state) => state.location);
  const { data: ParentNodeData, refetch: ParentNodeRefetch } = useQuery(
    "node parent data",
    async () => {
      if (location.parentId) {
        const {
          data: { getParentNodes },
          errors,
        } = await axiosSendGraphQlRequest({
          query: `query nodeParentData($parentId: String!) {
          getParentNodes(parentId: $parentId) {
            _id
            userId
            placeName
            parent{
              parentName
            }
            coordinates
            imageUrl
          }
      }`,
          variables: {
            parentId: location.parentId,
          },
        });
        return { getParentNodes, errors };
      }
      return {};
    }
  );
  return { ParentNodeData, ParentNodeRefetch };
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

export const BfsSearchQuery = () => {
  const location = useSelector((state) => state.location);
  const { data: BfsData, refetch: NodeRefetch } = useQuery(
    "bfs data",
    async () => {
      if (location.fromId && location.toId) {
        const {
          data: { path },
          errors,
        } = await axiosSendGraphQlRequest({
          query: `query BfsSearchQuery($sourceId: String!, $destinationId:String!){
            path(sourceId:$sourceId , destinationId: $destinationId) {
              neighborsData {
                _id
              }
            }
        }`,
          variables: {
            sourceId: location.fromId,
            destinationId: location.toId,
          },
        });

        return { path, errors };
      }
      return null;
    }
  );

  return { BfsData, NodeRefetch };
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
