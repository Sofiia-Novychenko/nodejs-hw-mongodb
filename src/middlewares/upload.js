import multer from 'multer';
import path from 'node:path';

//! конфігуруємо сторедж

const storage = multer.diskStorage({
  //* де зберігаємо?
  destination: function (req, file, cb) {
    cb(null, path.resolve('src', 'tmp'));
  },
  //* з якою назвою?
  filename: function (req, file, cb) {
    const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniquePrefix + '-' + file.originalname);
  },
});

export const upload = multer({ storage: storage });
