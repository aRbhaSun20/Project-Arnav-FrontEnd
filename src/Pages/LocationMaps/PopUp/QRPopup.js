import { Button, IconButton, Modal, Paper, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import React, { useMemo, useState } from "react";
import { useParentQuery } from "../../../Context/Locations";
import { QrReader } from "react-qr-reader";
import { Close } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { LOCATION_ACTIONS } from "../../../Context/LocationReducers";

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

function QRPopup({ openPopUp, setOpenPopup }) {
  // const [selected, setSelected] = useState("user");
  const [result, setResult] = useState("62a0c0a0b27facdafb24fae2");

  const { ParentData } = useParentQuery();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const handleScan = (data) => {
    if (data && data.text) {
      if (result !== data.text) {
        console.log(data.text);
        setResult(data.text);
        dispatch({
          type: LOCATION_ACTIONS.ADD_LOCATION,
          payload: { parentId: data.text },
        });
        enqueueSnackbar("location fetched from QR succesfully", {
          variant: "success",
        });
      } else {
        enqueueSnackbar("error in QR code", {
          variant: "error",
        });
      }
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  const parentSelectedData = useMemo(() => {
    if (result && ParentData && Array.isArray(ParentData?.parents)) {
      const data = ParentData?.parents?.find((ele) => ele?._id === result);
      if (data) return data;
    }
    return {};
  }, [result, ParentData]);

  return (
    <React.Fragment>
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
            height: "92vh",
            minWidth: "55rem",
            gridTemplateRows: "3rem 1fr",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid #d1d1d1",
            }}
          >
            <Typography variant="h6">
              <b>QR Scanner for parent or Location Codes</b>
            </Typography>
            <IconButton onClick={() => setOpenPopup(false)}>
              <Close />
            </IconButton>
          </div>

          {result ? (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <div style={{ display: "flex", justifyContent: "space-around" }}>
                {parentSelectedData && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1.5rem",
                    }}
                  >
                    <Typography variant="h5">
                      <b>Parent Details</b>
                    </Typography>
                    <div
                      style={{
                        display: "flex",
                        gap: "1rem",
                        flexDirection: "column",
                        width: "max-content",
                        maxWidth: "35rem",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "1rem",
                        }}
                      >
                        <Typography>
                          <b>Place Name:</b>
                        </Typography>
                        <Typography>
                          {parentSelectedData?.parentName}
                        </Typography>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: "1rem",
                        }}
                      >
                        <Typography>
                          <b>Place Description:</b>
                        </Typography>
                        <Typography>
                          {parentSelectedData?.parentName}
                        </Typography>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: "1rem",
                        }}
                      >
                        <Typography>
                          <b>User Created:</b>
                        </Typography>
                        <Typography>
                          {parentSelectedData?.parentUser?.name}
                        </Typography>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "1rem",
                        }}
                      >
                        <Typography>
                          <b> Parent Image:</b>
                        </Typography>
                        <img
                          style={{ width: "100%", height: "25rem" }}
                          src={parentSelectedData?.parentImageUrl}
                          alt="parent-location"
                        />
                      </div>
                    </div>
                  </div>
                )}
                {parentSelectedData && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1.5rem",
                    }}
                  >
                    <Typography variant="h5">
                      <b>Source Details</b>
                    </Typography>
                    <div
                      style={{
                        display: "flex",
                        gap: "1rem",
                        flexDirection: "column",
                        width: "max-content",
                        maxWidth: "35rem",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "1rem",
                        }}
                      >
                        <Typography>
                          <b>Source Name:</b>
                        </Typography>
                        <Typography>
                          {parentSelectedData?.parentName}
                        </Typography>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: "1rem",
                        }}
                      >
                        <Typography>
                          <b>Source Description:</b>
                        </Typography>
                        <Typography>
                          {parentSelectedData?.parentName}
                        </Typography>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: "1rem",
                        }}
                      >
                        <Typography>
                          <b>User Created:</b>
                        </Typography>
                        <Typography>
                          {parentSelectedData?.parentUser?.name}
                        </Typography>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "1rem",
                        }}
                      >
                        <Typography>
                          <b>Source Image:</b>
                        </Typography>
                        <img
                          style={{ width: "100%", height: "25rem" }}
                          src={parentSelectedData?.parentImageUrl}
                          alt="parent-location"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: "3rem", margin: "auto" }}>
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: "blue",
                    height: 54,
                    width: "13rem",
                    borderRadius: 8,
                    fontWeight: "bold",
                  }}
                  onClick={() => setResult("")}
                >
                  Retake Results
                </Button>
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: "blue",
                    height: 54,
                    width: "13rem",
                    borderRadius: 8,
                    fontWeight: "bold",
                  }}
                  onClick={() => setOpenPopup(false)}
                >
                  Confirm Results
                </Button>
              </div>
            </div>
          ) : (
            <div
              style={{
                height: "90%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <QrReader
                onResult={(result, error) => {
                  if (!!result) {
                    handleScan(result);
                  }

                  if (!!error) {
                    handleError(error);
                  }
                }}
                constraints={{ facingMode: "environment" }}
                containerStyle={{ width: "80%" }}
                style={{ width: "90%" }}
              />
            </div>
          )}
          {/* <TextField
            select
            label="Camera Type"
            onChange={(e) => setSelected(e.target.value)}
          >
            <MenuItem value="user">
              <ListItemText primary="Front Camera" />
            </MenuItem>
            <MenuItem value="environment">
              <ListItemText primary="Rear Camera" />
            </MenuItem>
          </TextField> */}
        </Paper>
      </Modal>
    </React.Fragment>
  );
}

export default QRPopup;
