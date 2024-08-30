const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/repos', async (req, res) => {
  const res = await fetch('https://api.github.com/users/freeCodeCamp/repos');
  res.status(200).json({
    data: res,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});
