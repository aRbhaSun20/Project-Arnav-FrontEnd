import { Button, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useReactMediaRecorder } from "react-media-recorder";

function VideoHandler({ handleVideoChange, neighId }) {
  const {
    status,
    startRecording,
    stopRecording,
    mediaBlobUrl,
    previewStream,
    clearBlobUrl,
    pauseRecording,
    resumeRecording,
  } = useReactMediaRecorder({ video: true, audio: false });

  const [videoStatus, setVideoStatus] = useState({
    startStop: false,
  });
  const [videoPlayStatus, setVideoPlayStatus] = useState({
    pauseResume: false,
  });

  useEffect(() => {
    if (mediaBlobUrl && !videoStatus.startStop) {
      saveFile();
    }
    // eslint-disable-next-line 
  }, [mediaBlobUrl]);

  const saveFile = async () => {
    const mediaBlob = await fetch(mediaBlobUrl).then((response) =>
      response.blob()
    );
    handleVideoChange(mediaBlob, neighId);
  };

  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <Typography
        style={{
          fontSize: "1.3rem",
          textTransform: "uppercase",
        }}
      >
        Live Stream :<b style={{ color: getCOlor(status) }}> {status}</b>
      </Typography>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button
          variant="contained"
          style={{
            backgroundColor: videoStatus.startStop ? "red" : "green",
            height: 54,
            width: "11rem",
            borderRadius: 8,
            color: "white",
            fontWeight: "bold",
          }}
          onClick={() => {
            if (videoStatus.startStop) {
              stopRecording();
            } else {
              startRecording();
            }
            setVideoStatus((state) => ({
              startStop: !state.startStop,
            }));
          }}
        >
          {!videoStatus.startStop ? "Start" : "Stop"} Recording
        </Button>
        {videoStatus.startStop && (
          <Button
            variant="contained"
            style={{
              backgroundColor: videoPlayStatus.pauseResume
                ? "orange"
                : "lightgreen",
              height: 54,
              width: "11rem",
              borderRadius: 8,
              color: "white",
              fontWeight: "bold",
            }}
            onClick={() => {
              if (videoPlayStatus.pauseResume) {
                resumeRecording();
              } else {
                pauseRecording();
              }
              setVideoPlayStatus((state) => ({
                pauseResume: !state.pauseResume,
              }));
            }}
          >
            {!videoPlayStatus.pauseResume ? "Pause" : "Resume"}
            Recording
          </Button>
        )}
        {mediaBlobUrl && !videoStatus.startStop && (
          <Button
            variant="contained"
            style={{
              backgroundColor: "gray",
              height: 54,
              width: "11rem",
              borderRadius: 8,
              color: "white",
              fontWeight: "bold",
            }}
            onClick={() => {
              if (!videoStatus.startStop) {
                stopRecording();
                handleVideoChange(null, neighId);
                clearBlobUrl();
                if (videoPlayStatus.pauseResume)
                  setVideoPlayStatus({
                    pauseResume: false,
                  });
              }
            }}
          >
            Reset
          </Button>
        )}
      </div>
      <div style={{ margin: "auto" }}>
        {videoStatus.startStop ? (
          <VideoPreview stream={previewStream} />
        ) : mediaBlobUrl ? (
          <video src={mediaBlobUrl} controls width={400} />
        ) : null}
      </div>
    </div>
  );
}

export default VideoHandler;

const VideoPreview = ({ stream }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  if (!stream) {
    return null;
  }
  return <video ref={videoRef} autoPlay width={400} />;
};

const getCOlor = (status) => {
  if (status === "recording") return "green";
  if (status === "idle") return "orange";
  return "Red";
};
