import * as React from "react";
import NavbarAfter from "../../Components/Navbar/NavbarAfter";
import LeftBar from "./LeftBar";
import LocationDetails from "./LocationDetails";
import VideoDetails from "./VideoDetails";

export default function AuthorityDashboard() {
  return (
    <React.Fragment>
      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr" }}>
        <LeftBar />
        <div
          style={{
            backgroundColor: "#F4F4FC",
            display: "grid",
            width: "100%",
            height: "99vh",
            gridTemplateRows: "10vh auto",
          }}
        >
          <NavbarAfter />
          <LocationDetails />
          <VideoDetails />
        </div>
      </div>
    </React.Fragment>
  );
}
