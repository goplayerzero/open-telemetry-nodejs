

'use strict';

const grpc = require('@grpc/grpc-js');
const logger = require('./logger');

const messages = require('./helloworld_pb');
const services = require('./helloworld_grpc_pb');

const PORT = 50051;

/** Starts a gRPC server that receives requests on sample server port. */
function startServer() {
  // Creates a server
  const server = new grpc.Server();
  server.addService(services.GreeterService, { sayHello });
  server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), () => {
    console.log(`binding server on 0.0.0.0:${PORT}`);
  });
}

function sayHello(call, callback) {
  const reply = new messages.HelloReply();
  reply.setMessage(`Hello ${call.request.getName()}`);
  logger.info(`sayHello with name ${call.request.getName()}`)
  callback(null, reply);
}

startServer();
