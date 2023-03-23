require("./config/db.config");

const express = require("express");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
app.use(cors());
app.use(bodyParser.json());
const routes = require("./Routers");

const PORT = process.env.PORT || 8000;

app.use("/", routes);

app.listen(PORT, () => {
  console.log(`Server is up and running on PORT ${PORT}`);
});
