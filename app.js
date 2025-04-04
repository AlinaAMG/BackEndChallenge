const express = require('express');
const routes = require("./config/routes");
require("./config/mongoose")

const app = express();


app.use('/public', express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');

app.use(routes);

app.listen(4000, () => {
    console.log('Server is op port 4000');
  });