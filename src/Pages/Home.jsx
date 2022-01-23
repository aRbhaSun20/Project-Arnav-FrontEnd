import React from "react";
import Navbar from "../Components/Navbar/Navbar.jsx";
import homeSvg from "../assets/high-speed-train.png";
import { Button, Typography } from "@mui/material";
import LoginPopUp from "../Components/Login/LoginPopUp.jsx";
import { useDispatch } from "react-redux";
import { NAV_ACTIONS } from "../Context/NavigationReducers.js";

export default function Home() {
  const dispatch = useDispatch();

  return (
    <React.Fragment>
      <div
        style={{
          backgroundColor: "#F4F4FC",
          display: "grid",
          width: "100vw",
          height: "100vh",
          gridTemplateRows: "10vh auto",
        }}
      >
        <Navbar />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
          <div
            style={{
              display: "grid",
              gridTemplateRows: "1fr .5fr  1.5fr",
              height: "75%",
              margin: "auto",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                width: "90%",
                margin: "auto",
                textAlign: "start",
              }}
            >
              <Typography
                style={{ fontSize: 44, color: "gray", letterSpacing: 3 }}
              >
                Travel Faster Than Ever Before
              </Typography>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                width: "90%",
                textAlign: "start",
                margin: "auto",
              }}
            >
              <Typography
                style={{ width: "60%", fontSize: "1.2rem", color: "#383838" }}
              >
                Welcome to Arnav service platform, travel with ease. Search
                your desired locations right now.
              </Typography>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-around",
                  alignItems: "flex-start",
                  width: "75%",
                  margin: "auto",
                  height: "auto",
                  rowGap: "2rem",
                }}
              >
                <Typography style={{ fontSize: 30, fontWeight: "bold" }}>
                  For Explorers
                </Typography>
                <Typography style={{ fontSize: 18 }}>
                  Users can login here
                </Typography>
                <Button
                  variant="contained"
                  style={{
                    height: 54,
                    width: 230,
                    fontWeight: "bold",
                    borderRadius: 8,
                    backgroundColor: "blue",
                  }}
                  onClick={() =>
                    dispatch({
                      type: NAV_ACTIONS.NAV_CHANGE,
                      payload: { loginPopUp: true, loginType: "Explorers" },
                    })
                  }
                >
                  Login as Explorers
                </Button>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-around",
                  alignItems: "flex-start",
                  width: "50%",
                  margin: "auto",
                  height: "auto",
                  rowGap: "2rem",
                }}
              >
                <Typography style={{ fontSize: 30, fontWeight: "bold" }}>
                  For Authority
                </Typography>
                <Typography style={{ fontSize: 18 }}>
                  Authority can login here
                </Typography>
                <Button
                  variant="contained"
                  style={{
                    height: 54,
                    width: 230,
                    fontWeight: "bold",
                    borderRadius: 8,
                    backgroundColor: "blue",
                  }}
                  onClick={() =>
                    dispatch({
                      type: NAV_ACTIONS.NAV_CHANGE,
                      payload: { loginPopUp: true, loginType: "Authority" },
                    })
                  }
                >
                  Login as Authority
                </Button>
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src={homeSvg}
              style={{ transform: "scaleX(-1)", width: "80%" }}
              alt="home-svg"
            />
          </div>
        </div>
      </div>

      <LoginPopUp />
    </React.Fragment>
  );
}
