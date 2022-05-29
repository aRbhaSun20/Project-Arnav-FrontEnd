import { Close } from "@mui/icons-material";
import {
  Button,
  IconButton,
  Modal,
  Paper,
  Input,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocationQuery } from "../../Context/Locations";
import { axiosSendGraphQlRequest } from "../../util/AxiosRequest";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

function AddVideos({ openPopUp, setOpenPopup }) {
  const [placeName, setLocation] = useState({});
  const [coordinates, setCoordinates] = useState(null);
  const { LocationRefetch } = useLocationQuery();
  const user = useSelector((state) => state.user);

  // useEffect(() => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(({ coords }) => {
  //       setCoordinates([coords.latitude, coords.longitude]);
  //     });
  //   }
  // }, []);

  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async () => {
    try {
      console.log(URL.toString(placeName));
      const {
        data: { addVideo },
        errors,
      } = await axiosSendGraphQlRequest({
        query: `mutation addVideo($placeName: String) {
          uploadVideo( filename: $placeName) {
            filename
          }
        }`,
        variables: { placeName: URL.toString(placeName) },
      });
      console.log(addVideo);
      // if (addLocation) {
      //   enqueueSnackbar("Location Created Succesful", { variant: "success" });
      //   LocationRefetch();
      //   setOpenPopup(false);
      // }

      // if (Array.isArray(errors) && errors[0]) {
      //   enqueueSnackbar(errors[0].message, { variant: "error" });
      // }
    } catch {
      enqueueSnackbar("Location Creation Failed", { variant: "error" });
    }
  };

  const handleCHange = (e) => {
    console.log(typeof e.target.files[0]);
    setLocation(e.target.files[0]);
  };

  return (
    <Modal
      open={openPopUp}
      onClose={() => {
        setOpenPopup(false);
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Paper
        elevation={3}
        sx={style}
        style={{
          display: "grid",
          gridGap: "1rem",
          borderRadius: "1rem",
          width: "max-content",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #e1e1e1",
            paddingBottom: ".5rem",
          }}
        >
          <Typography variant="h5">
            <b>Add Video</b>{" "}
          </Typography>
          <IconButton
            onClick={() => {
              setOpenPopup(false);
            }}
          >
            <Close />
          </IconButton>
        </div>
        {coordinates && <img src={coordinates} />}
        <div style={{ display: "flex", flexFlow: "row wrap", gap: "1rem" }}>
          <Input type="file" onChange={handleCHange} />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            gap: "2rem",
          }}
        >
          <Button
            variant="outlined"
            style={{
              backgroundColor: "blue",
              height: 54,
              width: "17rem",
              borderRadius: 8,
              color: "white",
              fontWeight: "bold",
            }}
            onClick={() => {
              setOpenPopup(false);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="outlined"
            style={{
              backgroundColor: "blue",
              height: 54,
              width: "17rem",
              borderRadius: 8,
              color: "white",
              fontWeight: "bold",
            }}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </div>
      </Paper>
    </Modal>
  );
}

export default AddVideos;
