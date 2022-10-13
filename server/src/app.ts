import express from 'express';
import cors from 'cors';
import { getBooksInfo, downloadFile } from './lib/helpers';
import bodyParser from 'body-parser';
import { SocksProxyAgent } from 'socks-proxy-agent';

const flibustaOnionOrigin = 'http://flibustaongezhld6dibs2dps6vm4nvqg2kp7vgowbu76tzopgnhazqd.onion';
const httpAgent = new SocksProxyAgent('socks5h://127.0.0.1:9050');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/search', async (req: express.Request, res: express.Response) => {
  const bookTitle = req.query.book as string;
  const booksData = await getBooksInfo(flibustaOnionOrigin, httpAgent, bookTitle);
  res.send(booksData);
});

app.get('/download/:url', async (req: express.Request, res: express.Response) => {
  const url = req.params.url;
  const fileName = await downloadFile(httpAgent, url);
  res.download('public/' + fileName);
});

export default app;