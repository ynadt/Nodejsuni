const express = require('express');
const router = require('./routes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(express.json());
app.use('/api', router);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
