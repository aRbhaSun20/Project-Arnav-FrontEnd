import React, { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import { AddBox, Delete, Edit, Info, ReadMore } from "@mui/icons-material";
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
import AddVideos from "./AddVideo";
import { useVideoQuery } from "../../Context/Video";
import EditVideos from "./EditVideo";
import DeleteVideos from "./DeleteVideo";
import { axiosSendRequest, AXIOS_ACTIONS } from "../../util/AxiosRequest";

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

export default function VideoDetails() {
  const classes = useStyles();
  const { data } = useVideoQuery();
  const [openAddVideo, setOpenAddVideo] = useState(false);
  const [selected, setSelected] = useState({ _id: "" });
  const [openEditVideo, setOpenEditVideo] = useState(false);
  const [openDeleteVideo, setOpenDeleteVideo] = useState(false);

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
              <Typography variant="h6">Video Details</Typography>
              <IconButton>
                <Info />
              </IconButton>
            </div>
            <IconButton
              className={classes.iconBtnStyles}
              justifyContent="flex-end"
              onClick={() => {
                setOpenAddVideo(true);
              }}
              style={{ background: "blue" }}
            >
              <Tooltip title="Add Videos">
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
                  gridTemplateColumns: "repeat(4,1fr)",
                  width: "100%",
                }}
              >
                <TableCell style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                  Video
                </TableCell>
                <TableCell style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                  Place Name
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
              {data?.videos?.map((row, i) => (
                <TableRow
                  key={row.name}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4,1fr)",
                    width: "100%",
                    backgroundColor: i % 2 === 0 ? "#f1f1f1" : null,
                  }}
                >
                  <VideoImage filename={row.filename} />
                  <TableCell>{row.placeName}</TableCell>
                  <TableCell>{row.status}</TableCell>
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
                        setOpenEditVideo(true);
                      }}
                    >
                      <Tooltip title="Edit Video">
                        <Edit style={{ fonSize: "1.5rem" }} />
                      </Tooltip>
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        setSelected(row);
                        setOpenDeleteVideo(true);
                      }}
                      style={{ width: "3.5rem", height: "3.5rem" }}
                    >
                      <Tooltip title="Delete Video">
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
      <AddVideos openPopUp={openAddVideo} setOpenPopup={setOpenAddVideo} />
      <EditVideos
        openPopUp={openEditVideo}
        setOpenPopup={setOpenEditVideo}
        selected={selected}
      />
      <DeleteVideos
        openPopUp={openDeleteVideo}
        setOpenPopup={setOpenDeleteVideo}
        selected={selected}
      />
    </React.Fragment>
  );
}

const VideoImage = ({ filename }) => {
  // eslint-disable-next-line no-unused-vars
  const [imageData, setImageData] = useState(null);
  // const arrayBufferToBase64 = (buffer) => {
  //   var binary = "";
  //   var bytes = [].slice.call(new Uint8Array(buffer));
  //   bytes.forEach((b) => (binary += String.fromCharCode(b)));
  //   return window.btoa(binary);
  // };

  useEffect(() => {
    console.log(filename);
    if (filename) {
      axiosSendRequest(
        AXIOS_ACTIONS.GET,
        null,
        `https://arnav-backend.herokuapp.com/getVideo?videoId=b28298a1d39c6804632fcdb43f37eba6.png`
      ).then((res) => {
        // const data = `data:image/jpeg;base64, ${arrayBufferToBase64(res)}`;
        // console.log(data)
        // setImageData(URL.createObjectURL(res));
      });
    }
  }, [filename]);

  return (
    <React.Fragment>
      {imageData && <img src={imageData} alt="video-ele" />}
    </React.Fragment>
  );
};
