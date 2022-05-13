import { Button, Modal, Paper, Typography } from "@mui/material";
import React, { useState } from "react";
import QrReader from "react-qr-scanner";

const previewStyle = {
  width: "75rem",
};

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
  // eslint-disable-next-line no-unused-vars
  const [delay, setDelay] = useState(100);
  const [result, setResult] = useState(null);

  const handleScan = (data) => {
    if (data && data.text) setResult(data.text);
  };

  const handleError = (err) => {
    console.error(err);
  };

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
            minWidth: "75rem",
          }}
        >
          {" "}
          {result ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography>{result}</Typography>

              <Button
                variant="contained"
                style={{
                  backgroundColor: "blue",
                  height: 54,
                  width: "13rem",
                  borderRadius: 8,
                  fontWeight: "bold",
                }}
                onClick={() => setResult(null)}
              >
                Retake Results
              </Button>
            </div>
          ) : (
            <QrReader
              delay={delay}
              style={previewStyle}
              onError={handleError}
              onScan={handleScan}
              facingMode="rear"
            />
          )}
        </Paper>
      </Modal>
    </React.Fragment>
  );
}

export default QRPopup;
