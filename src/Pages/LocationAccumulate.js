import { Button, Typography } from "@mui/material";
import React, { useMemo, useState } from "react";

let timer = null;
let array = [];

const getCoords = async ({ coords }) => {
  console.log(coords);
  array.push(coords);
};
const error = (err) => {
  console.warn("ERROR(" + err.code + "): " + err.message);
};
let locationWatcher = navigator.geolocation.watchPosition(getCoords, error, {
  timeout: 100,
  enableHighAccuracy: false,
  maximumAge: 0,
});
function LocationAccumulate() {
  const [data, setData] = useState([]);
  return (
    <div>
      <Button
        variant="outlined"
        color="primary"
        onClick={() => {
          array = [];
          setData([]);
          locationWatcher = navigator.geolocation.watchPosition(
            getCoords,
            error,
            {
              enableHighAccuracy: true,
              timeout: 1000,
              maximumAge: 0,
            }
          );
        }}
      >
        Start Timer
      </Button>
      <Button
        variant="outlined"
        color="primary"
        onClick={() => {
          setData(
            array.map((ele) => ({
              latitude: ele.latitude,
              longitude: ele.longitude,
            }))
          );
          console.log(array);
          navigator.geolocation.clearWatch(locationWatcher);
        }}
      >
        Stop Timer
      </Button>{" "}
      <Button
        variant="outlined"
        color="primary"
        href={`data:text/json;charset=utf-8,${encodeURIComponent(
          JSON.stringify(data)
        )}`}
        download="filename.json"
      >
        Download
      </Button>
      <div>
        {data.map((ele, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "2rem",
            }}
          >
            <Typography variant="h6">{i + 1}</Typography>
            <Typography>{ele?.latitude}</Typography>
            <Typography>{ele?.longitude}</Typography>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LocationAccumulate;
