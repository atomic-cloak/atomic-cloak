const express = require("express");
var cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
const path = require("path");
const PORT = 7777;

// app.use(express.static(path.join(__dirname, "static")));

app.post("/swap", (req, res, next) => {
    console.log("Got post:", req.body);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.send("Secret stored! ");
});

app.listen(PORT);
console.log("Listening on port " + PORT);
