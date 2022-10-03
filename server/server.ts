import express from 'express';
import cors from 'cors';
import helpers from './lib/helpers';
import path from 'path';
import bodyParser from 'body-parser';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/search', async (req, res) => {
  const book = req.query.book;
  const booksData = await helpers.getInfo(book);
  res.send(booksData);
});

app.get('/download/:url', async (req, res) => {
  const url = req.params.url;
  const fileName = await helpers.downloadFile(url);
  res.download('public/' + fileName);
});

app.listen(3001, () => console.log('express in running'));