const path = require('path');
const express = require('express');

const app = express();

app.get('/', (req, res, next) => {
    console.log('Robots take-over[Phase I]');
    res.send('This simple app feels chatty and wants to say hi!');
  });
  
  app.get('/users', (req, res, next) => {
    console.log('Robots take-over[Phase II]');
    res.send('All good in here. Cheers!');  });

app.listen(3000, () => console.log('This simple app is listening on port 3000!'));