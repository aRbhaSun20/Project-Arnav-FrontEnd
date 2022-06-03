import {
  Button,
  Modal,
  Paper,
  Typography,
  TextField,
  MenuItem,
  ListItemText,
} from "@mui/material";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useParticularLocationQuery } from "../../../Context/Locations";
import { QrReader } from "react-qr-reader";

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
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState("");
  const [result, setResult] = useState("");
  const { SelectedLocation, SelectedLocationRefetch } =
    useParticularLocationQuery(result);
  const { enqueueSnackbar } = useSnackbar();

  const handleScan = (data) => {
    if (data && data.text) {
      // console.log(JSON.parse(data.text))
      // const formatData = JSON.parse(data.text);
      if (result !== data.text) {
        console.log(data.text);
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
    if (!result)
      navigator.mediaDevices.enumerateDevices().then((res) => {
        const devices = [];
        res.forEach((dev) => {
          if (dev.kind === "videoinput") {
            devices.push(dev);
          }
        });
        setOptions(devices);
      });
  }, [result]);

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
            <div style={{height:"90%"}}>
              {/* <QrReader
                delay={delay}
                style={previewStyle}
                onError={handleError}
                onScan={handleScan}
                facingMode={options}
              /> */}{" "}
              <QrReader
                onResult={(result, error) => {
                  if (!!result) {
                    handleScan(result);
                  }

                  if (!!error) {
                    handleError(error);
                  }
                }}containerStyle={{width:"60%"}}
                constraints={{ deviceId: selected }}
                style={{width:"90%"}}
              />
              <TextField
                select
                onChange={(e) => {
                  setSelected(e.target.value);
                }}
                value={options}
              >
                {options.map((opt, i) => (
                  <MenuItem value={opt.deviceId} key={i}>
                    <ListItemText primary={opt.label} />
                  </MenuItem>
                ))}
              </TextField>
            </div>
          )}
        </Paper>
      </Modal>
    </React.Fragment>
  );
}

export default QRPopup;
