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
import { useSelector } from "react-redux";

const iconPopups = [
  darkBluePopUp,
  orangePopUp,
  lightbluePopUp,
  greenPopUp,
  redPopUp,
];

// eslint-disable-next-line
const MapComponent = ({ icon, markerPos, details, imageUrl, parent, _id }) => {
  // eslint-disable-next-line
  const map = useMap();
  const MarkerRef = useRef();
  const [show, SetShow] = useState(true);
  const { fromId, toId, selected } = useSelector((state) => state.location);

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

  useEffect(() => {
    if (MarkerRef.current) {
      if (_id === selected) {
        map.flyTo(markerPos, map.getZoom());
        MarkerRef.current.openPopup();
      } else {
        MarkerRef.current.closePopup();
      }
    }
    // eslint-disable-next-line
  }, [selected]);

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
                  margin: "0",
                  color: fromId === _id ? "blue" : toId === _id && "red",
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
            {show && (
              <div
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={imageUrl}
                    alt="parent connected node"
                    style={{
                      width: "3.5rem",
                      height: "3.5rem",
                      borderRadius: "2rem",
                    }}
                  />
                </div>
                <div style={{ display: "grid", gap: ".5rem" }}>
                  <Typography
                    style={{
                      fontSize: "1.4rem",
                      margin: 0,
                      fontWeight: "bold",
                    }}
                  >
                    {details.value}
                  </Typography>
                  <Typography style={{ fontSize: ".85rem", margin: 0 }}>
                    {parent?.parentName}
                  </Typography>
                </div>
              </div>
            )}
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
                {...action}
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
