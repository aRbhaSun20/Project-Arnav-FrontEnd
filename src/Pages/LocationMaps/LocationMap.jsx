import { InputAdornment, Paper } from "@mui/material";
import * as React from "react";
import NavbarAfter from "../../Components/Navbar/NavbarAfter";
import LeftBar from "../AuthorityDashboard/LeftBar";
import { TextField } from "@mui/material";
import { Search } from "@mui/icons-material";
import LocationBox from "./LocationBox";
import LocationMapContainer from "./LocationMapContainer";

export default function LocationMap() {
  return (
    <React.Fragment>
      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr" }}>
        <LeftBar />
        <div
          style={{
            backgroundColor: "#F4F4FC",
            display: "grid",
            width: "100%",
            height: "100vh",
            gridTemplateRows: "10vh auto",
          }}
        >
          <NavbarAfter />
          <Paper
            elevation={3}
            style={{
              width: "98%",
              margin: "0 auto",
              borderRadius: "1rem",
              height: "89vh",
              display: "grid",
              gridTemplateColumns: "1fr 2.5fr",
            }}
          >
            <div
              style={{
                padding: "1rem",
                display: "flex",
                flexDirection: "column",
                rowGap: "1rem",
              }}
            >
              <TextField
                placeholder="Search Location"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                  style: { borderRadius: ".7rem", height: "2.8rem" },
                }}
              />
              <div
                style={{
                  maxHeight: "79vh",
                  overflow: "auto",
                  paddingRight: "1rem",
                  display: "grid",
                  rowGap: "1rem",
                }}
              >
                {new Array(10).fill("").map((ele, i) => (
                  <LocationBox key={i} />
                ))}
              </div>
            </div>
            <div>
              <LocationMapContainer />
            </div>
          </Paper>
        </div>
      </div>
    </React.Fragment>
  );
}
