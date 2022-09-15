import React from "react";
import {
  ButtonGroup,
  Button,
  Card,
  CardActions,
  CardMedia,
  Typography,
} from "@mui/material";

import coverPlaceholder from "../../images/cover-placeholder.svg";
import DownloadButton from "../DownloadButton/DownloadButton";

const cardStyles = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
};

function Book({ title, cover, author, downloadLinks, handleDownload, id }) {
  const downloadButtons = Object.values(downloadLinks).map((value, i) => (
    <DownloadButton
      text={value.name}
      onClick={handleDownload}
      href={value.link}
      extension={value.extension}
      key={i}
      isDownloading={value.isDownloading}
    />
  ));

  const coverImg =
    cover === null ? coverPlaceholder : `data:image/jpg;base64, ${cover}`;

  return (
    <Card className="book" sx={cardStyles} px={3} id={id}>
      <CardMedia
        component="img"
        src={coverImg}
        sx={{ maxWidth: "250px", width: "auto" }}
      />
      <Typography
        className="book__title"
        align="center"
        sx={{ marginTop: "auto" }}
        variant="h6"
      >
        {title}
      </Typography>
      <Typography className="book__author" align="center" variant="string">
        {author}
      </Typography>
      <CardActions>
        <ButtonGroup size="small" variant="outlined">
          {downloadButtons}
        </ButtonGroup>
      </CardActions>
    </Card>
  );
}

export default Book;
