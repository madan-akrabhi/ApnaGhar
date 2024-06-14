const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectWithDB = require("./config/db");
const dotenv = require("dotenv");

const app = express();

dotenv.config();

const PORT = process.env.PORT | 4000;

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);
app.use(express.json());
app.use(cookieParser());

connectWithDB();

app.use("", require("./routes"));

app.listen(PORT, (err) => {
  if (err) console.log("Error connecting to server" + err);
  else console.log("Listening on PORT:" + PORT);
});
