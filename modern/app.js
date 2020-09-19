import express from 'express';
const dotenv = require('dotenv');
dotenv.config();
import { responseHandler } from './response-handler.js';

const app = express();

app.get('/', responseHandler);

app.listen(
    `${process.env.PORT}`,
    () => console.log(`This simple app is listening on port ${process.env.PORT}!`)
);
