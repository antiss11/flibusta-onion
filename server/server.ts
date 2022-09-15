const express = require('express');
const cors = require('cors');
const helpers = require('./lib/helpers');
const path = require('path');
const bodyParser = require('body-parser');

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
})

app.get('/download/:url', async (req, res) => {
	const url = req.params.url;
	const fileName = await helpers.downloadFile(url);
	res.download('public/' + fileName);
})

app.listen(3001, () => console.log('express in running'));