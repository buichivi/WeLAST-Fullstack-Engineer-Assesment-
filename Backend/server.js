const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');

app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/repos', async (req, res) => {
  try {
    const response = await fetch('https://api.github.com/users/freeCodeCamp/repos', {
      headers: {
        Authorization: 'token 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',
      },
    });
    const data = await response.json();
    res.status(200).json({
      data: data.filter((repo) => repo.fork === false && repo.forks > 5),
    });
  } catch (err) {
    res.status(404).json({ message: 'Failed to fetch data' });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});
