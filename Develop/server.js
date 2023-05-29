const express = require('express')
const PORT = 3001;
const app = express();
const path = require('path');


app.use(express.json());



app.use(express.static('public'));

// GET Route for homepage
/*app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/assets/index.html'))
);*/

// GET Route for feedback page
app.get('/notes', (req, res) =>

  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
