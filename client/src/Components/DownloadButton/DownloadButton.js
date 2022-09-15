import React from "react";
import { Button, CircularProgress } from "@mui/material";

function DownloadButton({ text, onClick, href, extension, isDownloading }) {
  return (
    <Button
      href={href}
      onClick={onClick}
      data-ext={extension}
      disabled={isDownloading}
      sx={{ width: "3rem" }}
    >
      {isDownloading ? <CircularProgress size="1rem" /> : text}
    </Button>
  );
}

export default DownloadButton;
