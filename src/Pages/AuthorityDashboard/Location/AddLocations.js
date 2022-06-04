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
  Chip,
  Checkbox,
} from "@mui/material";
import React, { useCallback, useMemo, useState } from "react";
import {
  useLocationQuery,
  useNodeQuery,
  useParentQuery,
} from "../../../Context/Locations";
import { axiosSendGraphQlRequest } from "../../../util/AxiosRequest";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";
import { storage } from "../../../util/firebaseconfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { green } from "@mui/material/colors";
import { v4 as uuidV4 } from "uuid";
import ImageCapture from "react-image-data-capture";

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

function AddLocation({ openPopUp, setOpenPopup }) {
  const [placeName, setLocation] = useState({
    sourceId: "",
    neighborIds: [],
    parentId: "",
  });
  const [loading, setLoading] = useState(false);
  // const [coordinates, setCoordinates] = useState([]);
  const { LocationRefetch } = useLocationQuery();
  const user = useSelector((state) => state.user);
  const [choice, setChoice] = useState("file");
  const [imgSrc, setImgSrc] = useState(null);

  const { ParentData } = useParentQuery();
  const { NodeData } = useNodeQuery();
  // useEffect(() => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(({ coords }) => {
  //       setCoordinates([coords.latitude, coords.longitude]);
  //     });
  //   }
  // }, []);

  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = () => {
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
  };

  const createLocation = async (dataUrl, fileName) => {
    try {
      const {
        data: { addLocation },
        errors,
      } = await axiosSendGraphQlRequest({
        query: `mutation addLocation($placeName: String, $userId: String, $dataUrl: String, $fileName: String) {
          addLocation( parentName: $placeName, parentImageUrl: $dataUrl, userId: $userId, fileName: $fileName) {
              _id
              parentName
          }
        }`,
        variables: { placeName, userId: user._id, dataUrl, fileName },
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
    const { value, name } = e.target;
    setLocation((state) => ({ ...state, [name]: value }));
  };

  const findData = useCallback(
    (data) => {
      const current = NodeData?.nodes.find((ele) => ele?._id === data);
      return current;
    },
    [NodeData]
  );

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
            <b>Add Location Details</b>
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
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <TextField
              value={placeName.sourceId}
              variant="outlined"
              name="sourceId"
              onChange={handleInputChange}
              label="Source Node"
              SelectProps={{ MenuProps }}
              select
              style={{ width: 400 }}
            >
              {NodeData?.nodes?.map((row, i) => (
                <MenuItem key={i} value={row?._id}>
                  <ListItemText primary={row?.placeName} />
                </MenuItem>
              ))}
            </TextField>
            <TextField
              value={placeName.parentId}
              variant="outlined"
              name="parentId"
              onChange={handleInputChange}
              label="Parent Name"
              select
              style={{ width: 400 }}
              SelectProps={{ MenuProps }}
            >
              {ParentData?.parents?.map((row, i) => (
                <MenuItem key={i} value={row?._id}>
                  <ListItemText primary={row?.parentName} />
                </MenuItem>
              ))}
            </TextField>
            <TextField
              value={placeName.neighborIds}
              variant="outlined"
              name="neighborIds"
              onChange={handleInputChange}
              label="Neighbor Nodes"
              select
              SelectProps={{
                multiple: true,
                MenuProps,
                renderValue: (selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={findData(value)?.placeName} />
                    ))}
                  </Box>
                ),
              }}
              style={{ width: 400 }}
            >
              {NodeData?.nodes?.map((row, i) => (
                <MenuItem
                  key={i}
                  disabled={placeName.sourceId === row?._id}
                  value={row?._id}
                  style={{ display: "flex", gap: "1rem" }}
                >
                  <Checkbox
                    checked={placeName.neighborIds.indexOf(row?._id) > -1}
                  />
                  <ListItemText primary={row?.placeName} />
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

export default AddLocation;

const getType = (data) => {
  const types = data.split("/").reverse();
  return types[0];
};
