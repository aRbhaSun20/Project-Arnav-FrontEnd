import { LocalPharmacy } from "@mui/icons-material";
import { Paper, Typography } from "@mui/material";
import React from "react";

export default function LocationBox({ placeName, parent, _id, imageUrl }) {
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
        }}
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
            style={{ width: "3.5rem", height: "3.5rem", borderRadius: "2rem" }}
          />
        </div>
        <div style={{ display: "grid", textAlign: "start", rowGap: ".4rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography style={{ fontSize: "1.4rem", fontWeight: "bold" }}>
              {placeName}
            </Typography>{" "}
            <Typography style={{ fontSize: ".8rem", fontWeight: "bold" }}>
              {parent?.name}
            </Typography>
          </div>

          <Typography style={{ fontSize: ".85rem" }}>{placeName}</Typography>
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
