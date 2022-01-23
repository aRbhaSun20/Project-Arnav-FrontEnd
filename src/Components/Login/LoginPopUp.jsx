import { Button, Modal, Paper, TextField, Typography } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import PeopleLogo from "../../assets/people-logo.png";
import { NAV_ACTIONS } from "../../Context/NavigationReducers";

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

export default function LoginPopUp() {
  const history = useNavigate();
  const openPopUp = useSelector((state) => state.navigation);
  const dispatch = useDispatch();
  return (
    <React.Fragment>
      <Modal
        open={openPopUp.loginPopUp}
        onClose={() =>
          dispatch({
            type: NAV_ACTIONS.NAV_CHANGE,
            payload: { loginPopUp: false, loginType: "" },
          })
        }
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Paper
          elevation={3}
          sx={style}
          style={{
            display: "grid",
            gridTemplateRows: "1.2fr 1fr 1fr",
            height: "57vh",
            gridGap: "1rem",
            borderRadius: "1rem",
            width: "25%",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <img src={PeopleLogo} style={{ width: "7rem" }} alt="people-log" />
            <Typography style={{ fontSize: 24, textTransform: "uppercase",textAlign:"center" }}>
              welcome to Arnav as {openPopUp.loginType}
            </Typography>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <TextField
              variant="outlined"
              label="Username"
              style={{ width: 400 }}
            />
            <TextField
              variant="outlined"
              label="Password"
              type="password"
              style={{ width: 400 }}
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
                history(
                  `${
                    openPopUp.loginType === "Explorers"
                      ? "Explorersdashboard"
                      : "authoritydashboard"
                  }`
                );
                dispatch({
                  type: NAV_ACTIONS.NAV_CHANGE,
                  payload: { loginPopUp: false, loginStatus: true },
                });
              }}
            >
              Login
            </Button>
            <Typography style={{ color: "blue" }}>Forget password ?</Typography>
            <Typography>
              Don't have an account ?
              <span style={{ color: "blue" }}>Sign Up</span>
            </Typography>
          </div>
        </Paper>
      </Modal>
    </React.Fragment>
  );
}
