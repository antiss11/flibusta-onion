const express = require('express');
const cors = require('cors');
const books = require('./lib/search');

const app = express();

app.use(cors());
app.use(express.json());

app.post('/search', async (req, res) => {
	const query = req.body.query;
	const booksData = await books.getInfo(query);
	res.send(booksData);
})

app.listen(3001, () => console.log('express in running'));