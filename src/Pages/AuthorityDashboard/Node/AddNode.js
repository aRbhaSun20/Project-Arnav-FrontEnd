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
  MenuItem,
  ListItemText,
} from "@mui/material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNodeQuery, useParentQuery } from "../../../Context/Locations";
import { axiosSendGraphQlRequest } from "../../../util/AxiosRequest";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";
import { storage } from "../../../util/firebaseconfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { green } from "@mui/material/colors";
import { v4 as uuidV4 } from "uuid";
import ImageCapture from "react-image-data-capture";
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
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
  const [placeName, setLocation] = useState({
    placeName: "",
    parentId: "",
  });
  const [loading, setLoading] = useState(false);
  const [coordinates, setCoordinates] = useState([]);
  const { NodeRefetch } = useNodeQuery();
  const user = useSelector((state) => state.user);
  const [choice, setChoice] = useState("file");
  const [imgSrc, setImgSrc] = useState(null);
  const { ParentData } = useParentQuery();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        setCoordinates([coords.latitude, coords.longitude]);
      });
    }
  }, []);

  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = () => {
    if (imgSrc) {
      try {
        if (!loading) setLoading(true);
        const fileName = `${uuidV4()}.${getType(imgSrc.type)}`;
        const imageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(imageRef, imgSrc);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = snapshot.bytesTransferred / snapshot.totalBytes;
            if (progress === 1) {
              setLoading(false);
              enqueueSnackbar("File uploaded successfully", {
                variant: "success",
              });
            }
          },
          (error) => {
            console.log(error.message);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((url) => {
              createLocation(url, fileName);
              console.log(url);
            });
          }
        );
      } catch {
        enqueueSnackbar("Location Image Creation Failed", { variant: "error" });
      }
    } else {
      createLocationNOUrl();
    }
  };

  const createLocation = async (dataUrl, fileName) => {
    try {
      const {
        data: { addNodes },
        errors,
      } = await axiosSendGraphQlRequest({
        query: `mutation addNodes($placeName: String, $userId: String, $dataUrl: String, $fileName: String, $coordinates: [Float],$parentId: String) {
          addNodes( placeName: $placeName, imageUrl: $dataUrl, userId: $userId, fileName: $fileName, coordinates: $coordinates parentId: $parentId) {
              _id
              placeName
          }
        }`,
        variables: {
          ...placeName,
          userId: user._id,
          dataUrl,
          fileName,
          coordinates,
        },
      });
      if (addNodes) {
        enqueueSnackbar("Node Created Succesful", { variant: "success" });
        NodeRefetch();
        setOpenPopup(false);
      }
      if (Array.isArray(errors) && errors[0]) {
        enqueueSnackbar(errors[0].message, { variant: "error" });
      }
    } catch {
      enqueueSnackbar("Node Creation Failed", { variant: "error" });
    }
  };

  const createLocationNOUrl = async () => {
    try {
      const {
        data: { addNodes },
        errors,
      } = await axiosSendGraphQlRequest({
        query: `mutation addNodes($placeName: String, $userId: String, $coordinates: [Float] $parentId: String) {
          addNodes( placeName: $placeName,  userId: $userId,  coordinates: $coordinates, parentId: $parentId) {
              _id
              placeName
          }
        }`,
        variables: {
          ...placeName,
          userId: user._id,
          coordinates,
        },
      });
      if (addNodes) {
        enqueueSnackbar("Node Created Succesful", { variant: "success" });
        NodeRefetch();
        setOpenPopup(false);
      }
      if (Array.isArray(errors) && errors[0]) {
        enqueueSnackbar(errors[0].message, { variant: "error" });
      }
    } catch {
      enqueueSnackbar("Node Creation Failed", { variant: "error" });
    }
  };

  const handleChange = (e) => {
    setImgSrc(e.target.files[0]);
  };

  const onCapture = (imageData) => {
    // read as file
    const blob = imageData.blob;
    blob.name = uuidV4();
    blob.lastModified = new Date();

    const file = new File([blob], blob.name, {
      type: blob.type,
    });
    setImgSrc(file);
    enqueueSnackbar("Image Capture Successful", {
      variant: "success",
    });
  };

  // Use useCallback to avoid unexpected behaviour while rerendering
  const onError = useCallback((error) => {
    console.log(error);
  }, []);

  // Use useMemo to avoid unexpected behaviour while rerendering
  const config = useMemo(() => ({ video: true }), []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocation((state) => ({ ...state, [name]: value }));
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
            <b>Add Node Details</b>{" "}
          </Typography>
          <IconButton
            onClick={() => {
              setOpenPopup(false);
            }}
          >
            <Close />
          </IconButton>
        </div>
        <div style={{ display: "flex", flexFlow: "column", gap: "1rem" }}>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "space-between",
            }}
          >
            <TextField
              value={placeName.placeName}
              variant="outlined"
              name="placeName"
              onChange={handleInputChange}
              label="Node Name"
              style={{ width: "100%" }}
            />
            <TextField
              value={placeName.parentId}
              variant="outlined"
              name="parentId"
              onChange={handleInputChange}
              label="Parent Name"
              select
              style={{ width: "100%" }}
              SelectProps={{ MenuProps }}
            >
              {ParentData?.parents?.map((row, i) => (
                <MenuItem key={i} value={row?._id}>
                  <ListItemText primary={row?.parentName} />
                </MenuItem>
              ))}
            </TextField>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              onClick={() => {
                setChoice("file");
              }}
              style={{
                backgroundColor: "blue",
                height: 54,
                width: "17rem",
                borderRadius: 8,
                color: "white",
                fontWeight: "bold",
              }}
            >
              Choose file
            </Button>
            <Button
              onClick={() => {
                setChoice("image");
              }}
              style={{
                backgroundColor: "blue",
                height: 54,
                width: "17rem",
                borderRadius: 8,
                color: "white",
                fontWeight: "bold",
              }}
            >
              Click Image
            </Button>
          </div>
          {imgSrc ? (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <img
                src={URL.createObjectURL(imgSrc)}
                alt="parent-img"
                style={{ width: 300, margin: "auto" }}
              />
              <Button
                variant="contained"
                color="primary"
                style={{
                  backgroundColor: "blue",
                  height: 54,
                  width: "17rem",
                  borderRadius: 8,
                  color: "white",
                  fontWeight: "bold",
                }}
                onClick={() => {
                  setImgSrc(null);
                }}
              >
                Retry
              </Button>
            </div>
          ) : choice === "file" ? (
            <Input type="file" onChange={handleChange} />
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ImageCapture
                onCapture={onCapture}
                onError={onError}
                width={300}
                userMediaConfig={config}
              />
            </div>
          )}
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
              Submit
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

const getType = (data) => {
  const types = data.split("/").reverse();
  return types[0];
};
