const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
})
app.use('/hello', (req, res) => {
  res.send('Hello Hello Hello Hello Hello');
})

app.listen(port, () => {
  console.log(`Server is successfully listening on port ${port}`);
})