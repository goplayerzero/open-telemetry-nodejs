// Include for console debugging opentelemetry
//const { diag, DiagConsoleLogger, DiagLogLevel } = require('@opentelemetry/api');
//diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);
// end of debugging opentelemetry
require('dotenv').config()
const express = require('express');
const grpc = require('@grpc/grpc-js');
const messages = require('./helloworld_pb');
const services = require('./helloworld_grpc_pb');
const cors = require('cors');
const logger = require('./logger');

const PORT = 50051;

const app = express();

const client = new services.GreeterClient(
  `localhost:${PORT}`,
  grpc.credentials.createInsecure(),
);

app.options('/api/customers', cors())

app.get('/api/customers', cors(), (req, res) => {
  const customers = [
    {id: 1, firstName: 'John', lastName: 'Doe'},
    {id: 2, firstName: 'Brad', lastName: 'Traversy'},
    {id: 3, firstName: 'Mary', lastName: 'Swanson'},
  ];

  logger.info('Express called');

  const request = new messages.HelloRequest();
  request.setName('world');
  client.sayHello(request, (err, response) => {
    if (err) throw err;
    logger.info('GRPC sayHello greeting:'+ response.getMessage());
  });

  res.json(customers);
});

const port = 5001;

app.listen(port, () => `Server running on port ${port}`);
