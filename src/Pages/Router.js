import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthorityChat from "./AuthorityChat/AuthorityChat";
import AuthorityDashboard from "./AuthorityDashboard/AuthorityDashboard";
import AuthorityHistory from "./AuthorityHistory/AuthorityHistory";
import AuthorityRequest from "./AuthorityRequest/AuthorityRequest";
import Home from "./Home";
import LocationMap from "./LocationMaps/LocationMap";

export default function Router() {
  return (
    <React.Fragment>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="authoritydashboard" element={<AuthorityDashboard />} />
          <Route path="authorityhistory" element={<AuthorityHistory />} />
          <Route path="authorityrequest" element={<AuthorityRequest />} />
          <Route path="authoritychat" element={<AuthorityChat />} />
          <Route path="explorersdashboard" element={<AuthorityDashboard />} />
          <Route path="explorershistory" element={<AuthorityHistory />} />
          <Route path="explorersrequest" element={<AuthorityRequest />} />
          <Route path="explorerschat" element={<AuthorityChat />} />
          <Route path="pharmacyMap" element={<LocationMap />} />
        </Routes>
      </BrowserRouter>
    </React.Fragment>
  );
}
