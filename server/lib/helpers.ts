import fs from "fs";
import path from "path";
import axios from "axios";
import { URL } from "url";
import FlibustaAPI from "flibusta";
import { SocksProxyAgent } from "socks-proxy-agent";
import mimes from "../types/mimes";

async function getBookInfo(origin: string, httpAgent: SocksProxyAgent, bookTitle: string ) {
  const flibustaApi = new FlibustaAPI(origin, { httpAgent });
  const result = await flibustaApi.getBooksByNameFromOpds(bookTitle);
  if (result === null || result === undefined) return null;

  // Array of base64 strings represent books covers
  const covers64 = result.map((book) => {
    if (book.cover) {
      return getImage(origin, httpAgent, book.cover)}
    }
  );

  return Promise.all(covers64).then((covers64) => {
    return result.map((book, i) => ({
      description: book.description,
      title: book.title,
      cover64: covers64[i],
      downloads: book.downloads.map((downloadInfo) => ({
        name: downloadInfo.link.split("/").at(-1),
        link: new URL(path.join(origin, downloadInfo.link)),
        extension: mimes[downloadInfo.type],
      })),
      author: book.author[0].name,
    }));
  });
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

async function downloadFile(origin: string, httpAgent: SocksProxyAgent, url: string) {
  const response = await axios.get(url, {
    httpAgent,
    responseType: "arraybuffer",
  });
  const fileName = response.headers["content-disposition"]
    .split("filename=")[1]
    .replace(/["']/g, "");
  fs.writeFileSync(path.join("public", fileName), response.data);
  return fileName;
}

export {getBookInfo, downloadFile};
