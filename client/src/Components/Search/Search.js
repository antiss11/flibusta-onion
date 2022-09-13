import React from "react";
import { TextField } from "@mui/material";
import { Button } from "@mui/material";

import "./Search.css";

function Search({ onSubmit, onChange, value }) {
  return (
    <>
      <form className="search-form" action="search" onSubmit={onSubmit}>
        <TextField
          onChange={onChange}
          value={value}
          placeholder="Enter book title here"
        />
        <Button variant="outlined" onClick={onSubmit}>
          Search
        </Button>
      </form>
    </>
  );
}

export default Search;
