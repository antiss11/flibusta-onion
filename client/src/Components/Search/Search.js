import React from "react";
import { CircularProgress, TextField } from "@mui/material";
import { Button } from "@mui/material";

import "./Search.css";

function Search({ onSubmit, onChange, value, isSearching }) {
  return (
    <>
      <form className="search-form" action="search" onSubmit={onSubmit}>
        <TextField
          onChange={onChange}
          value={value}
          placeholder="Enter book title here"
        />
        <Button
          variant="outlined"
          onClick={onSubmit}
          sx={{ width: "10%" }}
          disabled={isSearching}
        >
          {isSearching ? <CircularProgress /> : "Search"}
        </Button>
      </form>
    </>
  );
}

export default Search;
