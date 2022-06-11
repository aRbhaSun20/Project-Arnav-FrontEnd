import React, { useEffect, useMemo, useRef, useState } from "react";
import Leaflet from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { IconButton, Typography } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { useNodeParentQuery } from "../../Context/Locations";
import "./MapAnalytics.css";

import darkBluePopUp from "./darkblue.svg";
import orangePopUp from "./orange.svg";
import lightbluePopUp from "./lightblue.svg";
import greenPopUp from "./green.svg";
import redPopUp from "./red.svg";

const iconPopups = [
  darkBluePopUp,
  orangePopUp,
  lightbluePopUp,
  greenPopUp,
  redPopUp,
];

// eslint-disable-next-line
const MapComponent = ({ icon, markerPos, details, id }) => {
  // eslint-disable-next-line
  const map = useMap();
  const MarkerRef = useRef();
  const [show, SetShow] = useState(true);

  // const MapAnalyticsPopUp = useSelector((state) => state.MapAnalyticsPopUps);

  const iconLocation = new Leaflet.icon({
    iconUrl: icon,
    iconRetinaUrl: icon,
    iconAnchor: [10, 40],
    popupAnchor: [0, -20],
    shadowSize: [68, 95],
    shadowAnchor: [22, 94],
    iconSize: new Leaflet.Point(25, 75),
    className: "leaflet-div-icon",
  });

  // useEffect(() => {
  //   if (MarkerRef.current) {
  //     if (
  //       id === MapAnalyticsPopUp.currentPopUp["Invoice Number"] &&
  //       MapAnalyticsPopUp.hover
  //     ) {
  //       map.flyTo(markerPos, map.getZoom());
  //       MarkerRef.current.openPopup();
  //     } else {
  //       MarkerRef.current.closePopup();
  //     }
  //   }
  //   // eslint-disable-next-line
  // }, [MapAnalyticsPopUp]);

  return (
    markerPos && (
      <Marker position={markerPos} ref={MarkerRef} icon={iconLocation}>
        <Popup autoClose={false}>
          <div
            style={{
              display: "grid",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  height: "1rem",
                }}
              >
                {details.key}
              </Typography>
              <IconButton
                style={{ transform: `rotate(${show ? 0 : 180}deg)` }}
                className="expandButtonMap"
                onClick={() => {
                  SetShow((state) => !state);
                }}
              >
                <ExpandMore />
              </IconButton>
            </div>

            <Typography
              style={{ textAlign: "center", display: show ? "none" : "block" }}
            >
              {details.value}
            </Typography>
          </div>
        </Popup>
      </Marker>
    )
  );
};

export default function LocationMapContainer() {
  const position = [51.505, -0.09];
  const { ParentNodeData } = useNodeParentQuery();

  // eslint-disable-next-line
  const [markerPos, setMarkerPos] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        setMarkerPos([coords.latitude, coords.longitude]);
      });
    }
  }, []);

  const data = useMemo(() => {
    if (ParentNodeData && Array.isArray(ParentNodeData.getParentNodes))
      return ParentNodeData.getParentNodes;
    return [];
  }, [ParentNodeData]);

  return (
    <React.Fragment>
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          flexDirection: "column",
          position: "relative",
        }}
      >
        <MapContainer
          center={position}
          zoom={8}
          scrollWheelZoom={true}
          style={{
            width: "100%",
            height: "100%",
            overflow: "hidden",
            position: "absolute",
            zIndex: 90,
          }}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {data.map((action, i) => (
            <React.Fragment key={i}>
              <MapComponent
                icon={iconPopups[i % iconPopups.length]}
                markerPos={action?.coordinates}
                details={{
                  key: "Place Name :",
                  value: action.placeName,
                }}
                id={action?._id}
              />
              {/* {MapAnalyticsPopUp.currentPopUp["Invoice Number"] ===
                action["Invoice Number"] &&
                action.delivered_to_lat_lon &&
                action.sold_by_lat_lon && (
                  <Polyline
                    pathOptions={{
                      color: "blue",
                      dashArray: "16 8",
                    }}
                    positions={[
                      action.delivered_to_lat_lon,
                      action.sold_by_lat_lon,
                    ]}
                  />
                )} */}
            </React.Fragment>
          ))}
          <StartUp />
        </MapContainer>
      </div>
    </React.Fragment>
  );
}

const StartUp = () => {
  const map = useMap();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        map.flyTo([coords.latitude, coords.longitude], map.getZoom());
      });
    } // eslint-disable-next-line
  }, []);
  return null;
};
