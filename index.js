const express = require("express");
const cool = require('cool-ascii-faces');
const app = express();
const mogoose = require("mongoose");
const cors = require('cors');
const routesUrl = require('./routes/router')

app.use(express.json());
app.use(cors());
mogoose.connect(
  "mongodb+srv://Hlalele:HlaleleMaroba@crud.ht6dtyo.mongodb.net/?retryWrites=true&w=majority"
);

app.use('/app' , routesUrl)
app.listen(9000, () => {
  console.log("Server Is Up");
});
