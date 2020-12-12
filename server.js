const express = require("express");
const path = require("path");
const fs = require("fs");
const uniqid = require("uniqid");

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE_PATH = path.join(__dirname, "/db/db.json");

fs.access(DB_FILE_PATH, fs.constants.F_OK, (err) => {
    if (err) {
        fs.writeFile(DB_FILE_PATH, '[]', () => {
        })
    }
})

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
  res.sendFile(DB_FILE_PATH);
});

app.post("/api/notes", (req, res) => {
  let newNote = req.body;

  newNote.id = uniqid.process();

  fs.readFile(DB_FILE_PATH, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      let savedData = JSON.parse(data);
      savedData.push(newNote);
      let newData = JSON.stringify(savedData);

      fs.writeFile(DB_FILE_PATH, newData, (err, data) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.send(newNote);
        }
      });
    }
  });
});

app.delete("/api/notes/:id", (req, res) => {
  let noteID = req.params.id;
  fs.readFile(DB_FILE_PATH, (err, data) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    let savedData = JSON.parse(data);
    let filteredData = savedData.filter((note) => {
      if (note.id === noteID) {
        return false;
      } else {
        return true;
      }
    });
    if (savedData.length === filteredData.length) {
      res.status(404).send();
      return;
    }
    let newData = JSON.stringify(filteredData);
    fs.writeFile(DB_FILE_PATH, newData, (err, data) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(204).send();
      }
    });
  });
});

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
