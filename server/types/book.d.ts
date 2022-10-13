import bookDownload from "./bookDownload";

interface Book {
  description: string;
  title: string;
  cover64: string | null | undefined;
  downloads: Array<bookDownload>;
  author: string;
}

export default Book;