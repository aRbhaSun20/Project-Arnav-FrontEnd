import { Button, Modal, Paper, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import DateAdapter from "@mui/lab/AdapterLuxon";
import { DatePicker, LocalizationProvider } from "@mui/lab";
import { DateTime } from "luxon";
import { axiosSendRequest, AXIOS_ACTIONS } from "../../util/AxiosRequest";
import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import { USER_ACTIONS } from "../../Context/UserReducers";
import { NAV_ACTIONS } from "../../Context/NavigationReducers";
import { useNavigate } from "react-router";

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
  const [loginData, setLogin] = useState({ name: "", password: "" });
  const dispatch = useDispatch();
  const history = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLogin((state) => ({ ...state, [name]: value }));
  };

  const [currentDate, setCurrentDate] = useState(DateTime.now());
  const handleSubmit = async () => {
    try {
      const { login } = await axiosSendRequest(AXIOS_ACTIONS.POST, {
        query: `mutation updateUserCity($name: String!, $password: String!) {
          signUpUser(name: $name, email: $email, age: $age, password: $password, location: [1, 0]) {
            _id
            name
            age
            email
            password
            token
          }
      }`,
        variables: loginData,
      });
      enqueueSnackbar("Login Succesful", { variant: "success" });
      dispatch({
        type: NAV_ACTIONS.NAV_CHANGE,
        payload: { loginPopUp: false, loginStatus: true, ...login },
      });
      dispatch({
        type: USER_ACTIONS.LOGIN,
        payload: login,
      });
      history(
        `${
          openPopUp.loginType === "Explorers"
            ? "Explorersdashboard"
            : "authoritydashboard"
        }`
      );
    } catch {
      enqueueSnackbar("Login Failed", { variant: "error" });
    }
  };
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
              name=""
              onChange={handleChange}
              style={{ width: "100%" }}
            />
            <TextField
              variant="outlined"
              label="Last Name"
              onChange={handleChange}
              style={{ width: "100%" }}
            />
            <TextField
              variant="outlined"
              label="Phone Number"
              type="number"
              onChange={handleChange}
              style={{ width: "100%" }}
            />
            <TextField
              variant="outlined"
              label="Email Id"
              type="email"
              onChange={handleChange}
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
              onChange={handleChange}
              style={{ width: "100%" }}
            />
            <TextField
              variant="outlined"
              label="Password"
              type="password"
              onChange={handleChange}
              style={{ width: "100%" }}
            />
            <TextField
              variant="outlined"
              label="Confirm Password"
              type="password"
              onChange={handleChange}
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
                onClick={handleSubmit}
              >
                Register
              </Button>
            </div>

            <Typography style={{ fontSize: ".7rem", textAlign: "center" }}>
              Please upload the relevant document for emergency situations for
              the choice of transport in case of failure .. this data will be
              secure and only used to treat you effectively
            </Typography>
          </div>
        </Paper>
      </Modal>
    </React.Fragment>
  );
}
