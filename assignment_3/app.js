const path = require('path');
const express = require('express');

const routes = require('./routes/routes');
const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(routes);


app.listen(3000, () => console.log('This simple app is listening on port 3000!'));