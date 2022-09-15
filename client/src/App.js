import React from "react";
import axios from "axios";
import CyrillicToTranslit from "cyrillic-to-translit-js";

import { Grid, Typography } from "@mui/material";

import Search from "./Components/Search/Search";
import Book from "./Components/Book/Book";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { query: "", books: {}, isSearching: false, hasError: false };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleDownload = this.handleDownload.bind(this);
  }

  async handleSubmit(e) {
    e.preventDefault();
    this.setState({ isSearching: true });
    await this._search();
  }

  handleChange(e) {
    this.setState({ query: e.target.value });
  }

  async _search() {
    try {
      const response = await fetch(
        `http://localhost:3001/search?book=${encodeURI(this.state.query)}`,
        {
          method: "GET",
          redirect: "follow",
        }
      );

      const books = await response.json();

      // Create an object with keys as names (fb2, mobi, etc.)
      const formattedBooksArray = books.map((book) => {
        const downloadsInfo = Object.fromEntries(
          book.downloads.map((downloadInfo) => [
            downloadInfo.name,
            { ...downloadInfo, isDownloading: false },
          ])
        );
        return {
          ...book,
          downloads: downloadsInfo,
        };
      });

      // Creating an object with usage array indexes as ids
      const formattedBooksObj = Object.fromEntries(
        Object.entries(formattedBooksArray)
      );

      this.setState({ books: formattedBooksObj, isSearching: false });
    } catch (err) {
      this.setState({ isSearching: false, hasError: true });
    }
  }

  toggleLinkDownloading(id, linkName) {
    this.setState((prev) => {
      const books = Object.assign(prev.books);
      const isDownloading = books[id].downloads[linkName].isDownloading;
      books[id].downloads[linkName].isDownloading = !isDownloading;
      return {
        ...prev,
        books,
      };
    });
  }

  async handleDownload(e) {
    e.preventDefault();
    const book = e.target.closest(".book");
    const id = book.id;
    const author = book.querySelector(".book__author").textContent;
    const title = book.querySelector(".book__title").textContent;
    const ebookType = e.target.textContent;
    const ext = e.target.dataset.ext;
    const linkName = e.target.textContent;
    this.toggleLinkDownloading(id, linkName);
    const cyrillicToTranslit = new CyrillicToTranslit();
    const fileName = cyrillicToTranslit.transform(
      `${author} ${title} ${ebookType}.${ext}`,
      "_"
    );
    this._download(e.target.href, fileName).then((_) => {
      this.toggleLinkDownloading(id, linkName);
    });
  }

  _download(url, fileName) {
    return new Promise((resolve, reject) => {
      axios
        .get("http://localhost:3001/download/" + encodeURIComponent(url), {
          responseType: "blob",
        })
        .then((res) => {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", fileName);
          document.body.appendChild(link);
          link.click();
          resolve();
        })
        .catch((err) => console.log(err));
    });
  }

  render() {
    const gridItems = Object.keys(this.state.books).map((id) => {
      const { title, cover64, author, downloads } = this.state.books[id];
      return (
        <Grid item sm={12} md={6} lg={3} key={id}>
          <Book
            title={title}
            cover={cover64}
            author={author}
            downloadLinks={downloads}
            handleDownload={this.handleDownload}
            id={id}
          />
        </Grid>
      );
    });

    return (
      <Grid
        container
        spacing={2}
        justifyItems="center"
        justifyContent="center"
        alignItems="center"
        px={7}
      >
        <Grid
          item
          container
          xs={12}
          alignItems="center"
          justifyItems="center"
          justifyContent="center"
        >
          <Search
            onSubmit={this.handleSubmit}
            onChange={this.handleChange}
            value={this.state.value}
            isSearching={this.state.isSearching}
          />
        </Grid>
        {this.state.hasError ? (
          <Typography variant="h3">Oops, something went wrong...</Typography>
        ) : (
          gridItems
        )}
        <Grid item container spacing={5}></Grid>
      </Grid>
    );
  }
}

export default App;
