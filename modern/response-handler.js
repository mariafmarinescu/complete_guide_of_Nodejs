// const fs = require('fs/promises');
import fs from 'fs/promises';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(__filename);

const __filename = fileURLToPath(import.meta.url);

export const resHandler = (req, res, next) => {
  fs.readFile('index.html', 'utf8')
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.log(err);
    });
};
