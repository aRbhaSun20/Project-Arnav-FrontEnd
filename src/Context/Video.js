import { useQuery } from "react-query";
import { axiosSendGraphQlRequest } from "../util/AxiosRequest";

export const useVideoQuery = () => {
  const { data, refetch: VideoRefetch } = useQuery("video datas", async () => {
    const {
      data: { videos },
      errors,
    } = await axiosSendGraphQlRequest({
      query: `query videoData {
          videos{
            _id
            filename
            uploadDate
            length
            chunkSize
            contentType
          }
      }`,
    });
    return { videos, errors };
  });
  return { data, VideoRefetch };
};

export const useParticularVideoQuery = (locationId) => {
  const { data: SelectedVideo, refetch: SelectedVideoRefetch } = useQuery(
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
  return { SelectedVideo, SelectedVideoRefetch };
};
