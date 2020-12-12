const express = require("express");
const path = require("path");
const fs = require("fs");
const uniqid = require("uniqid");

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE_PATH = path.join(__dirname, "/db/db.json");

// checking if the database file exists
fs.access(DB_FILE_PATH, fs.constants.F_OK, (err) => {
    if (err) {
        // if the database file doesn't exist, this will create it
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
// posting to the file
app.post("/api/notes", (req, res) => {

  let newNote = req.body;
// create unique ID for the not, I used uniqid
  newNote.id = uniqid.process();
// load the database
  fs.readFile(DB_FILE_PATH, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      let savedData = JSON.parse(data);
    //   add the new note
      savedData.push(newNote);
      let newData = JSON.stringify(savedData);
    //   write the data to the database and checking for errors
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
// delete a note
app.delete("/api/notes/:id", (req, res) => {
// get the id of the note
  let noteID = req.params.id;
//   load the database
  fs.readFile(DB_FILE_PATH, (err, data) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    let savedData = JSON.parse(data);
    // remove the note
    let filteredData = savedData.filter((note) => {
      if (note.id === noteID) {
        return false;
      } else {
        return true;
      }
    });
    // check that a note was removed, if not 404
    if (savedData.length === filteredData.length) {
      res.status(404).send();
      return;
    }
    let newData = JSON.stringify(filteredData);
    // write the data to the database
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
