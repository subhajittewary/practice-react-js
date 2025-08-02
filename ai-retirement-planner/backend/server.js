const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const routes = require("./routes");

const app = express();
const port = 5000;
let x = 20;

app.use(cors());
app.use(bodyParser.json())

app.use(routes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
});
