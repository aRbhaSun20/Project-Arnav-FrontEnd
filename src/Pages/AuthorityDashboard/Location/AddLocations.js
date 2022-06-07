import { Close, ExpandMore } from "@mui/icons-material";
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
  Stepper,
  Step,
  StepLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
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
import { uploadFIles } from "../../../util/firebaseconfig";
import { green } from "@mui/material/colors";
import { v4 as uuidV4 } from "uuid";
import ImageCapture from "react-image-data-capture";
import VideoHandler from "./VideoHandler";

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

const steps = ["Source Details", "Neighbour Details"];

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
const NEIGHBOR_DETAILS = {
  direction: "",
  videoUrl: "",
};
const DIRECTIONS = ["FRONT", "RIGHT", "FRONT"];
function AddLocation({ openPopUp, setOpenPopup }) {
  const [placeName, setLocation] = useState({
    sourceId: "",
    neighborIds: [],
    parentId: "",
    imageUrl: "",
    imageName: "",
  });
  const [loading, setLoading] = useState(false);
  // const [coordinates, setCoordinates] = useState([]);
  const { LocationRefetch } = useLocationQuery();
  const user = useSelector((state) => state.user);
  const [choice, setChoice] = useState("file");
  const [imgSrc, setImgSrc] = useState(null);
  const [activeStep, setActiveStep] = useState(0);

  const [neighborData, setNeighbourData] = useState({});

  const { ParentData } = useParentQuery();
  const { NodeData } = useNodeQuery();

  const [expanded, setExpanded] = useState(false);

  const handleAccChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) =>
      Math.min(prevActiveStep + 1, steps.length)
    );
  };

  const handleInputAccChange = (e, neighId) => {
    const { name, value, files } = e.target;
    if (name === "inpFIle") {
      setNeighbourData((state) => ({
        ...state,
        [neighId]: { ...validataData(state[neighId]), videoData: files[0] },
      }));
    } else {
      setNeighbourData((state) => {
        const data = {
          ...state,
          [neighId]: { ...validataData(state[neighId]), [name]: value },
        };
        return { ...data };
      });
    }
  };

  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = () => {
    try {
      setLoading(true);
      if (imgSrc) uploadFIles(imgSrc, handleLocationImage);
    } catch {
      enqueueSnackbar("File creation failed", { variant: "error" });
    }
  };

  const handleVideoSubmit = async (dataUrl, videoName, neighId) => {
    setNeighbourData((state) => {
      const data = {
        ...state,
        [neighId]: {
          ...validataData(state.neighId),
          videoUrl: dataUrl,
          videoName,
        },
      };
      console.log(data);
      return { ...data };
    });
    enqueueSnackbar("Video File upload Successful", { variant: "success" });
  };

  const handleLocationImage = async (dataUrl, name) => {
    setLocation((state) => ({ ...state, imageUrl: dataUrl, imageName: name }));
    createLocation({ imageUrl: dataUrl, imageName: name });
  };

  const createLocation = async (data) => {
    try {
      const {
        data: { addLocation },
        errors,
      } = await axiosSendGraphQlRequest({
        query: `mutation addLocation($sourceId: String, $userId: String, $imageUrl: String, $imageName: String, $neighborData: String, $parentId: String) {
          addLocation(userId: $userId, sourceId: $sourceId, neighborData: $neighborData, parentId: $parentId, imageUrl: $imageUrl, fileName: $imageName) {
            _id
          }
    }`,
        variables: {
          userId: user._id,
          ...placeName,
          ...data,
          neighborData: JSON.stringify(neighborData),
        },
      });
      if (addLocation) {
        enqueueSnackbar("Location Created Succesful", { variant: "success" });
        LocationRefetch();
        setOpenPopup(false);
        setLocation({
          sourceId: "",
          neighborIds: [],
          parentId: "",
          imageUrl: "",
          imageName: "",
        });
        setNeighbourData({});
        setLoading(false);
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
    console.log(file);
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

  const handleVideoChange = (videoData, neighId) => {
    if (videoData) {
      const name = uuidV4();

      const file = new File([videoData], name, {
        type: "video/mp4",
      });
      setNeighbourData((state) => {
        const data = {
          ...state,
          [neighId]: { ...validataData(state.neighId), videoData: file },
        };
        console.log(data);
        return { ...data };
      });
    }
  };

  const uploadFileIndi = (neighKey) => {
    if (neighborData[neighKey].videoUrl) {
      enqueueSnackbar("Video Already uploaded", { variant: "error" });
    } else {
      if (neighborData[neighKey].videoData) {
        uploadFIles(
          neighborData[neighKey].videoData,
          handleVideoSubmit,
          neighKey
        );
      } else {
        enqueueSnackbar("Video File upload failed", { variant: "error" });
      }
    }
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
          width: "51rem",
          height: "",
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
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, i) => (
            <Step key={label} onClick={() => setActiveStep(i)}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 ? (
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
        ) : (
          <div style={{ display: "grid", gap: "1rem" }}>
            {placeName.neighborIds.map((neighbor, i) => (
              <Accordion
                expanded={expanded === i}
                onChange={handleAccChange(i)}
                key={i}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                >
                  <Typography
                    sx={{ width: "33%", flexShrink: 0, fontSize: "1.3rem" }}
                  >
                    <b>{findData(neighbor)?.placeName}</b>
                  </Typography>
                </AccordionSummary>
                <AccordionDetails
                  style={{ display: "flex", flexFlow: "column", gap: "1rem" }}
                >
                  <TextField
                    value={neighborData[neighbor]?.direction}
                    variant="outlined"
                    name="direction"
                    onChange={(e) => handleInputAccChange(e, neighbor)}
                    label="Direction Neighbour Node"
                    SelectProps={{ MenuProps }}
                    select
                    style={{ width: 400 }}
                  >
                    {DIRECTIONS.map((row, i) => (
                      <MenuItem key={i} value={row}>
                        <ListItemText primary={row} />
                      </MenuItem>
                    ))}
                  </TextField>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Button
                      onClick={() => {
                        setChoice("file");
                      }}
                      style={{
                        backgroundColor: "blue",
                        height: 54,
                        width: "12rem",
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
                        width: "12rem",
                        borderRadius: 8,
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      Click Video
                    </Button>
                    <Button
                      onClick={() => {
                        uploadFileIndi(neighbor);
                      }}
                      style={{
                        backgroundColor: "blue",
                        height: 54,
                        width: "12rem",
                        borderRadius: 8,
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      Upload Video
                    </Button>
                  </div>
                  {choice === "file" ? (
                    <Input
                      type="file"
                      name="inpFIle"
                      onChange={(e) => handleInputAccChange(e, neighbor)}
                    />
                  ) : (
                    <VideoHandler
                      handleVideoChange={handleVideoChange}
                      neighId={neighbor}
                    />
                  )}
                </AccordionDetails>
              </Accordion>
            ))}
          </div>
        )}

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
          {activeStep === 0 ? (
            <Button
              variant="contained"
              style={{
                backgroundColor: "blue",
                height: 54,
                width: "17rem",
                borderRadius: 8,
                color: "white",
                fontWeight: "bold",
              }}
              onClick={handleNext}
            >
              Next
            </Button>
          ) : (
            <Box sx={{ m: 1, position: "relative" }}>
              <Button
                variant="contained"
                // disabled={loading}
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
          )}
        </div>
      </Paper>
    </Modal>
  );
}

export default AddLocation;

const validataData = (data) => {
  console.log(data);
  if (data) return data;
  return NEIGHBOR_DETAILS;
};
