const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FlibustaAPI = require("flibusta").default;
const SocksProxyAgent = require('socks-proxy-agent').SocksProxyAgent;


const MIMES = {
  "application/fb2+zip": 'zip',
  "application/html+zip": 'zip',
  "application/x-mobipocket-ebook": 'mobi',
  "application/rtf+zip": 'zip',
  "application/txt+zip": 'zip'
};

const ORIGIN = "http://flibustaongezhld6dibs2dps6vm4nvqg2kp7vgowbu76tzopgnhazqd.onion"

const httpAgent = new SocksProxyAgent('socks5h://127.0.0.1:9050');

async function getInfo(bookTitle) {
	const flibustaApi = new FlibustaAPI(ORIGIN, { httpAgent });
	const result = await flibustaApi.getBooksByNameFromOpds(bookTitle);
  const covers64 = result.map(book => getImage(book.cover));

  return Promise.all(covers64).then(covers64 => {
    return result.map((book, i) => ({...book, 
      cover64: covers64[i],
      downloads: book.downloads.map(downloadInfo => ({
        name: downloadInfo.link.split('/').at(-1), 
        link: new URL(path.join(ORIGIN, downloadInfo.link)),
        extension: MIMES[downloadInfo.type]})),
      author: book.author[0].name,
    }));
  });
}

async function getImage(url) {
  if (url === undefined) return null;
  const response = await axios.get(ORIGIN + url, {
      responseType: 'arraybuffer',
      httpAgent,
    }
  )
  const b64 = await Buffer.from(response.data).toString('base64');
  return b64;
}
