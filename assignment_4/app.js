const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

const routes = require('./routes/routes');

app.set('view engine', 'pug');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(routes);

app.use(bodyParser.urlencoded({ extended: false }));


app.listen(3000, () => console.log('This simple app is listening on port 3000!'));