import { Button, Modal, Paper, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import QrReader from "react-qr-scanner";
import { useParticularLocationQuery } from "../../../Context/Locations";

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
  const [result, setResult] = useState("");
  const { SelectedLocation, SelectedLocationRefetch } =
    useParticularLocationQuery(result);
  const { enqueueSnackbar } = useSnackbar();

  const handleScan = (data) => {
    if (data && data.text) {
      // console.log(JSON.parse(data.text))
      // const formatData = JSON.parse(data.text);
      if (result !== data.text) {
        setResult(data.text);
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

  useEffect(() => {
    if (result) SelectedLocationRefetch();
    // eslint-disable-next-line
  }, [result]);

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
              <Typography>
                {JSON.stringify(SelectedLocation?.location)}
              </Typography>

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
