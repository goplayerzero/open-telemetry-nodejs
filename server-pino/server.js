// Include for console debugging opentelemetry
//const { diag, DiagConsoleLogger, DiagLogLevel } = require('@opentelemetry/api');
//diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);
// end of debugging opentelemetry
require('dotenv').config()
const express = require('express');
const cors = require('cors');
const logger = require('./logger');

const app = express();

app.options('/api/customers', cors())

app.get('/api/customers', cors(), (req, res) => {
  const customers = [
    {id: 1, firstName: 'John', lastName: 'Doe'},
    {id: 2, firstName: 'Brad', lastName: 'Traversy'},
    {id: 3, firstName: 'Mary', lastName: 'Swanson'},
  ];

  logger.info('This is a test of a log message');
  res.json(customers);
});

const port = 5001;

app.listen(port, () => `Server running on port ${port}`);
