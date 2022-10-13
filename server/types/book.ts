export type BookDownloadLink = string;
export type BookDownloadExtension = string;
export type BookDownloadName = string | null | undefined;

export type BookDescription = string;
export type BookTitle = string;
export type BookCover = string | null | undefined;
export type BookAuthor = string;

export interface Book {
  description: BookDescription;
  title: BookTitle;
  cover64: BookCover;
  author: BookAuthor;
  downloads: Array<{
    name: BookDownloadName,
    link: BookDownloadLink;
    extension: BookDownloadExtension;
  }>
}
