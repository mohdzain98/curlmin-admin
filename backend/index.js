const connectToMongo = require("./db");
const { syncDB } = require("./mysql");
const express = require("express");
const cors = require("cors");

connectToMongo();
syncDB();

const app = express();
const port = 5007;

app.use(cors());
app.use(express.json());

app.use("/auth", require("./routes/auth"));
app.use("/core", require("./routes/core"));

app.use("/", (req, res) => {
  return res.json({
    message: "Wecome to Curlmin admin server",
    version: "1.0",
  });
});

app.listen(port, () => {
  console.log("admin.curlmin backend Running Successfully on assigned port");
});
