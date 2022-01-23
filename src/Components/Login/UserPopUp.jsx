import { Button, Modal, Paper, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import DateAdapter from "@mui/lab/AdapterLuxon";
import { DatePicker, LocalizationProvider } from "@mui/lab";
import { DateTime } from "luxon";

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

export default function UserPopUp({ openPopUp, setOpenPopUp }) {
  const [currentDate, setCurrentDate] = useState(DateTime.now());
  return (
    <React.Fragment>
      <Modal
        open={openPopUp}
        onClose={() => setOpenPopUp(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Paper
          elevation={3}
          sx={style}
          style={{
            display: "grid",
            gridTemplateRows: "1fr 4fr 2fr",
            height: "60vh",
            gridGap: "1rem",
            borderRadius: "1rem",
            width: "40%",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography style={{ fontSize: 24 }}>User Registration</Typography>
          </div>
          <div
            style={{
              display: "grid",
              justifyContent: "space-around",
              alignItems: "center",
              gridTemplateColumns: "1fr 1fr",
              gridGap: "2rem",
            }}
          >
            <TextField
              variant="outlined"
              label="First Name"
              style={{ width: "100%" }}
            />
            <TextField
              variant="outlined"
              label="Last Name"
              style={{ width: "100%" }}
            />
            <TextField
              variant="outlined"
              label="Phone Number"
              type="number"
              style={{ width: "100%" }}
            />
            <TextField
              variant="outlined"
              label="Email Id"
              type="email"
              style={{ width: "100%" }}
            />
            <LocalizationProvider dateAdapter={DateAdapter}>
              <DatePicker
                label="Date of Birth"
                value={currentDate}
                onChange={(newValue) => {
                  setCurrentDate(newValue);
                }}
                renderInput={(params) => (
                  <TextField {...params} style={{ width: "100%" }} />
                )}
              />
            </LocalizationProvider>
            <TextField
              variant="outlined"
              label="Address"
              style={{ width: "100%" }}
            />
            <TextField
              variant="outlined"
              label="Password"
              type="password"
              style={{ width: "100%" }}
            />
            <TextField
              variant="outlined"
              label="Confirm Password"
              type="password"
              style={{ width: "100%" }}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                width: "75%",
              }}
            >
              <Button
                variant="outlined"
                style={{
                  height: 54,
                  width: "13rem",
                  borderRadius: 8,
                  fontWeight: "bold",
                }}
              >
                Upload Document
              </Button>
              <Button
                variant="contained"
                style={{
                  backgroundColor: "blue",
                  height: 54,
                  width: "13rem",
                  borderRadius: 8,
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                Register
              </Button>
            </div>

            <Typography style={{ fontSize: ".7rem", textAlign: "center" }}>
              Please upload the relevant document for emergency situations for the 
              choice of transport in case of failure ..
              this data will be secure and only used to treat you effectively
            </Typography>
          </div>
        </Paper>
      </Modal>
    </React.Fragment>
  );
}
