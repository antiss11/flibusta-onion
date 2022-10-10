import bookDownload from "./bookDownload";

interface Book {
  description: string;
  title: string;
  cover64: string;
  downloads: Array<bookDownload>
}

export default Book;