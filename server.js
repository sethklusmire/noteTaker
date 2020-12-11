const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

// GET/ POST ROUTES/ API
app.get("/", (req, res) =>
res.sendFile(path.join(__dirname, "./public/index.html"))
);

app.get("/notes", (req, res) =>
res.sendFile(path.join(__dirname, "./public/notes.html"))
);

app.get("/notes", (req, res) => 
res.sendFile(path.join(__dirname, "public/notes.html"))
);

app.get("/api/notes", (req, res) => {
res.sendFile(path.join(__dirname, "/db/db.json"));
});

app.post("")



app.delete("")