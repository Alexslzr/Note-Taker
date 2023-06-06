const express = require('express')
const PORT = process.env.PORT || 3001;
const app = express();
const path = require('path');
let notes = require('./db/db.json')
const uuid = require('./helper/uuid')
const fs = require('fs')


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));


app.get('/api/notes', (req, res) =>
  res.json(notes)
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes/:id', (req, res) => {
  if (req.params.id) {
    console.info(`${req.method} request received to get a specific note`);
    const noteId = req.params.id;
    for (let i = 0; i < notes.length; i++) {
      const currentNote = notes[i];
      if (currentNote.id === noteId) {
        res.status(200).json(currentNote);
        return;
      }
    }
    res.status(404).send('Note not found');
  } else {
    res.status(400).send('Note ID not provided');
  }
});


app.post('/api/notes', (req, res)=>{
    console.info(`${req.method} request received`);
    const { title, text } = req.body;
    if (title && text) {
      const newNote = {
        title,
        text,
        id: uuid(),
      };
      fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
        } else {
          const parsedNotes = JSON.parse(data);
          parsedNotes.push(newNote);
          notes = parsedNotes
          console.log(parsedNotes)
          fs.writeFile('./db/db.json',JSON.stringify(parsedNotes, null, 4),
            (writeErr) =>
              writeErr
                ? console.error(writeErr)
                : console.info('success')
          );
          res.json(notes)
        }
      });
    } else {
      res.status(500).json('Error in posting Note');
    }
})

app.delete('/api/notes/:id', (req,res)=>{
 fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
        } else {
          const parsedNotes = JSON.parse(data);
          let deletedNote = req.params.id;
          let x;
          for(let i=0; i<parsedNotes.length;i++){
            if(deletedNote === parsedNotes[i].id){
              x=i;
            }
          }
          parsedNotes.splice(x,1);
          notes=parsedNotes
          fs.writeFile('./db/db.json',JSON.stringify(parsedNotes, null, 4),
            (writeErr) =>
              writeErr
                ? console.error(writeErr)
                : console.info('Successfully updated Notes!')
          );
          res.json(notes)
        }
      });
})


app.get('*', (req,res)=>{
  res.sendFile(path.join(__dirname, '/public/index.html'))
})

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
