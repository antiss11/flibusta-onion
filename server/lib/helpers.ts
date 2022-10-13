import fs from "fs";
import path from "path";
import axios from "axios";
import { URL } from "url";
import FlibustaAPI from "flibusta";
import { SocksProxyAgent } from "socks-proxy-agent";
import mimes from "../types/mimes";
import Book from "../types/book";

async function getBooksInfo(origin: string, httpAgent: SocksProxyAgent, bookTitle: string ): Promise<Array<Book> | null> {
  const flibustaApi = new FlibustaAPI(origin, { httpAgent });
  const result = await flibustaApi.getBooksByNameFromOpds(bookTitle);
  if (result === null || result === undefined) return null;

  // Array of base64 strings represent books covers
  const covers64Promises = result.map((book) => {
    if (book.cover) {
      return getImage(origin, httpAgent, book.cover)}
    }
  );

  const covers64 = await Promise.all(covers64Promises);

  return result.map((book, i) => ({
    description: book.description,
    title: book.title,
    cover64: covers64[i],
    downloads: book.downloads.map((downloadInfo) => ({
      name: downloadInfo.link.split("/").at(-1),
      link: new URL(downloadInfo.link, origin).href,
      extension: mimes[downloadInfo.type],
    })),
    author: book.author[0].name,
  }));
}

async function getImage(origin: string, httpAgent: SocksProxyAgent, urlPath: string): Promise<string | null> {
  if (urlPath === undefined) return null;
  const response = await axios.get(new URL(urlPath, origin).href, {
    responseType: "arraybuffer",
    httpAgent,
  });
  const b64 = Buffer.from(response.data).toString("base64");
  return b64;
}

async function downloadFile(httpAgent: SocksProxyAgent, url: string) {
  const response = await axios.get(url, {
    httpAgent,
    responseType: "arraybuffer",
  });
  const fileName = response.headers["content-disposition"]
    .split("filename=")[1]
    .replace(/["']/g, "");
  fs.writeFile(path.join("public", fileName), response.data, (err) => {
    if (err) throw err;
  });
  return fileName;
}

export {getBooksInfo, downloadFile};
