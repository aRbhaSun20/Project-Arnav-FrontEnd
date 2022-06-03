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

const previewStyle = {
  width: "65rem",
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
  const [options, setOptions] = useState("rear");
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
            <React.Fragment>
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
                    handleScan(result?.text);
                  }

                  if (!!error) {
                    handleError(error);
                  }
                }}
                style={previewStyle}
              />
              <TextField
                select
                onChange={(e) => {
                  setOptions(e.target.value);
                }}
                value={options}
              >
                <MenuItem value="rear">
                  <ListItemText primary={"rear"} />
                </MenuItem>
                <MenuItem value="front">
                  <ListItemText primary={"front"} />
                </MenuItem>
              </TextField>
            </React.Fragment>
          )}
        </Paper>
      </Modal>
    </React.Fragment>
  );
}

export default QRPopup;
