import {
  InputAdornment,
  Paper,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from "@mui/material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import NavbarAfter from "../../Components/Navbar/NavbarAfter";
import LeftBar from "../AuthorityDashboard/LeftBar";
import { TextField } from "@mui/material";
import {
  Directions,
  Explore,
  QrCodeScanner,
  Search,
  ThreeDRotation,
  ViewInAr,
} from "@mui/icons-material";
import LocationBox from "./LocationBox";
import LocationMapContainer from "./LocationMapContainer";
import QRPopup from "./PopUp/QRPopup";
import {
  useLocationQuery,
  useNodeParentQuery,
  useNodeQuery,
} from "../../Context/Locations";
import { useSelector } from "react-redux";
import { bfs } from "../../bfs/bfs";
import ARContainer from "./ARContainer";

const actions = [
  { icon: <QrCodeScanner />, name: "QR Scanner" },
  { icon: <ViewInAr />, name: "Augmented Relaity" },
  { icon: <ThreeDRotation />, name: "3D Maps" },
  { icon: <Directions />, name: "2D Maps" },
];

const LocationMap = () => {
  const [selected, setSelected] = useState("2d");
  const [openQr, setQrPopup] = useState(false);
  const { ParentNodeData, ParentNodeRefetch } = useNodeParentQuery();

  const [search, setSearch] = useState("");
  const { LocationData } = useLocationQuery();
  const { NodeData } = useNodeQuery();

  const location = useSelector((state) => state.location);

  const handleClick = (name) => {
    switch (name) {
      case actions[0].name:
        setQrPopup(true);
        break;
      case actions[1].name:
        setSelected("ar");
        break;
      case actions[2].name:
        setSelected("2d");
        break;
      case actions[3].name:
        setSelected("2d");
        break;
      default:
        break;
    }
  };

  const parentNodes = useMemo(() => {
    if (ParentNodeData && Array.isArray(ParentNodeData.getParentNodes))
      return ParentNodeData.getParentNodes.filter(
        (ele) =>
          ele?.parent?.parentName
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          ele?.placeName?.toLowerCase().includes(search.toLowerCase())
      );
    return [];
  }, [ParentNodeData, search]);

  const getLocationBySource = useCallback(
    (sourceId) => {
      if (Array.isArray(LocationData?.locations)) {
        return LocationData?.locations?.find(
          (location) => location.sourceId === sourceId
        );
      }
    },
    [LocationData]
  );

  const getConnectedPath = useMemo(() => {
    if (
      Array.isArray(LocationData?.locations) &&
      Array.isArray(NodeData?.nodes)
    ) {
      const pathConnected = {};
      NodeData?.nodes.forEach((nodes) => {
        const currentLocation = getLocationBySource(nodes?._id);
        const neighbors = currentLocation
          ? currentLocation?.neighborIds?.map((neigh) => neigh.destinationId)
          : [];
        pathConnected[nodes._id] = {
          _id: nodes?._id,
          neighbors,
        };
      });
      return pathConnected;
    }
  }, [NodeData, LocationData]);

  const getShortestPath = useCallback(() => {
    if (location.fromId && location.toId) {
      const resultPath = getArrayData(
        bfs(location.fromId, location.toId, getConnectedPath)
      );
      if (resultPath) return resultPath;
    }
    return [];
  }, [location.fromId, location.toId, getConnectedPath]);

  useEffect(() => {
    if (location.parentId) {
      ParentNodeRefetch();
    }
  }, [location.parentId]);

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
                onChange={(e) => setSearch(e.target.value)}
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
                  display: "grid",
                  rowGap: "1rem",
                  padding: "1rem",
                }}
              >
                {parentNodes.map((ele, i) => (
                  <LocationBox key={i} {...ele} />
                ))}
              </div>
            </div>
            <div>
              {selected === "2d" ? <LocationMapContainer /> : <ARContainer />}
            </div>
            <SpeedDial
              ariaLabel="SpeedDial basic example"
              sx={{ position: "absolute", bottom: 16, right: 16 }}
              icon={<SpeedDialIcon />}
            >
              {actions.map((action) => (
                <SpeedDialAction
                  key={action.name}
                  icon={action.icon}
                  tooltipTitle={action.name}
                  onClick={() => {
                    handleClick(action.name);
                  }}
                />
              ))}
            </SpeedDial>
          </Paper>
        </div>
      </div>
      <QRPopup openPopUp={openQr} setOpenPopup={setQrPopup} />
    </React.Fragment>
  );
};

export default LocationMap;

const getArrayData = (data) => (Array.isArray(data) ? data.reverse() : null);
