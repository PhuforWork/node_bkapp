const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const app = express();
const rootRoute = require("../src/routes/index");

app.use(express.json());
app.use(cors());
app.use(express.static("."));

app.listen(8085);

app.get("/test", (req, res) => {
  res.send("Hello");
});

app.use("/api", rootRoute);
