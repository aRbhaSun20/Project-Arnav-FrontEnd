import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import {
  AddBox,
  Delete,
  Edit,
  Info,
  ReadMore,
} from "@mui/icons-material";
import {
  AppBar,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useLocationQuery } from "../../../Context/Locations";
import AddLocations from "./AddLocations";
import EditLocations from "./EditLocations";
import DeleteLocations from "./DeleteLocations";

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
    display: "flex",
    alignItems: "center",
  },
  paper: {
    display: "flex",
  },
  table: {
    borderBottom: "none",
    // marginLeft: '1rem'
  },
  icons: {
    display: "flex",
    alignItems: "center",
    marginTop: "1rem",
  },
  iconBtnStyles: {
    background: "blue",
    margin: "0.2rem",
  },
  modalButtons: {
    fontFamily: "Titillium Web",
    textTransform: "none",
    borderRadius: "3rem",
    marginLeft: "1rem",
    color: "black",
    backgroundImage: "linear-gradient(to right,#F98A5C,#FEAA7B)",
  },
}));

export default function LocationDetails() {
  const classes = useStyles();
  const { LocationData } = useLocationQuery();
  const [openAddLocation, setOpenAddLocation] = useState(false);
  const [selected, setSelected] = useState({ _id: "" });
  const [openEditLocation, setOpenEditLocation] = useState(false);
  const [openDeleteLocation, setOpenDeleteLocation] = useState(false);

  return (
    <React.Fragment>
      <Paper
        elevation={8}
        style={{
          width: "98%",
          margin: "0 auto",
          borderRadius: "1rem",
          height: "min-content",
          marginBottom: "2rem",
        }}
      >
        <AppBar
          style={{ zIndex: "1", borderRadius: "1rem" }}
          position="relative"
          color="default"
          elevation={0}
        >
          <Toolbar>
            <div className={classes.title}>
              <Typography variant="h6">Location Details</Typography>
              <IconButton>
                <Info />
              </IconButton>
            </div>
            <IconButton
              className={classes.iconBtnStyles}
              justifyContent="flex-end"
              onClick={() => {
                setOpenAddLocation(true);
              }}
              style={{ background: "blue" }}
            >
              <Tooltip title="Add Locations">
                <AddBox style={{ fill: "white" }} />
              </Tooltip>
            </IconButton>
          </Toolbar>
        </AppBar>
        <TableContainer
          component={Paper}
          style={{
            margin: "1rem",
            width: "98%",
            maxHeight: "54vh",
            overflow: "auto",
          }}
        >
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow
                style={{
                  display: "grid",
                  gridTemplateColumns: "10rem repeat(5,1fr)",
                  width: "100%",
                }}
              >
                <TableCell
                  align="center"
                  style={{ fontSize: "1.2rem", fontWeight: "bold" }}
                >
                  Image
                </TableCell>
                <TableCell style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                  User created
                </TableCell>{" "}
                <TableCell style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                  Source
                </TableCell>
                <TableCell style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                  Parent Name
                </TableCell>
                <TableCell style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                  Request Status
                </TableCell>
                <TableCell style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {LocationData?.locations?.map((row, i) => (
                <TableRow
                  key={i}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "10rem repeat(5,1fr)",
                    width: "100%",
                    backgroundColor: i % 2 === 0 ? "#f1f1f1" : null,
                  }}
                >
                  <TableCell align="center">
                    {row?.imageUrl && (
                      <img
                        src={row?.imageUrl}
                        style={{ width: "3rem", height: "3rem" }}
                        alt="location-img"
                      />
                    )}
                  </TableCell>
                  <TableCell>{row?.user?.name}</TableCell>
                  <TableCell>{row?.source?.placeName}</TableCell>
                  <TableCell>{row?.parent?.parentName}</TableCell>
                  <TableCell>{row?.status}</TableCell>
                  <TableCell
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4,1fr)",
                      width: "75%",
                    }}
                  >
                    <IconButton
                      style={{ width: "3.5rem", height: "3.5rem" }}
                      onClick={() => {
                        setSelected(row);
                        setOpenEditLocation(true);
                      }}
                    >
                      <Tooltip title="Edit Location">
                        <Edit style={{ fonSize: "1.5rem" }} />
                      </Tooltip>
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        setSelected(row);
                        setOpenDeleteLocation(true);
                      }}
                      style={{ width: "3.5rem", height: "3.5rem" }}
                    >
                      <Tooltip title="Delete Location">
                        <Delete style={{ fontSize: "1.5rem" }} />
                      </Tooltip>
                    </IconButton>
                    <IconButton style={{ width: "3.5rem", height: "3.5rem" }}>
                      <Tooltip title="View More">
                        <ReadMore style={{ fontSize: "1.5rem" }} />
                      </Tooltip>
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <AddLocations
        openPopUp={openAddLocation}
        setOpenPopup={setOpenAddLocation}
      />
      <EditLocations
        openPopUp={openEditLocation}
        setOpenPopup={setOpenEditLocation}
        selected={selected}
      />
      <DeleteLocations
        openPopUp={openDeleteLocation}
        setOpenPopup={setOpenDeleteLocation}
        selected={selected}
      />{" "}
    </React.Fragment>
  );
}
