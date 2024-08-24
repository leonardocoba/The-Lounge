import React from "react";
import IconButton from "@mui/material/IconButton";
import PresentToAllIcon from "@mui/icons-material/PresentToAll";

export default function DashBoard() {
  const handleScreenShareClick = async () => {
    console.log("Icon clicked!");
  };

  return (
    <div>
      <IconButton aria-label="present" onClick={handleScreenShareClick}>
        <PresentToAllIcon />
      </IconButton>
    </div>
  );
}
