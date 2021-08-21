const express = require('express');
const app = express();
const routes = require('./routes');
const port = 3000;

// uncomment if needed:
// const cors = require('cors');
app.use(express.json());
// app.use(cors());

app.use(express.static(__dirname + '/loaderio-token'));


app.use('/qa', routes);

app.listen(port, () => {
  console.log(`Express server listening on port: ${port} `);
});
