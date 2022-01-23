import * as React from "react";
import NavbarAfter from "../../Components/Navbar/NavbarAfter";
import LeftBar from "./LeftBar";
import LocationDetails from "./LocationDetails";

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
            height: "100vh",
            gridTemplateRows: "10vh auto",
          }}
        >
          <NavbarAfter />
          {/* <LocationDetails /> */}
        </div>
      </div>
    </React.Fragment>
  );
}
