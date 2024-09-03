const express = require("express");
const env = require("dotenv");
env.config();
const database = require("./config/database");
database.connect();
const app = express();
const port = process.env.port;

const routesApiV1 = require("./v1/routes/index.route");

routesApiV1(app);

// khởi chạy app ở cổng 3000
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});