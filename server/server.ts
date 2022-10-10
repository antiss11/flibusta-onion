import express from 'express';
import cors from 'cors';
import {getBookInfo, downloadFile} from './lib/helpers';
import path from 'path';
import bodyParser from 'body-parser';
import { SocksProxyAgent } from 'socks-proxy-agent';

const flibustaOnionOrigin = "http://flibustaongezhld6dibs2dps6vm4nvqg2kp7vgowbu76tzopgnhazqd.onion";
const httpAgent = new SocksProxyAgent("socks5h://127.0.0.1:9050");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/search', async (req, res) => {
  const bookTitle = req.query.book;
  const booksData = await getBookInfo(flibustaOnionOrigin, httpAgent, bookTitle);
  res.send(booksData);
});

app.get('/download/:url', async (req, res) => {
  const url = req.params.url;
  const fileName = await downloadFile(flibustaOnionOrigin, httpAgent, url);
  res.download('public/' + fileName);
});

app.listen(3001, () => console.log('express in running'));