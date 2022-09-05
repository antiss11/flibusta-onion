const axios = require('axios');
const FlibustaAPI = require("flibusta").default;
const SocksProxyAgent = require('socks-proxy-agent').SocksProxyAgent;

const ORIGIN = "http://flibustaongezhld6dibs2dps6vm4nvqg2kp7vgowbu76tzopgnhazqd.onion"

const httpAgent = new SocksProxyAgent('socks5h://127.0.0.1:9050');

async function getInfo(bookTitle) {
	const flibustaApi = new FlibustaAPI(ORIGIN, { httpAgent });
	const result = await flibustaApi.getBooksByNameFromOpds(bookTitle);
  const covers64 = [];
  result.forEach(book => {
    const cover64 = getImage(book.cover);
    covers64.push(cover64);
  });
  let books;
  return Promise.all(covers64).then(covers64 => {
    books = result.map((book, i) => {
      return {
        title: book.title,
        author: book.author[0].name,
        downloads: book.downloads,
        cover64: covers64[i],
      }
    });
    return books;
  });
};
