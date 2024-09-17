const express = require("express");
const env = require("dotenv");
env.config();
var cors = require('cors');
var bodyParser = require('body-parser');
const database = require("./config/database");
database.connect();
const app = express();
const port = process.env.port;

// parse application/json
app.use(bodyParser.json());

app.use(cors());

// app.use(cors({
//     origin: 'http://xyz.com',
//     optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
//   }));

const routesApiV1 = require("./v1/routes/index.route");

routesApiV1(app);

// khởi chạy app ở cổng 3000
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});