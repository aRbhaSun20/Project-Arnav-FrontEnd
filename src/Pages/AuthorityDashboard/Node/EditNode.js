import { Close } from "@mui/icons-material";
import {
  Button,
  IconButton,
  Modal,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocationQuery } from "../../../Context/Locations";
import { axiosSendGraphQlRequest } from "../../../util/AxiosRequest";
import { useSnackbar } from "notistack";

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

function EditNode({ openPopUp, setOpenPopup, selected }) {
  const [placeName, setLocation] = useState("");
  const { LocationRefetch } = useLocationQuery();

  // useEffect(() => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(({ coords }) => {
  //       setCoordinates([coords.latitude, coords.longitude]);
  //     });
  //   }
  // }, []);

  useEffect(() => {
    if (selected?.placeName) setLocation(selected.placeName);
  }, [selected]);

  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async () => {
    try {
      const {
        data: { editLocation },
        errors,
      } = await axiosSendGraphQlRequest({
        query: `mutation editLocation($_id: String, $placeName: String) {
          editLocation( _id:$_id ,placeName: $placeName) {
              _id
              placeName
          }
        }`,
        variables: { placeName, _id: selected?._id },
      });
      if (editLocation) {
        enqueueSnackbar("Location Edited Succesful", { variant: "success" });
        LocationRefetch();
        setOpenPopup(false);
      }

      if (Array.isArray(errors) && errors[0]) {
        enqueueSnackbar(errors[0].message, { variant: "error" });
      }
    } catch {
      enqueueSnackbar("Location Edit Failed", { variant: "error" });
    }
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
            <b>Edit Location</b>{" "}
          </Typography>
          <IconButton
            onClick={() => {
              setOpenPopup(false);
            }}
          >
            <Close />
          </IconButton>
        </div>
        <div style={{ display: "flex", flexFlow: "row wrap", gap: "1rem" }}>
          <TextField
            value={placeName}
            variant="outlined"
            onChange={(e) => setLocation(e.target.value)}
            label="Location Name"
            style={{ width: 400 }}
          />
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

export default EditNode;
