import { Close } from "@mui/icons-material";
import { Button, IconButton, Modal, Paper, Typography } from "@mui/material";
import React from "react";
import { useSnackbar } from "notistack";
  // eslint-disable-next-line
import { useQRCode } from "react-qrcode";
import { saveAs } from "file-saver";

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

function QRGenerateLocations({ openPopUp, setOpenPopup, selected }) {
  const { enqueueSnackbar } = useSnackbar();
    // eslint-disable-next-line
  const dataUrl = useQRCode("fr");

  const handleSubmit = async () => {
    saveAs(dataUrl, `${selected?.placeName}.png`);
    enqueueSnackbar("Location QR code Download successful", {
      variant: "success",
    });
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
            <b>Generate Location QR Code</b>{" "}
          </Typography>
          <IconButton
            onClick={() => {
              setOpenPopup(false);
            }}
          >
            <Close />
          </IconButton>
        </div>
        <div
          style={{
            display: "flex",
            flexFlow: "column wrap",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography>
            <b>Download {selected?.placeName} QR Code</b>{" "}
          </Typography>
          {selected._id && (
            <img src={dataUrl} style={{ width: "20rem" }} alt="qr-codes" />
          )}
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
            Download
          </Button>
        </div>
      </Paper>
    </Modal>
  );
}

export default QRGenerateLocations;
