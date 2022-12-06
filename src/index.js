const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const app = express();
const rootRoute = require("../src/routes/index");

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + "/public"));

app.listen(8081);

app.get("/test", (req, res) => {
  res.send("Hello");
});

app.use("/api", rootRoute);
