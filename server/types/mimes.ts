type Extension = string;

type Mimes = {
  [mime: string]: Extension
};

const mimes: Mimes = {
  'application/fb2+zip': 'zip',
  'application/html+zip': 'zip',
  'application/x-mobipocket-ebook': 'mobi',
  'application/rtf+zip': 'zip',
  'application/txt+zip': 'zip',
};

export default mimes;