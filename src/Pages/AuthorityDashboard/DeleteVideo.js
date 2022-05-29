import { Close } from "@mui/icons-material";
import { Button, IconButton, Modal, Paper, Typography } from "@mui/material";
import React from "react";
import { useLocationQuery } from "../../Context/Locations";
import { axiosSendGraphQlRequest } from "../../util/AxiosRequest";
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

function DeleteVideos({ openPopUp, setOpenPopup, selected }) {
  const { LocationRefetch } = useLocationQuery();

  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async () => {
    try {
      const {
        data: { deleteLocation },
        errors,
      } = await axiosSendGraphQlRequest({
        query: `mutation deleteLocation($_id: String!) {
          deleteLocation( _id:$_id ) {
              _id
              placeName
          }
        }`,
        variables: { _id: selected?._id },
      });
      if (deleteLocation) {
        enqueueSnackbar("Location Delete Succesful", { variant: "success" });
        LocationRefetch();
        setOpenPopup(false);
      }

      if (Array.isArray(errors) && errors[0]) {
        enqueueSnackbar(errors[0].message, { variant: "error" });
      }
    } catch {
      enqueueSnackbar("Location delete Failed", { variant: "error" });
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
            <b>Delete Location</b>{" "}
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
          <Typography>
            <b>Are you sure you want to delete {selected?.placeName}</b>
          </Typography>
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

export default DeleteVideos;
