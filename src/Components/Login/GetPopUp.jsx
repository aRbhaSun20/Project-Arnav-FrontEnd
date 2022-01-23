import { Button, Modal, Paper, Typography } from "@mui/material";
import React, { useState } from "react";
import AuthorityPopUp from "./AuthorityPopUp";
import UserPopUp from "./UserPopUp";
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

export default function GetPopUp({ openPopUp, setOpenPopUp }) {
  const [userPopUp, setUserPopUp] = useState(false);
  const [authorityPopUp, setAuthorityPopUp] = useState(false);
  return (
    <React.Fragment>
      <Modal
        open={openPopUp}
        onClose={() => setOpenPopUp(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Paper
          elevation={3}
          sx={style}
          style={{
            display: "flex",
            height: "35vh",
            borderRadius: "1rem",
            width: "auto",
            justifyContent: "space-evenly",
            alignItems: "center",
            flexDirection: "column",
            padding: "2rem 5rem",
          }}
        >
          <Typography style={{ fontSize: 19.2 }}>WHO ARE YOU ?</Typography>
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
              setOpenPopUp(false);
              setUserPopUp(true);
            }}
          >
            Explorers
          </Button>
          <Typography style={{ fontSize: 14.5 }}>OR</Typography>
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
              setOpenPopUp(false);
              setAuthorityPopUp(true);
            }}
          >
            Authority
          </Button>
        </Paper>
      </Modal>
      <UserPopUp openPopUp={userPopUp} setOpenPopUp={setUserPopUp} />
      <AuthorityPopUp openPopUp={authorityPopUp} setOpenPopUp={setAuthorityPopUp} />
    </React.Fragment>
  );
}
