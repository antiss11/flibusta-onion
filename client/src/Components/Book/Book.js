import React from "react";
import { ButtonGroup, Button, Card, CardActions, CardMedia } from "@mui/material";
import {Typography} from "@mui/material";
import {CircularProgress} from "@mui/material";
import coverPlaceholder from "../../images/cover-placeholder.svg";

const cardStyles = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
}

function Book({title, cover, author, downloadLinks, handleDownload}) {
  const linksNames = [];
  const urls = [];

  for (const [linkName, linkInfo] of Object.entries(downloadLinks)) {
    linksNames.push(linkName);
    urls.push(linkInfo.url);
  }
  
  const downloadButtons = linksNames.map((linkName, i) => (
    <Button href={urls[i]} onClick={handleDownload}>{linkName}</Button>
  ));

  
  cover = (cover === null) ? coverPlaceholder : `data:image/jpg;base64, ${cover}`;
  
  return (
    <Card className="book" sx={cardStyles} px={3}>
      <CardMedia component="img" src={cover} sx={{maxWidth: "250px", width: 'auto'}}/>
      <Typography className="book__title" align="center" sx={{marginTop: 'auto'}}>{title}</Typography>
      <Typography className="book__author" align="center">{author}</Typography>
      <CardActions>
        <ButtonGroup variant="outlined">
          {downloadButtons}
        </ButtonGroup>
      </CardActions>
    </Card>
  )
}

export default Book;