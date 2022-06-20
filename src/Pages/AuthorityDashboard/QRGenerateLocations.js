import { Close } from "@mui/icons-material";
import { Button, IconButton, Modal, Paper, Typography } from "@mui/material";
import React, { useRef } from "react";
import { useSnackbar } from "notistack";
import { useQRCode } from "react-qrcode";
import logo from "./logo2.jpeg";
import { exportComponentAsPNG } from "react-component-export-image";

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

function QRGenerateLocations({ openPopUp, setOpenPopup, selected, type }) {
  const { enqueueSnackbar } = useSnackbar();
  const qrRef = useRef();

  const handleSubmit = async () => {
    if (qrRef.current) {
      exportComponentAsPNG(qrRef, { fileName: selected.placeName });
      enqueueSnackbar(`${type} QR code Download successful`, {
        variant: "success",
      });
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
            <b>Generate {type} QR Code</b>{" "}
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
          {selected._id && (
            <QRComponent
              ref={qrRef}
              data={`${selected.parentId},${selected?._id}`}
              placeName={selected?.placeName}
            />
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

const QRComponent = React.forwardRef(({ data, placeName }, ref) => {
  const dataUrl = useQRCode(data);
  return (
    <div
      ref={ref}
      style={{
        background: "#67d139",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "1.5rem",
        gap: ".5rem",
        border: "4px solid",
      }}
    >
      <img src={logo} style={{ width: "12rem" }} />
      <Typography
        style={{
          fontWeight: "bold",
          fontSize: "2rem",
          textTransform: "uppercase",
          color: "black",
          letterSpacing: "2px",
        }}
      >
        {placeName}
      </Typography>
      <img
        src={dataUrl}
        style={{ width: "18rem", border: "4px solid" }}
        alt="qr-codes"
      />
    </div>
  );
});
