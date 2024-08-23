const express = require('express');

const app = express();

// End point
app.get('/', (req, res) => res.send('API Running'));

const PORT = process.env.PRORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
