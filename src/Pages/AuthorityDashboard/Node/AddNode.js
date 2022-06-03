import { Close } from "@mui/icons-material";
import {
  Button,
  IconButton,
  Modal,
  Paper,
  TextField,
  Typography,
  Input,
  Box,
  CircularProgress,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocationQuery } from "../../../Context/Locations";
import { axiosSendGraphQlRequest } from "../../../util/AxiosRequest";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";
import { storage } from "../../../util/firebaseconfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { green } from "@mui/material/colors";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

function AddNode({ openPopUp, setOpenPopup }) {
  const [placeName, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState(null);
  const [coordinates, setCoordinates] = useState([]);
  const { LocationRefetch } = useLocationQuery();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        setCoordinates([coords.latitude, coords.longitude]);
      });
    }
  }, []);

  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = () => {
    try {
      if (!loading) setLoading(true);
      const imageRef = ref(storage, files.name);
      const uploadTask = uploadBytesResumable(imageRef, files);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = snapshot.bytesTransferred / snapshot.totalBytes;
          if (progress === 1) {
            setLoading(false);
            enqueueSnackbar("File uploaded successfully ", {
              variant: "success",
            });
          }
        },
        (error) => {
          console.log(error.message);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            createLocation(url);
          });
        }
      );
    } catch {
      enqueueSnackbar("Location Image Creation Failed", { variant: "error" });
    }
  };

  const createLocation = async (dataUrl) => {
    try {
      const {
        data: { addLocation },
        errors,
      } = await axiosSendGraphQlRequest({
        query: `mutation addLocation($placeName: String, $coordinates: [Float], $userId: String) {
          addLocation( placeName: $placeName, coordinates: $coordinates, userId: $userId) {
              _id
              placeName
          }
        }`,
        variables: { placeName, coordinates, userId: user._id },
      });
      if (addLocation) {
        enqueueSnackbar("Location Created Succesful", { variant: "success" });
        LocationRefetch();
        setOpenPopup(false);
      }
      if (Array.isArray(errors) && errors[0]) {
        enqueueSnackbar(errors[0].message, { variant: "error" });
      }
    } catch {
      enqueueSnackbar("Location Creation Failed", { variant: "error" });
    }
  };

  const handleChange = (e) => {
    setFiles(e.target.files[0]);
  };

  return (
    <Modal
      open={openPopUp}
      onClose={() => {
        setOpenPopup(false);
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Paper
        elevation={3}
        sx={style}
        style={{
          display: "grid",
          gridGap: "1rem",
          borderRadius: "1rem",
          width: "max-content",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #e1e1e1",
            paddingBottom: ".5rem",
          }}
        >
          <Typography variant="h5">
            <b>Add Locations</b>{" "}
          </Typography>
          <IconButton
            onClick={() => {
              setOpenPopup(false);
            }}
          >
            <Close />
          </IconButton>
        </div>
        <div style={{ display: "flex", flexFlow: "row wrap", gap: "1rem" }}>
          <TextField
            value={placeName}
            variant="outlined"
            onChange={(e) => setLocation(e.target.value)}
            label="Location Name"
            style={{ width: 400 }}
          />
          <Input type="file" onChange={handleChange} />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            gap: "2rem",
          }}
        >
          <Button
            variant="outlined"
            style={{
              backgroundColor: "blue",
              height: 54,
              width: "17rem",
              borderRadius: 8,
              color: "white",
              fontWeight: "bold",
            }}
            onClick={() => {
              setOpenPopup(false);
            }}
          >
            Cancel
          </Button>
          <Box sx={{ m: 1, position: "relative" }}>
            <Button
              variant="contained"
              disabled={loading}
              style={{
                backgroundColor: loading ? "lightgrey" : "blue",
                height: 54,
                width: "17rem",
                borderRadius: 8,
                color: "white",
                fontWeight: "bold",
              }}
              onClick={handleSubmit}
            >
              Accept terms
            </Button>
            {loading && (
              <CircularProgress
                size={36}
                sx={{
                  color: green[500],
                  position: "absolute",
                  top: "40%",
                  left: "50%",
                  marginTop: "-12px",
                  marginLeft: "-12px",
                }}
              />
            )}
          </Box>
        </div>
      </Paper>
    </Modal>
  );
}

export default AddNode;
