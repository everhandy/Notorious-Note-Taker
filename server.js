const express = require('express');
const path = require('path');
const fs = require('fs');

const port = process.env.PORT || 3001;

const app = express();

app.use(express.json());

app.use(express.static('public'));

const notesFilePath = path.join(__dirname, 'db', 'db.json');

// Read notes from the JSON file
const readNotes = () => {
    const data = fs.readFileSync(notesFilePath);
    return JSON.parse(data);
};
  
// Write notes to the JSON file
const writeNotes = (notes) => {
    fs.writeFileSync(notesFilePath, JSON.stringify(notes, null, 2));
};

// Routes
app.get('/api/notes', (req, res) => {
    const notes = readNotes();  
    res.json(notes);
});
  
// This variable will keep track of the last ID used
let lastId = 0;

app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  const notes = readNotes();

  // Increment the lastId for a new note
  lastId++;
  newNote.id = lastId;

  notes.push(newNote);
  writeNotes(notes);
  res.json(newNote);
});

// Bonus delete route
app.delete('/api/notes/:id', (req, res) => {
    const noteId = parseInt(req.params.id);
    let notes = readNotes();
    notes = notes.filter((note) => note.id !== noteId);
    writeNotes(notes);
    res.json({ message: 'Note deleted' });
});
  
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
);