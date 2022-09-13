import React from "react";
import axios from "axios";

import { Grid } from "@mui/material";

import Search from "./Components/Search/Search";
import Book from "./Components/Book/Book";
import CyrillicToTranslit from "cyrillic-to-translit-js";


class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {query: "", books: []};
		
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleDownload = this.handleDownload.bind(this);
	}

	async handleSubmit(e) {
		e.preventDefault();
		await this._search();
	}

	handleChange(e) {
		this.setState({query: e.target.value});
	}

	async _search() {		
		const response = await fetch('http://localhost:3001/search', {
			method: 'POST',
			redirect: 'follow',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(this.state),
		});

		const books = await response.json();
		this.setState({ books });
	}

	async handleDownload(e) {
			e.preventDefault();		
			const book = e.target.closest('.book');		
			const author = book.querySelector('.book__author').textContent;
			const title = book.querySelector('.book__title').textContent;
			const ebookType = e.target.textContent
			const ext = e.target.dataset.ext;
			const cyrillicToTranslit = new CyrillicToTranslit();
			const fileName = cyrillicToTranslit.transform(`${author} ${title} ${ebookType}.${ext}`, '_');
			await this._download(e.target.href, fileName);
	}	

	async _download(url, fileName) {
		axios.get('http://localhost:3001/download/' + encodeURIComponent(url), {responseType: 'blob'}).then(res => {
			const url = window.URL.createObjectURL(new Blob([res.data]));
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', fileName);
			document.body.appendChild(link);
			link.click();
		}).catch(err => console.log(err));
	}


	render() {
		const gridItems = this.state.books.map(({title, cover64, author, downloads}) => (
			<Grid item xs={4}>
				<Book title={title} cover={cover64} author={author} downloadLinks={downloads} handleDownload={this.handleDownload} />
			</Grid>
		))

		return (
			<Grid container spacing={2} justifyItems="center" alignItems="center" px={7}>
				<Grid item container xs={12} alignItems="center" justifyItems="center">
					<Search onSubmit={this.handleSubmit} onChange={this.handleChange} value={this.state.value}/>
				</Grid>
				<Grid item container spacing={5}>		
					{gridItems}					
				</Grid>
				
			</Grid>
		)
	}
}

export default App;
