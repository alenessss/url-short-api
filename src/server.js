const express = require('express');
const urlsRouter = require('./routes/urls');
const config = require('./config');

const app = express();

app.use(express.json());
app.use('/', urlsRouter);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});