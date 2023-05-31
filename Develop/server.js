const express = require('express')
const PORT = 3001;
const app = express();
const path = require('path');
const data = require('./db/db.json')
const uuid = require('./helper/uuid')
const fs = require('fs')


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

app.get('/api/notes', (req, res) =>
  res.json(data)
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.post('/api/notes', (req, res)=>{
    console.info(`${req.method} request received`);
    const { title, text } = req.body;
    if (title && text) {
      const newNote = {
        title,
        text,
        note_id: uuid(),
      };
      fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
        } else {
          const parsedNotes = JSON.parse(data);
          parsedNotes.push(newNote);
          fs.writeFile('./db/db.json',JSON.stringify(parsedNotes, null, 4),
            (writeErr) =>
              writeErr
                ? console.error(writeErr)
                : console.info('Successfully updated Notes!')
          );
        }
      });
      const response = {
        status: 'success',
        body: newNote,
      };
       console.log(response);
      res.status(201).json(response);
    } else {
      res.status(500).json('Error in posting Note');
    }
})

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
