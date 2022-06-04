import { Close } from "@mui/icons-material";
import {
  Button,
  IconButton,
  Modal,
  Paper,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import React, { useState } from "react";
import { useParentQuery } from "../../../Context/Locations";
import { axiosSendGraphQlRequest } from "../../../util/AxiosRequest";
import { useSnackbar } from "notistack";
import { green } from "@mui/material/colors";
import { storage } from "../../../util/firebaseconfig";
import { ref, deleteObject } from "firebase/storage";

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

function DeleteLocation({ openPopUp, setOpenPopup, selected }) {
  const { ParentRefetch } = useParentQuery();
  const [loading, setLoading] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = () => {
    if (selected.fileName) {
      try {
        if (!loading) setLoading(true);

        const imageRef = ref(storage, selected.fileName);
        deleteObject(imageRef)
          .then(() => {
            deleteParent();
            enqueueSnackbar("File deleted successfully", {
              variant: "success",
            });
          })
          .catch((error) => {
            enqueueSnackbar("FIle Deletion Failed", { variant: "error" });
            console.log(error.message);
          });
      } catch {
        enqueueSnackbar("FIle Deletion Failed", { variant: "error" });
      }
    } else {
      deleteParent();
    }
  };

  const deleteParent = async () => {
    try {
      const {
        data: { deleteParent },
        errors,
      } = await axiosSendGraphQlRequest({
        query: `mutation deleteParent($_id: String!) {
          deleteParent( _id:$_id ) {
              _id
              parentName
          }
        }`,
        variables: { _id: selected?._id },
      });
      if (deleteParent) {
        enqueueSnackbar("Location Delete Succesful", { variant: "success" });
        ParentRefetch();
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
            <b>
              Are you sure you want to delete{" "}
              <span style={{ fontSize: "1.25rem" }}>
                {selected?.parentName}
              </span>{" "}
            </b>
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
          <Box sx={{ m: 1, position: "relative" }}>
            <Button
              variant="outlined"
              disabled={loading}
              style={{
                backgroundColor: loading ? "lightgrey" : "blue",
                height: 54,
                width: "17rem",
                borderRadius: 8,
                color: "white",
                fontWeight: "bold",
              }}
              onClick={handleSubmit}
            >
              Submit
            </Button>{" "}
            {loading && (
              <CircularProgress
                size={36}
                sx={{
                  color: green[500],
                  position: "absolute",
                  top: "40%",
                  left: "50%",
                  marginTop: "-12px",
                  marginLeft: "-12px",
                }}
              />
            )}
          </Box>
        </div>
      </Paper>
    </Modal>
  );
}

export default DeleteLocation;
