import { Paper, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { LOCATION_ACTIONS } from "../../Context/LocationReducers";

export default function LocationBox({ placeName, parent, _id, imageUrl }) {
  const { fromId, toId } = useSelector((state) => state.location);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const handleCLick = () => {
    if (_id !== fromId && _id !== toId) {
      dispatch({
        type: LOCATION_ACTIONS.ADD_LOCATION,
        payload: { toId: _id, selected: _id },
      });
      enqueueSnackbar("selected is Destination Node ", {
        variant: "success",
      });
    } else {
      dispatch({
        type: LOCATION_ACTIONS.ADD_LOCATION,
        payload: { selected: _id },
      });
    }
  };

  return (
    <React.Fragment>
      <Paper
        elevation={5}
        style={{
          height: "11vh",
          display: "grid",
          gridTemplateColumns: "1fr 5fr 1fr",
          placeContent: "center",
          borderBottom: "1px solid lightgray",
          cursor: "pointer",
          padding: "1rem",
          gap: "1rem",
          borderRadius: "1rem",
          border:
            _id === fromId ? "4px solid blue" : _id === toId && "4px solid red",
          position: "relative",
        }}
        onClick={handleCLick}
      >
        {_id === fromId && (
          <Typography
            style={{
              position: "absolute",
              fontSize: ".9rem",
              right: 0,
              margin: ".5rem",
              color: "blue",
            }}
          >
            <b>Source</b>
          </Typography>
        )}{" "}
        {_id === toId && (
          <Typography
            style={{
              position: "absolute",
              fontSize: ".9rem",
              right: 0,
              margin: ".5rem",
              color: "red",
            }}
          >
            <b>Destination</b>
          </Typography>
        )}
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
            style={{ width: "3.5rem", height: "3.5rem", borderRadius: "2rem" }}
          />
        </div>
        <div style={{ display: "grid", textAlign: "start", rowGap: ".4rem" }}>
          <Typography style={{ fontSize: "1.4rem", fontWeight: "bold" }}>
            {placeName}
          </Typography>

          <Typography style={{ fontSize: ".85rem" }}>
            {parent?.parentName}
          </Typography>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            flexDirection: "column",
            justifyContent: "center",
            rowGap: ".5rem",
          }}
        >
          <Typography style={{ fontSize: ".95rem", color: "green" }}>
            10 m
          </Typography>
        </div>
      </Paper>
    </React.Fragment>
  );
}
