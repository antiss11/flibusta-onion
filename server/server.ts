const express = require('express');
const cors = require('cors');
const helpers = require('./lib/helpers');
const path = require('path');


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/search', async (req, res) => {
	const query = req.body.query;
	const booksData = await helpers.getInfo(query);
	res.send(booksData);
})

app.get('/download/:url', async (req, res) => {
	const url = req.params.url;
	const fileName = await helpers.downloadFile(url);
	res.download('public/' + fileName);
})

app.listen(3001, () => console.log('express in running'));