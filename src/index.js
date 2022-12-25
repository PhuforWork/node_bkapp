const express = require("express");
const cors = require("cors");
const rootRoute = require("../src/routes/index");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("."));

app.listen(8081);

app.get("/test", (req, res) => {
  let test = req.query;
  console.log(test);
  res.send("Hello");
});

app.use("/api", rootRoute);
